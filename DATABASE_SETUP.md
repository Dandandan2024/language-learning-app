# Database Setup Guide

## The Issue

The Vocabulary Web is currently showing an error because it can't connect to the database. This happens when the `DATABASE_URL` environment variable is not set.

## Quick Fix: Show Sample Data

I've updated the Vocabulary Web to show sample data when the database isn't available, so you can see how it works. You'll see a yellow "Demo Mode" banner indicating that sample data is being displayed.

## To Set Up the Real Database

### Option 1: Use Neon (Recommended for Development)

1. **Sign up for Neon**: Go to [neon.tech](https://neon.tech) and create a free account
2. **Create a new project** and get your database connection string
3. **Create a `.env.local` file** in your project root:

```env
DATABASE_URL="postgresql://username:password@host/database?sslmode=require"
NEXTAUTH_URL="http://localhost:3000"
NEXTAUTH_SECRET="your-secret-key-here"
OPENAI_API_KEY="your-openai-api-key"
```

4. **Initialize the database**:
```bash
npx prisma db push
npm run db:seed
```

### Option 2: Use Local PostgreSQL

1. **Install PostgreSQL** on your machine
2. **Create a database**:
```bash
createdb language_learning_app
```

3. **Create a `.env.local` file**:
```env
DATABASE_URL="postgresql://username:password@localhost:5432/language_learning_app"
NEXTAUTH_URL="http://localhost:3000"
NEXTAUTH_SECRET="your-secret-key-here"
OPENAI_API_KEY="your-openai-api-key"
```

4. **Initialize the database**:
```bash
npx prisma db push
npm run db:seed
```

### Option 3: Use SQLite (Simplest for Development)

1. **Modify `prisma/schema.prisma`** to use SQLite:
```prisma
datasource db {
  provider = "sqlite"
  url      = "file:./dev.db"
}
```

2. **Initialize the database**:
```bash
npx prisma db push
npm run db:seed
```

## What Happens After Setup

Once the database is properly configured:

1. **The Vocabulary Web will load real data** from your database
2. **You'll see actual lexemes** instead of sample data
3. **Confidence levels will be calculated** based on real study performance
4. **The yellow demo banner will disappear**

## Current Status

- ✅ **Vocabulary Web Component**: Working with fallback to sample data
- ✅ **API Endpoint**: Created and ready
- ✅ **Error Handling**: Graceful fallbacks implemented
- ❌ **Database Connection**: Not configured (causing the loading error)

## Testing the Fix

1. **Set up the database** using one of the options above
2. **Restart your development server**: `npm run dev`
3. **Navigate to the Vocabulary Web**: Click the button on the home page
4. **You should see real data** instead of the error

## Troubleshooting

### Still Getting Errors?
- Check the browser console for detailed error messages
- Verify your `.env.local` file exists and has the correct `DATABASE_URL`
- Make sure your database is running and accessible
- Try running `npx prisma db push` to verify the connection

### Need Help?
- Check the browser console logs (F12 → Console)
- Look for the "Fetching vocabulary data..." message
- Check if the API endpoint `/api/vocabulary-web/data` is responding

The Vocabulary Web is now much more robust and will work even without a database, showing you exactly how it will look once properly configured!