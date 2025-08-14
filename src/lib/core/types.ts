// Core types for the language learning app

export type Rating = 1 | 2 | 3 | 4; // again, hard, good, easy
export type CEFR = "A1" | "A2" | "B1" | "B2" | "C1" | "C2";
export type Outcome = "easy" | "hard";

export interface FSRSState {
  s: number; // stability
  d: number; // difficulty
  due: Date;
}

export interface LexemeState extends FSRSState {
  reps: number;
  lapses: number;
  lastReview: Date | null;
  suspended: boolean;
}

export interface PlacementState {
  theta: number;  // -3..+3
  step: number;   // step size
  n: number;      // number of responses
  // Track which lexemes have been shown during placement to avoid duplicates
  seenLexemeIds?: string[];
  // Keep a lightweight history of outcomes for later profiling
  history?: Array<{
    lexemeId: string;
    outcome: Outcome;
    cefr: CEFR;
    freqRank?: number;
  }>;
}

export interface LevelEstimate {
  cefrBand: CEFR;
  vocabIndex: number; // 0..10
  confidence: number; // 0..1
}

export interface PlacementItem {
  lexemeId: string;
  sentence?: {
    textL2: string;
    textL1: string;
    cefr: CEFR;
    targetForm?: string;
  };
  // Optional lexeme information for client display/telemetry
  lexeme?: {
    lemma: string;
    pos?: string;
    cefr?: CEFR;
    freqRank?: number;
  };
  meta: {
    idx: number;
    total: number;
    theta: number;
    delta: number;
  };
}

export interface StudyCard {
  cardId: string;
  sentence: {
    textL2: string;
    textL1: string;
    targetForm?: string;
    cefr: CEFR;
  };
  lexeme: {
    lemma: string;
    pos?: string;
  };
  state: {
    due: string; // ISO date string from API
    stability: number;
    difficulty: number;
  };
}

// Knowledge profile derived from placement
export interface KnowledgeBand {
  rangeStartRank: number;
  rangeEndRank: number; // use Number.MAX_SAFE_INTEGER to indicate open-ended
  cefr?: CEFR;
  pKnownMean: number; // 0..1
  pKnownLow: number;  // 0..1 lower bound
  pKnownHigh: number; // 0..1 upper bound
}

export interface KnowledgeProfile {
  thetaMean: number;   // placement theta
  thetaMargin: number; // uncertainty approx (use step)
  bands: KnowledgeBand[];
}
