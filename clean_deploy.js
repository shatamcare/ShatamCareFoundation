// clean_deploy.js - Script for cleanly deploying only dist folder to gh-pages
import { execSync } from 'child_process';
import fs from 'fs';
import path from 'path';

// Ensure we have a clean start
console.log('🚀 Starting clean deployment process...');

try {
  // Step 1: Clean dist folder and build
  console.log('📦 Cleaning and rebuilding...');
  if (fs.existsSync('./dist')) {
    fs.rmSync('./dist', { recursive: true, force: true });
  }
  execSync('npm run build', { stdio: 'inherit' });
  
  // Step 2: Create .nojekyll file
  console.log('🚫 Creating .nojekyll file...');
  fs.writeFileSync('./dist/.nojekyll', '');
  
  // Step 3: Delete remote gh-pages branch if it exists
  console.log('🗑️ Removing old gh-pages branch...');
  try {
    execSync('git push origin --delete gh-pages', { stdio: 'pipe' });
    console.log('   Remote gh-pages branch deleted.');
  } catch (error) {
    console.log('   No remote gh-pages branch to delete or not authorized.');
  }
  
  // Step 4: Deploy only the dist folder to gh-pages
  console.log('🚀 Deploying dist folder to gh-pages...');
  execSync('npx gh-pages -d dist --dotfiles', { stdio: 'inherit' });
  
  console.log('✅ Deployment complete! Check your site in a few minutes.');
  console.log('🌐 Site URL: https://adarshalexbalmuchu.github.io/ShatamCareFoundation/');
  
} catch (error) {
  console.error('❌ Deployment failed:', error);
  process.exit(1);
}
