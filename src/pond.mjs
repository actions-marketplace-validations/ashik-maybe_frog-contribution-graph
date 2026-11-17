import { ROWS, COLS, monthLabels } from './grid.mjs';

export const LAYOUT = {
  cell: 11,
  gap: 3,
  pad: 8,
  top: 22,
  footer: 16,
};

export function layout() {
  const { cell, gap, pad, top, footer } = LAYOUT;
  const innerWidth = COLS * cell + (COLS - 1) * gap;
  const innerHeight = ROWS * cell + (ROWS - 1) * gap;
  return {
    cell,
    gap,
    pad,
    top,
    width: innerWidth + pad * 2,
    height: top + innerHeight + pad + footer,
    x: (col) => pad + col * (cell + gap),
    y: (row) => top + row * (cell + gap),
  };
}

/** Empty cells stay in the grid as faint water, keeping the year's shape. */
export function padMarkup(grid, theme, L) {
  const rects = [];
  for (let x = 0; x < grid.length; x++) {
    for (let y = 0; y < ROWS; y++) {
      const cell = grid[x][y];
      const fill = cell ? theme.levels[cell.level] : theme.levels[0];
      const opacity = cell ? 1 : 0.35;
      rects.push(
        `<rect x="${L.x(x)}" y="${L.y(y)}" width="${L.cell}" height="${L.cell}" rx="2.5" fill="${fill}" opacity="${opacity}"/>`,
      );
    }
  }
  return rects.join('');
}

export function monthMarkup(grid, theme, L) {
  return monthLabels(grid)
    .map(
      ({ x, label }) =>
        `<text x="${L.x(x)}" y="${L.top - 7}" font-family="monospace" font-size="9" fill="${theme.labels}">${label}</text>`,
    )
    .join('');
}

/** One fading ring per landing, phase-shifted to fire on the frog's arrival.
 * The circle itself starts at opacity 0: SMIL applies no styles before an
 * animation's begin time, so a visible static state would show every ring
 * at once until the first loop completes. */
export function rippleMarkup(route, theme, L, { hopDuration, loopDuration }) {
  const outer = (L.cell * 1.6).toFixed(1);
  return route
    .map((p, i) => {
      const cx = (L.x(p.x) + L.cell / 2).toFixed(1);
      const cy = (L.y(p.y) + L.cell / 2).toFixed(1);
      const begin = (i * hopDuration).toFixed(2);
      return `<circle cx="${cx}" cy="${cy}" r="3" opacity="0" fill="none" stroke="${theme.ripple}" stroke-width="1.2"><animate attributeName="r" values="3;${outer};${outer}" keyTimes="0;0.04;1" dur="${loopDuration.toFixed(2)}s" begin="${begin}s" repeatCount="indefinite"/><animate attributeName="opacity" values="0.55;0.25;0;0" keyTimes="0;0.015;0.05;1" dur="${loopDuration.toFixed(2)}s" begin="${begin}s" repeatCount="indefinite"/></circle>`;
    })
    .join('');
}
