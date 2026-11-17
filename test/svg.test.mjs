import { test } from 'node:test';
import assert from 'node:assert/strict';
import { buildGrid } from '../src/grid.mjs';
import { buildRoute } from '../src/route.mjs';
import { renderSvg } from '../src/svg.mjs';
import { getTheme } from '../src/theme.mjs';
import { hopSamples, motionTiming } from '../src/frog.mjs';
import { weeks } from './helpers.mjs';

const grid = buildGrid(weeks());
const route = buildRoute(grid);

test('sprite motion starts at zero and ends at one', () => {
  const samples = hopSamples([{ x: 0, y: 0 }, { x: 10, y: 3 }]);
  const { keyTimes } = motionTiming(samples, 1, 6);
  const times = keyTimes.split(';').map(Number);
  assert.equal(times[0], 0);
  assert.equal(times.at(-1), 1);
});

test('values and keyTimes have equal counts', () => {
  const svg = renderSvg({ grid, route, theme: getTheme('day') });
  const values = svg.match(/type="translate"[^>]*values="([^"]+)"/)[1];
  const keyTimes = svg.match(/type="translate"[^>]*keyTimes="([^"]+)"/)[1];
  assert.equal(values.split(';').length, keyTimes.split(';').length);
});

test('both themes render and differ', () => {
  const day = renderSvg({ grid, route, theme: getTheme('day') });
  const night = renderSvg({ grid, route, theme: getTheme('night') });
  assert.notEqual(day, night);
  assert.match(day, /#dcefe4/);
  assert.match(night, /#08191d/);
});

test('svg keeps motion, fallback and accessible title', () => {
  const svg = renderSvg({ grid, route, theme: getTheme('day') });
  assert.match(svg, /animateTransform/);
  assert.match(svg, /prefers-reduced-motion: reduce/);
  assert.match(svg, /<title id="pond-title">/);
  assert.match(svg, /role="img"/);
});

test('svg stays under 250 KB', () => {
  const svg = renderSvg({ grid, route, theme: getTheme('day') });
  assert.ok(Buffer.byteLength(svg) < 250_000);
});
