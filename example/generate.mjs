/**
 * Render static (still) and animated previews for every profile shape,
 * plus a night-theme pair for the normal shape. No token or GitHub account
 * needed. Output is deterministic, so re-running is a clean no-op diff.
 */
import { mkdir, writeFile } from 'node:fs/promises';
import { join } from 'node:path';
import { FIXTURES, gridFromCounts } from './fixtures.mjs';
import { buildRoute } from '../src/route.mjs';
import { renderSvg } from '../src/svg.mjs';
import { getTheme } from '../src/theme.mjs';

const root = new URL('.', import.meta.url).pathname;
const previewDir = join(root, 'preview');
const animatedDir = join(root, 'animated');

const jobs = [
  ...Object.keys(FIXTURES).map((shape) => ({ shape, theme: 'day' })),
  { shape: 'normal', theme: 'night', suffix: 'night' },
  { shape: 'normal', theme: 'day', suffix: 'monsoon', monsoon: true },
  { shape: 'normal', theme: 'night', suffix: 'monsoon-night', monsoon: true },
];

await mkdir(previewDir, { recursive: true });
await mkdir(animatedDir, { recursive: true });

for (const job of jobs) {
  const name = job.suffix ?? job.shape;
  const grid = gridFromCounts(FIXTURES[job.shape]);
  const route = buildRoute(grid);
  const theme = getTheme(job.theme);

  for (const [dir, still] of [[previewDir, true], [animatedDir, false]]) {
    const svg = renderSvg({ grid, theme, route, still, monsoon: job.monsoon ?? false });
    const path = join(dir, `${name}.svg`);
    await writeFile(path, svg);
    console.log(`wrote ${path} (${(Buffer.byteLength(svg) / 1024).toFixed(1)} KB)`);
  }
}
