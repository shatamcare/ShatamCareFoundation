
#!/bin/bash

# Shatam Care Foundation - Production Deployment Script
# This script builds and prepares the application for production deployment

echo "🚀 Starting Shatam Care Foundation deployment process..."

# Check if node_modules exists
if [ ! -d "node_modules" ]; then
    echo "📦 Installing dependencies..."
    npm install
fi

# Clean previous builds
echo "🧹 Cleaning previous builds..."
rm -rf dist/

# Build for production
echo "🔨 Building for production..."
npm run build

if [ $? -eq 0 ]; then
    echo "✅ Build completed successfully!"
    echo "📁 Production files are ready in the 'dist' folder"
    echo "🌐 Your website is ready for deployment!"
else
    echo "❌ Build failed. Please check the errors above."
    exit 1
fi

# Display build info
echo ""
echo "📊 Build Statistics:"
du -sh dist/
echo ""
echo "🔗 Next steps:"
echo "1. Upload the 'dist' folder contents to your web server"
echo "2. Configure your server to serve index.html for all routes (for SPA routing)"
echo "3. Set up SSL certificate for HTTPS"
echo "4. Configure your domain DNS settings"
