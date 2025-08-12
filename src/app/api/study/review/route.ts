import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { StudyReviewSchema, review } from "@/lib/core";

export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const userId = session.user.id;
    const body = await request.json();

    // Validate request body
    const validation = StudyReviewSchema.safeParse(body);
    if (!validation.success) {
      return NextResponse.json(
        { error: "Invalid request", details: validation.error.errors },
        { status: 400 }
      );
    }

    const { cardId, rating } = validation.data;

    // Get the card and associated lexeme state
    const card = await prisma.card.findFirst({
      where: {
        id: cardId,
        userId
      }
    });

    if (!card) {
      return NextResponse.json(
        { error: "Card not found" }, 
        { status: 404 }
      );
    }

    const lexemeState = await prisma.lexemeState.findUnique({
      where: {
        userId_lexemeId: {
          userId,
          lexemeId: card.targetLexemeId
        }
      }
    });

    if (!lexemeState) {
      return NextResponse.json(
        { error: "Lexeme state not found" }, 
        { status: 404 }
      );
    }

    // Calculate elapsed days since last review
    const now = new Date();
    const lastReview = lexemeState.lastReview || lexemeState.due;
    const elapsedDays = Math.max(0, Math.floor(
      (now.getTime() - lastReview.getTime()) / (1000 * 60 * 60 * 24)
    ));

    // Save review record with snapshot of state BEFORE update
    await prisma.review.create({
      data: {
        userId,
        lexemeId: card.targetLexemeId,
        cardId,
        rating,
        reviewedAt: now,
        stability: lexemeState.stability,
        difficulty: lexemeState.difficulty,
        elapsedDays
      }
    });

    // Update FSRS state
    const fsrsResult = review(
      { s: lexemeState.stability, d: lexemeState.difficulty },
      rating as 1 | 2 | 3 | 4
    );

    // Update lexeme state with new values
    const updatedState = await prisma.lexemeState.update({
      where: {
        userId_lexemeId: {
          userId,
          lexemeId: card.targetLexemeId
        }
      },
      data: {
        stability: fsrsResult.s,
        difficulty: fsrsResult.d,
        due: fsrsResult.due,
        reps: lexemeState.reps + 1,
        lapses: rating === 1 ? lexemeState.lapses + 1 : lexemeState.lapses,
        lastReview: now
      }
    });

    // TODO: Trigger prefetch for next 2-3 due lexemes in background

    return NextResponse.json({
      nextDue: updatedState.due,
      updatedState: {
        stability: updatedState.stability,
        difficulty: updatedState.difficulty,
        reps: updatedState.reps,
        lapses: updatedState.lapses
      }
    });

  } catch (error) {
    console.error("Study review error:", error);
    return NextResponse.json(
      { error: "Internal server error" }, 
      { status: 500 }
    );
  }
}
