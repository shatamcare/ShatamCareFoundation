import fs from 'fs';
import path from 'path';

// Ensure dist directory exists
const distPath = path.resolve('dist');
if (!fs.existsSync(distPath)) {
  fs.mkdirSync(distPath, { recursive: true });
}

// Copy public files to dist
const publicPath = path.resolve('public');
const copyPublicFiles = () => {
  if (fs.existsSync(publicPath)) {
    const files = fs.readdirSync(publicPath);
    files.forEach(file => {
      const srcPath = path.join(publicPath, file);
      const destPath = path.join(distPath, file);
      if (fs.statSync(srcPath).isFile()) {
        fs.copyFileSync(srcPath, destPath);
        console.log(`Copied ${file} to dist/`);
      }
    });
  }
};

// Update paths in index.html
const updateIndexHtml = () => {
  const indexPath = path.join(distPath, 'index.html');
  if (fs.existsSync(indexPath)) {
    let content = fs.readFileSync(indexPath, 'utf-8');
    
    // Fix asset paths
    content = content.replace(/src="\/src\//g, 'src="./src/');
    content = content.replace(/href="\/assets\//g, 'href="./assets/');
    content = content.replace(/src="\/assets\//g, 'src="./assets/');
    
    fs.writeFileSync(indexPath, content);
    fs.copyFileSync(indexPath, path.join(distPath, '404.html'));
    console.log('Updated paths in index.html and created 404.html');
  }
};

copyPublicFiles();
updateIndexHtml();
