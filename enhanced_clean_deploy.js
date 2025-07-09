// enhanced_clean_deploy.js - Script for cleanly deploying only dist folder to gh-pages
// Enhanced version that specifically fixes App.tsx 500 errors
import { execSync } from 'child_process';
import fs from 'fs';
import path from 'path';

// Ensure we have a clean start
console.log('🚀 Starting enhanced clean deployment process...');

try {
  // Step 1: Clean dist folder and build
  console.log('📦 Cleaning and rebuilding...');
  if (fs.existsSync('./dist')) {
    fs.rmSync('./dist', { recursive: true, force: true });
  }
  if (fs.existsSync('./node_modules/.cache/gh-pages')) {
    fs.rmSync('./node_modules/.cache/gh-pages', { recursive: true, force: true });
  }
  
  // Run build
  execSync('npm run build', { stdio: 'inherit' });
  
  // Step 2: Verify no source files in dist
  console.log('🔍 Checking for source files in dist...');
  if (fs.existsSync('./dist/src')) {
    console.log('⚠️ Found src folder in dist! Removing...');
    fs.rmSync('./dist/src', { recursive: true, force: true });
  } else {
    console.log('✅ No source files found in dist.');
  }
  
  // Step 3: Create .nojekyll file
  console.log('🚫 Creating .nojekyll file...');
  fs.writeFileSync('./dist/.nojekyll', '');
  
  // Step 4: Create 404.html for SPA routing
  console.log('🔄 Creating 404.html for SPA routing...');
  if (fs.existsSync('./dist/index.html')) {
    fs.copyFileSync('./dist/index.html', './dist/404.html');
    console.log('✅ Created 404.html');
  }
  
  // Step 5: Delete remote gh-pages branch if it exists
  console.log('🗑️ Removing old gh-pages branch...');
  try {
    execSync('git push origin --delete gh-pages', { stdio: 'pipe' });
    console.log('   Remote gh-pages branch deleted.');
  } catch (error) {
    console.log('   No remote gh-pages branch to delete or not authorized.');
  }
  
  // Step 6: Create a clean temporary directory
  const tempDir = `temp_deploy_${Date.now()}`;
  console.log(`📁 Creating temporary directory ${tempDir}...`);
  fs.mkdirSync(tempDir);
  
  // Copy only the dist contents
  console.log('📋 Copying only dist folder contents to temp directory...');
  const distFiles = fs.readdirSync('./dist');
  distFiles.forEach(file => {
    const srcPath = path.join('./dist', file);
    const destPath = path.join(tempDir, file);
    
    if (fs.lstatSync(srcPath).isDirectory()) {
      fs.mkdirSync(destPath, { recursive: true });
      
      // Use fs functions instead of cp for better cross-platform compatibility
      const copyDirRecursively = (src, dest) => {
        if (!fs.existsSync(dest)) {
          fs.mkdirSync(dest, { recursive: true });
        }
        
        const entries = fs.readdirSync(src);
        for (const entry of entries) {
          const srcPath = path.join(src, entry);
          const destPath = path.join(dest, entry);
          
          if (fs.lstatSync(srcPath).isDirectory()) {
            copyDirRecursively(srcPath, destPath);
          } else {
            fs.copyFileSync(srcPath, destPath);
          }
        }
      };
      
      copyDirRecursively(srcPath, destPath);
    } else {
      fs.copyFileSync(srcPath, destPath);
    }
  });
  
  // Step 7: Initialize git in temp directory and push to gh-pages
  console.log('🔄 Creating clean gh-pages branch from temp directory...');
  process.chdir(tempDir);
  execSync('git init', { stdio: 'pipe' });
  execSync('git add .', { stdio: 'pipe' });
  execSync('git config --local user.email "deployment@example.com"', { stdio: 'pipe' });
  execSync('git config --local user.name "Deployment Script"', { stdio: 'pipe' });
  execSync('git commit -m "Clean deployment with only built files"', { stdio: 'pipe' });
  
  // Force push to gh-pages
  console.log('🚀 Pushing to gh-pages branch...');
  execSync('git push --force "https://github.com/adarshalexbalmuchu/ShatamCareFoundation.git" HEAD:gh-pages', { stdio: 'inherit' });
  
  // Step 8: Clean up
  process.chdir('..');
  fs.rmSync(tempDir, { recursive: true, force: true });
  
  console.log('✅ Enhanced clean deployment complete! Check your site in a few minutes.');
  console.log('🌐 Site URL: https://adarshalexbalmuchu.github.io/ShatamCareFoundation/');
  
} catch (error) {
  console.error('❌ Deployment failed:', error);
  process.exit(1);
}
