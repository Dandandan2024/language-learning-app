#!/bin/bash

# Step by Step Family Law - Deployment Script
# This script helps deploy the website to Vercel

echo "🚀 Step by Step Family Law - Deployment Script"
echo "=============================================="

# Check if git is initialized
if [ ! -d ".git" ]; then
    echo "❌ Git repository not initialized. Please run 'git init' first."
    exit 1
fi

# Check if we're in the right directory
if [ ! -f "package.json" ]; then
    echo "❌ Please run this script from the project root directory."
    exit 1
fi

echo "✅ Project structure looks good!"

# Check if Vercel CLI is installed
if ! command -v vercel &> /dev/null; then
    echo "📦 Installing Vercel CLI..."
    npm install -g vercel
fi

echo "🔧 Building project..."
npm run build

if [ $? -eq 0 ]; then
    echo "✅ Build successful!"
else
    echo "❌ Build failed. Please check for errors."
    exit 1
fi

echo "🚀 Deploying to Vercel..."
vercel --prod

echo "🎉 Deployment complete!"
echo ""
echo "Next steps:"
echo "1. Configure your custom domain in Vercel dashboard"
echo "2. Set up analytics and monitoring"
echo "3. Migrate your Notion content using /admin/migrate"
echo "4. Test all functionality"
echo ""
echo "For more help, see deploy.md"