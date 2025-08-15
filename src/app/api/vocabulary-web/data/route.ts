import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/prisma';

export async function GET(request: NextRequest) {
  try {
    // Get the authenticated user
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const userId = session.user.id;

    // Fetch all lexemes
    const lexemes = await prisma.lexeme.findMany({
      orderBy: { freqRank: 'asc' },
      select: {
        id: true,
        lemma: true,
        pos: true,
        cefr: true,
        freqRank: true,
      },
    });

    // Fetch user's lexeme states
    const lexemeStates = await prisma.lexemeState.findMany({
      where: { userId },
      select: {
        userId: true,
        lexemeId: true,
        due: true,
        stability: true,
        difficulty: true,
        reps: true,
        lapses: true,
        lastReview: true,
        suspended: true,
      },
    });

    // Fetch user's reviews
    const reviews = await prisma.review.findMany({
      where: { userId },
      select: {
        id: true,
        userId: true,
        lexemeId: true,
        cardId: true,
        rating: true,
        reviewedAt: true,
        stability: true,
        difficulty: true,
        elapsedDays: true,
      },
      orderBy: { reviewedAt: 'desc' },
    });

    return NextResponse.json({
      lexemes,
      lexemeStates,
      reviews,
    });

  } catch (error) {
    console.error('Error fetching vocabulary data:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}