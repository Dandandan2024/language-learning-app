import { NextRequest, NextResponse } from "next/server";
export const dynamic = "force-dynamic";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { probKnow } from "@/lib/core";

function computeZipf(freqRank: number): number {
	const z = 7 - Math.log10(Math.max(1, freqRank));
	return Math.max(1, Math.min(7, z));
}

export async function GET(request: NextRequest) {
	try {
		const session = await getServerSession(authOptions);
		if (!session?.user?.id) {
			return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
		}
		const userId = session.user.id;

		const current = await prisma.assessmentSession.findFirst({
			where: { userId, stage: 'done' },
			orderBy: { completedAt: 'desc' }
		});
		if (!current) {
			return NextResponse.json({ error: 'No completed assessment' }, { status: 404 });
		}

		const theta = current.currentTheta;
		const V = current.currentVar;
		const SE = Math.sqrt(V);

		// Per-word probabilities
		const totalCount = await prisma.lexeme.count();
		const pageSize = 5000;
		const pageParam = Number(new URL(request.url).searchParams.get('page') || '1');
		const page = Math.max(1, pageParam);
		const skip = (page - 1) * pageSize;

		const lexemes = await prisma.lexeme.findMany({
			select: { id: true, bInitRecognition: true, zipf: true, freqRank: true },
			orderBy: { freqRank: 'asc' },
			skip,
			take: pageSize
		});

		const g = 0.05; // recognition guessing default for yes/no-style
		const items = lexemes.map((l: { id: string; bInitRecognition: number | null; zipf: number | null; freqRank: number; }) => {
			const z = l.zipf ?? computeZipf(l.freqRank);
			const b = (l.bInitRecognition ?? (-(z) + 3)) as number;
			const p = probKnow(theta, b, g);
			const ci68: [number, number] = [probKnow(theta - SE, b, g), probKnow(theta + SE, b, g)];
			const ci95: [number, number] = [probKnow(theta - 1.96 * SE, b, g), probKnow(theta + 1.96 * SE, b, g)];
			return { lexemeId: l.id, p, ci68, ci95 };
		});

		// Coverage by Zipf band (simple mean p per rounded zipf)
		const allLexemes = await prisma.lexeme.findMany({ select: { zipf: true, freqRank: true } });
		const bandAgg = new Map<number, { sum: number; n: number }>();
		for (const l of allLexemes) {
			const z = Math.round(l.zipf ?? computeZipf(l.freqRank));
			const b = (-(z) + 3);
			const pz = probKnow(theta, b, g);
			const agg = bandAgg.get(z) || { sum: 0, n: 0 };
			agg.sum += pz;
			agg.n += 1;
			bandAgg.set(z, agg);
		}
		const coverageByZipf = Array.from(bandAgg.entries())
			.sort((a, b) => a[0] - b[0])
			.map(([zipf, agg]) => ({ zipf, coverage: agg.n > 0 ? agg.sum / agg.n : 0 }));

		// Vocab size estimate (sum of p over all lexemes)
		const perAll = await prisma.lexeme.findMany({ select: { zipf: true, freqRank: true, bInitRecognition: true } });
		let vocabSize = 0;
		for (const l of perAll) {
			const z = l.zipf ?? computeZipf(l.freqRank);
			const b = l.bInitRecognition ?? (-(z) + 3);
			vocabSize += probKnow(theta, b, g);
		}

		// Persist LevelEstimate summary
		await prisma.levelEstimate.upsert({
			where: { userId },
			update: { updatedAt: new Date(), theta, thetaVar: V },
			create: { userId, cefrBand: 'B1', vocabIndex: 5, confidence: Math.max(0.3, 1 - SE), theta, thetaVar: V }
		});

		return NextResponse.json({
			sessionId: current.id,
			theta,
			SE,
			vocabSize,
			coverageByZipf,
			perWord: { page, pageSize, total: totalCount, items }
		});
	} catch (error) {
		console.error('assessment/result error', error);
		return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
	}
}