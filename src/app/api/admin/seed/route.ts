import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

// Minimal bootstrap seed so placement has content
export async function GET(req: NextRequest) {
  try {
    const url = new URL(req.url);
    const key = url.searchParams.get("key") || req.headers.get("x-seed-secret");
    const required = process.env.SEED_SECRET;
    if (!required || key !== required) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const lexemeCount = await prisma.lexeme.count();
    if (lexemeCount > 0) {
      return NextResponse.json({ message: "Already seeded", lexemeCount });
    }

    const lexemes = [
      { id: "seed-hello", lemma: "hello", pos: "interjection", freqRank: 1, cefr: "A1", forms: ["hello", "hi"], notes: null as string | null },
      { id: "seed-good", lemma: "good", pos: "adjective", freqRank: 2, cefr: "A1", forms: ["good", "better", "best"], notes: null },
      { id: "seed-water", lemma: "water", pos: "noun", freqRank: 3, cefr: "A1", forms: ["water", "waters"], notes: null },
      { id: "seed-because", lemma: "because", pos: "conjunction", freqRank: 50, cefr: "A2", forms: ["because"], notes: null },
      { id: "seed-understand", lemma: "understand", pos: "verb", freqRank: 51, cefr: "A2", forms: ["understand", "understands", "understanding", "understood"], notes: null },
      { id: "seed-suggest", lemma: "suggest", pos: "verb", freqRank: 200, cefr: "B1", forms: ["suggest", "suggests", "suggesting", "suggested"], notes: null },
    ];

    for (const l of lexemes) {
      await prisma.lexeme.create({
        data: {
          id: l.id,
          lemma: l.lemma,
          pos: l.pos,
          freqRank: l.freqRank,
          cefr: l.cefr,
          forms: l.forms,
          notes: l.notes ?? undefined,
        },
      });
    }

    const sentences = [
      { lexemeId: "seed-hello", textL2: "Hello, how are you?", textL1: "Hola, ¿cómo estás?", cefr: "A1", difficulty: 0.1, targetForm: "hello" },
      { lexemeId: "seed-good", textL2: "This is good food.", textL1: "Esta es buena comida.", cefr: "A1", difficulty: 0.15, targetForm: "good" },
      { lexemeId: "seed-water", textL2: "I drink water every day.", textL1: "Bebo agua todos los días.", cefr: "A1", difficulty: 0.2, targetForm: "water" },
      { lexemeId: "seed-because", textL2: "I study because I want to learn.", textL1: "Estudio porque quiero aprender.", cefr: "A2", difficulty: 0.3, targetForm: "because" },
      { lexemeId: "seed-understand", textL2: "I understand what you mean.", textL1: "Entiendo lo que quieres decir.", cefr: "A2", difficulty: 0.35, targetForm: "understand" },
      { lexemeId: "seed-suggest", textL2: "I suggest we meet tomorrow.", textL1: "Sugiero que nos encontremos mañana.", cefr: "B1", difficulty: 0.5, targetForm: "suggest" },
    ];

    for (const s of sentences) {
      const uniqueHash = Buffer.from(`${s.lexemeId}-${s.textL2}`).toString("base64").slice(0, 16);
      await prisma.sentence.create({
        data: {
          targetLexemeId: s.lexemeId,
          textL2: s.textL2,
          textL1: s.textL1,
          cefr: s.cefr,
          difficulty: s.difficulty,
          tokens: s.textL2.toLowerCase().split(" "),
          source: "seed",
          targetForm: s.targetForm,
          uniqueHash,
        },
      });
    }

    return NextResponse.json({ message: "Seeded", counts: { lexemes: lexemes.length, sentences: sentences.length } });
  } catch (err) {
    console.error("Seed error", err);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}


