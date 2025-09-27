#!/bin/bash

echo "🏠 Setting up Sauna Cult Booking System..."

# Check if Node.js is installed
if ! command -v node &> /dev/null; then
    echo "❌ Node.js is not installed. Please install Node.js 18+ first."
    exit 1
fi

# Check if npm is installed
if ! command -v npm &> /dev/null; then
    echo "❌ npm is not installed. Please install npm first."
    exit 1
fi

echo "📦 Installing dependencies..."
npm install

# Check if .env.local exists
if [ ! -f ".env.local" ]; then
    echo "📝 Creating .env.local from template..."
    cp .env.example .env.local
    echo "⚠️  Please update .env.local with your actual configuration!"
    echo "   - Database URL"
    echo "   - Stripe API keys"
    echo "   - JWT secret"
    echo "   - Admin credentials"
else
    echo "✅ .env.local already exists"
fi

# Generate Prisma client
echo "🔧 Generating Prisma client..."
npx prisma generate

echo "✅ Setup complete!"
echo ""
echo "Next steps:"
echo "1. Update .env.local with your configuration"
echo "2. Set up your PostgreSQL database"
echo "3. Run: npx prisma db push"
echo "4. Run: npx tsx scripts/setup.ts"
echo "5. Run: npm run dev"
echo ""
echo "🌐 Then visit http://localhost:3000"