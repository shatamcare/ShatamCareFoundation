#!/usr/bin/env node
// start-dev.js - Ensures development server always runs on the correct port (5174)

const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

// Color codes for console output
const colors = {
  reset: '\x1b[0m',
  green: '\x1b[32m',
  yellow: '\x1b[33m',
  blue: '\x1b[34m',
  magenta: '\x1b[35m',
  cyan: '\x1b[36m',
  white: '\x1b[37m',
};

console.log(`${colors.cyan}Starting Shatam Care Foundation development server...${colors.reset}`);

// Check if the port is correctly configured in vite.config.ts
const viteConfigPath = path.join(__dirname, 'vite.config.ts');
if (fs.existsSync(viteConfigPath)) {
  const viteConfig = fs.readFileSync(viteConfigPath, 'utf8');
  if (!viteConfig.includes('port: 5174')) {
    console.log(`${colors.yellow}⚠️  Warning: vite.config.ts is not configured to use port 5174.${colors.reset}`);
    console.log(`${colors.yellow}   Please update the port in vite.config.ts to 5174 for consistency.${colors.reset}`);
  }
}

// Start the development server
try {
  console.log(`${colors.green}🚀 Launching development server at ${colors.cyan}http://localhost:5174${colors.reset}`);
  execSync('npx vite --port 5174', { stdio: 'inherit' });
} catch (error) {
  console.error(`${colors.red}Error starting development server:${colors.reset}`, error);
  process.exit(1);
}
