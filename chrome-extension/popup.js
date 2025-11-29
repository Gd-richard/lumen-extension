// Constants & Mock Data
const MOCK_RESULTS = {
  dataUsage: "They collect your email, browsing history, IP address, and device location to create a user profile.",
  permissions: "Requires access to cookies for tracking, local storage, and optional camera access for profile photos.",
  risks: "Your data is shared with third-party advertising networks. No clear encryption standard mentioned for stored messages.",
  rights: "You have the right to request a copy of your data and request deletion (GDPR/CCPA compliant)."
};

const MOCK_FAQS = [
  {
    question: "Do they sell my data?",
    answer: "Technically no, but they 'share' it with partners who may use it for targeted advertising, which feels similar."
  },
  {
    question: "Can I delete my data?",
    answer: "Yes. You can email privacy@example.com to request full account deletion, which takes up to 30 days."
  },
  {
    question: "What's the biggest risk?",
    answer: "The vague 'partner sharing' clause allows them to transfer your profile to undefined third parties without explicit consent."
  }
];

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
  const cardsContainer = document.getElementById('cards-container');
  const faqContainer = document.getElementById('faq-container');

  // Initialization
  autoDetectUrl();

  // Event Listeners
  if (urlInput) {
    urlInput.addEventListener('input', updateInputState);
    
    urlInput.addEventListener('keydown', (e) => {
      if (e.key === 'Enter') {
        handleAnalyze();
      }
    });
  }

  if (analyzeBtn) analyzeBtn.addEventListener('click', handleAnalyze);
  
  if (clearBtn) {
    clearBtn.addEventListener('click', () => {
      if (urlInput) urlInput.value = '';
      updateInputState();
      resetView();
    });
  }
  
  if (detectBtn) detectBtn.addEventListener('click', autoDetectUrl);

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
          urlInput.value = activeTab.url;
          updateInputState();
        }
      });
    }
  }

  function handleAnalyze() {
    if (!urlInput) return;
    const url = urlInput.value.trim();
    
    // If no URL, just focus input and return
    if (!url) {
      urlInput.focus();
      return;
    }
    
    // Hide input section as requested
    if (inputSection) inputSection.style.display = 'none';
    
    // Show Loading Skeleton
    if (loadingView) loadingView.classList.add('active');

    // Simulate API Call
    setTimeout(() => {
      // Render and Show Results
      renderResults();
      renderFaq();
      
      if (loadingView) loadingView.classList.remove('active');
      if (resultsView) resultsView.classList.add('active');
    }, 2000);
  }

  function resetView() {
    // Show input section again
    if (inputSection) inputSection.style.display = 'block';
    if (loadingView) loadingView.classList.remove('active');
    if (resultsView) resultsView.classList.remove('active');
  }

  function renderResults() {
    if (!cardsContainer) return;
    cardsContainer.innerHTML = '';
    
    CARDS_CONFIG.forEach(config => {
      const content = MOCK_RESULTS[config.id];
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

  function renderFaq() {
    if (!faqContainer) return;
    faqContainer.innerHTML = '';
    
    MOCK_FAQS.forEach((faq, index) => {
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
