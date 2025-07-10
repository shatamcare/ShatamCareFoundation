import { execSync } from 'child_process';
import { rmSync } from 'fs';
import { resolve } from 'path';
import { fileURLToPath } from 'url';
import { dirname } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

console.log('🧹 Cleaning dist directory...');
try {
  rmSync(resolve('dist'), { recursive: true, force: true });
} catch (err) {
  console.warn('No dist directory to clean');
}

console.log('🏗️ Building project...');
execSync('npm run build', { stdio: 'inherit' });

console.log('🛠️ Running fix-paths...');
import('./fix-paths.js').catch(err => {
  console.error('Error running fix-paths:', err);
  process.exit(1);
});
