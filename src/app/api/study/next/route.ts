import { NextRequest, NextResponse } from "next/server";
export const dynamic = "force-dynamic";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { StudyCard } from "@/lib/core";

export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const userId = session.user.id;

    // Check if user has completed placement
    const levelEstimate = await prisma.levelEstimate.findUnique({
      where: { userId }
    });

    if (!levelEstimate) {
      return NextResponse.json(
        { error: "Please complete placement test first" }, 
        { status: 409 }
      );
    }

    // Find due lexeme states, ordered by due date
    const dueLexemeState = await prisma.lexemeState.findFirst({
      where: {
        userId,
        due: {
          lte: new Date()
        },
        suspended: false
      },
      orderBy: {
        due: 'asc'
      },
      include: {
        lexeme: {
          include: {
            sentences: {
              where: {
                cefr: levelEstimate.cefrBand // Match user's level
              },
              take: 1
            }
          }
        }
      }
    });

    if (!dueLexemeState) {
      // No due cards - could create new ones or return empty
      return NextResponse.json(
        { error: "No cards due for review" }, 
        { status: 409 }
      );
    }

    // If no sentence exists for this lexeme at user's level, try to find one
    let sentence = dueLexemeState.lexeme.sentences[0];
    if (!sentence) {
      // Try to find any sentence for this lexeme
      const fallbackSentence = await prisma.sentence.findFirst({
        where: {
          targetLexemeId: dueLexemeState.lexemeId
        }
      });
      
      if (!fallbackSentence) {
        return NextResponse.json(
          { error: "No content available for review" }, 
          { status: 404 }
        );
      }
      
      sentence = fallbackSentence;
    }

    // Find or create card for this user-sentence-lexeme combination
    let card = await prisma.card.findFirst({
      where: {
        userId,
        sentenceId: sentence.id,
        targetLexemeId: dueLexemeState.lexemeId
      }
    });

    if (!card) {
      card = await prisma.card.create({
        data: {
          userId,
          sentenceId: sentence.id,
          targetLexemeId: dueLexemeState.lexemeId
        }
      });
    }

    const response: StudyCard = {
      cardId: card.id,
      sentence: {
        textL2: sentence.textL2,
        textL1: sentence.textL1,
        targetForm: sentence.targetForm || undefined,
        cefr: sentence.cefr as any
      },
      lexeme: {
        lemma: dueLexemeState.lexeme.lemma,
        pos: dueLexemeState.lexeme.pos || undefined
      },
      state: {
        due: dueLexemeState.due,
        stability: dueLexemeState.stability,
        difficulty: dueLexemeState.difficulty
      }
    };

    return NextResponse.json(response);

  } catch (error) {
    console.error("Study next error:", error);
    return NextResponse.json(
      { error: "Internal server error" }, 
      { status: 500 }
    );
  }
}
