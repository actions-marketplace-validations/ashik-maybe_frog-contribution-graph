/**
 * Flower placement. Rank-based with an absolute cap, so a quiet year still
 * blooms and a monster year never turns into a flower field.
 */
export const MAX_FLOWERS = 8;

/**
 * Pick the days that bloom. At most MAX_FLOWERS, always at least one when
 * anything is active, preferring the highest counts and breaking ties toward
 * the most recent date.
 */
export function pickFlowers(grid, active) {
  const candidates = [];
  for (const column of grid) {
    for (const cell of column) {
      if (cell && cell.count > 0) candidates.push(cell);
    }
  }
  if (candidates.length === 0) return new Set();
  if (candidates.every((cell) => cell.count === candidates[0].count)) {
    return new Set(candidates.slice(-1));
  }

  const wanted = Math.max(1, Math.min(MAX_FLOWERS, Math.round(active * 0.02)));
  const sorted = [...candidates].sort(
    (a, b) => b.count - a.count || (a.date < b.date ? 1 : -1),
  );
  return new Set(sorted.slice(0, wanted));
}
