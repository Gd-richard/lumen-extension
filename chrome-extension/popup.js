// Constants
// Use a fixed URL for now, but this should be environmental or built
const API_URL = 'http://localhost:3000/api/summarize';

const CARDS_CONFIG = [
  { id: 'dataUsage', title: 'Data Usage', icon: '📊', accent: 'bg-blue-500', bg: 'bg-blue-50', color: '#3b82f6', delay: '' },
  { id: 'permissions', title: 'Permissions', icon: '🔑', accent: 'bg-amber-500', bg: 'bg-amber-50', color: '#f59e0b', delay: 'delay-100' },
  { id: 'risks', title: 'Risks', icon: '⚠️', accent: 'bg-red-500', bg: 'bg-red-50', color: '#ef4444', delay: 'delay-200' },
  { id: 'rights', title: 'Your Rights', icon: '✅', accent: 'bg-emerald-500', bg: 'bg-emerald-50', color: '#10b981', delay: 'delay-300' }
];

document.addEventListener('DOMContentLoaded', () => {
  // DOM Elements
  const urlInput = document.getElementById('policy-url');
  const analyzeBtn = document.getElementById('analyze-btn');
  const clearBtn = document.getElementById('clear-btn');
  const detectBtn = document.getElementById('detect-btn');

  const inputSection = document.getElementById('input-section');
  const loadingView = document.getElementById('loading-view');
  const resultsView = document.getElementById('results-view');
  const errorView = document.getElementById('error-view');

  const cardsContainer = document.getElementById('cards-container');
  const faqContainer = document.getElementById('faq-container');

  // Error UI Elements
  const errorTitle = document.getElementById('error-title');
  const errorMessage = document.getElementById('error-message');
  const manualPasteSection = document.getElementById('manual-paste-section');
  const policyTextArea = document.getElementById('policy-text');
  const analyzeTextBtn = document.getElementById('analyze-text-btn');
  const tryAgainBtn = document.getElementById('try-again-btn');

  // Initialization
  autoDetectUrl();

  // Listen for messages from content script
  if (typeof chrome !== 'undefined' && chrome.runtime && chrome.runtime.onMessage) {
    chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
      if (request.action === "fillUrl" && request.url) {
        if (urlInput) {
          urlInput.value = request.url;
          updateInputState();
          // Optionally notify user or highlight input
          urlInput.focus();
        }
      }
    });
  }

  // Event Listeners
  if (urlInput) {
    urlInput.addEventListener('input', updateInputState);
    
    urlInput.addEventListener('keydown', (e) => {
      if (e.key === 'Enter') {
        handleAnalyze();
      }
    });
  }

  if (analyzeBtn) analyzeBtn.addEventListener('click', () => handleAnalyze());
  
  if (clearBtn) {
    clearBtn.addEventListener('click', () => {
      if (urlInput) urlInput.value = '';
      updateInputState();
      resetView();
    });
  }
  
  if (detectBtn) detectBtn.addEventListener('click', autoDetectUrl);

  if (analyzeTextBtn) {
      analyzeTextBtn.addEventListener('click', () => {
          const text = policyTextArea.value.trim();
          if (text) {
              handleManualPaste(text);
          }
      });
  }

  if (tryAgainBtn) {
      tryAgainBtn.addEventListener('click', () => {
          resetView();
          // If we have a URL, try analyzing it again?
          // Or just go back to input screen.
          // Let's go back to input screen so user can correct URL.
          if (urlInput) urlInput.focus();
      });
  }

  // Functions
  function updateInputState() {
    if (!urlInput || !clearBtn || !detectBtn) return;
    const hasUrl = urlInput.value.trim().length > 0;
    clearBtn.style.display = hasUrl ? 'block' : 'none';
    detectBtn.style.display = hasUrl ? 'none' : 'flex';
  }

  function autoDetectUrl() {
    if (typeof chrome !== 'undefined' && chrome.tabs && chrome.tabs.query) {
      chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
        const activeTab = tabs[0];
        if (activeTab && activeTab.url && urlInput) {
          // Only auto-fill if it looks like a web page
          if (activeTab.url.startsWith('http')) {
              urlInput.value = activeTab.url;
              updateInputState();
          }
        }
      });
    }
  }

  async function handleAnalyze() {
    if (!urlInput) return;
    const url = urlInput.value.trim();
    
    // If no URL, just focus input and return
    if (!url) {
      urlInput.focus();
      return;
    }
    
    // UI Updates
    if (inputSection) inputSection.style.display = 'none';
    if (errorView) errorView.classList.remove('active');
    if (loadingView) loadingView.classList.add('active');

    try {
        const data = await callApi({ url });

        // Render and Show Results
        renderResults(data);
        renderFaq(data.faqs);

        if (loadingView) loadingView.classList.remove('active');
        if (resultsView) resultsView.classList.add('active');

    } catch (error) {
        handleError(error, url);
    }
  }

  async function handleManualPaste(text) {
      // UI Updates
      if (errorView) errorView.classList.remove('active');
      if (loadingView) loadingView.classList.add('active');
      if (inputSection) inputSection.style.display = 'none'; // Ensure input is hidden

      try {
          const data = await callApi({ text });

          // Render and Show Results
          renderResults(data);
          renderFaq(data.faqs);

          if (loadingView) loadingView.classList.remove('active');
          if (resultsView) resultsView.classList.add('active');

      } catch (error) {
          // If manual paste fails, show generic error
          handleError(error, null, true);
      }
  }

  async function callApi(body) {
      const response = await fetch(API_URL, {
          method: 'POST',
          headers: {
              'Content-Type': 'application/json'
          },
          body: JSON.stringify(body)
      });

      if (!response.ok) {
          const errorData = await response.json().catch(() => ({}));
          const error = new Error(errorData.error || `Request failed with status ${response.status}`);
          error.status = response.status;
          throw error;
      }

      return await response.json();
  }

  function handleError(error, originalUrl, isManualPaste = false) {
      if (loadingView) loadingView.classList.remove('active');
      if (resultsView) resultsView.classList.remove('active');
      if (inputSection) inputSection.style.display = 'none';

      if (errorView) errorView.classList.add('active');

      // Reset UI elements
      if (manualPasteSection) manualPasteSection.style.display = 'none';
      if (tryAgainBtn) tryAgainBtn.textContent = "Try Again";

      console.error("Analysis Error:", error);

      // 1. Blocked / Forbidden (403)
      if (error.status === 403 || error.message.toLowerCase().includes('forbidden') || error.message.toLowerCase().includes('access denied')) {
          errorTitle.textContent = "Couldn't Access This Policy";
          errorMessage.textContent = "This site blocks automated access. But you can still analyze it!";

          if (manualPasteSection) manualPasteSection.style.display = 'block';
          if (tryAgainBtn) tryAgainBtn.textContent = "Try Again with URL";

          // Clear textarea
          if (policyTextArea) policyTextArea.value = "";
      }
      // 2. Network Error
      else if (error.name === 'TypeError' && error.message.includes('fetch')) {
          errorTitle.textContent = "Connection Error";
          errorMessage.textContent = "Please check your internet connection and try again.";
      }
      // 3. Other Errors
      else {
          errorTitle.textContent = "Something Went Wrong";
          errorMessage.textContent = isManualPaste
            ? "We couldn't analyze the text. Please ensure it's valid text."
            : "We couldn't analyze this policy. Please try again later.";
      }
  }

  function resetView() {
    if (inputSection) inputSection.style.display = 'block';
    if (loadingView) loadingView.classList.remove('active');
    if (resultsView) resultsView.classList.remove('active');
    if (errorView) errorView.classList.remove('active');
  }

  function renderResults(data) {
    if (!cardsContainer) return;
    cardsContainer.innerHTML = '';
    
    CARDS_CONFIG.forEach(config => {
      const content = data[config.id] || "No information available.";
      const card = document.createElement('div');
      card.className = `result-card ${config.delay}`;
      card.innerHTML = `
        <div class="card-accent" style="background-color: ${config.color}"></div>
        <div class="card-header">
          <div class="card-icon ${config.bg}" style="background-color: ${config.color}20; color: ${config.color}">
            ${config.icon}
          </div>
          <h3 class="card-title">${config.title}</h3>
        </div>
        <p class="card-content">${content}</p>
      `;
      cardsContainer.appendChild(card);
    });
  }

  function renderFaq(faqs) {
    if (!faqContainer) return;
    faqContainer.innerHTML = '';
    
    if (!faqs || !Array.isArray(faqs)) return;

    faqs.forEach((faq) => {
      const item = document.createElement('div');
      item.className = 'accordion-item';
      item.innerHTML = `
        <button class="accordion-btn">
          <div class="accordion-title-wrapper">
            <span class="accordion-icon">?</span>
            <span class="accordion-question">${faq.question}</span>
          </div>
          <span class="accordion-arrow">▼</span>
        </button>
        <div class="accordion-content">
          <div class="accordion-inner">
            <p class="accordion-text">${faq.answer}</p>
          </div>
        </div>
      `;
      
      // Add click handler
      const btn = item.querySelector('.accordion-btn');
      btn.addEventListener('click', () => {
        const isOpen = item.classList.contains('active');
        
        // Close all others
        document.querySelectorAll('.accordion-item').forEach(i => {
          i.classList.remove('active');
        });
        
        // Toggle current
        if (!isOpen) {
          item.classList.add('active');
        }
      });
      
      faqContainer.appendChild(item);
    });
  }
});
