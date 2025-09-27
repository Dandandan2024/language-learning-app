#!/bin/bash

echo "🚀 Deploying Sauna Cult to Vercel..."

# Check if git is initialized
if [ ! -d ".git" ]; then
    echo "📁 Initializing Git repository..."
    git init
    git add .
    git commit -m "Initial commit: Sauna Cult booking system"
fi

# Check if vercel CLI is installed
if ! command -v vercel &> /dev/null; then
    echo "📦 Installing Vercel CLI..."
    npm install -g vercel
fi

# Check if user is logged in to Vercel
if ! vercel whoami &> /dev/null; then
    echo "🔐 Please login to Vercel:"
    vercel login
fi

echo "🌐 Deploying to Vercel..."
vercel --prod

echo "✅ Deployment initiated!"
echo ""
echo "Next steps:"
echo "1. Set up your PostgreSQL database"
echo "2. Configure environment variables in Vercel dashboard"
echo "3. Run: npx prisma db push"
echo "4. Run: npx tsx scripts/setup.ts"
echo "5. Test your deployment!"
echo ""
echo "📖 See DEPLOYMENT.md for detailed instructions"