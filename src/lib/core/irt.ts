export const sigmoid = (x: number) => 1 / (1 + Math.exp(-x));

export function probKnow(theta: number, b: number, g: number) {
	return g + (1 - g) * sigmoid(theta - b);
}

export function fisherInfo(theta: number, b: number, g: number) {
	const p = probKnow(theta, b, g);
	const q = (p - g) / (1 - g); // = sigmoid(theta - b)
	const dp = (1 - g) * q * (1 - q);
	return dp * dp / (p * (1 - p) + 1e-9);
}

export interface ThetaState { theta: number; var: number; }

export function updateThetaMAP(state: ThetaState, b: number, g: number, y: 0 | 1): ThetaState {
	const { theta, var: V } = state;
	const p = probKnow(theta, b, g);
	const q = (p - g) / (1 - g);
	const dp = (1 - g) * q * (1 - q);
	const grad = (y - p) * (dp / (p * (1 - p) + 1e-9)) - (theta / V);
	const hess = - (dp * dp / (p * (1 - p) + 1e-9)) - (1 / V);
	const thetaNew = theta - grad / (hess + 1e-9);
	const varNew = Math.min(1.0, Math.max(0.02, -1 / (hess + 1e-9)));
	return { theta: thetaNew, var: varNew };
}

export interface CandidateItem {
	id: string;
	lexemeId?: string;
	b: number;
	g: number;
	type: 'yesno_real' | 'yesno_pseudo' | 'mc4' | 'recall';
	exposure?: number;
	pos?: string | null;
	zipf?: number | null;
}

export function pickBestItem(theta: number, candidates: CandidateItem[], options?: {
	minExposure?: number;
	mixPOS?: boolean;
}): CandidateItem | null {
	if (candidates.length === 0) return null;
	// Simple: pick highest Fisher info near theta with lowest exposure first
	const scored = candidates.map(c => ({
		c,
		score: fisherInfo(theta, c.b, c.g) - 0.01 * (c.exposure || 0)
	}));
	scored.sort((a, b) => b.score - a.score);
	return scored[0]?.c || null;
}