# Deploying Sauna Cult to Vercel

This guide will help you deploy your Sauna Cult booking system to Vercel.

## Prerequisites

1. **GitHub Account** - Your code needs to be in a GitHub repository
2. **Vercel Account** - Sign up at [vercel.com](https://vercel.com)
3. **PostgreSQL Database** - You'll need a database (recommended: Vercel Postgres, Railway, or Supabase)
4. **Stripe Account** - For payment processing

## Step 1: Push to GitHub

1. **Initialize Git repository** (if not already done):
   ```bash
   git init
   git add .
   git commit -m "Initial commit: Sauna Cult booking system"
   ```

2. **Create a GitHub repository**:
   - Go to [github.com](https://github.com) and create a new repository
   - Don't initialize with README (since you already have files)

3. **Push your code**:
   ```bash
   git remote add origin https://github.com/YOUR_USERNAME/YOUR_REPO_NAME.git
   git branch -M main
   git push -u origin main
   ```

## Step 2: Set Up Database

### Option A: Vercel Postgres (Recommended)
1. Go to your Vercel dashboard
2. Navigate to "Storage" → "Create Database" → "Postgres"
3. Create a new database
4. Copy the connection string

### Option B: Railway
1. Go to [railway.app](https://railway.app)
2. Create a new PostgreSQL database
3. Copy the connection string

### Option C: Supabase
1. Go to [supabase.com](https://supabase.com)
2. Create a new project
3. Go to Settings → Database → Connection string

## Step 3: Deploy to Vercel

1. **Go to Vercel Dashboard**:
   - Visit [vercel.com/dashboard](https://vercel.com/dashboard)

2. **Import Project**:
   - Click "New Project"
   - Import your GitHub repository
   - Select the repository and click "Import"

3. **Configure Environment Variables**:
   In the Vercel project settings, add these environment variables:
   
   ```
   NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_live_your_stripe_publishable_key
   STRIPE_SECRET_KEY=sk_live_your_stripe_secret_key
   DATABASE_URL=your_postgresql_connection_string
   JWT_SECRET=your_super_secret_jwt_key_here
   ADMIN_EMAIL=admin@yourdomain.com
   ADMIN_PASSWORD=your_secure_admin_password
   ```

4. **Deploy**:
   - Click "Deploy"
   - Wait for the build to complete

## Step 4: Set Up Database Schema

After deployment, you need to set up your database:

1. **Install Vercel CLI**:
   ```bash
   npm i -g vercel
   ```

2. **Login to Vercel**:
   ```bash
   vercel login
   ```

3. **Pull environment variables**:
   ```bash
   vercel env pull .env.local
   ```

4. **Push database schema**:
   ```bash
   npx prisma db push
   ```

5. **Generate Prisma client**:
   ```bash
   npx prisma generate
   ```

6. **Set up admin user and sample data**:
   ```bash
   npx tsx scripts/setup.ts
   ```

## Step 5: Configure Custom Domain (Optional)

1. Go to your Vercel project settings
2. Navigate to "Domains"
3. Add your custom domain
4. Follow the DNS configuration instructions

## Step 6: Set Up Stripe Webhooks (Important!)

1. **Go to Stripe Dashboard**:
   - Visit [dashboard.stripe.com](https://dashboard.stripe.com)

2. **Create Webhook**:
   - Go to "Developers" → "Webhooks"
   - Click "Add endpoint"
   - URL: `https://your-domain.vercel.app/api/webhooks/stripe`
   - Select events: `payment_intent.succeeded`, `payment_intent.payment_failed`

3. **Get Webhook Secret**:
   - Copy the webhook signing secret
   - Add it to Vercel environment variables as `STRIPE_WEBHOOK_SECRET`

## Post-Deployment Checklist

- [ ] Database schema is set up
- [ ] Admin user is created
- [ ] Stripe keys are configured (use live keys for production)
- [ ] Custom domain is set up (optional)
- [ ] Stripe webhooks are configured
- [ ] Test a complete booking flow
- [ ] Verify admin dashboard works
- [ ] Check email notifications (if configured)

## Environment Variables Reference

| Variable | Description | Example |
|----------|-------------|---------|
| `NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY` | Stripe publishable key | `pk_live_...` |
| `STRIPE_SECRET_KEY` | Stripe secret key | `sk_live_...` |
| `DATABASE_URL` | PostgreSQL connection string | `postgresql://...` |
| `JWT_SECRET` | Secret for JWT tokens | Random string |
| `ADMIN_EMAIL` | Admin login email | `admin@yourdomain.com` |
| `ADMIN_PASSWORD` | Admin login password | Secure password |
| `STRIPE_WEBHOOK_SECRET` | Stripe webhook secret | `whsec_...` |

## Troubleshooting

### Build Errors
- Check that all environment variables are set
- Ensure database connection string is correct
- Verify Stripe keys are valid

### Database Issues
- Make sure PostgreSQL database is running
- Check connection string format
- Run `npx prisma db push` to sync schema

### Payment Issues
- Verify Stripe keys are correct
- Check webhook configuration
- Test with Stripe test cards first

## Support

If you encounter issues:
1. Check the Vercel deployment logs
2. Verify all environment variables are set
3. Test the application locally first
4. Check the browser console for errors

Your Sauna Cult booking system should now be live and ready to accept bookings!