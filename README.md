# Language Learning App

A modern web application for language learning using spaced repetition and comprehensible input. Built with Next.js, Prisma, and TypeScript.

## Features

- **Adaptive Placement Test**: Determines user's vocabulary level using binary search algorithm
- **FSRS Scheduling**: Implements spaced repetition with Free Spaced Repetition Scheduler
- **Comprehensible Input**: Sentences target one new word while keeping others at user's level
- **Beautiful UI**: Modern interface built with Tailwind CSS and shadcn/ui
- **Authentication**: Secure login with NextAuth (email magic links + Google OAuth)
- **Real-time Progress**: Track learning progress and statistics

## Architecture

### Monorepo Structure
```
apps/
  web/        # Next.js frontend application
  worker/     # Background job processor (planned)
packages/
  core/       # Shared algorithms (FSRS, placement, types)
infra/
  prisma/     # Database schema and migrations
```

### Tech Stack
- **Frontend**: Next.js 15, React 18, TypeScript
- **Styling**: Tailwind CSS, shadcn/ui components
- **Backend**: Next.js API routes, Prisma ORM
- **Database**: PostgreSQL (recommended: Neon)
- **Authentication**: NextAuth.js
- **Testing**: Jest (for core algorithms)

## Quick Start

### Prerequisites
- Node.js 18+ 
- PostgreSQL database (or Neon account)
- Git

### 1. Clone and Setup
```bash
git clone <repository-url>
cd language-learning-app
npm install
```

### 2. Environment Configuration
Create `apps/web/.env.local`:
```env
# Database
DATABASE_URL="postgresql://username:password@localhost:5432/language_app"

# NextAuth
NEXTAUTH_URL="http://localhost:3000"
NEXTAUTH_SECRET="your-secret-key-here-generate-with-openssl-rand-base64-32"

# Google OAuth (optional)
GOOGLE_CLIENT_ID="your-google-client-id"
GOOGLE_CLIENT_SECRET="your-google-client-secret"

# OpenAI API (for future LLM integration)
OPENAI_API_KEY="your-openai-api-key"
```

### 3. Database Setup
```bash
# Generate Prisma client
npm run db:generate

# Create and apply migrations
npm run db:migrate

# Seed database with sample Russian lexemes
cd infra/prisma
npm run db:seed
cd ../..
```

### 4. Run Development Server
```bash
npm run dev
```

