import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

// Create initial LexemeState rows for the logged-in user so study can start
export async function GET(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const url = new URL(req.url);
    const key = url.searchParams.get("key") || req.headers.get("x-seed-secret");
    const required = process.env.SEED_SECRET;
    if (!required || key !== required) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const userId = session.user.id;

    // Pick a handful of seeded lexemes and create due-now states
    const seededLexemes = await prisma.lexeme.findMany({
      where: { id: { in: [
        "seed-hello",
        "seed-good",
        "seed-water",
        "seed-because",
        "seed-understand",
        "seed-suggest",
      ] } },
      take: 6,
    });

    const now = new Date();
    let created = 0;
    for (const l of seededLexemes) {
      const exists = await prisma.lexemeState.findUnique({
        where: {
          userId_lexemeId: { userId, lexemeId: l.id },
        },
      });
      if (exists) continue;
      await prisma.lexemeState.create({
        data: {
          userId,
          lexemeId: l.id,
          due: now,
          stability: 0.5,
          difficulty: 5.0,
          reps: 0,
          lapses: 0,
          lastReview: null,
          suspended: false,
        },
      });
      created++;
    }

    return NextResponse.json({ message: "Onboarded", created });
  } catch (err) {
    console.error("Onboard error", err);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}


