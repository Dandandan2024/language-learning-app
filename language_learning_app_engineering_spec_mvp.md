# Language Learning App — Engineering Spec (MVP)

## 1) Product overview

**Goal:** A web app that teaches via spaced repetition and comprehensible input. Cards are short, level‑appropriate sentences that each target one due lexeme. Non‑target words are at or below the learner’s estimated level.

**Initial scope:** One language pair (e.g., Russian → English). Email/OAuth login, adaptive placement (8–12 items), study loop with FSRS scheduler, LLM sentence generation with deterministic validation, simple analytics.

---

## 2) User flow (MVP)

1. **Log in / Sign up** → NextAuth (email magic link + optional Google/Apple).
2. **Adaptive placement (8–12 items):**
   - Start at \~B1 mid‑level. Show a sentence targeting a seed lexeme.
   - User taps **Easy** → next is harder; **Hard** → next is easier.
   - Step size halves every 2 items; stop once step ≤ threshold or after 12 items.
   - Output: `cefrBand`, continuous `vocabIndex` (−3..+3 mapped to 0..10), `confidence`.
3. **Study loop:**
   - Pull next due lexeme (FSRS). Fetch or generate a sentence that targets it.
   - Show L2, optional hint; reveal L1 on demand. Rating buttons: Again/Hard/Good/Easy.
   - Update FSRS state and enqueue prefetch for the next 2–3 due lexemes.
4. **Light analytics:** daily reviews, retention %, streak.

---

## 3) System architecture

- **Web:** Next.js 14 (App Router, TypeScript), Tailwind, shadcn/ui.
- **API:** Next.js route handlers (`/api/*`).
- **DB:** Neon Postgres via Prisma.
- **Worker:** Node (Railway) for background jobs: LLM generation, validation, TTS (optional), prefetch.
- **Hosting:** Vercel (web), Railway (worker). Optional Upstash Redis for queue; or Postgres‑only job table.
- **LLM:** OpenAI (provider‑switchable).
- **Optional:** pgvector on Neon for dedupe/rerank.

**Repo layout**

```
apps/
  web/        (Next.js app)
  worker/     (job consumer)
packages/
  core/       (shared types, FSRS, placement, schemas)
infra/
  prisma/     (schema + migrations)
```

---

## 4) Data model (Prisma)

```prisma
model User {
  id            String   @id @default(cuid())
  email         String   @unique
  name          String?
  createdAt     DateTime @default(now())
  settings      Json?
  levelEstimate LevelEstimate?
  reviews       Review[]
  lexemeStates  LexemeState[]
}

model Lexeme {
  id        String   @id @default(cuid())
  lemma     String
  pos       String?
  freqRank  Int
  cefr      String            // A1..C2 seed label
  forms     String[]          // optional inflections
  notes     String?
  @@index([freqRank])
  @@index([cefr])
}

model Sentence {
  id             String   @id @default(cuid())
  targetLexemeId String
  textL2         String
  textL1         String   // translation
  cefr           String
  difficulty     Float    // 0..1 scaled
  tokens         String[] // optional tokenizer output
  source         String   // "llm" | "seed"
  targetForm     String?
  createdAt      DateTime @default(now())
  uniqueHash     String   @unique
  Lexeme         Lexeme   @relation(fields: [targetLexemeId], references: [id])
}

model Card {
  id             String   @id @default(cuid())
  userId         String
  sentenceId     String
  targetLexemeId String
  createdAt      DateTime @default(now())
  User           User     @relation(fields: [userId], references: [id])
  Sentence       Sentence @relation(fields: [sentenceId], references: [id])
  Lexeme         Lexeme   @relation(fields: [targetLexemeId], references: [id])
}

model Review {
  id          String   @id @default(cuid())
  userId      String
  lexemeId    String
  cardId      String
  rating      Int                 // 1 again, 2 hard, 3 good, 4 easy
  reviewedAt  DateTime @default(now())
  stability   Float               // snapshot BEFORE update
  difficulty  Float
  elapsedDays Int
}

model LexemeState {
  userId     String
  lexemeId   String
  due        DateTime
  stability  Float
  difficulty Float
  reps       Int
  lapses     Int
  lastReview DateTime?
  suspended  Boolean  @default(false)
  @@id([userId, lexemeId])
}

model LevelEstimate {
  userId     String  @id
  cefrBand   String  // A1..C2
  vocabIndex Float   // 0..10
  confidence Float   // 0..1
  updatedAt  DateTime @default(now())
}
```

**Indexes to add in later migrations**

- `LexemeState(due)` for pull‑next queries.
- `Review(userId, reviewedAt)` for analytics.

