"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";

interface YesNoItem {
	id: string;
	type: 'yesno_real' | 'yesno_pseudo';
	lexemeId?: string;
	lemma?: string;
	pseudoword?: string;
	g: number;
	b?: number;
}

interface NextItemResponse {
	continue: boolean;
	stage: 'yesno' | 'cat' | 'done';
	nextItem: null | { id: string; type: 'mc4' | 'recall'; lexemeId?: string; g: number; b?: number };
}

export function PlacementWizard() {
	const router = useRouter();
	const [sessionId, setSessionId] = useState<string | null>(null);
	const [stage, setStage] = useState<'idle' | 'yesno' | 'cat' | 'done'>('idle');
	const [yesnoItems, setYesnoItems] = useState<YesNoItem[]>([]);
	const [yesnoIdx, setYesnoIdx] = useState(0);
	const [loading, setLoading] = useState(false);
	const [error, setError] = useState<string | null>(null);
	const [catItem, setCatItem] = useState<null | { id: string; lexemeId?: string; g: number; b?: number }>(null);

	const totalYesno = yesnoItems.length;
	const yesnoProgress = totalYesno ? Math.round((yesnoIdx / totalYesno) * 100) : 0;

	const startAssessment = async () => {
		setLoading(true);
		setError(null);
		try {
			const res = await fetch('/api/assessment/start', { method: 'POST' });
			if (!res.ok) throw new Error('Failed to start assessment');
			const data = await res.json();
			setSessionId(data.sessionId);
			setStage('yesno');
			setYesnoItems(data.items);
			setYesnoIdx(0);
		} catch (e: any) {
			setError(e?.message || 'Error starting assessment');
		} finally {
			setLoading(false);
		}
	};

	const answerYesNo = async (knows: boolean) => {
		if (!sessionId) return;
		const current = yesnoItems[yesnoIdx];
		if (!current) return;
		setLoading(true);
		try {
			await fetch('/api/assessment/answer', {
				method: 'POST',
				headers: { 'Content-Type': 'application/json' },
				body: JSON.stringify({ sessionId, itemId: current.id, y: knows ? 1 : 0 })
			});
			const nextIdx = yesnoIdx + 1;
			if (nextIdx < yesnoItems.length) {
				setYesnoIdx(nextIdx);
			} else {
				// Transition to CAT
				setStage('cat');
				await fetchNextCat();
			}
		} catch (e: any) {
			setError(e?.message || 'Error submitting answer');
		} finally {
			setLoading(false);
		}
	};

	const fetchNextCat = async () => {
		if (!sessionId) return;
		setLoading(true);
		try {
			const res = await fetch('/api/assessment/answer', {
				method: 'POST',
				headers: { 'Content-Type': 'application/json' },
				body: JSON.stringify({ sessionId, itemId: '', y: 1 }) // trigger next without specific item
			});
			if (!res.ok) throw new Error('Failed to fetch next item');
			const data: NextItemResponse = await res.json();
			if (!data.continue && data.stage === 'done') {
				setStage('done');
				return;
			}
			if (data.nextItem) {
				setCatItem({ id: data.nextItem.id, lexemeId: data.nextItem.lexemeId, g: data.nextItem.g, b: data.nextItem.b });
			}
		} catch (e: any) {
			setError(e?.message || 'Error loading next');
		} finally {
			setLoading(false);
		}
	};

	const answerCat = async (knew: boolean) => {
		if (!sessionId || !catItem) return;
		setLoading(true);
		try {
			const res = await fetch('/api/assessment/answer', {
				method: 'POST',
				headers: { 'Content-Type': 'application/json' },
				body: JSON.stringify({ sessionId, itemId: catItem.id, y: knew ? 1 : 0 })
			});
			if (!res.ok) throw new Error('Failed to submit answer');
			const data: NextItemResponse = await res.json();
			if (!data.continue && data.stage === 'done') {
				setStage('done');
				return;
			}
			if (data.nextItem) {
				setCatItem({ id: data.nextItem.id, lexemeId: data.nextItem.lexemeId, g: data.nextItem.g, b: data.nextItem.b });
			}
		} catch (e: any) {
			setError(e?.message || 'Error submitting');
		} finally {
			setLoading(false);
		}
	};

	useEffect(() => {
		const handler = (e: KeyboardEvent) => {
			if (loading) return;
			if (stage === 'yesno') {
				if (e.key === 'y' || e.key === 'Y' || e.key === 'ArrowRight') answerYesNo(true);
				if (e.key === 'n' || e.key === 'N' || e.key === 'ArrowLeft') answerYesNo(false);
			}
			if (stage === 'cat') {
				if (e.key === '1') answerCat(false);
				if (e.key === '2') answerCat(true);
			}
		};
		window.addEventListener('keydown', handler);
		return () => window.removeEventListener('keydown', handler);
	}, [stage, loading, yesnoIdx, catItem]);

	if (error) {
		return (
			<div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center p-4">
				<Card className="w-full max-w-md">
					<CardHeader>
						<CardTitle className="text-center text-red-600">Error</CardTitle>
					</CardHeader>
					<CardContent className="text-center space-y-4">
						<p>{error}</p>
						<Button onClick={() => setError(null)}>Dismiss</Button>
					</CardContent>
				</Card>
			</div>
		);
	}

	if (stage === 'idle') {
		return (
			<div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center p-4">
				<Card className="w-full max-w-md">
					<CardHeader>
						<CardTitle className="text-center">Level Assessment</CardTitle>
					</CardHeader>
					<CardContent className="text-center space-y-4">
						<p>Quick two-step test: first a rapid Yes/No word check (with a few made-up words), then a short adaptive quiz.</p>
						<Button onClick={startAssessment} disabled={loading}>Start</Button>
					</CardContent>
				</Card>
			</div>
		);
	}

	if (stage === 'yesno') {
		const item = yesnoItems[yesnoIdx];
		const label = item?.type === 'yesno_real' ? 'Do you know this word?' : 'This is a made-up word!';
		const display = item?.type === 'yesno_real' ? (item.lemma || item.lexemeId) : (item?.pseudoword || '');
		return (
			<div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center p-4">
				<Card className="w-full max-w-xl">
					<CardHeader>
						<CardTitle className="text-center">Yes/No Check</CardTitle>
						<div className="space-y-2">
							<div className="flex justify-between text-sm text-gray-600">
								<span>Item {yesnoIdx + 1} of {totalYesno}</span>
								<span>Tip: Pseudowords are fake. Don't guess.</span>
							</div>
							<Progress value={yesnoProgress} className="h-2" />
						</div>
					</CardHeader>
					<CardContent className="space-y-6 text-center">
						<div className="text-3xl font-medium leading-relaxed p-6 bg-white rounded-lg shadow-sm">
							{display}
						</div>
						<div className="flex justify-center gap-6">
							<Button variant="outline" onClick={() => answerYesNo(false)} disabled={loading}>No</Button>
							<Button onClick={() => answerYesNo(true)} disabled={loading}>Yes</Button>
						</div>
					</CardContent>
				</Card>
			</div>
		);
	}

	if (stage === 'cat') {
		return (
			<div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center p-4">
				<Card className="w-full max-w-xl">
					<CardHeader>
						<CardTitle className="text-center">Adaptive Quiz</CardTitle>
					</CardHeader>
					<CardContent className="space-y-6 text-center">
						<div className="text-xl">Is this word known?</div>
						<div className="flex justify-center gap-6">
							<Button variant="outline" onClick={() => answerCat(false)} disabled={loading}>Not Sure</Button>
							<Button onClick={() => answerCat(true)} disabled={loading}>I Know It</Button>
						</div>
					</CardContent>
				</Card>
			</div>
		);
	}

	return (
		<div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center p-4">
			<Card className="w-full max-w-xl">
				<CardHeader>
					<CardTitle className="text-center">Results Ready</CardTitle>
				</CardHeader>
				<CardContent className="text-center space-y-4">
					<div className="text-sm text-gray-600">Your profile has been updated with per-word probabilities.</div>
					<div className="flex gap-3 justify-center">
						<Button onClick={async () => { await fetch('/api/assessment/seed', { method: 'POST' }); router.push('/study'); }}>Start learning from my weak zone</Button>
						<Button variant="outline" onClick={() => router.push('/study')}>Skip</Button>
					</div>
				</CardContent>
			</Card>
		</div>
	);
}