Visit [http://localhost:3000](http://localhost:3000) to see the app!

## How It Works

### Adaptive Placement (8-12 items)
1. Starts at ~B1 level (theta = 0)
2. Shows sentence targeting a lexeme at current difficulty
3. User rates: Easy (+step) or Hard (-step)
4. Step size halves every 2 responses
5. Stops when convergence reached or 12 items completed
6. Maps final theta to CEFR level and vocab index

### Study Loop with FSRS
1. Pulls next due lexeme based on FSRS scheduling
2. Shows sentence with target word highlighted
3. User reveals translation then rates recall (1-4)
4. Updates stability/difficulty and schedules next review
5. Prefetches content for upcoming reviews

### Core Algorithms

**FSRS-lite Implementation:**
```typescript
// Initial state: stability=0.5, difficulty=5.0
// Rating multipliers: again=0.5, hard=0.9, good=1.6, easy=2.2
// Interval = max(1, round(stability^1.07)) days
```

**Placement Algorithm:**
```typescript
// Binary search with halving step sizes
// theta ∈ [-3,+3] maps to CEFR A1-C2
// vocabIndex = 10 * sigmoid(theta)
```

## Database Schema

### Core Models
- **User**: Authentication and settings
- **Lexeme**: Vocabulary items with frequency ranks and CEFR levels
- **Sentence**: L2/L1 sentence pairs targeting specific lexemes
- **LexemeState**: Per-user FSRS state (stability, difficulty, due date)
- **Review**: Historical review records for analytics
- **Card**: Links users to specific sentence-lexeme combinations

### Key Relationships
- Users have many LexemeStates (their learning progress)
- Lexemes have many Sentences (different contexts)
- Reviews track all user interactions for analytics

## API Endpoints

### Placement
- `GET /api/placement/next` - Get next placement item
- `POST /api/placement/answer` - Submit easy/hard rating

### Study
- `GET /api/study/next` - Get next due card
- `POST /api/study/review` - Submit review rating (1-4)

### Generation (Future)
- `POST /api/generate` - Request LLM sentence generation

## Testing

Run core algorithm tests:
```bash
cd packages/core
npm test
```

Tests cover:
- FSRS state transitions and monotonic growth
- Placement convergence and CEFR mapping
- Schema validation with Zod

## Deployment

### Database (Neon)
1. Create account at [neon.tech](https://neon.tech)
2. Create new project and database
3. Copy connection string to `DATABASE_URL`

### Web App (Vercel)
1. Connect GitHub repository to Vercel
2. Set environment variables in Vercel dashboard
3. Deploy automatically on push

### Background Worker (Railway) - Planned
Future implementation will add:
- LLM sentence generation queue
- Prefetching for upcoming reviews
- Content validation and filtering

## Development

### Workspace Commands
```bash
npm run dev          # Start web app
npm run build        # Build for production
npm run db:generate  # Generate Prisma client
npm run db:migrate   # Run database migrations
npm run db:studio    # Open Prisma Studio
```

### Project Structure
```
├── apps/web/src/
│   ├── app/                 # Next.js App Router
│   ├── components/          # React components
│   ├── lib/                 # Utilities and config
│   └── styles/             # Global styles
├── packages/core/src/
│   ├── fsrs.ts             # Spaced repetition algorithm
│   ├── placement.ts        # Adaptive placement logic
│   ├── schemas.ts          # Zod validation schemas
│   └── types.ts            # TypeScript definitions
└── infra/prisma/
    ├── schema.prisma       # Database schema
    └── seed.ts             # Sample data
```

## Contributing

1. Fork the repository
2. Create feature branch: `git checkout -b feature/amazing-feature`
3. Commit changes: `git commit -m 'Add amazing feature'`
4. Push to branch: `git push origin feature/amazing-feature`
5. Open Pull Request

## Roadmap

### MVP Complete ✅
- [x] Monorepo setup with Next.js and Prisma
- [x] FSRS-lite scheduling algorithm with tests
- [x] Adaptive placement algorithm with tests  
- [x] NextAuth authentication
- [x] Placement and study API endpoints
- [x] Modern UI with placement wizard and study interface
- [x] Russian language seed data

### Planned Features
- [ ] Background worker for LLM sentence generation
- [ ] Advanced analytics dashboard
- [ ] Multiple language support
- [ ] Audio/TTS integration
- [ ] Mobile app (React Native)
- [ ] Social features and leaderboards

## License

MIT License - see LICENSE file for details.

---

**Happy Learning!** 🚀📚

## Probabilistic Assessment (Yes/No + Mini-CAT)

- Endpoints:
  - `POST /api/assessment/start`: starts a session and returns Yes/No items (with ~20% pseudowords).
  - `POST /api/assessment/answer`: submits responses; transitions to CAT and adaptively selects items; stops at SE(θ) ≤ 0.30 or 30 items.
  - `GET /api/assessment/result`: returns θ, SE, estimated vocab size, coverage by Zipf bands, and paginated per-word probabilities.
  - `POST /api/assessment/seed`: seeds the study queue from low-probability, high-impact lexemes.
  - `GET /api/lexemes/coverage`: coverage curve by Zipf bands.

- Math utils in `src/lib/core/irt.ts`:
  - `probKnow(θ,b,g)`, `fisherInfo(θ,b,g)`, `updateThetaMAP(state,b,g,y)`.

- Prisma additions:
  - Lexeme features: `familyId, zipf, length, morphComplex, cognate, falseFriend, bInitRecognition, bInitRecall`.
  - New models: `AssessmentSession, AssessmentItem, AssessmentResponse, LexemeAbility` and optional `theta, thetaVar` on `LevelEstimate`.

- Config (defaults inline for now):
  - Yes/No counts: real=60, pseudo=15. Guessing: yes/no=0.05, mc4=0.25.
  - CAT stop: SE ≤ 0.30 or 30 items.

- Tests
  - Unit tests for IRT utilities and placement helpers: `npm test`.
