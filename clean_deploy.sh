#!/bin/bash
# clean_deploy.sh - A more reliable GitHub Pages deployment script
# Usage: bash clean_deploy.sh

echo "🚀 Starting clean deployment process..."

# Step 1: Clean and rebuild
echo "📦 Cleaning and rebuilding..."
if [ -d "dist" ]; then
  rm -rf dist
fi

# Ensure gh-pages cache is clean too
if [ -d "node_modules/.cache/gh-pages" ]; then
  rm -rf node_modules/.cache/gh-pages
fi

# Run build
npm run build

# Step 2: Create .nojekyll file
echo "🚫 Creating .nojekyll file..."
touch dist/.nojekyll

# Step 3: Delete remote gh-pages branch if it exists
echo "🗑️ Removing old gh-pages branch..."
git push origin --delete gh-pages || echo "No remote branch to delete or not authorized"

# Step 4: Deploy only the dist folder
echo "🚀 Deploying dist folder to gh-pages..."
npx gh-pages -d dist --dotfiles

echo "✅ Deployment complete! Check your site in a few minutes."
echo "🌐 Site URL: https://adarshalexbalmuchu.github.io/ShatamCareFoundation/"
