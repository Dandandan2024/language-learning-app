# Deployment Guide for Anki GPT 2.0

## Prerequisites

1. **Neon Database** - Sign up at [neon.tech](https://neon.tech) for a free PostgreSQL database
2. **Vercel Account** - Sign up at [vercel.com](https://vercel.com)
3. **OpenAI API Key** - Get from [platform.openai.com](https://platform.openai.com)
4. **NextAuth Secret** - Generate a random string (you can use `openssl rand -base64 32`)

## Step 1: Database Setup

1. Create a new project on Neon
2. Copy your database connection string (it looks like: `postgresql://username:password@host/database?sslmode=require`)
3. Save this for later

## Step 2: Local Setup (Optional - for testing)

1. Create a file `apps/web/.env.local` with:
```env
DATABASE_URL=your-neon-database-url
NEXTAUTH_URL=http://localhost:3000
NEXTAUTH_SECRET=your-secret-key
OPENAI_API_KEY=your-openai-api-key
```

2. Initialize the database:
```bash
cd apps/web
npx prisma db push
```

3. Test locally:
```bash
npm run dev
```

## Step 3: Deploy to Vercel

### Option A: Using Vercel CLI

1. Install Vercel CLI:
```bash
npm i -g vercel
```

2. Deploy:
```bash
vercel
```

3. Follow the prompts and add environment variables when asked

### Option B: Using GitHub Integration

1. Push your code to GitHub
2. Go to [vercel.com/new](https://vercel.com/new)
3. Import your GitHub repository
4. Configure environment variables:
   - `DATABASE_URL` - Your Neon database URL
   - `NEXTAUTH_URL` - Your production URL (e.g., https://your-app.vercel.app)
   - `NEXTAUTH_SECRET` - Your generated secret
   - `OPENAI_API_KEY` - Your OpenAI API key

5. Click "Deploy"

## Step 4: Post-Deployment

1. Once deployed, go to your Vercel dashboard
2. Navigate to your project settings
3. Update `NEXTAUTH_URL` to match your production URL
4. Redeploy if needed

## Step 5: Initialize Database Schema

After deployment, run the database migrations:

1. Install Vercel CLI if you haven't already
2. Run:
```bash
vercel env pull .env.local
cd apps/web
npx prisma db push
```

## Troubleshooting

### Prisma Client Generation Issues
- The deployment uses a special build command that generates the Prisma client during build
- If you see Prisma errors, ensure your DATABASE_URL is correctly set in Vercel

### Build Failures
- Check the Vercel build logs for detailed error messages
- Ensure all environment variables are set correctly
- Try running `npm run build:vercel` locally to debug

### Database Connection Issues
- Verify your DATABASE_URL includes `?sslmode=require` at the end
- Check that your Neon database is active and not paused
- Ensure your database schema is initialized with `npx prisma db push`

## Environment Variables Reference

| Variable | Description | Example |
|----------|-------------|---------|
| DATABASE_URL | PostgreSQL connection string | postgresql://user:pass@host/db?sslmode=require |
| NEXTAUTH_URL | Your app's URL | https://your-app.vercel.app |
| NEXTAUTH_SECRET | Random secret for NextAuth | Generated with openssl rand -base64 32 |
| OPENAI_API_KEY | OpenAI API key for sentence generation | sk-... |

## Next Steps

After successful deployment:
1. Create initial seed data for lexemes and sentences
2. Test the placement wizard
3. Configure custom domain (optional)
4. Set up monitoring and analytics (optional)
