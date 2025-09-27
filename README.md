# Sauna Cult Booking System

A modern, user-friendly web application for booking sauna sessions with integrated payments and admin management.

## Features

### Customer Features
- 🏠 **Beautiful Homepage** - Modern, responsive design with clear session display
- 📅 **Easy Booking** - Simple date selection and session booking
- 💳 **Secure Payments** - Integrated Stripe payment processing
- ✅ **Instant Confirmation** - Real-time booking confirmation with payment success
- 📱 **Mobile Responsive** - Works perfectly on all devices

### Admin Features
- 🔐 **Secure Authentication** - Admin login with JWT tokens
- 📊 **Dashboard** - Overview of bookings, revenue, and sessions
- 📅 **Session Management** - Create, edit, and manage sauna sessions
- 👥 **Booking Management** - View and manage all customer bookings
- 💰 **Revenue Tracking** - Monitor earnings and booking statistics

## Tech Stack

- **Frontend**: Next.js 14, React 18, TypeScript, Tailwind CSS
- **Backend**: Next.js API Routes, Prisma ORM
- **Database**: PostgreSQL
- **Payments**: Stripe
- **Authentication**: JWT tokens with bcrypt
- **UI Components**: Headless UI, Heroicons, Lucide React

## Quick Start

### 1. Install Dependencies

```bash
npm install
```

### 2. Environment Setup

Copy the example environment file:

```bash
cp .env.example .env.local
```

Update `.env.local` with your configuration:

```env
# Database
DATABASE_URL="postgresql://username:password@localhost:5432/sauna_cult"

# Stripe (get from https://stripe.com)
STRIPE_PUBLISHABLE_KEY=pk_test_...
STRIPE_SECRET_KEY=sk_test_...

# JWT Secret (generate a random string)
JWT_SECRET=your-super-secret-jwt-key

# Admin Credentials
ADMIN_EMAIL=admin@saunacult.com
ADMIN_PASSWORD=secure-admin-password
```

### 3. Database Setup

Generate Prisma client and run migrations:

```bash
npx prisma generate
npx prisma db push
```

### 4. Initialize Database

Run the setup script to create admin user and sample sessions:

```bash
npx tsx scripts/setup.ts
```

### 5. Start Development Server

```bash
npm run dev
```

Visit `http://localhost:3000` to see the booking system in action!

## Admin Access

- **URL**: `http://localhost:3000/admin`
- **Default Email**: `admin@saunacult.com`
- **Default Password**: `admin123`

*Change these credentials in your `.env.local` file for production!*

## Stripe Setup

1. Create a Stripe account at [stripe.com](https://stripe.com)
2. Get your API keys from the Stripe Dashboard
3. Add them to your `.env.local` file
4. For production, use live keys instead of test keys

## Database Schema

The application uses the following main entities:

- **Users**: Customer information (email, name, phone)
- **Sessions**: Sauna session details (date, time, price, capacity)
- **Bookings**: Customer bookings with payment status
- **Admins**: Admin users for system management

## API Endpoints

### Public Endpoints
- `GET /api/sessions` - Get available sessions for a date
- `POST /api/bookings` - Create a new booking
- `GET /api/bookings/[id]` - Get booking details

### Admin Endpoints
- `POST /api/admin/login` - Admin authentication
- `GET /api/admin/verify` - Verify admin token
- `GET /api/admin/stats` - Get dashboard statistics
- `GET /api/admin/sessions` - Get all sessions
- `POST /api/admin/sessions` - Create new session
- `PATCH /api/admin/sessions/[id]` - Update session
- `DELETE /api/admin/sessions/[id]` - Delete session
- `GET /api/admin/bookings` - Get all bookings
- `PATCH /api/admin/bookings/[id]` - Update booking status

## Deployment

### Vercel (Recommended)

1. Push your code to GitHub
2. Connect your repository to Vercel
3. Add environment variables in Vercel dashboard
4. Deploy!

### Other Platforms

The app can be deployed to any platform that supports Next.js:
- Netlify
- Railway
- DigitalOcean App Platform
- AWS Amplify

Make sure to set up a PostgreSQL database and configure all environment variables.

## Customization

### Styling
- Modify `tailwind.config.js` to change colors and theme
- Update `app/globals.css` for custom styles
- Brand colors are defined in the `sauna` color palette

### Features
- Add email notifications in `lib/email.ts`
- Extend booking with additional fields in the Prisma schema
- Add more payment methods by extending Stripe integration

## Support

For issues and questions:
1. Check the console for error messages
2. Verify all environment variables are set correctly
3. Ensure database is properly connected
4. Check Stripe keys are valid and have proper permissions

## License

MIT License - feel free to use this project for your own sauna business!