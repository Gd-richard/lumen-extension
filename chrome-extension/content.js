// Keywords to look for
const KEYWORDS = [
  "privacy policy", "privacy", "terms", "terms of service", "cookie policy", "data policy"
];

// Function to check if link matches
function findPolicyLink() {
  const links = document.querySelectorAll('a');
  for (const link of links) {
    const text = link.textContent.toLowerCase();

    // Check if text matches any keyword
    if (KEYWORDS.some(keyword => text.includes(keyword))) {
      return link.href;
    }
  }
  return null;
}

// Check if already dismissed
function isDismissed() {
  return sessionStorage.getItem('lumen-badge-dismissed') === 'true';
}

function injectBadge(url) {
  if (document.getElementById('lumen-badge')) return; // Already injected
  if (isDismissed()) return;

  const badge = document.createElement('div');
  badge.id = 'lumen-badge';
  badge.innerHTML = '🔒 Privacy policy detected';

  // Styles
  Object.assign(badge.style, {
    position: 'fixed',
    bottom: '20px',
    right: '20px',
    zIndex: '999999',
    backgroundColor: 'white',
    color: '#333',
    padding: '10px 15px',
    borderRadius: '8px',
    boxShadow: '0 4px 6px rgba(0,0,0,0.1)',
    cursor: 'pointer',
    fontFamily: 'Arial, sans-serif',
    fontSize: '14px',
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
    transition: 'opacity 0.3s ease-in-out',
    opacity: '0',
    animation: 'lumen-fade-in 0.5s forwards'
  });

  // Animation style
  const style = document.createElement('style');
  style.textContent = `
    @keyframes lumen-fade-in {
      from { opacity: 0; transform: translateY(10px); }
      to { opacity: 1; transform: translateY(0); }
    }
  `;
  document.head.appendChild(style);

  // Click handler: send message
  badge.addEventListener('click', (e) => {
    chrome.runtime.sendMessage({ action: "fillUrl", url: url });
    // Visual feedback
    badge.style.transform = 'scale(0.95)';
    setTimeout(() => {
        badge.style.transform = 'scale(1)';
    }, 100);
  });

  // Dismiss button
  const dismissBtn = document.createElement('span');
  dismissBtn.innerHTML = '&times;';
  Object.assign(dismissBtn.style, {
    marginLeft: '10px',
    cursor: 'pointer',
    color: '#888',
    fontSize: '16px',
    fontWeight: 'bold'
  });

  dismissBtn.addEventListener('click', (e) => {
    e.stopPropagation(); // Don't trigger badge click
    badge.remove();
    sessionStorage.setItem('lumen-badge-dismissed', 'true');
  });

  badge.appendChild(dismissBtn);
  document.body.appendChild(badge);
}

// Main execution
const detectedUrl = findPolicyLink();
if (detectedUrl) {
  injectBadge(detectedUrl);
}
