/**
 * Debug script to help identify problematic image references
 * Run this in the browser console to see what images are being loaded
 */

// Function to monitor all image loading attempts
function debugImageLoading() {
  console.log('🔍 Image Loading Debugger Started');
  
  // Monitor all failed image loads
  const images = document.querySelectorAll('img');
  const problematicImages = [];
  
  images.forEach((img, index) => {
    img.addEventListener('error', function(e) {
      const failedSrc = this.src;
      console.error(`❌ Failed to load image ${index}:`, failedSrc);
      problematicImages.push({
        element: this,
        src: failedSrc,
        alt: this.alt,
        id: this.id,
        className: this.className
      });
    });
    
    img.addEventListener('load', function(e) {
      console.log(`✅ Successfully loaded:`, this.src);
    });
  });
  
  // Check for the specific problematic images
  const specificProblems = [
    'EHA1.jpg',
    'EHA (3).jpg',
    'training.jpg',
    'brain_bridge_boxcontent-1024x1024.jpeg'
  ];
  
  setTimeout(() => {
    console.log('🕵️ Checking for specific problematic images...');
    specificProblems.forEach(imageName => {
      const imgElements = Array.from(document.querySelectorAll('img')).filter(img => 
        img.src.includes(imageName)
      );
      
      if (imgElements.length > 0) {
        console.warn(`⚠️ Found elements trying to load ${imageName}:`, imgElements);
      }
    });
    
    if (problematicImages.length > 0) {
      console.error('📋 Summary of problematic images:', problematicImages);
    } else {
      console.log('🎉 No problematic images found so far!');
    }
  }, 3000);
}

// Start debugging
debugImageLoading();

// Also override console.warn to catch getImagePath warnings
const originalWarn = console.warn;
console.warn = function(...args) {
  if (args[0] && args[0].includes('Image not found')) {
    console.error('🚨 getImagePath warning:', ...args);
  }
  originalWarn.apply(console, args);
};

console.log(`
🔍 Image Debug Commands:
- Type 'debugImageLoading()' to restart monitoring
- Check the console for error messages
- Look for ❌ and ⚠️ symbols for issues
`);