---

## 5) Scheduling — FSRS‑lite

Store `(stability s, difficulty d)` per **user×lexeme**. Rating → update `(s,d)` and schedule next `due`.

- Init: `s=0.5, d=5.0`.
- Multipliers by rating: `again=0.5`, `hard=0.9`, `good=1.6`, `easy=2.2`.
- Clamp: `s∈[0.3,60]`, `d∈[1.3,9.0]`.
- Interval: `days = round( max(1, s^1.07) )`.
- Persist snapshot to `Review` before update for analytics.

Tests: monotonic growth on better ratings; interval increases over successful streaks; lapses reset behavior.

---

## 6) Adaptive placement (8–12 items)

- Maintain scalar `theta` (−3..+3). Start at 0 (\~B1).
- Step size `Δ` starts at 1.0; halve every 2 responses.
- Show item at difficulty \~`theta` by selecting a seed lexeme + cached sentence near that level.
- Update: Easy → `theta += Δ`; Hard → `theta -= Δ`.
- Stop when: (a) at least 8 items **and** `Δ ≤ 0.25`, or (b) 12 items.
- Map to CEFR: A1≤−2; A2≤−1; B1≤0.2; B2≤1.2; C1≤2.2; else C2.
- Compute `vocabIndex = 10 * sigmoid(theta)`; `confidence` via remaining `Δ`.

Seed bank: \~300 lexemes across A1–C1 with curated sentences so placement never blocks on LLM.

---

## 7) Sentence generation (LLM) pipeline

**Constraints**

- Exactly one **target lexeme** (due) appears; other tokens must be ≤ user level.
- Length 5–12 words, one clause, neutral topics, no names/slang.
- Return L2 sentence, L1 translation, CEFR, target form, one‑line note.

**System prompt (template)**

```
You generate SHORT, SIMPLE sentences in <TARGET_LANGUAGE> for language learners.
Target lexeme: <LEMMA>.
Difficulty: <CEFR> (~theta <THETA>).
All other words ≤ this level.
5–12 words. One clause. No names, no slang.
Return JSON only with keys: sentence_l2, sentence_l1, target_form, cefr, notes.
```

**Validation (deterministic)**

- JSON schema (zod) for fields and max lengths.
- Normalize L2 → `uniqueHash` for dedupe.
- Token gate: maintain small CEFR wordlists for function words + rank cutoff for open‑class words; reject if any out‑of‑band token.
- If rejected, retry with short feedback ("too hard", "too long").

**Caching strategy**

- Cache by `(lexemeId, cefrBand)` in `Sentence` table; hit cache before calling the LLM.
- Background prefetch: when a user reviews, queue generation for the next 2–3 due lexemes (their `cefrBand`).

Optional: lightweight L2↔L1 back‑translation check in worker; mark low‑agreement sentences for review rather than blocking.

---

## 8) API contracts (App Router route handlers)

```
GET  /api/placement/next
→ { lexemeId, sentence?: {textL2,textL1,cefr,targetForm}, meta: {idx,total,theta,delta} }

POST /api/placement/answer
{ outcome: "easy"|"hard", lexemeId }
→ { continue: boolean, estimate?: { cefrBand, vocabIndex, confidence } }

GET  /api/study/next
→ { cardId, sentence, lexeme, state: { due, stability, difficulty } }

POST /api/study/review
{ cardId, rating: 1|2|3|4 }
→ { nextDue, updatedState }

POST /api/generate
{ lexemeId, difficultyHint: { cefrBand, theta? } }
→ 202 (enqueued) | 200 (cached sentence)
```

Errors: 400 invalid input, 409 no due items, 429 rate limit, 500 generic.

---

## 9) UI spec

**Placement wizard**

- Progress indicator 1/10. L2 sentence, subtle “?” to reveal L1.
- Buttons: **Hard** / **Easy** (keyboard: left/right). Minimal chrome to keep focus.

**Study**

- Big L2 with target lexeme highlighted (underline or chip). Toggle to reveal L1.
- Rating buttons: Again / Hard / Good / Easy (keyboard: 1–4).
- After rating: small toast: “Back in 2d”.

**Settings**

