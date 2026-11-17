import { gridStats } from './grid.mjs';
import { activeStats, detectShape } from './stats.mjs';
import {
  layout,
  waterMarkup,
  padMarkup,
  monthMarkup,
  rippleMarkup,
  flowerMarkup,
  currentMarkup,
} from './pond.mjs';
import { frogMarkup, hopSamples, motionTiming } from './frog.mjs';
import { markGaps } from './route.mjs';

const HOP_HEIGHT = 22;

export function renderSvg({ grid, theme, route, locale = 'en', still = false }) {
  const L = layout();
  const stats = gridStats(grid);
  const active = activeStats(grid);
  const shape = detectShape(grid);
  const marked = markGaps(route);
  const transitions = Math.max(1, route.length - 1);
  const loopDuration = +(transitions * 0.6).toFixed(2);

  const points = marked.map((p) => ({
    x: L.x(p.x) + L.cell / 2,
    y: L.y(p.y) + L.cell / 2,
  }));
  const samples = hopSamples(points, marked, { hopHeight: HOP_HEIGHT });
  const { values, keyTimes } = motionTiming(samples, Math.max(1, transitions));

  // Dive opacity mirrors the arc's sink, so the frog vanishes into the water.
  const opacities = samples
    .map((p) => (1 - (p.sink ?? 0) * 0.85).toFixed(2))
    .join(';');

  const pixel = L.cell / 3.5;
  const first = samples[0] ?? { x: L.x(0), y: L.y(3) };
  const shadow = `<filter id="frog-shadow" x="-50%" y="-50%" width="200%" height="200%"><feDropShadow dx="0" dy="0.8" stdDeviation="0.9" flood-opacity="0.4"/></filter>`;
  const stillFrog = `<g class="still-frog" filter="url(#frog-shadow)" transform="translate(${first.x.toFixed(1)} ${first.y.toFixed(1)})">${frogMarkup(theme, pixel)}</g>`;
  const movingFrog =
    !still && transitions > 1
      ? `<g class="motion" filter="url(#frog-shadow)"><animateTransform attributeName="transform" type="translate" values="${values}" keyTimes="${keyTimes}" dur="${loopDuration.toFixed(2)}s" repeatCount="indefinite"/><animate attributeName="opacity" values="${opacities}" keyTimes="${keyTimes}" dur="${loopDuration.toFixed(2)}s" repeatCount="indefinite"/><g><animateTransform attributeName="transform" type="scale" values="1 1;0.94 1.06;1.12 0.88;1 1" keyTimes="0;0.78;0.94;1" dur="0.6s" repeatCount="indefinite"/>${frogMarkup(theme, pixel)}</g></g>`
      : '';

  const desc = active.active === 0
    ? 'A frog resting on an empty pond. 0 contributions in the last year.'
    : `A frog hops across ${active.active} active days. ${stats.total} contributions in the last year.`;

  return `<svg xmlns="http://www.w3.org/2000/svg" width="${L.width}" height="${L.height}" viewBox="0 0 ${L.width} ${L.height}" role="img" aria-labelledby="pond-title pond-desc">
<title id="pond-title">Contribution pond at ${theme.name}</title>
<desc id="pond-desc">${desc}</desc>
${still ? '' : `<style>
@media (prefers-reduced-motion: reduce) { .motion, .currents { display: none } }
@media (prefers-reduced-motion: no-preference) { .still-frog { display: none } }
</style>`}
${waterMarkup(theme, L)}
${shadow}
${currentMarkup(theme, L, { still })}
${monthMarkup(grid, theme, L, { locale })}
${padMarkup(grid, theme, L, { shape })}
${flowerMarkup(grid, theme, L, { loopDuration, active: active.active, still })}
${still || route.length <= 1 ? '' : rippleMarkup(marked, theme, L, { hopDuration: 0.6, loopDuration })}
${stillFrog}
${movingFrog}
<text x="${L.width - L.pad}" y="${L.height - 4}" text-anchor="end" font-family="monospace" font-size="9" fill="${theme.labels}">${stats.total} contributions</text>
</svg>`;
}
