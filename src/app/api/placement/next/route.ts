import { NextRequest, NextResponse } from "next/server";
export const dynamic = "force-dynamic";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { 
  start, 
  pick, 
  getDifficultyForTheta,
  PlacementItem 
} from "@/lib/core";
import { generateSentence } from "@/lib/openai";
import { generateUniqueHash } from "@/lib/core";

export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const userId = session.user.id;

    // Check if user already has a level estimate (completed placement)
    const existingEstimate = await prisma.levelEstimate.findUnique({
      where: { userId }
    });

    if (existingEstimate) {
      return NextResponse.json(
        { error: "Placement already completed" }, 
        { status: 409 }
      );
    }

    // Get or create placement session from user settings
    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: { settings: true }
    });

    const settings = user?.settings as any;
    const placementState = settings?.placementState || start();
    
    // Get user language preferences, with defaults
    const userLanguage = settings?.language || 'ru';
    const nativeLanguage = settings?.nativeLanguage || 'en';

    // Get difficulty parameters for current theta
    const difficulty = getDifficultyForTheta(pick(placementState));

    // Avoid duplicates by excluding seen lexeme ids from this user session
    const seen: string[] = Array.isArray(placementState?.seenLexemeIds) ? placementState.seenLexemeIds : [];

    // Prefer lexemes within the current difficulty CEFR band, excluding seen ones
    let candidate = await prisma.lexeme.findFirst({
      where: {
        cefr: difficulty.cefr,
        id: { notIn: seen }
      },
      orderBy: { freqRank: 'asc' }
    });

    // Fallback: any lexeme not seen yet
    if (!candidate) {
      candidate = await prisma.lexeme.findFirst({
        where: { id: { notIn: seen } },
        orderBy: { freqRank: 'asc' }
      });
    }

    if (!candidate) {
      return NextResponse.json(
        { error: "No suitable content found" }, 
        { status: 404 }
      );
    }

    // Find or generate a sentence for this lexeme
    let sentence = await prisma.sentence.findFirst({
      where: { targetLexemeId: candidate.id },
      orderBy: { createdAt: 'desc' }
    });

    if (!sentence) {
      try {
        const generated = await generateSentence({
          lexeme: candidate.lemma,
          pos: candidate.pos || undefined,
          cefr: difficulty.cefr as any,
          targetLanguage: userLanguage,
          nativeLanguage: nativeLanguage
        });
        const uniqueHash = generateUniqueHash(`${candidate.id}-${generated.sentence_l2}`);
        sentence = await prisma.sentence.create({
          data: {
            targetLexemeId: candidate.id,
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
      } catch (err) {
        return NextResponse.json(
          { error: "Failed to generate content" },
          { status: 502 }
        );
      }
    }

    const response: PlacementItem = {
      lexemeId: candidate.id,
      sentence: {
        textL2: sentence.textL2,
        textL1: sentence.textL1,
        cefr: sentence.cefr as any,
        targetForm: sentence.targetForm || undefined
      },
      lexeme: {
        lemma: candidate.lemma,
        pos: candidate.pos || undefined,
        cefr: candidate.cefr as any,
        freqRank: candidate.freqRank
      },
      meta: {
        idx: placementState.n + 1,
        total: 15, // Maximum possible items
        theta: placementState.theta,
        delta: placementState.step
      }
    };

    return NextResponse.json(response);

  } catch (error) {
    console.error("Placement next error:", error);
    return NextResponse.json(
      { error: "Internal server error" }, 
      { status: 500 }
    );
  }
}