- Daily goal (# reviews). Toggle: hide translation until reveal. Voice toggle if TTS enabled.

Accessibility: focus ring, ARIA for buttons, readable font sizes.

---

## 10) Worker & jobs

**Jobs**

- `generateSentence(lexemeId, cefrBand | theta)`
- `prefetchForUser(userId)`

**Queue options**

- Redis (BullMQ + Upstash) with job idempotency via `uniqueHash`.
- Or Postgres job table with polling (simpler ops, fewer deps).

Backoff: exponential; max 3 attempts; log reasons.

---

## 11) Observability & analytics

- Structured logs for API and jobs (request id).
- Metrics: LLM latency, token usage, generation success rate, reject reasons; scheduler retention %, average interval growth; placement convergence length.
- Basic admin page for sentence audits and manual disable.

---

## 12) Security & safety

- NextAuth session, HTTPS only, secure cookies.
- Row‑level access: user‑scoped queries everywhere.
- Content filter: block PII, politics, medical claims, violence via prompt + post‑gate list.
- Rate limits per user for `/api/generate`.

---

## 13) Environment & config

- `DATABASE_URL` (Neon)
- `OPENAI_API_KEY`
- `NEXTAUTH_SECRET` (+ provider ids)
- `REDIS_URL` (if using Redis)
- `TTS_API_KEY` (optional)

Vercel: set envs for `apps/web`. Railway: set envs for `apps/worker`.

---

## 14) Seed & migration plan

1. `Lexeme` seed from frequency list with CEFR guess; mark \~300 as `placementSeed` (extra column if desired).
2. Curate 1–3 sentences per seed lexeme for offline placement reliability.
3. Run smoke test: placement → study with cached sentences; LLM only used when cache miss.

---

## 15) Testing strategy

- **Unit:** FSRS transitions; placement step logic; zod schema validation.
- **Integration:** `/api/study/next` → `/api/study/review` loop; due ordering.
- **E2E:** new user → placement → 20 reviews; check intervals grow.
- **Load:** 1k sentence generations/hour; cache hit ≥70% after warmup.

---

## 16) Cursor setup

**.cursor/rules.md (essentials)**

- Prefer TypeScript; no `any`.
- Validate all external JSON via zod.
- Add unit tests for FSRS and placement before UI polish.
- Keep route handlers small; move logic to `packages/core`.
- Never block UI on generation: always show cached or enqueue.

**First Cursor tasks**

1. Scaffold Next.js app + Tailwind + shadcn/ui.
2. Add Prisma + Neon; create schema & migration.
3. Implement `packages/core/fsrs.ts` + tests.
4. Placement endpoints + minimal UI.
5. Study endpoints + minimal UI.
6. Worker on Railway with `/jobs/generateSentence`.
7. Add cache-first fetch in `/api/study/next` and prefetch.

---

## 17) Roadmap after MVP

- Per‑user ease calibration (learn user bias; adjust difficulty mapping).
- Morphology mode: cycle common forms for verbs/nouns.
- Audio‑first mode with cached TTS per sentence.
- Vector rerank for diversity & near‑duplication control.
- Multi‑language support with `Language` table and language‑scoped lexemes.

---

## 18) Code snippets

**FSRS‑lite**

```ts
export type Rating = 1|2|3|4;
export type State = { s: number; d: number; due: Date };

export function initState(): State {
  return { s: 0.5, d: 5.0, due: new Date() };
}

export function review(prev: { s: number; d: number }, rating: Rating) {
  let { s, d } = prev;
  const mult = rating===1 ? 0.5 : rating===2 ? 0.9 : rating===3 ? 1.6 : 2.2;
  s = Math.min(60, Math.max(0.3, s * mult));
  d = Math.min(9.0, Math.max(1.3, d + (rating===4? -0.2 : rating===1? +0.3 : 0)));
  const days = Math.max(1, Math.round(Math.pow(s, 1.07)));
  const due = new Date(Date.now() + days*86400000);
  return { s, d, due, days };
}
```

**LLM output zod schema**

```ts
import { z } from "zod";
export const SentenceSchema = z.object({
  sentence_l2: z.string().min(3).max(160),
  sentence_l1: z.string().min(1).max(200),
  target_form: z.string().optional(),
  cefr: z.enum(["A1","A2","B1","B2","C1","C2"]),
  notes: z.string().max(200).optional()
});
```

**Placement stepper**

```ts
export type Outcome = "easy" | "hard";
export function start() { return { theta: 0, step: 1.0, n: 0 }; }
export function pick(d: {theta:number}) { return Math.max(-2.5, Math.min(2.5, d.theta)); }
export function upd(d: {theta:number; step:number; n:number}, o:Outcome){
  const theta = d.theta + (o==='easy' ? d.step : -d.step);
  const n = d.n + 1;
  const step = n % 2 === 0 ? d.step * 0.5 : d.step;
  return { theta, step, n };
}
export function stop(d:{step:number; n:number}) { return (d.n >= 8 && d.step <= 0.25) || d.n >= 12; }
```

---

**This spec is ready to drop into Cursor as a project brief.**

