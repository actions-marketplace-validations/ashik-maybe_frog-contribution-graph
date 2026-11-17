import { ROWS, COLS, monthLabels } from './grid.mjs';
import { intensity, activeStats } from './stats.mjs';
import { pickFlowers } from './flowers.mjs';
import { jitter } from './jitter.mjs';

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

/** Calm water: uniform body, no data. Data lives on the pads. */
export function waterMarkup(theme, L) {
  return `<rect width="${L.width}" height="${L.height}" rx="10" fill="${theme.water}" stroke="${theme.waterEdge}"/>`;
}

/**
 * Pads are ellipses sized by normalised activity, with deterministic jitter.
 * Shape tweaks (sparse/dense) adjust base size and opacity only.
 */
export function padMarkup(grid, theme, L, { shape = 'normal' } = {}) {
  const stats = activeStats(grid);
  const scale = shape === 'dense' ? 0.82 : shape === 'sparse' ? 1.25 : 1;
  const opacity = shape === 'dense' ? 0.9 : 1;
  const rects = [];

  for (let x = 0; x < grid.length; x++) {
    for (let y = 0; y < ROWS; y++) {
      const cell = grid[x][y];
      if (!cell || cell.count <= 0) continue;
      const t = intensity(stats, cell.count);
      const rx = (L.cell * (0.52 + 0.42 * t) * scale).toFixed(2);
      const ry = (rx * 0.72).toFixed(2);
      const { unit, angle } = jitter(cell.date);
      const cx = (L.x(x) + L.cell / 2 + (unit - 0.5) * 1.2).toFixed(2);
      const cy = (L.y(y) + L.cell / 2 + ((unit * 7) % 1 - 0.5) * 1.2).toFixed(2);
      const rotate = ((angle * 180) / Math.PI - 90).toFixed(1);
      const fill = theme.levels[1 + Math.round(t * (theme.levels.length - 2))];
      rects.push(
        `<ellipse cx="${cx}" cy="${cy}" rx="${rx}" ry="${ry}" fill="${fill}" opacity="${opacity}" transform="rotate(${rotate} ${cx} ${cy})"/>`,
      );
    }
  }
  return rects.join('');
}

/**
 * Up to eight blooms on the year's strongest days. One open/close cycle per
 * loop, phase-shifted so they do not pulse in unison.
 */
export function flowerMarkup(grid, theme, L, { loopDuration, active }) {
  const blooms = pickFlowers(grid, active);
  const parts = [];
  let index = 0;
  for (let x = 0; x < grid.length; x++) {
    for (let y = 0; y < ROWS; y++) {
      const cell = grid[x][y];
      if (!cell || !blooms.has(cell)) continue;
      const cx = (L.x(x) + L.cell / 2).toFixed(2);
      const cy = (L.y(y) + L.cell / 2).toFixed(2);
      const begin = ((index * loopDuration) / 8).toFixed(2);
      const petals = [];
      for (let p = 0; p < 5; p++) {
        const a = (p * 72 - 90) * (Math.PI / 180);
        const px = (cx * 1 + Math.cos(a) * 2.4).toFixed(2);
        const py = (cy * 1 + Math.sin(a) * 2.4).toFixed(2);
        petals.push(
          `<ellipse cx="${px}" cy="${py}" rx="1.7" ry="2.6" fill="${theme.shaplaPetal}" transform="rotate(${((a * 180) / Math.PI + 90).toFixed(1)} ${px} ${py})"><animate attributeName="rx" values="0.2;1.7;1.7" keyTimes="0;0.03;1" dur="${loopDuration.toFixed(2)}s" begin="${begin}s" repeatCount="indefinite"/><animate attributeName="ry" values="0.2;2.6;2.6" keyTimes="0;0.03;1" dur="${loopDuration.toFixed(2)}s" begin="${begin}s" repeatCount="indefinite"/></ellipse>`,
        );
      }
      parts.push(
        `<g>${petals.join('')}<circle cx="${cx}" cy="${cy}" r="1.1" fill="${theme.shaplaHeart}"/></g>`,
      );
      index++;
    }
  }
  return parts.join('');
}

export function monthMarkup(grid, theme, L, { locale = 'en' } = {}) {
  const formatter = new Intl.DateTimeFormat(locale, { month: 'short', timeZone: 'UTC' });
  return monthLabels(grid)
    .map(
      ({ x, month }) =>
        `<text x="${L.x(x)}" y="${L.top - 7}" font-family="monospace" font-size="9" fill="${theme.labels}">${formatter.format(new Date(Date.UTC(2026, month, 1)))}</text>`,
    )
    .join('');
}

/** River current: seamless because offset travel equals the dash period. */
export function currentMarkup(theme, L, { bands = 5 } = {}) {
  const parts = [];
  for (let i = 0; i < bands; i++) {
    const y = L.top + ((i + 0.5) / bands) * (L.height - L.top - L.footer);
    const wobble = ((i % 2) - 0.5) * 6;
    const flip = i % 2 ? -100 : 100;
    parts.push(
      `<path class="currents" d="M ${L.pad} ${y.toFixed(1)} q ${(L.width / 4).toFixed(0)} ${wobble} ${(L.width / 2).toFixed(0)} 0 t ${(L.width / 2).toFixed(0)} 0" fill="none" stroke="${theme.waterEdge}" stroke-width="1.2" stroke-dasharray="28 72" opacity="0.5"><animate attributeName="stroke-dashoffset" values="0;${flip}" dur="24s" repeatCount="indefinite"/></path>`,
    );
  }
  return parts.join('');
}

/** One fading ring per landing. Starts invisible: SMIL applies no styles
 * before an animation begins, and a visible static state would paint every
 * ring at once until the first loop completes. */
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
