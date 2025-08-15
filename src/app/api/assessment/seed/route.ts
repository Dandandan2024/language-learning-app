import { NextRequest, NextResponse } from "next/server";
export const dynamic = "force-dynamic";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { probKnow } from "@/lib/core";
import { generateSentence } from "@/lib/openai";

function computeZipf(freqRank: number): number {
	const z = 7 - Math.log10(Math.max(1, freqRank));
	return Math.max(1, Math.min(7, z));
}

export async function POST(request: NextRequest) {
	try {
		const session = await getServerSession(authOptions);
		if (!session?.user?.id) {
			return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
		}
		const userId = session.user.id;

		const level = await prisma.levelEstimate.findUnique({ where: { userId } });
		const theta = level?.theta ?? 0;
		const SE = Math.sqrt(level?.thetaVar ?? 1);
		const g = 0.25; // for MC recognition items we'll study

		// High-impact bands: Zipf 3..5 roughly
		const lexemes = await prisma.lexeme.findMany({
			select: { id: true, lemma: true, pos: true, bInitRecognition: true, zipf: true, freqRank: true, cefr: true },
			orderBy: { freqRank: 'asc' },
			take: 20000
		});

		const scored = lexemes.map((l: { id: string; lemma: string; pos: string | null; bInitRecognition: number | null; zipf: number | null; freqRank: number; cefr: string; }) => {
			const z = l.zipf ?? computeZipf(l.freqRank);
			const b = (l.bInitRecognition ?? (-(z) + 3)) as number;
			const p = probKnow(theta, b, g);
			return { ...l, z, b, p };
		}).filter(x => x.z >= 3 && x.z <= 5);

		// Pick lowest p but prioritize higher Zipf (impact)
		scored.sort((a, b) => (a.p - b.p) || (b.z - a.z));
		const pick = scored.slice(0, 12);

		// Get user language preferences
		const user = await prisma.user.findUnique({ where: { id: userId }, select: { settings: true } });
		const settings = (user?.settings as any) || {};
		const userLanguage = settings?.language || 'ru';
		const nativeLanguage = settings?.nativeLanguage || 'en';

		const now = new Date();
		let createdStates = 0;
		let createdSentences = 0;
		for (const l of pick) {
			await prisma.lexemeState.upsert({
				where: { userId_lexemeId: { userId, lexemeId: l.id } },
				update: { due: now },
				create: {
					userId,
					lexemeId: l.id,
					due: now,
					stability: 0.5,
					difficulty: 5.0,
					reps: 0,
					lapses: 0,
					suspended: false
				}
			});
			createdStates++;

			const existingSentence = await prisma.sentence.findFirst({ where: { targetLexemeId: l.id, cefr: l.cefr } });
			if (!existingSentence) {
				try {
					const generated = await generateSentence({
						lexeme: l.lemma,
						pos: l.pos || undefined,
						cefr: l.cefr as any,
						targetLanguage: userLanguage,
						nativeLanguage: nativeLanguage
					});
					const uniqueHash = Buffer.from(`${l.id}-${generated.sentence_l2}`).toString("base64").slice(0, 16);
					await prisma.sentence.create({
						data: {
							targetLexemeId: l.id,
							textL2: generated.sentence_l2,
							textL1: generated.sentence_l1,
							cefr: generated.cefr,
							difficulty: 0.4,
							tokens: generated.sentence_l2.toLowerCase().split(' '),
							source: 'llm',
							targetForm: generated.target_form || undefined,
							uniqueHash
						}
					});
					createdSentences++;
				} catch (e) {
					// ignore generation failure
				}
			}
		}

		return NextResponse.json({ seeded: createdStates, sentences: createdSentences });
	} catch (error) {
		console.error('assessment/seed error', error);
		return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
	}
}