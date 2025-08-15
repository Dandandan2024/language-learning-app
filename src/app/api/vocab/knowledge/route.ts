import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export async function GET() {
  const session = await getServerSession(authOptions);
  
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    // Get user's level estimate
    const levelEstimate = await prisma.levelEstimate.findUnique({
      where: { userId: session.user.id }
    });

    if (!levelEstimate) {
      return NextResponse.json({ error: "No level estimate found" }, { status: 404 });
    }

    // Get all lexemes with user's study state
    const lexemeStates = await prisma.lexemeState.findMany({
      where: { userId: session.user.id },
      include: {
        lexeme: true
      }
    });

    // Get all lexemes (no limit - we want to show everything)
    const allLexemes = await prisma.lexeme.findMany({
      orderBy: {
        freqRank: 'asc'
      }
    });

    // Create a map of studied lexemes for quick lookup
    const studiedMap = new Map(
      lexemeStates.map(state => [state.lexemeId, state])
    );

    // Get review history for studied words
    const reviews = await prisma.review.findMany({
      where: {
        userId: session.user.id
      },
      orderBy: {
        reviewedAt: 'desc'
      }
    });

    // Create a map of reviews by lexeme ID
    const reviewsByLexeme = new Map<string, typeof reviews>();
    reviews.forEach(review => {
      if (!reviewsByLexeme.has(review.lexemeId)) {
        reviewsByLexeme.set(review.lexemeId, []);
      }
      reviewsByLexeme.get(review.lexemeId)!.push(review);
    });

    // Calculate knowledge score for each word
    const vocabKnowledge = allLexemes.map(lexeme => {
      const state = studiedMap.get(lexeme.id);
      
      if (state) {
        // Studied word - calculate based on actual data
        const wordReviews = reviewsByLexeme.get(lexeme.id) || [];
        const avgRating = wordReviews.length > 0 
          ? wordReviews.reduce((sum, r) => sum + r.rating, 0) / wordReviews.length 
          : 2.5;
        
        // Calculate knowledge score (0-1) based on multiple factors
        const stabilityScore = Math.min(state.stability / 180, 1); // Cap at 180 days
        const difficultyScore = 1 - state.difficulty;
        const ratingScore = (avgRating - 1) / 3; // Normalize 1-4 to 0-1
        const reviewScore = Math.min(state.reps / 10, 1); // Cap at 10 reviews
        
        // Map to 1-10 scale (1=unknown, 5=learning, 7=familiar, 10=mastered)
        const rawScore = (
          stabilityScore * 0.4 + 
          difficultyScore * 0.2 + 
          ratingScore * 0.2 + 
          reviewScore * 0.2
        );
        
        let knowledgeLevel = 1;
        if (rawScore > 0.8) knowledgeLevel = 10;
        else if (rawScore > 0.6) knowledgeLevel = 7;
        else if (rawScore > 0.3) knowledgeLevel = 5;
        else knowledgeLevel = 1;

        return {
          id: lexeme.id,
          lemma: lexeme.lemma,
          pos: lexeme.pos || '',
          cefr: lexeme.cefr,
          freqRank: lexeme.freqRank,
          knowledgeLevel,
          knowledgeScore: rawScore,
          studied: true,
          stability: state.stability,
          difficulty: state.difficulty,
          reps: state.reps,
          lapses: state.lapses,
          due: state.due,
          suspended: state.suspended
        };
      } else {
        // Unstudied word - estimate based on level
        const levelMap: Record<string, number> = {
          'A1': 1, 'A2': 2, 'B1': 3, 'B2': 4, 'C1': 5, 'C2': 6
        };
        
        const userLevel = levelMap[levelEstimate.cefrBand] || 3;
        const wordLevel = levelMap[lexeme.cefr] || 3;
        
        // Default knowledge levels based on CEFR comparison
        let knowledgeLevel = 1;
        let knowledgeScore = 0;
        
        if (wordLevel < userLevel) {
          // Word is below user's level - assume some passive knowledge
          const diff = userLevel - wordLevel;
          if (diff >= 2) {
            knowledgeLevel = 7; // Well below level - probably familiar
            knowledgeScore = 0.6 + diff * 0.1;
          } else {
            knowledgeLevel = 5; // Slightly below - somewhat familiar
            knowledgeScore = 0.4 + diff * 0.15;
          }
        } else if (wordLevel === userLevel) {
          // At user's level - learning zone
          knowledgeLevel = 5;
          knowledgeScore = 0.3;
        } else {
          // Above user's level - unknown
          knowledgeLevel = 1;
          knowledgeScore = Math.max(0, 0.2 - (wordLevel - userLevel) * 0.05);
        }
        
        // Adjust by confidence in level estimate
        knowledgeScore *= levelEstimate.confidence;
        
        return {
          id: lexeme.id,
          lemma: lexeme.lemma,
          pos: lexeme.pos || '',
          cefr: lexeme.cefr,
          freqRank: lexeme.freqRank,
          knowledgeLevel,
          knowledgeScore,
          studied: false,
          stability: 0,
          difficulty: 0.5,
          reps: 0,
          lapses: 0,
          due: null,
          suspended: false
        };
      }
    });

    // Sort by frequency rank for consistent visualization
    vocabKnowledge.sort((a, b) => a.freqRank - b.freqRank);

    return NextResponse.json({
      levelEstimate: {
        cefrBand: levelEstimate.cefrBand,
        vocabIndex: levelEstimate.vocabIndex,
        confidence: levelEstimate.confidence
      },
      vocabulary: vocabKnowledge,
      totalWords: vocabKnowledge.length,
      studiedCount: lexemeStates.length,
      totalReviews: reviews.length
    });
  } catch (error) {
    console.error("Error fetching vocabulary knowledge:", error);
    return NextResponse.json(
      { error: "Failed to fetch vocabulary knowledge" },
      { status: 500 }
    );
  }
}