#!/bin/bash

# Build the project
echo "Building the project..."
npm run build

# Deploy to gh-pages branch
echo "Deploying to GitHub Pages..."
npm run deploy

echo "Deployment complete! Your site should be available at:"
echo "https://shatamcare.github.io/website/"
