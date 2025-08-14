import { Outcome, PlacementState, LevelEstimate, CEFR } from './types';

/**
 * Adaptive placement algorithm
 * Estimates user's vocabulary level using binary search with halving step sizes
 */

export function start(): PlacementState {
  return {
    theta: 0,    // Start at ~B1 mid-level
    step: 1.0,   // Initial step size
    n: 0,        // Number of responses
    seenLexemeIds: [],
    history: []
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
  // Stop when: (a) at least 10 items and step <= 0.2, or (b) 15 items
  return (state.n >= 10 && state.step <= 0.2) || state.n >= 15;
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
  const normalized = (maxStep - clampedStep) / (maxStep - minStep);
  
  return minConfidence + normalized * (maxConfidence - minConfidence);
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
  
  // Use broad ranges to ensure we find content even with minimal seed data
  const rankRanges: Record<CEFR, { min: number; max: number }> = {
    "A1": { min: 1, max: 1000000 },
    "A2": { min: 1, max: 1000000 },
    "B1": { min: 1, max: 1000000 },
    "B2": { min: 1, max: 1000000 },
    "C1": { min: 1, max: 1000000 },
    "C2": { min: 1, max: 1000000 }
  };
  
  const range = rankRanges[cefr];
  
  return {
    cefr,
    minFreqRank: range.min,
    maxFreqRank: range.max
  };
}

// Approximate mapping from frequency rank to difficulty on theta scale (-3..+3)
function rankToDifficultyTheta(freqRank: number): number {
  const Rmax = 50000; // assume 50k ranks coverage
  const r = Math.max(1, Math.min(Rmax, freqRank));
  const normalized = Math.log(r) / Math.log(Rmax); // 0..1
  return -3 + 6 * normalized; // maps to [-3, +3]
}

// Compute knowledge profile bands using theta and step as uncertainty
export function getKnowledgeProfile(state: PlacementState): {
  thetaMean: number;
  thetaMargin: number;
  bands: { rangeStartRank: number; rangeEndRank: number; cefr?: CEFR; pKnownMean: number; pKnownLow: number; pKnownHigh: number; }[]
} {
  const thetaMean = state.theta;
  const thetaLow = state.theta - state.step;
  const thetaHigh = state.theta + state.step;

  const bands: Array<{ rangeStartRank: number; rangeEndRank: number; cefr?: CEFR; } > = [
    { rangeStartRank: 1, rangeEndRank: 1000, cefr: "A1" },
    { rangeStartRank: 1001, rangeEndRank: 3000, cefr: "A2" },
    { rangeStartRank: 3001, rangeEndRank: 6000, cefr: "B1" },
    { rangeStartRank: 6001, rangeEndRank: 10000, cefr: "B2" },
    { rangeStartRank: 10001, rangeEndRank: 20000, cefr: "C1" },
    { rangeStartRank: 20001, rangeEndRank: Number.MAX_SAFE_INTEGER, cefr: "C2" },
  ];

  const sigmoid = (x: number) => 1 / (1 + Math.exp(-x));

  const prof = bands.map(b => {
    // Use the midpoint of the rank band to approximate band difficulty
    const midRank = Math.floor((b.rangeStartRank + Math.min(b.rangeEndRank, 2 * b.rangeStartRank)) / 2);
    const diff = rankToDifficultyTheta(midRank);
    const pMean = sigmoid(thetaMean - diff);
    const pLow = sigmoid(thetaLow - diff);
    const pHigh = sigmoid(thetaHigh - diff);
    return {
      rangeStartRank: b.rangeStartRank,
      rangeEndRank: b.rangeEndRank,
      cefr: b.cefr,
      pKnownMean: Number(pMean.toFixed(3)),
      pKnownLow: Number(pLow.toFixed(3)),
      pKnownHigh: Number(pHigh.toFixed(3)),
    };
  });

  return { thetaMean, thetaMargin: state.step, bands: prof };
}
