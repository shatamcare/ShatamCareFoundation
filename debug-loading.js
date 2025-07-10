// Debug script to identify loading issues
// Run this in browser console when the site loads blank

console.log('=== LOADING DEBUG START ===');

// 1. Check if main JS/CSS assets are loaded
console.log('Document ready state:', document.readyState);
console.log('Current URL:', window.location.href);

// 2. Check for React root
const root = document.getElementById('root');
console.log('Root element exists:', !!root);
console.log('Root element content:', root ? root.innerHTML.length : 'N/A');

// 3. Check for asset loading errors
const assets = Array.from(document.querySelectorAll('script[src], link[href]'));
console.log('Asset count:', assets.length);

assets.forEach(asset => {
  const url = asset.src || asset.href;
  if (url && url.includes('ShatamCareFoundation')) {
    fetch(url, { method: 'HEAD' })
      .then(response => {
        console.log(`✓ Asset loaded: ${url.split('/').pop()} (${response.status})`);
      })
      .catch(error => {
        console.error(`✗ Asset failed: ${url.split('/').pop()}`, error);
      });
  }
});

// 4. Check for JavaScript errors
let errorCount = 0;
window.addEventListener('error', (e) => {
  errorCount++;
  console.error(`JS Error #${errorCount}:`, e.error || e.message);
});

// 5. Check for resource loading errors
window.addEventListener('error', (e) => {
  if (e.target !== window) {
    console.error('Resource loading error:', e.target.src || e.target.href);
  }
}, true);

// 6. Check if React is working
setTimeout(() => {
  console.log('After 2s - Root content length:', root ? root.innerHTML.length : 'N/A');
  console.log('React mount check:', !!window.React || !!document.querySelector('[data-reactroot]'));
  console.log('=== LOADING DEBUG END ===');
}, 2000);
