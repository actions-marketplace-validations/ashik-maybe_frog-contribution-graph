/**
 * Distribution analysis. GitHub's contributionLevel is relative to the user's
 * own year, but heavy ties (many days at count 1) collapse the quartiles, so
 * pad sizing is computed from raw counts with a p95 reference instead.
 */

const PERCENTILE = 0.95;

export function percentile(sorted, p) {
  if (sorted.length === 0) return 0;
  const index = Math.min(sorted.length - 1, Math.floor(p * sorted.length));
  return sorted[index];
}

/** Active days (count > 0) as sorted counts plus the p95 reference value. */
export function activeStats(grid) {
  const counts = [];
  for (const column of grid) {
    for (const cell of column) {
      if (cell && cell.count > 0) counts.push(cell.count);
    }
  }
  counts.sort((a, b) => a - b);
  return {
    counts,
    active: counts.length,
    ref: Math.max(1, percentile(counts, PERCENTILE)),
  };
}

/**
 * Normalised intensity 0..1 for a day. Degenerate distributions (active
 * counts all within one of each other) get a flat 0.5: the data genuinely
 * does not distinguish those days, so the render must not invent contrast.
 * A genuine outlier (e.g. one 500-commit day) is signal, not noise.
 */
export function intensity(stats, count) {
  if (count <= 0) return 0;
  if (stats.counts.at(-1) - stats.counts[0] < 2) return 0.5;
  return Math.min(1, Math.sqrt(count / stats.ref));
}

/** Percent of days with any activity, the shape signal. */
export function activeRatio(grid) {
  const days = grid.flat().filter(Boolean).length;
  if (days === 0) return 0;
  return grid.flat().filter((cell) => cell && cell.count > 0).length / days;
}

/**
 * Profile shapes drive rendering, never data values.
 * empty: nothing to show; sparse: too few pads to read as a path;
 * dense: pads would merge into a carpet.
 */
export function detectShape(grid) {
  const active = grid.flat().filter((cell) => cell && cell.count > 0).length;
  if (active === 0) return 'empty';
  const ratio = active / grid.flat().filter(Boolean).length;
  if (ratio < 0.08) return 'sparse';
  if (ratio > 0.85) return 'dense';
  return 'normal';
}
