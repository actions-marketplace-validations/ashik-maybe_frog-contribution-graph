import { COLS, ROWS } from '../src/grid.mjs';

const levels = [
  'NONE', 'FIRST_QUARTILE', 'SECOND_QUARTILE',
  'THIRD_QUARTILE', 'FOURTH_QUARTILE',
];

/** Deterministic year of contributions for tests. */
export function weeks(seed = 1) {
  return Array.from({ length: COLS }, (_, x) => ({
    contributionDays: Array.from({ length: ROWS }, (_, y) => {
      const n = (x * 7 + y + seed) % 5;
      return {
        date: new Date(Date.UTC(2025, 0, 1 + x * 7 + y))
          .toISOString()
          .slice(0, 10),
        weekday: y,
        contributionCount: n * 2,
        contributionLevel: levels[n],
      };
    }),
  }));
}
