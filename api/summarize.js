import * as cheerio from "cheerio";
import { createClient } from '@supabase/supabase-js'

const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_KEY
)

export default async function handler(req, res) {
  // Set CORS headers
  res.setHeader('Access-Control-Allow-Credentials', true);
  res.setHeader('Access-Control-Allow-Origin', '*'); // Allow all origins for the extension
  res.setHeader('Access-Control-Allow-Methods', 'GET,OPTIONS,PATCH,DELETE,POST,PUT');
  res.setHeader(
    'Access-Control-Allow-Headers',
    'X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version'
  );

  // Handle OPTIONS request
  if (req.method === 'OPTIONS') {
    res.status(200).end();
    return;
  }

  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { url } = req.body || {};

  if (!url) {
    return res.status(400).json({ error: 'Missing URL parameter' });
  }

  // Check cache
  try {
    const { data, error } = await supabase
      .from('summaries')
      .select('*')
      .eq('url', url)

    if (data && data.length > 0) {
      return res.status(200).json({ ...data[0].summary, cached: true })
    }

    if (error) {
      console.warn("Supabase cache check error:", error)
    }
  } catch (err) {
    console.warn("Supabase cache check failed:", err)
  }

  try {
    // Fetch the HTML content
    const response = await fetch(url);
    if (!response.ok) {
      throw new Error(`Failed to fetch URL: ${response.statusText}`);
    }
    const html = await response.text();

    // Extract text content
    const $ = cheerio.load(html);

    // Remove scripts, styles, and other non-text elements
    $('script').remove();
    $('style').remove();
    $('noscript').remove();
    $('iframe').remove();
    $('svg').remove();

    // Get the text
    const textContent = $('body').text().replace(/\s+/g, ' ').trim();

    // Truncate text if it's too long to avoid token limits (Gemini 1.5 Flash has a large context window, but good to be safe/efficient)
    // 100k chars is usually plenty for a privacy policy and well within limits
    const truncatedText = textContent.slice(0, 200000);

    if (!truncatedText) {
        return res.status(400).json({ error: 'Could not extract text from the provided URL.' });
    }

    // Initialize Gemini API
    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) {
        console.error("GEMINI_API_KEY is not set");
        return res.status(500).json({ error: 'Server configuration error' });
    }

    const apiUrl = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${apiKey}`;

    const geminiResponse = await fetch(apiUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        contents: [{
          parts: [{
            text: `Analyze this privacy policy and return ONLY a JSON response with this structure:
{
  "dataUsage": "1-2 sentence summary",
  "permissions": "1-2 sentence summary",
  "risks": "1-2 sentence summary",
  "rights": "1-2 sentence summary",
  "faqs": [
    {"question": "Do they sell my data?", "answer": "short answer"},
    {"question": "Can I delete my data?", "answer": "short answer"},
    {"question": "What's the biggest risk?", "answer": "short answer"}
  ]
}

Policy text: ${truncatedText}`
          }]
        }]
      })
    });

    if (!geminiResponse.ok) {
        const errorText = await geminiResponse.text();
        throw new Error(`Gemini API Error: ${geminiResponse.status} ${geminiResponse.statusText} - ${errorText}`);
    }

    const geminiData = await geminiResponse.json();

    // Check if candidates exist and have content
    if (!geminiData.candidates || geminiData.candidates.length === 0 || !geminiData.candidates[0].content) {
         throw new Error('No candidates returned from Gemini API');
    }

    const responseText = geminiData.candidates[0].content.parts[0].text;

    // Parse the JSON response from Gemini
    // Clean up potential markdown formatting (```json ... ```)
    const jsonStr = responseText.replace(/^```json\s*/, '').replace(/\s*```$/, '');

    let analysis;
    try {
        analysis = JSON.parse(jsonStr);
    } catch (e) {
        console.error("Failed to parse Gemini response:", responseText);
        return res.status(500).json({ error: 'Failed to parse AI response', raw: responseText });
    }

    // Store in Supabase
    try {
      const { error } = await supabase
        .from('summaries')
        .insert([{ url, summary: analysis }])

      if (error) {
        console.warn("Supabase insert error:", error)
      }
    } catch (err) {
      console.warn("Supabase insert failed:", err)
    }

    return res.status(200).json({ ...analysis, cached: false });

  } catch (error) {
    console.error("Error processing request:", error);
    return res.status(500).json({ error: error.message || 'Internal Server Error' });
  }
}
