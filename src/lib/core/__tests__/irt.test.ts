import { probKnow, fisherInfo, updateThetaMAP, pickBestItem } from '../irt';

describe('IRT utils', () => {
	test('probKnow increases with theta and decreases with b', () => {
		const g = 0.25;
		const lowTheta = probKnow(-2, 0, g);
		const highTheta = probKnow(2, 0, g);
		expect(highTheta).toBeGreaterThan(lowTheta);

		const easyItem = probKnow(0, -1, g);
		const hardItem = probKnow(0, 1, g);
		expect(easyItem).toBeGreaterThan(hardItem);
	});

	test('fisherInfo peaks near p≈0.5 (theta≈b)', () => {
		const g = 0.25;
		const near = fisherInfo(0, 0, g);
		const far = fisherInfo(3, 0, g);
		expect(near).toBeGreaterThan(far);
	});

	test('updateThetaMAP moves theta toward correct if y=1 and away if y=0', () => {
		const g = 0.25;
		const state = { theta: 0, var: 1 };
		const correct = updateThetaMAP(state, 0.5, g, 1);
		expect(correct.theta).toBeGreaterThan(state.theta);
		const wrong = updateThetaMAP(state, -0.5, g, 0);
		expect(wrong.theta).toBeLessThan(state.theta);
	});

	test('pickBestItem prefers items near theta with low exposure', () => {
		const items = [
			{ id: 'a', b: -2, g: 0.25, type: 'mc4' as const, exposure: 3 },
			{ id: 'b', b: 0, g: 0.25, type: 'mc4' as const, exposure: 0 },
			{ id: 'c', b: 2, g: 0.25, type: 'mc4' as const, exposure: 0 },
		];
		const pick = pickBestItem(0, items);
		expect(pick?.id).toBe('b');
	});
});