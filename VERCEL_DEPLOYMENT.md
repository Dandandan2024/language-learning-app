# Vercel Deployment Guide for Language Learning App

## Quick Setup (5 minutes)

### Step 1: Get a Free Database
1. Go to [neon.tech](https://neon.tech) and sign up for free
2. Create a new project called "language-learning-app"
3. Copy your database connection string (it looks like: `postgresql://username:password@host/database?sslmode=require`)
4. Keep this handy - you'll need it for Vercel

### Step 2: Deploy to Vercel
1. Go to [vercel.com](https://vercel.com) and sign up/login
2. Click "New Project" and import your GitHub repository
3. Vercel will auto-detect it's a Next.js app
4. **Important**: Add these environment variables in Vercel:

```
DATABASE_URL=postgresql://username:password@host/database?sslmode=require
NEXTAUTH_URL=https://your-app-name.vercel.app
NEXTAUTH_SECRET=your-secret-key-here
```

### Step 3: Generate Secret Key
Run this command to generate a secure secret:
```bash
openssl rand -base64 32
```
Copy the output and use it as your `NEXTAUTH_SECRET`

### Step 4: Set Up Database Schema
After deployment, you need to initialize your database:

1. Install Vercel CLI: `npm i -g vercel`
2. Login: `vercel login`
3. Pull environment variables: `vercel env pull .env.local`
4. Set up database: `npx prisma db push`
5. Seed with sample data: `npm run db:seed`

## Detailed Steps

### Environment Variables Needed

| Variable | Description | Example |
|----------|-------------|---------|
| `DATABASE_URL` | Your Neon database connection string | `postgresql://user:pass@host/db?sslmode=require` |
| `NEXTAUTH_URL` | Your Vercel app URL | `https://your-app.vercel.app` |
| `NEXTAUTH_SECRET` | Random secret for authentication | Generated with `openssl rand -base64 32` |

### Optional Environment Variables

| Variable | Description | When to use |
|----------|-------------|-------------|
| `OPENAI_API_KEY` | For AI-generated sentences | Only if you want dynamic content generation |
| `GOOGLE_CLIENT_ID` | Google OAuth | For Google sign-in |
| `GOOGLE_CLIENT_SECRET` | Google OAuth secret | For Google sign-in |
| `EMAIL_SERVER_*` | Email configuration | For magic link authentication |

### Database Setup Commands

```bash
# 1. Pull environment from Vercel
vercel env pull .env.local

# 2. Generate Prisma client
npm run db:generate

# 3. Push database schema
npm run db:push

# 4. Seed with sample data
npm run db:seed
```

### Troubleshooting

#### Build Fails
- Check that `DATABASE_URL` is set correctly in Vercel
- Ensure the database URL includes `?sslmode=require`
- Check Vercel build logs for specific errors

#### Database Connection Issues
- Verify your Neon database is active (not paused)
- Check that the connection string is correct
- Ensure all environment variables are set in Vercel

#### Authentication Issues
- Verify `NEXTAUTH_URL` matches your Vercel domain exactly
- Check that `NEXTAUTH_SECRET` is set
- Ensure the secret is the same across deployments

#### App Works Locally But Not on Vercel
- Check environment variables are set in Vercel dashboard
- Verify database schema is initialized: `npx prisma db push`
- Check Vercel function logs for runtime errors

### Testing Your Deployment

1. Visit your Vercel URL
2. Click "Sign In"
3. Enter any email and name
4. Try the placement test
5. Check that data is being saved to your database

### Next Steps After Deployment

1. **Custom Domain**: Add your own domain in Vercel settings
2. **Monitoring**: Set up Vercel Analytics
3. **Content**: Add more language content via the admin endpoints
4. **Features**: Enable optional features like Google OAuth

## Support

If you run into issues:
1. Check the Vercel deployment logs
2. Verify all environment variables are set
3. Ensure database schema is initialized
4. Test locally with the same environment variables

The app should work out of the box with just the 3 required environment variables!