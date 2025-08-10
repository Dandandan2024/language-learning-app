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
    due: Date;
    stability: number;
    difficulty: number;
  };
}
