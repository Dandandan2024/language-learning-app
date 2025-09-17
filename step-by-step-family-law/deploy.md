# Deployment Guide

## Quick Deploy to Vercel

### Option 1: One-Click Deploy
[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https://github.com/YOUR_USERNAME/step-by-step-family-law)

### Option 2: Manual Deploy

1. **Fork this repository** on GitHub
2. **Go to [Vercel.com](https://vercel.com)**
3. **Click "New Project"**
4. **Import your forked repository**
5. **Click "Deploy"**

## Environment Variables

No environment variables are required for basic functionality.

## Custom Domain Setup

1. **Purchase domain** (recommended: `stepbystepfamilylaw.com.au`)
2. **In Vercel dashboard:**
   - Go to Settings → Domains
   - Add your domain
   - Follow DNS configuration instructions

## Post-Deployment Checklist

- [ ] Test all pages and functionality
- [ ] Update contact information in footer
- [ ] Configure analytics (Google Analytics 4)
- [ ] Set up monitoring (Sentry)
- [ ] Test mobile responsiveness
- [ ] Verify SEO meta tags
- [ ] Test content migration tool
- [ ] Set up backup strategy

## Analytics Setup

1. **Google Analytics 4:**
   - Create GA4 property
   - Add tracking code to `src/app/layout.tsx`
   - Configure goals and conversions

2. **Vercel Analytics:**
   - Automatically enabled
   - View in Vercel dashboard

## Monitoring Setup

1. **Sentry (Error Tracking):**
   - Sign up at sentry.io
   - Add Sentry SDK to project
   - Configure error reporting

2. **Uptime Monitoring:**
   - Use Vercel's built-in monitoring
   - Or set up external service (UptimeRobot)

## Content Management

1. **Migrate Notion Content:**
   - Go to `/admin/migrate`
   - Follow migration guide
   - Upload and process content

2. **Regular Updates:**
   - Update content monthly
   - Review legal accuracy quarterly
   - Monitor user feedback

## Security Considerations

- [ ] Enable HTTPS (automatic with Vercel)
- [ ] Set up security headers (configured in vercel.json)
- [ ] Regular dependency updates
- [ ] Content security policy
- [ ] Rate limiting for forms

## Performance Optimization

- [ ] Image optimization (Next.js automatic)
- [ ] Code splitting (Next.js automatic)
- [ ] CDN (Vercel automatic)
- [ ] Caching strategy
- [ ] Bundle analysis

## Backup Strategy

1. **Code:** GitHub (automatic)
2. **Content:** Regular exports from admin panel
3. **Database:** Vercel automatic backups
4. **Files:** Vercel automatic backups

## Support

- **Documentation:** README.md
- **Issues:** GitHub Issues
- **Community:** /community (when implemented)
- **Email:** support@stepbystepfamilylaw.com.au