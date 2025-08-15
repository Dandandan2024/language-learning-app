import { NextRequest, NextResponse } from "next/server";
export const dynamic = "force-dynamic";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { AssessmentStartResponse } from "@/lib/core";

function generatePseudoword(seed: number): string {
	// Simple consonant-vowel generator
	const consonants = 'bcdfghjklmnpqrstvwxyz';
	const vowels = 'aeiou';
	let s = '';
	for (let i = 0; i < 6; i++) {
		const isVowel = i % 2 === 1;
		const pool = isVowel ? vowels : consonants;
		seed = (seed * 9301 + 49297) % 233280;
		const idx = Math.floor(seed / 233280 * pool.length);
		s += pool[idx];
	}
	return s;
}

function computeZipf(freqRank: number): number {
	// Approximate Zipf from rank; placeholder mapping
	// Zipf ≈ 7 - log10(rank)
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

		// Create assessment session
		const created = await prisma.assessmentSession.create({
			data: {
				userId,
				stage: 'yesno',
				currentTheta: 0,
				currentVar: 1,
				config: {
					yesno_real_count: 60,
					yesno_pseudo_count: 15,
					guess_yesno: 0.05
				}
			}
		});

		// Fetch lexemes and stratify by Zipf bands 7->3
		const lexemes = await prisma.lexeme.findMany({
			select: { id: true, lemma: true, freqRank: true, zipf: true, bInitRecognition: true },
			orderBy: { freqRank: 'asc' },
			take: 20000
		});

		const withZipf = lexemes.map((l: { id: string; lemma: string; freqRank: number; zipf: number | null; bInitRecognition: number | null; }) => ({
			...l,
			zipf: (l.zipf ?? computeZipf(l.freqRank)) as number,
			b: (l.bInitRecognition ?? (-(l.zipf ?? 3.0) + 3)) as number
		}));

		const bands = [7,6,5,4,3];
		const perBand = Math.max(1, Math.floor(60 / bands.length));
		const sampled: typeof withZipf = [];
		for (const b of bands) {
			const pool = withZipf.filter((w: any) => Math.round(w.zipf) === b);
			for (let i = 0; i < perBand && pool.length > 0; i++) {
				const idx = Math.floor(Math.random() * pool.length);
				sampled.push(pool.splice(idx, 1)[0]);
			}
		}
		while (sampled.length < 60 && withZipf.length > 0) {
			const idx = Math.floor(Math.random() * withZipf.length);
			sampled.push(withZipf.splice(idx, 1)[0]);
		}

		// Create items: real yes/no
		const realItemsData = sampled.map((s: any) => ({
			sessionId: created.id,
			type: 'yesno_real' as const,
			lexemeId: s.id as string,
			g: 0.05,
			b: s.b as number
		}));

		// Pseudowords
		const pseudoItemsData = Array.from({ length: 15 }).map((_: unknown, i: number) => ({
			sessionId: created.id,
			type: 'yesno_pseudo' as const,
			pseudoword: generatePseudoword(Date.now() + i),
			g: 0.05,
			b: 0
		}));

		const createdItems = await prisma.$transaction([
			prisma.assessmentItem.createMany({ data: realItemsData }),
			prisma.assessmentItem.createMany({ data: pseudoItemsData })
		]);

		// Return combined shuffled list to client
		const items = [
			...realItemsData.map((d: { lexemeId: string; g: number; b: number }, idx: number) => {
				const lex = withZipf.find((x: any) => x.id === d.lexemeId);
				return { id: `r-${idx}`, type: 'yesno_real' as const, lexemeId: d.lexemeId!, lemma: lex?.lemma as string | undefined, g: d.g, b: d.b };
			}),
			...pseudoItemsData.map((d: { pseudoword: string; g: number; b: number }, idx: number) => ({ id: `p-${idx}`, type: 'yesno_pseudo' as const, pseudoword: d.pseudoword!, g: d.g, b: d.b }))
		];
		for (let i = items.length - 1; i > 0; i--) {
			const j = Math.floor(Math.random() * (i + 1));
			[items[i], items[j]] = [items[j], items[i]];
		}

		const payload = { sessionId: created.id, stage: 'yesno', items };
		const parsed = AssessmentStartResponse.parse(payload);
		return NextResponse.json(parsed);
	} catch (error) {
		console.error('assessment/start error', error);
		return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
	}
}