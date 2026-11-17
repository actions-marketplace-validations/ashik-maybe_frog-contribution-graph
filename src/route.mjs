import { ROWS } from './grid.mjs';

/**
 * One landing per active week: the frog visits that week's busiest day.
 * Empty weeks are skipped so an inactive year still produces a short path.
 */
export function buildRoute(grid, { maxHops = 48 } = {}) {
  const picks = [];
  for (let x = 0; x < grid.length; x++) {
    let best = null;
    for (let y = 0; y < ROWS; y++) {
      const cell = grid[x]?.[y];
      if (!cell || cell.count <= 0) continue;
      if (!best || cell.count > best.count) best = { x, y, ...cell };
    }
    if (best) picks.push(best);
  }

  if (picks.length === 0) {
    return [{ x: Math.floor(grid.length / 2), y: 3, date: null, count: 0, level: 0 }];
  }

  if (picks.length <= maxHops) return picks;

  const step = picks.length / maxHops;
  return Array.from({ length: maxHops }, (_, i) => picks[Math.floor(i * step)]);
}

/**
 * Classify each transition. Gaps wider than GAP_COLUMNS are too far to hop:
 * the frog dives, swims under, and surfaces on the far pad. Sparse profiles
 * get this on nearly every move; normal profiles only a few times per loop.
 */
export const GAP_COLUMNS = 2;

export function markGaps(route) {
  return route.map((point, index) => ({
    ...point,
    dive: index > 0 && point.x - route[index - 1].x > GAP_COLUMNS,
  }));
}
