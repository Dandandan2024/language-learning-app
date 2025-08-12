import { initState, review, getNextInterval, isDue, getDueCards } from '../fsrs';
import { Rating, FSRSState } from '../types';

describe('FSRS Algorithm', () => {
  describe('initState', () => {
    it('should create initial state with correct values', () => {
      const state = initState();
      expect(state.s).toBe(0.5);
      expect(state.d).toBe(5.0);
      expect(state.due).toBeInstanceOf(Date);
    });
  });

  describe('review', () => {
    const baseState = { s: 2.0, d: 5.0 };

    it('should apply correct multipliers for each rating', () => {
      const results = {
        again: review(baseState, 1),
        hard: review(baseState, 2), 
        good: review(baseState, 3),
        easy: review(baseState, 4)
      };

      expect(results.again.s).toBe(1.0); // 2.0 * 0.5
      expect(results.hard.s).toBe(1.8);  // 2.0 * 0.9
      expect(results.good.s).toBe(3.2);  // 2.0 * 1.6
      expect(results.easy.s).toBe(4.4);  // 2.0 * 2.2
    });

    it('should clamp stability within bounds', () => {
      // Test lower bound
      const lowResult = review({ s: 0.1, d: 5.0 }, 1);
      expect(lowResult.s).toBe(0.3); // clamped to minimum

      // Test upper bound
      const highResult = review({ s: 50.0, d: 5.0 }, 4);
      expect(highResult.s).toBe(60); // clamped to maximum (50 * 2.2 = 110, clamped to 60)
    });

    it('should update difficulty correctly', () => {
      const baseD = 5.0;
      
      const againResult = review({ s: 2.0, d: baseD }, 1);
      expect(againResult.d).toBe(5.3); // 5.0 + 0.3
      
      const easyResult = review({ s: 2.0, d: baseD }, 4);
      expect(easyResult.d).toBe(4.8); // 5.0 - 0.2
      
      const goodResult = review({ s: 2.0, d: baseD }, 3);
      expect(goodResult.d).toBe(5.0); // no change
    });

    it('should clamp difficulty within bounds', () => {
      const lowResult = review({ s: 2.0, d: 1.0 }, 1);
      expect(lowResult.d).toBe(1.3); // clamped to minimum
      
      const highResult = review({ s: 2.0, d: 9.0 }, 1);
      expect(highResult.d).toBe(9.0); // clamped to maximum
    });

    it('should calculate correct intervals', () => {
      const result = review({ s: 2.0, d: 5.0 }, 3);
      const expectedDays = Math.max(1, Math.round(Math.pow(3.2, 1.07)));
      expect(result.days).toBe(expectedDays);
      
      // Should always be at least 1 day
      const veryLowResult = review({ s: 0.1, d: 5.0 }, 1);
      expect(veryLowResult.days).toBeGreaterThanOrEqual(1);
    });

    it('should set due date correctly', () => {
      const before = Date.now();
      const result = review({ s: 2.0, d: 5.0 }, 3);
      const after = Date.now();
      
      const expectedDue = before + result.days * 86400000;
      const actualDue = result.due.getTime();
      
      expect(actualDue).toBeGreaterThanOrEqual(expectedDue - 1000); // Allow 1s tolerance
      expect(actualDue).toBeLessThanOrEqual(after + result.days * 86400000);
    });
  });

  describe('monotonic growth', () => {
    it('should increase intervals for better ratings', () => {
      const state = { s: 2.0, d: 5.0 };
      
      const intervals = [
        getNextInterval(state, 1), // again
        getNextInterval(state, 2), // hard
        getNextInterval(state, 3), // good
        getNextInterval(state, 4)  // easy
      ];
      
      expect(intervals[0]).toBeLessThan(intervals[1]);
      expect(intervals[1]).toBeLessThan(intervals[2]);
      expect(intervals[2]).toBeLessThan(intervals[3]);
    });
  });

  describe('isDue', () => {
    it('should return true for overdue cards', () => {
      const overdueState: FSRSState = {
        s: 2.0,
        d: 5.0,
        due: new Date(Date.now() - 86400000) // yesterday
      };
      expect(isDue(overdueState)).toBe(true);
    });

    it('should return false for future cards', () => {
      const futureState: FSRSState = {
        s: 2.0,
        d: 5.0,
        due: new Date(Date.now() + 86400000) // tomorrow
      };
      expect(isDue(futureState)).toBe(false);
    });
  });

  describe('getDueCards', () => {
    it('should filter and sort due cards', () => {
      const cards = [
        { id: '1', state: { s: 1, d: 5, due: new Date(Date.now() + 86400000) } }, // future
        { id: '2', state: { s: 1, d: 5, due: new Date(Date.now() - 86400000) } }, // due yesterday
        { id: '3', state: { s: 1, d: 5, due: new Date(Date.now() - 7200000) } },  // due 2h ago
      ];

      const due = getDueCards(cards);
      expect(due).toHaveLength(2);
      expect(due[0].id).toBe('2'); // oldest first
      expect(due[1].id).toBe('3');
    });
  });
});
