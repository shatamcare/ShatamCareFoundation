// Test image paths
console.log('Testing image paths...');

// Test with direct paths
const testPaths = [
  '/images/Team/SC_LOGO-removebg-preview.png',
  '/images/Users/care.jpg',
  '/images/Users/EHA (1).jpg',
  '/images/Caregivers/sessions.jpg',
  '/images/Brain Kit/kit.jpg',
  '/images/Users/dementia care 1.jpg'
];

testPaths.forEach(path => {
  console.log(`Path: ${path}`);
  console.log(`Encoded: ${encodeURI(path)}`);
  console.log('---');
});

// Test if images are accessible
const img = new Image();
img.onload = () => console.log('✅ Logo loaded successfully');
img.onerror = () => console.log('❌ Logo failed to load');
img.src = '/images/Team/SC_LOGO-removebg-preview.png';
