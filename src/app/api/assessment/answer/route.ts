import { NextRequest, NextResponse } from "next/server";
export const dynamic = "force-dynamic";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { AssessmentAnswerRequest, AssessmentAnswerResponse } from "@/lib/core";
import { updateThetaMAP, probKnow, ThetaState } from "@/lib/core";

export async function POST(request: NextRequest) {
	try {
		const session = await getServerSession(authOptions);
		if (!session?.user?.id) {
			return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
		}
		const userId = session.user.id;
		const body = await request.json();
		const parsedReq = AssessmentAnswerRequest.safeParse(body);
		if (!parsedReq.success) {
			return NextResponse.json({ error: 'Invalid request', details: parsedReq.error.errors }, { status: 400 });
		}
		const { sessionId, itemId, y } = parsedReq.data;

		const sess = await prisma.assessmentSession.findUnique({ where: { id: sessionId } });
		if (!sess || sess.userId !== userId) {
			return NextResponse.json({ error: 'Not found' }, { status: 404 });
		}

		// Find stored item (we used createMany; retrieve by session and index)
		const item = await prisma.assessmentItem.findFirst({
			where: { sessionId, id: itemId }
		});

		// If caller only knows client temp id, find a next unresponded item of current stage
		let effectiveItem = item;
		if (!effectiveItem) {
			effectiveItem = await prisma.assessmentItem.findFirst({
				where: {
					sessionId,
					type: sess.stage === 'yesno' ? { in: ['yesno_real', 'yesno_pseudo'] } : { in: ['mc4', 'recall'] }
				},
				orderBy: { presentedAt: 'asc' }
			});
		}
		if (!effectiveItem) {
			return NextResponse.json({ error: 'No pending item' }, { status: 400 });
		}

		// Record response
		await prisma.assessmentResponse.create({
			data: {
				sessionId,
				itemId: effectiveItem.id,
				lexemeId: effectiveItem.lexemeId || null,
				userId,
				y,
				thetaBefore: sess.currentTheta
			}
		});

		// Update session exposure
		await prisma.assessmentItem.update({
			where: { id: effectiveItem.id },
			data: { exposure: { increment: 1 } }
		});

		let nextStage = sess.stage;
		let thetaState: ThetaState = { theta: sess.currentTheta, var: sess.currentVar };

		if (sess.stage === 'yesno') {
			// After collecting all yes/no, compute false alarm rate and init theta via simple mapping
			const yesnoCounts = await prisma.assessmentResponse.groupBy({
				by: ['itemId'],
				where: { sessionId, item: { type: { in: ['yesno_real', 'yesno_pseudo'] } } },
				_count: { _all: true }
			});
			const totalResponses = yesnoCounts.length;
			const pseudoHits = await prisma.assessmentResponse.count({
				where: { sessionId, item: { type: 'yesno_pseudo' }, y: 1 }
			});
			const falseAlarm = totalResponses > 0 ? Math.min(0.5, pseudoHits / Math.max(1, totalResponses)) : 0;

			// Bias-corrected hit rate over real words by zipf
			const realItems = await prisma.assessmentItem.findMany({ where: { sessionId, type: 'yesno_real' }, select: { id: true, lexemeId: true } });
			const realResponses = await prisma.assessmentResponse.findMany({ where: { sessionId, item: { type: 'yesno_real' } }, select: { itemId: true, y: true } });
			const hits = new Map<string, number>();
			const totals = new Map<string, number>();
			for (const r of realResponses) {
				hits.set(r.itemId, (hits.get(r.itemId) || 0) + (r.y ? 1 : 0));
				totals.set(r.itemId, (totals.get(r.itemId) || 0) + 1);
			}
			// Map to a coarse theta0: placeholder linear map from corrected accuracy
			let acc = 0.5;
			if (realResponses.length > 0) {
				const k = Array.from(hits.values()).reduce((a, b) => a + b, 0);
				const n = realResponses.length;
				const corrected = Math.max(0, Math.min(1, (k / n - falseAlarm) / Math.max(1e-6, 1 - falseAlarm)));
				acc = corrected;
			}
			const theta0 = Math.max(-3, Math.min(3, (acc - 0.5) * 6));

			await prisma.assessmentSession.update({ where: { id: sessionId }, data: { yesNoCompleted: true, falseAlarmRate: falseAlarm, currentTheta: theta0, currentVar: 0.7, stage: 'cat' } });
			nextStage = 'cat';
			thetaState = { theta: theta0, var: 0.7 };

			// Seed a small pool of CAT items (multiple-choice recognition)
			const pool = await prisma.lexeme.findMany({
				select: { id: true, bInitRecognition: true, zipf: true, freqRank: true },
				orderBy: { freqRank: 'asc' },
				take: 2000
			});
			const catItems = pool.slice(0, 200).map((l: { id: string; bInitRecognition: number | null; zipf: number | null; freqRank: number; }) => ({
				sessionId,
				type: 'mc4' as const,
				lexemeId: l.id,
				g: 0.25,
				b: (l.bInitRecognition ?? (-(l.zipf ?? 3.0) + 3)) as number
			}));
			await prisma.assessmentItem.createMany({ data: catItems });
		}

		if (nextStage === 'cat') {
			// Update theta from this response if item had b/g
			if (effectiveItem.b != null && effectiveItem.g != null) {
				const updated = updateThetaMAP(thetaState, effectiveItem.b || 0, effectiveItem.g || 0.25, (y as 0 | 1));
				await prisma.assessmentSession.update({ where: { id: sessionId }, data: { currentTheta: updated.theta, currentVar: updated.var } });
				thetaState = updated;
			}

			// Select next CAT item: highest Fisher info near theta and not over-exposed
			const candidates = await prisma.assessmentItem.findMany({
				where: { sessionId, type: 'mc4' },
				orderBy: { presentedAt: 'asc' },
				take: 200
			});
			// Avoid too many exposures
			const filtered = candidates.filter((c: { exposure: number | null | undefined; }) => (c.exposure || 0) < 3);
			let next = filtered[0] || candidates[0] || null;
			if (!next) {
				// Stop if no candidates
				await prisma.assessmentSession.update({ where: { id: sessionId }, data: { stage: 'done', completedAt: new Date() } });
				return NextResponse.json({ continue: false, stage: 'done', nextItem: null });
			}

			// Stopping rule by SE
			const SE = Math.sqrt(thetaState.var);
			const countCat = await prisma.assessmentResponse.count({ where: { sessionId, item: { type: 'mc4' } } });
			if (SE <= 0.30 || countCat >= 30) {
				await prisma.assessmentSession.update({ where: { id: sessionId }, data: { stage: 'done', completedAt: new Date() } });
				return NextResponse.json({ continue: false, stage: 'done', nextItem: null });
			}

			return NextResponse.json(AssessmentAnswerResponse.parse({
				continue: true,
				stage: 'cat',
				nextItem: { id: next.id, type: 'mc4', lexemeId: next.lexemeId!, g: next.g, b: next.b ?? 0 }
			}));
		}

		return NextResponse.json(AssessmentAnswerResponse.parse({
			continue: true,
			stage: nextStage,
			nextItem: null
		}));
	} catch (error) {
		console.error('assessment/answer error', error);
		return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
	}
}