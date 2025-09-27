#!/usr/bin/env node

/**
 * Database setup script for Vercel deployment
 * Run this after deploying to initialize the database schema and seed data
 */

const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

console.log('🚀 Setting up database for Language Learning App...\n');

// Check if .env.local exists
const envPath = path.join(__dirname, '.env.local');
if (!fs.existsSync(envPath)) {
  console.log('❌ .env.local file not found!');
  console.log('Please run: vercel env pull .env.local');
  console.log('Or manually create .env.local with your DATABASE_URL');
  process.exit(1);
}

try {
  // Read environment variables
  const envContent = fs.readFileSync(envPath, 'utf8');
  const hasDatabaseUrl = envContent.includes('DATABASE_URL=');
  
  if (!hasDatabaseUrl) {
    console.log('❌ DATABASE_URL not found in .env.local');
    console.log('Please add your database connection string to .env.local');
    process.exit(1);
  }

  console.log('✅ Environment variables found');

  // Generate Prisma client
  console.log('📦 Generating Prisma client...');
  execSync('npm run db:generate', { stdio: 'inherit' });

  // Push database schema
  console.log('🗄️  Setting up database schema...');
  execSync('npm run db:push', { stdio: 'inherit' });

  // Seed database
  console.log('🌱 Seeding database with sample data...');
  execSync('npm run db:seed', { stdio: 'inherit' });

  console.log('\n🎉 Database setup complete!');
  console.log('Your Language Learning App is ready to use!');
  console.log('\nNext steps:');
  console.log('1. Visit your Vercel URL');
  console.log('2. Click "Sign In" and create an account');
  console.log('3. Take the placement test to get started');

} catch (error) {
  console.error('\n❌ Database setup failed:', error.message);
  console.log('\nTroubleshooting:');
  console.log('1. Check that your DATABASE_URL is correct');
  console.log('2. Ensure your database is accessible');
  console.log('3. Try running the commands manually:');
  console.log('   npm run db:generate');
  console.log('   npm run db:push');
  console.log('   npm run db:seed');
  process.exit(1);
}