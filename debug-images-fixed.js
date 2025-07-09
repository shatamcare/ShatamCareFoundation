/**
 * Debug utility for diagnosing image path issues
 * This script helps identify why images might not be loading correctly
 */

import fs from 'fs';
import path from 'path';

console.log('🔍 Starting image path debugging utility...');

// Check if running in development or production
const mode = process.env.NODE_ENV || 'development';
console.log(`Current mode: ${mode}`);

// Check public directory structure
const publicDir = path.resolve('./public');
console.log(`\nChecking public directory: ${publicDir}`);

if (fs.existsSync(publicDir)) {
  console.log('✅ Public directory exists');
  
  // List top-level files in public
  const files = fs.readdirSync(publicDir);
  console.log('\nPublic directory contents:');
  files.forEach(file => {
    const filePath = path.join(publicDir, file);
    const stats = fs.statSync(filePath);
    console.log(`- ${file} ${stats.isDirectory() ? '(directory)' : `(${stats.size} bytes)`}`);
  });
  
  // Check for images directory
  const imagesDir = path.join(publicDir, 'images');
  if (fs.existsSync(imagesDir)) {
    console.log('\n✅ Images directory exists');
    
    // List subdirectories in images
    const imageSubdirs = fs.readdirSync(imagesDir);
    console.log('\nImage subdirectories:');
    imageSubdirs.forEach(subdir => {
      const subdirPath = path.join(imagesDir, subdir);
      if (fs.statSync(subdirPath).isDirectory()) {
        console.log(`- ${subdir}/`);
        // List files in this subdirectory
        const subdirFiles = fs.readdirSync(subdirPath);
        subdirFiles.forEach(file => {
          console.log(`  - ${file}`);
        });
      } else {
        console.log(`- ${subdir} (file)`);
      }
    });
    
    // Check for common missing images used in the code
    const commonImages = [
      'images/Team/SC_LOGO-removebg-preview.png',
      'images/Team/Amrita.jpg',
      'images/Caregivers/training.jpg',
      'images/Caregivers/sessions.jpg',
      'images/Brain Kit/brain_bridge_boxcontent-1024x1024.jpeg',
      'images/Users/care.jpg',
      'images/fallback.svg',
      'images/placeholder.jpg'
    ];
    
    console.log('\n🔍 Checking for commonly referenced images:');
    commonImages.forEach(imagePath => {
      const fullPath = path.join(publicDir, imagePath);
      if (fs.existsSync(fullPath)) {
        console.log(`✅ ${imagePath}`);
      } else {
        console.log(`❌ ${imagePath} - NOT FOUND`);
      }
    });
    
  } else {
    console.log('❌ Images directory not found');
  }
  
} else {
  console.log('❌ Public directory not found');
}

console.log('\n🎯 Debug complete!');
console.log('If you see missing images (❌), please check:');
console.log('1. Image files exist in the correct public/images/ subdirectories');
console.log('2. File names match exactly (case-sensitive)');
console.log('3. No typos in the file paths');
console.log('4. Image files are not corrupted');
