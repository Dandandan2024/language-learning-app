import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { GenerateRequestSchema, generateUniqueHash, normalizeText } from "@/lib/core";
import { generateSentence } from "@/lib/openai";

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

    // Get the lexeme details to generate a sentence
    const lexeme = await prisma.lexeme.findUnique({
      where: { id: lexemeId }
    });

    if (!lexeme) {
      return NextResponse.json(
        { error: "Lexeme not found" },
        { status: 404 }
      );
    }

    // Get user language preferences from settings
    const user = await prisma.user.findUnique({
      where: { id: session.user.id },
      select: { settings: true }
    });

    const settings = user?.settings as any;
    const userLanguage = settings?.language || 'ru';
    const nativeLanguage = settings?.nativeLanguage || 'en';

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

    // Generate a new sentence using OpenAI
    const generatedSentence = await generateSentence({
      lexeme: lexeme.lemma,
      pos: lexeme.pos || undefined,
      cefr: difficultyHint.cefrBand,
      targetLanguage: userLanguage, // Use user's language preference
      nativeLanguage: nativeLanguage // Use user's native language preference
    });

    // Store the generated sentence in the database for future use
    const uniqueHash = generateUniqueHash(`${lexemeId}-${generatedSentence.sentence_l2}`);
    
    const newSentence = await prisma.sentence.create({
      data: {
        targetLexemeId: lexemeId,
        textL2: generatedSentence.sentence_l2,
        textL1: generatedSentence.sentence_l1,
        cefr: generatedSentence.cefr,
        difficulty: 0.5, // Default difficulty, could be calculated based on CEFR
        tokens: generatedSentence.sentence_l2.toLowerCase().split(' '),
        source: 'llm',
        targetForm: generatedSentence.target_form,
        uniqueHash
      }
    });

    return NextResponse.json({
      sentence: {
        textL2: newSentence.textL2,
        textL1: newSentence.textL1,
        targetForm: newSentence.targetForm,
        cefr: newSentence.cefr
      }
    });

  } catch (error) {
    console.error("Generate sentence error:", error);
    return NextResponse.json(
      { error: "Internal server error" }, 
      { status: 500 }
    );
  }
}
