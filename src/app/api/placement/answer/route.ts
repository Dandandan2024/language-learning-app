import { NextRequest, NextResponse } from "next/server";
export const dynamic = "force-dynamic";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { 
  start,
  update,
  shouldStop,
  generateLevelEstimate,
  PlacementAnswerSchema,
  generateUniqueHash,
  getKnowledgeProfile
} from "@/lib/core";
import { generateSentence } from "@/lib/openai";

export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const userId = session.user.id;
    const body = await request.json();

    // Validate request body
    const validation = PlacementAnswerSchema.safeParse(body);
    if (!validation.success) {
      return NextResponse.json(
        { error: "Invalid request", details: validation.error.errors },
        { status: 400 }
      );
    }

    const { outcome, lexemeId } = validation.data;

    // Check if user already has a level estimate
    const existingEstimate = await prisma.levelEstimate.findUnique({
      where: { userId }
    });

    if (existingEstimate) {
      return NextResponse.json(
        { error: "Placement already completed" }, 
        { status: 409 }
      );
    }

    // Get current placement state from user settings
    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: { settings: true }
    });

    const settings = (user?.settings as any) || {};
    const placementState = settings.placementState || start();

    // Determine item difficulty theta if lexeme is found
    const lexeme = await prisma.lexeme.findUnique({ where: { id: lexemeId } });
    const itemDifficultyTheta = lexeme ? (typeof lexeme.freqRank === 'number' ? ((): number => {
      // inline mapping to avoid extra import: log-scaled rank to [-3, +3]
      const Rmax = 50000; const r = Math.max(1, Math.min(Rmax, lexeme.freqRank));
      const normalized = Math.log(r) / Math.log(Rmax); return -3 + 6 * normalized;
    })() : 0) : 0;

    // Update placement state with the user's response
    const newState = update(placementState, outcome, itemDifficultyTheta);

    // Track seen lexemes and history for profiling
    const seenLexemeIds: string[] = Array.isArray(placementState.seenLexemeIds) ? placementState.seenLexemeIds.slice() : [];
    const history = Array.isArray(placementState.history) ? placementState.history.slice() : [];

    // Enrich history entry with lexeme details
    if (lexeme) {
      if (!seenLexemeIds.includes(lexemeId)) seenLexemeIds.push(lexemeId);
      history.push({ lexemeId, outcome, cefr: (lexeme.cefr as any), freqRank: lexeme.freqRank, difficultyTheta: itemDifficultyTheta });
    }

    // Check if we should stop the placement test
    const finished = shouldStop(newState);

    if (finished) {
      // Generate final level estimate
      const estimate = generateLevelEstimate(newState);

      // Save level estimate to database
      await prisma.levelEstimate.create({
        data: {
          userId,
          cefrBand: estimate.cefrBand,
          vocabIndex: estimate.vocabIndex,
          confidence: estimate.confidence
        }
      });

      // Compute and store knowledge profile in settings
      const knowledgeProfile = getKnowledgeProfile({ ...newState, seenLexemeIds, history });

      // Clear placement state from user settings, persist knowledge profile
      await prisma.user.update({
        where: { id: userId },
        data: {
          settings: {
            ...settings,
            placementState: undefined,
            knowledgeProfile
          }
        }
      });

      // After placement completes, ensure the user has initial due study cards
      try {
        // Determine user language preferences
        const userLanguage = settings?.language || 'ru';
        const nativeLanguage = settings?.nativeLanguage || 'en';

        // If the database has no lexemes, seed a minimal fallback set
        const lexemeCount = await prisma.lexeme.count();
        if (lexemeCount === 0) {
          const fallbackLexemes = [
            { lemma: 'hello', pos: 'interjection', cefr: 'A1', freqRank: 1 },
            { lemma: 'good', pos: 'adjective', cefr: 'A1', freqRank: 2 },
            { lemma: 'water', pos: 'noun', cefr: 'A1', freqRank: 3 },
            { lemma: 'because', pos: 'conjunction', cefr: 'A2', freqRank: 50 },
            { lemma: 'understand', pos: 'verb', cefr: 'A2', freqRank: 51 },
            { lemma: 'suggest', pos: 'verb', cefr: 'B1', freqRank: 200 },
          ];
          for (const l of fallbackLexemes) {
            await prisma.lexeme.create({
              data: {
                lemma: l.lemma,
                pos: l.pos,
                freqRank: l.freqRank,
                cefr: l.cefr,
                forms: [l.lemma],
              }
            });
          }
        }

        // Pick lexemes around the user's estimated level
        const levelGroups: Record<string, string[]> = {
          'A1': ['A1'],
          'A2': ['A1', 'A2'],
          'B1': ['A2', 'B1'],
          'B2': ['B1', 'B2'],
          'C1': ['B2', 'C1'],
          'C2': ['C1', 'C2']
        };
        const allowedLevels = levelGroups[estimate.cefrBand] || ['A1', 'A2', 'B1'];

        const candidateLexemes = await prisma.lexeme.findMany({
          where: { cefr: { in: allowedLevels } },
          orderBy: { freqRank: 'asc' },
          take: 8,
        });

        const now = new Date();
        for (const lexeme of candidateLexemes) {
          // Ensure a lexeme state exists and is due now
          await prisma.lexemeState.upsert({
            where: { userId_lexemeId: { userId, lexemeId: lexeme.id } },
            update: {},
            create: {
              userId,
              lexemeId: lexeme.id,
              due: now,
              stability: 0.5,
              difficulty: 5.0,
              reps: 0,
              lapses: 0,
              suspended: false,
            }
          });

          // Ensure there is at least one sentence for this lexeme at user's level
          const existingSentence = await prisma.sentence.findFirst({
            where: { targetLexemeId: lexeme.id, cefr: estimate.cefrBand }
          });
          if (!existingSentence) {
            try {
              const generated = await generateSentence({
                lexeme: lexeme.lemma,
                pos: lexeme.pos || undefined,
                cefr: estimate.cefrBand as any,
                targetLanguage: userLanguage,
                nativeLanguage: nativeLanguage,
              });

              const uniqueHash = generateUniqueHash(`${lexeme.id}-${generated.sentence_l2}`);
              await prisma.sentence.create({
                data: {
                  targetLexemeId: lexeme.id,
                  textL2: generated.sentence_l2,
                  textL1: generated.sentence_l1,
                  cefr: generated.cefr,
                  difficulty: 0.4,
                  tokens: generated.sentence_l2.toLowerCase().split(' '),
                  source: 'llm',
                  targetForm: generated.target_form || undefined,
                  uniqueHash,
                }
              });
            } catch (genErr) {
              // Ignore generation failure; study will fall back to any available sentence
            }
          }
        }
      } catch (bootstrapErr) {
        // Do not fail placement completion if bootstrapping study content fails
        console.error('Post-placement bootstrap failed:', bootstrapErr);
      }

      return NextResponse.json({
        continue: false,
        estimate
      });
    } else {
      // Save updated placement state
      await prisma.user.update({
        where: { id: userId },
        data: {
          settings: {
            ...settings,
            placementState: { ...newState, seenLexemeIds, history }
          }
        }
      });

      return NextResponse.json({
        continue: true
      });
    }

  } catch (error) {
    console.error("Placement answer error:", error);
    return NextResponse.json(
      { error: "Internal server error" }, 
      { status: 500 }
    );
  }
}
