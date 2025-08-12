import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { 
  start, 
  pick, 
  getDifficultyForTheta,
  PlacementItem 
} from "@/lib/core";

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

    // Get difficulty parameters for current theta
    const difficulty = getDifficultyForTheta(pick(placementState));

    // Find a suitable lexeme for this difficulty level
    // Prefer matching CEFR, but fall back to any seed sentence if none exists
    let lexeme = await prisma.lexeme.findFirst({
      where: {
        cefr: difficulty.cefr,
      },
      include: {
        sentences: {
          where: {
            source: "seed",
            cefr: difficulty.cefr,
          },
          take: 1,
        },
      },
    });

    if (!lexeme || lexeme.sentences.length === 0) {
      lexeme = await prisma.lexeme.findFirst({
        include: {
          sentences: {
            where: { source: "seed" },
            take: 1,
          },
        },
      });
    }

    if (!lexeme || lexeme.sentences.length === 0) {
      return NextResponse.json(
        { error: "No suitable content found" }, 
        { status: 404 }
      );
    }

    const sentence = lexeme.sentences[0];

    const response: PlacementItem = {
      lexemeId: lexeme.id,
      sentence: {
        textL2: sentence.textL2,
        textL1: sentence.textL1,
        cefr: sentence.cefr as any,
        targetForm: sentence.targetForm || undefined
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
