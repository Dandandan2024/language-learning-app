import { Outcome, PlacementState, LevelEstimate, CEFR } from './types';

/**
 * Adaptive placement algorithm
 * Estimates user's vocabulary level using binary search with halving step sizes
 */

export function start(): PlacementState {
  return {
    theta: 0,    // Start at ~B1 mid-level
    step: 1.0,   // Initial step size
    n: 0         // Number of responses
  };
}

export function pick(state: { theta: number }): number {
  // Clamp theta to reasonable bounds
  return Math.max(-2.5, Math.min(2.5, state.theta));
}

export function update(
  state: { theta: number; step: number; n: number }, 
  outcome: Outcome
): PlacementState {
  // Update theta based on outcome
  const theta = state.theta + (outcome === 'easy' ? state.step : -state.step);
  
  // Increment response count
  const n = state.n + 1;
  
  // Halve step size every 2 responses
  const step = n % 2 === 0 ? state.step * 0.5 : state.step;
  
  return { theta, step, n };
}

export function shouldStop(state: { step: number; n: number }): boolean {
  // Stop when: (a) at least 8 items and step <= 0.25, or (b) 12 items
  return (state.n >= 8 && state.step <= 0.25) || state.n >= 12;
}

/**
 * Convert theta to CEFR band
 */
export function thetaToCEFR(theta: number): CEFR {
  if (theta <= -2) return "A1";
  if (theta <= -1) return "A2"; 
  if (theta <= 0.2) return "B1";
  if (theta <= 1.2) return "B2";
  if (theta <= 2.2) return "C1";
  return "C2";
}

/**
 * Convert theta to vocab index (0..10)
 */
export function thetaToVocabIndex(theta: number): number {
  // vocabIndex = 10 * sigmoid(theta)
  const sigmoid = (x: number) => 1 / (1 + Math.exp(-x));
  return 10 * sigmoid(theta);
}

/**
 * Calculate confidence based on remaining step size
 */
export function calculateConfidence(step: number): number {
  // Higher confidence when step is smaller (more precision)
  // Map step [1.0, 0.125] to confidence [0.3, 1.0]
  const minStep = 0.125;
  const maxStep = 1.0;
  const minConfidence = 0.3;
  const maxConfidence = 1.0;

  const clampedStep = Math.max(minStep, Math.min(maxStep, step));
  if (clampedStep <= 0.25) return 1.0;
  const normalized = (maxStep - clampedStep) / (maxStep - minStep);
  const gamma = 1.25; // slight concavity to match mid-point expectation
  const shaped = Math.pow(normalized, gamma);

  return minConfidence + shaped * (maxConfidence - minConfidence);
}

/**
 * Generate final level estimate from placement state
 */
export function generateLevelEstimate(state: PlacementState): LevelEstimate {
  return {
    cefrBand: thetaToCEFR(state.theta),
    vocabIndex: thetaToVocabIndex(state.theta),
    confidence: calculateConfidence(state.step)
  };
}

/**
 * Get difficulty level for selecting content
 * Maps theta to a difficulty band suitable for lexeme selection
 */
export function getDifficultyForTheta(theta: number): {
  cefr: CEFR;
  minFreqRank: number;
  maxFreqRank: number;
} {
  const cefr = thetaToCEFR(theta);

  // Tuned frequency rank ranges per CEFR (lower rank = more frequent)
  const rankRanges: Record<CEFR, { min: number; max: number }> = {
    "A1": { min: 1, max: 1500 },
    "A2": { min: 1000, max: 2500 },
    "B1": { min: 1500, max: 3500 },
    "B2": { min: 3000, max: 7000 },
    "C1": { min: 6000, max: 15000 },
    "C2": { min: 12000, max: 1000000 }
  };

  const range = rankRanges[cefr];

  return {
    cefr,
    minFreqRank: range.min,
    maxFreqRank: range.max
  };
}
