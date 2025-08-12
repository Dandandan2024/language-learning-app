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

    // Find a suitable lexeme for this difficulty level
    // We'll use a simple approach: pick from a predefined set of common words
    // In a production app, you might want to use a more sophisticated algorithm
    const commonWords = [
      { lemma: 'hello', pos: 'interjection', cefr: 'A1' },
      { lemma: 'good', pos: 'adjective', cefr: 'A1' },
      { lemma: 'water', pos: 'noun', cefr: 'A1' },
      { lemma: 'eat', pos: 'verb', cefr: 'A1' },
      { lemma: 'house', pos: 'noun', cefr: 'A1' },
      { lemma: 'because', pos: 'conjunction', cefr: 'A2' },
      { lemma: 'understand', pos: 'verb', cefr: 'A2' },
      { lemma: 'friend', pos: 'noun', cefr: 'A2' },
      { lemma: 'important', pos: 'adjective', cefr: 'A2' },
      { lemma: 'suggest', pos: 'verb', cefr: 'B1' },
      { lemma: 'opinion', pos: 'noun', cefr: 'B1' },
      { lemma: 'probably', pos: 'adverb', cefr: 'B1' },
      { lemma: 'experience', pos: 'noun', cefr: 'B1' },
      { lemma: 'despite', pos: 'preposition', cefr: 'B2' },
      { lemma: 'achieve', pos: 'verb', cefr: 'B2' },
      { lemma: 'significant', pos: 'adjective', cefr: 'B2' },
      { lemma: 'nevertheless', pos: 'adverb', cefr: 'C1' },
      { lemma: 'contemplate', pos: 'verb', cefr: 'C1' },
    ];

    // Pick a word that matches the target CEFR level, or fall back to any word
    let selectedWord = commonWords.find(word => word.cefr === difficulty.cefr);
    if (!selectedWord) {
      // Fall back to a word from the same general level
      const levelGroups = {
        'A1': ['A1'],
        'A2': ['A1', 'A2'],
        'B1': ['A2', 'B1'],
        'B2': ['B1', 'B2'],
        'C1': ['B2', 'C1'],
        'C2': ['C1', 'C2']
      };
      const allowedLevels = levelGroups[difficulty.cefr] || ['A1', 'A2', 'B1'];
      selectedWord = commonWords.find(word => allowedLevels.includes(word.cefr)) || commonWords[0];
    }

    if (!selectedWord) {
      return NextResponse.json(
        { error: "No suitable content found" }, 
        { status: 404 }
      );
    }

    // Generate a sentence using OpenAI
    const generatedSentence = await generateSentence({
      lexeme: selectedWord.lemma,
      pos: selectedWord.pos,
      cefr: difficulty.cefr,
      targetLanguage: userLanguage,
      nativeLanguage: nativeLanguage
    });

    // Create a temporary lexeme ID for the placement (we don't need to store this)
    const tempLexemeId = `placement-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;

    const response: PlacementItem = {
      lexemeId: tempLexemeId,
      sentence: {
        textL2: generatedSentence.sentence_l2,
        textL1: generatedSentence.sentence_l1,
        cefr: generatedSentence.cefr,
        targetForm: generatedSentence.target_form
      },
      meta: {
        idx: placementState.n + 1,
        total: 12, // Maximum possible items
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
