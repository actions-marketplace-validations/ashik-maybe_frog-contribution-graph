import { gridStats } from './grid.mjs';
import {
  layout,
  padMarkup,
  monthMarkup,
  rippleMarkup,
} from './pond.mjs';
import { frogMarkup, hopSamples, motionTiming } from './frog.mjs';

const HOP_DURATION = 0.28;
const SAMPLES_PER_HOP = 6;
const HOP_HEIGHT = 9;

export function renderSvg({ grid, theme, route }) {
  const L = layout();
  const stats = gridStats(grid);
  const pixel = L.cell / 5;
  const hops = route.length;
  const loopDuration = Math.max(1, hops * HOP_DURATION);

  const points = route.map((p) => ({
    x: L.x(p.x) + L.cell / 2,
    y: L.y(p.y) + L.cell / 2,
  }));
  const samples = hopSamples(points, {
    samplesPerHop: SAMPLES_PER_HOP,
    hopHeight: HOP_HEIGHT,
  });
  const { values, keyTimes } = motionTiming(
    samples,
    Math.max(1, hops),
    SAMPLES_PER_HOP,
  );

  const first = samples[0] ?? { x: L.x(0), y: L.y(3) };
  const stillFrog = `<g class="still-frog" transform="translate(${first.x.toFixed(1)} ${first.y.toFixed(1)})">${frogMarkup(theme, pixel)}</g>`;
  const movingFrog =
    hops > 1
      ? `<g class="motion"><animateTransform attributeName="transform" type="translate" values="${values}" keyTimes="${keyTimes}" dur="${loopDuration.toFixed(2)}s" repeatCount="indefinite"/><g><animateTransform attributeName="transform" type="scale" values="1 1;1.14 0.86;1 1" keyTimes="0;0.85;1" dur="${HOP_DURATION}s" repeatCount="indefinite"/>${frogMarkup(theme, pixel)}</g></g>`
      : '';

  return `<svg xmlns="http://www.w3.org/2000/svg" width="${L.width}" height="${L.height}" viewBox="0 0 ${L.width} ${L.height}" role="img" aria-labelledby="pond-title pond-desc">
<title id="pond-title">Contribution pond at ${theme.name}</title>
<desc id="pond-desc">A frog hops across ${stats.active} active days. ${stats.total} contributions in the last year.</desc>
<style>
@media (prefers-reduced-motion: reduce) { .motion { display: none } }
@media (prefers-reduced-motion: no-preference) { .still-frog { display: none } }
</style>
<rect width="${L.width}" height="${L.height}" rx="10" fill="${theme.water}" stroke="${theme.waterEdge}"/>
${monthMarkup(grid, theme, L)}
${padMarkup(grid, theme, L)}
${rippleMarkup(route, theme, L, { hopDuration: HOP_DURATION, loopDuration })}
${stillFrog}
${movingFrog}
<text x="${L.width - L.pad}" y="${L.height - 4}" text-anchor="end" font-family="monospace" font-size="9" fill="${theme.labels}">${stats.total} contributions</text>
</svg>`;
}
