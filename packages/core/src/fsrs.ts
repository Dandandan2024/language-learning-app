import { Rating, FSRSState } from './types';

/**
 * FSRS-lite scheduling algorithm
 * Simplified version of the Free Spaced Repetition Scheduler
 */

export function initState(): FSRSState {
  return {
    s: 0.5,
    d: 5.0,
    due: new Date()
  };
}

export function review(prev: { s: number; d: number }, rating: Rating) {
  let { s, d } = prev;
  
  // Rating multipliers: again=0.5, hard=0.9, good=1.6, easy=2.2
  const mult = rating === 1 ? 0.5 : 
               rating === 2 ? 0.9 : 
               rating === 3 ? 1.6 : 
               2.2;
  
  // Update stability
  s = Math.min(60, Math.max(0.3, s * mult));
  
  // Update difficulty
  d = Math.min(9.0, Math.max(1.3, d + (
    rating === 4 ? -0.2 : 
    rating === 1 ? +0.3 : 
    0
  )));
  
  // Calculate interval in days
  const days = Math.max(1, Math.round(Math.pow(s, 1.07)));
  
  // Calculate next due date
  const due = new Date(Date.now() + days * 86400000);
  
  return { s, d, due, days };
}

/**
 * Get the next interval for a given state and rating
 * Useful for preview purposes
 */
export function getNextInterval(state: { s: number; d: number }, rating: Rating): number {
  const result = review(state, rating);
  return result.days;
}

/**
 * Check if a card is due for review
 */
export function isDue(state: FSRSState): boolean {
  return new Date() >= state.due;
}

/**
 * Get cards that are due for review, sorted by due date
 */
export function getDueCards<T extends { state: FSRSState }>(cards: T[]): T[] {
  const now = new Date();
  return cards
    .filter(card => card.state.due <= now)
    .sort((a, b) => a.state.due.getTime() - b.state.due.getTime());
}
