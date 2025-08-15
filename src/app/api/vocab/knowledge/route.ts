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

    // Get all lexemes the user hasn't studied yet
    const studiedLexemeIds = lexemeStates.map(ls => ls.lexemeId);
    const unstudiedLexemes = await prisma.lexeme.findMany({
      where: {
        id: {
          notIn: studiedLexemeIds
        }
      },
      orderBy: {
        freqRank: 'asc'
      },
      take: 500 // Limit to top 500 most frequent words for performance
    });

    // Get review history for studied words
    const reviews = await prisma.review.findMany({
      where: {
        userId: session.user.id
      },
      orderBy: {
        reviewedAt: 'desc'
      }
    });

    // Calculate knowledge score for each word
    const vocabKnowledge = [
      // Studied words with their knowledge scores
      ...lexemeStates.map(state => {
        const wordReviews = reviews.filter(r => r.lexemeId === state.lexemeId);
        const avgRating = wordReviews.length > 0 
          ? wordReviews.reduce((sum, r) => sum + r.rating, 0) / wordReviews.length 
          : 2.5;
        
        // Calculate knowledge score (0-1) based on:
        // - Stability (higher = better known)
        // - Difficulty (lower = better known)
        // - Average rating
        // - Number of successful reviews
        const stabilityScore = Math.min(state.stability / 180, 1); // Cap at 180 days
        const difficultyScore = 1 - state.difficulty;
        const ratingScore = (avgRating - 1) / 3; // Normalize 1-4 to 0-1
        const reviewScore = Math.min(state.reps / 10, 1); // Cap at 10 reviews
        
        const knowledgeScore = (
          stabilityScore * 0.4 + 
          difficultyScore * 0.2 + 
          ratingScore * 0.2 + 
          reviewScore * 0.2
        );

        return {
          id: state.lexeme.id,
          lemma: state.lexeme.lemma,
          pos: state.lexeme.pos,
          cefr: state.lexeme.cefr,
          freqRank: state.lexeme.freqRank,
          knowledgeScore,
          studied: true,
          stability: state.stability,
          difficulty: state.difficulty,
          reps: state.reps,
          lapses: state.lapses,
          due: state.due,
          suspended: state.suspended
        };
      }),
      // Unstudied words with estimated knowledge based on level
      ...unstudiedLexemes.map(lexeme => {
        // Estimate knowledge based on CEFR level comparison
        const levelMap: Record<string, number> = {
          'A1': 1, 'A2': 2, 'B1': 3, 'B2': 4, 'C1': 5, 'C2': 6
        };
        
        const userLevel = levelMap[levelEstimate.cefrBand] || 3;
        const wordLevel = levelMap[lexeme.cefr] || 3;
        
        // If word is below user's level, assume some knowledge
        // If at or above, assume less knowledge
        let knowledgeScore = 0;
        if (wordLevel < userLevel) {
          knowledgeScore = 0.3 + (userLevel - wordLevel) * 0.15; // 30-75% based on level difference
        } else if (wordLevel === userLevel) {
          knowledgeScore = 0.15; // 15% for same level
        } else {
          knowledgeScore = Math.max(0, 0.1 - (wordLevel - userLevel) * 0.03); // 0-10% for higher levels
        }
        
        // Adjust by confidence in level estimate
        knowledgeScore *= levelEstimate.confidence;
        
        return {
          id: lexeme.id,
          lemma: lexeme.lemma,
          pos: lexeme.pos,
          cefr: lexeme.cefr,
          freqRank: lexeme.freqRank,
          knowledgeScore,
          studied: false,
          stability: 0,
          difficulty: 0.5,
          reps: 0,
          lapses: 0,
          due: null,
          suspended: false
        };
      })
    ];

    // Sort by frequency rank for consistent visualization
    vocabKnowledge.sort((a, b) => a.freqRank - b.freqRank);

    return NextResponse.json({
      levelEstimate: {
        cefrBand: levelEstimate.cefrBand,
        vocabIndex: levelEstimate.vocabIndex,
        confidence: levelEstimate.confidence
      },
      vocabulary: vocabKnowledge.slice(0, 300), // Limit to 300 words for visualization
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