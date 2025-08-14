import {
  start,
  pick,
  update,
  shouldStop,
  thetaToCEFR,
  thetaToVocabIndex,
  calculateConfidence,
  generateLevelEstimate,
  getDifficultyForTheta
} from '../placement';

describe('Placement Algorithm', () => {
  describe('start', () => {
    it('should initialize with correct starting values', () => {
      const state = start();
      expect(state.theta).toBe(0);
      expect(state.step).toBe(1.0);
      expect(state.n).toBe(0);
    });
  });

  describe('pick', () => {
    it('should clamp theta to reasonable bounds', () => {
      expect(pick({ theta: -5 })).toBe(-2.5);
      expect(pick({ theta: 5 })).toBe(2.5);
      expect(pick({ theta: 0 })).toBe(0);
      expect(pick({ theta: 1.5 })).toBe(1.5);
    });
  });

  describe('update', () => {
    it('should update theta correctly for easy outcome', () => {
      const state = { theta: 0, step: 1.0, n: 0 };
      const result = update(state, 'easy');
      
      expect(result.theta).toBe(1.0);
      expect(result.n).toBe(1);
      expect(result.step).toBe(1.0); // no change yet
    });

    it('should update theta correctly for hard outcome', () => {
      const state = { theta: 0, step: 1.0, n: 0 };
      const result = update(state, 'hard');
      
      expect(result.theta).toBe(-1.0);
      expect(result.n).toBe(1);
      expect(result.step).toBe(1.0); // no change yet
    });

    it('should halve step size every 2 responses', () => {
      let state = { theta: 0, step: 1.0, n: 0 };
      
      state = update(state, 'easy');  // n=1, step=1.0
      expect(state.step).toBe(1.0);
      
      state = update(state, 'hard');  // n=2, step=0.5
      expect(state.step).toBe(0.5);
      
      state = update(state, 'easy');  // n=3, step=0.5
      expect(state.step).toBe(0.5);
      
      state = update(state, 'hard');  // n=4, step=0.25
      expect(state.step).toBe(0.25);
    });
  });

  describe('shouldStop', () => {
    it('should stop after 15 items regardless of step size', () => {
      expect(shouldStop({ step: 1.0, n: 15 })).toBe(true);
      expect(shouldStop({ step: 0.5, n: 15 })).toBe(true);
    });

    it('should stop after 10+ items if step <= 0.2', () => {
      expect(shouldStop({ step: 0.2, n: 10 })).toBe(true);
      expect(shouldStop({ step: 0.15, n: 12 })).toBe(true);
      expect(shouldStop({ step: 0.125, n: 14 })).toBe(true);
    });

    it('should not stop if less than 10 items', () => {
      expect(shouldStop({ step: 0.1, n: 9 })).toBe(false);
    });

    it('should not stop if 10+ items but step > 0.2', () => {
      expect(shouldStop({ step: 0.5, n: 10 })).toBe(false);
      expect(shouldStop({ step: 0.3, n: 12 })).toBe(false);
    });
  });

  describe('thetaToCEFR', () => {
    it('should map theta values to correct CEFR bands', () => {
      expect(thetaToCEFR(-3)).toBe('A1');
      expect(thetaToCEFR(-2)).toBe('A1');
      expect(thetaToCEFR(-1.5)).toBe('A2');
      expect(thetaToCEFR(-1)).toBe('A2');
      expect(thetaToCEFR(0)).toBe('B1');
      expect(thetaToCEFR(0.2)).toBe('B1');
      expect(thetaToCEFR(0.5)).toBe('B2');
      expect(thetaToCEFR(1.2)).toBe('B2');
      expect(thetaToCEFR(1.5)).toBe('C1');
      expect(thetaToCEFR(2.2)).toBe('C1');
      expect(thetaToCEFR(2.5)).toBe('C2');
      expect(thetaToCEFR(3)).toBe('C2');
    });
  });

  describe('thetaToVocabIndex', () => {
    it('should convert theta to vocab index 0-10', () => {
      expect(thetaToVocabIndex(-3)).toBeCloseTo(0.47, 1);
      expect(thetaToVocabIndex(0)).toBeCloseTo(5.0, 1);
      expect(thetaToVocabIndex(3)).toBeCloseTo(9.53, 1);
      
      // Should always be between 0 and 10
      for (let theta = -5; theta <= 5; theta += 0.5) {
        const index = thetaToVocabIndex(theta);
        expect(index).toBeGreaterThanOrEqual(0);
        expect(index).toBeLessThanOrEqual(10);
      }
    });
  });

  describe('calculateConfidence', () => {
    it('should map step size to confidence correctly', () => {
      expect(calculateConfidence(1.0)).toBeCloseTo(0.3, 2);
      expect(calculateConfidence(0.125)).toBeCloseTo(1.0, 2);
      expect(calculateConfidence(0.5)).toBeCloseTo(0.7, 2);
    });

    it('should clamp extreme step values', () => {
      expect(calculateConfidence(2.0)).toBeCloseTo(0.3, 2); // clamped to max step
      expect(calculateConfidence(0.05)).toBeCloseTo(1.0, 2); // clamped to min step
    });
  });

  describe('generateLevelEstimate', () => {
    it('should generate complete level estimate', () => {
      const state = { theta: 0.5, step: 0.25, n: 8 };
      const estimate = generateLevelEstimate(state);
      
      expect(estimate.cefrBand).toBe('B2');
      expect(estimate.vocabIndex).toBeCloseTo(6.22, 1);
      expect(estimate.confidence).toBeCloseTo(0.9, 2);
    });
  });

  describe('getDifficultyForTheta', () => {
    it('should return appropriate difficulty settings', () => {
      const difficulty = getDifficultyForTheta(0);
      
      expect(difficulty.cefr).toBe('B1');
      expect(difficulty.minFreqRank).toBeGreaterThan(0);
      expect(difficulty.maxFreqRank).toBeGreaterThan(difficulty.minFreqRank);
    });

    it('should have reasonable frequency ranges for all levels', () => {
      for (let theta = -2.5; theta <= 2.5; theta += 0.5) {
        const diff = getDifficultyForTheta(theta);
        expect(diff.minFreqRank).toBeGreaterThan(0);
        expect(diff.maxFreqRank).toBeGreaterThan(diff.minFreqRank);
      }
    });
  });

  describe('integration test: full placement flow', () => {
    it('should converge to stable estimate', () => {
      let state = start();
      const responses = ['easy', 'easy', 'hard', 'easy', 'hard', 'hard', 'easy', 'easy', 'hard'] as const;
      
      for (const response of responses) {
        if (shouldStop(state)) break;
        state = update(state, response);
      }
      
      // Should have made progress toward convergence
      expect(state.n).toBeGreaterThan(0);
      expect(state.step).toBeLessThan(1.0);
      
      const estimate = generateLevelEstimate(state);
      expect(estimate.cefrBand).toMatch(/^[ABC][12]$/);
      expect(estimate.vocabIndex).toBeGreaterThanOrEqual(0);
      expect(estimate.vocabIndex).toBeLessThanOrEqual(10);
      expect(estimate.confidence).toBeGreaterThanOrEqual(0);
      expect(estimate.confidence).toBeLessThanOrEqual(1);
    });
  });
});
