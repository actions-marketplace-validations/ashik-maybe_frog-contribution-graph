import { buildGrid } from '../src/grid.mjs';

/**
 * Shared fixtures: five contribution-year shapes as daily count arrays.
 * Used by example/generate.mjs (preview/animated SVGs) and the test suite
 * (test/stats.test.mjs) so both see the same data and cannot drift apart.
 */

/** mulberry32: tiny seeded PRNG so shuffles are deterministic across runs. */
function mulberry32(seed) {
  return function next() {
    seed |= 0;
    seed = (seed + 0x6d2b79f5) | 0;
    let t = Math.imul(seed ^ (seed >>> 15), 1 | seed);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

/** Fisher-Yates with the seeded PRNG: same multiset, organic layout. */
function shuffled(counts, seed) {
  const out = [...counts];
  const rand = mulberry32(seed);
  for (let i = out.length - 1; i > 0; i--) {
    const j = Math.floor(rand() * (i + 1));
    [out[i], out[j]] = [out[j], out[i]];
  }
  return out;
}

export const FIXTURES = {
  empty: Array(53 * 7).fill(0),
  sparse: (() => {
    const counts = Array(53 * 7).fill(0);
    for (let i = 0; i < 12; i++) counts[i * 30] = 3;
    return counts;
  })(),
  normal: shuffled(
    Array.from({ length: 53 * 7 }, (_, i) => (i % 3 === 0 ? (i % 9) + 1 : 0)),
    7,
  ),
  dense: shuffled(Array.from({ length: 53 * 7 }, (_, i) => 1 + (i % 12)), 11),
  tied: shuffled(
    [
      ...Array(159).fill(0),
      ...Array(189).fill(1),
      ...Array(10).fill(2),
      ...Array(4).fill(3),
      ...Array(5).fill(4),
    ],
    42,
  ),
};

const START = Date.UTC(2025, 0, 1);

/**
 * Build a grid from daily counts the same way the tests do: day i is
 * 2025-01-01 UTC plus i days, weeks are consecutive 7-day groups, and any
 * count above zero is FIRST_QUARTILE. Arrays of any length are fine;
 * buildGrid pads short years to 53 columns.
 */
export function gridFromCounts(counts) {
  const days = counts.map((count, i) => ({
    date: new Date(START + i * 86_400_000).toISOString().slice(0, 10),
    weekday: new Date(START + i * 86_400_000).getUTCDay(),
    contributionCount: count,
    contributionLevel: count === 0 ? 'NONE' : 'FIRST_QUARTILE',
  }));
  const weeks = [];
  for (let i = 0; i < days.length; i += 7) weeks.push({ contributionDays: days.slice(i, i + 7) });
  return buildGrid(weeks);
}
