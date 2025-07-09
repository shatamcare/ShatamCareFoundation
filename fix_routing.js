// fix_routing.js
// This script ensures that the routing works correctly on GitHub Pages
// by copying index.html to 404.html for proper SPA behavior

import fs from 'fs';
import path from 'path';

console.log('🔄 Applying routing fixes for GitHub Pages...');

try {
  // Path to your dist folder
  const distFolder = path.resolve('./dist');
  
  // 1. Make sure there's no src folder in dist (source files should never be deployed)
  const srcFolderInDist = path.join(distFolder, 'src');
  if (fs.existsSync(srcFolderInDist)) {
    console.log('⚠️ Found src folder in dist! Removing...');
    fs.rmSync(srcFolderInDist, { recursive: true, force: true });
  }
  
  // 2. Copy index.html to 404.html for SPA route handling
  const indexPath = path.join(distFolder, 'index.html');
  const notFoundPath = path.join(distFolder, '404.html');
  
  if (fs.existsSync(indexPath)) {
    fs.copyFileSync(indexPath, notFoundPath);
    console.log('✅ Created 404.html from index.html for proper routing');
  } else {
    console.error('❌ index.html not found in dist folder!');
  }
  
  // 3. Make sure .nojekyll exists
  const nojekyllPath = path.join(distFolder, '.nojekyll');
  if (!fs.existsSync(nojekyllPath)) {
    fs.writeFileSync(nojekyllPath, '');
    console.log('✅ Created .nojekyll file');
  }
  
  // 4. Verify the build looks good
  console.log('\n📁 Dist folder contents:');
  const files = fs.readdirSync(distFolder);
  files.forEach(file => {
    console.log(`- ${file}`);
  });
  
  console.log('\n✅ Routing fixes applied successfully!');
} catch (error) {
  console.error('❌ Error applying routing fixes:', error);
}
