import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { GenerateRequestSchema, generateUniqueHash, normalizeText } from "@/lib/core";

export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await request.json();

    // Validate request body
    const validation = GenerateRequestSchema.safeParse(body);
    if (!validation.success) {
      return NextResponse.json(
        { error: "Invalid request", details: validation.error.errors },
        { status: 400 }
      );
    }

    const { lexemeId, difficultyHint } = validation.data;

    // Check if we already have a cached sentence for this lexeme-difficulty combination
    const existingSentence = await prisma.sentence.findFirst({
      where: {
        targetLexemeId: lexemeId,
        cefr: difficultyHint.cefrBand
      }
    });

    if (existingSentence) {
      return NextResponse.json({
        sentence: {
          textL2: existingSentence.textL2,
          textL1: existingSentence.textL1,
          targetForm: existingSentence.targetForm,
          cefr: existingSentence.cefr
        }
      });
    }

    // If no cached sentence, return 202 and enqueue generation
    // In a full implementation, this would trigger a background job
    // For now, we'll just return the 202 status
    return NextResponse.json(
      { message: "Sentence generation enqueued" },
      { status: 202 }
    );

  } catch (error) {
    console.error("Generate sentence error:", error);
    return NextResponse.json(
      { error: "Internal server error" }, 
      { status: 500 }
    );
  }
}
