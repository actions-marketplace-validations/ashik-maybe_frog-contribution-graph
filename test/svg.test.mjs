import { test } from 'node:test';
import assert from 'node:assert/strict';
import { buildGrid } from '../src/grid.mjs';
import { buildRoute } from '../src/route.mjs';
import { renderSvg } from '../src/svg.mjs';
import { layout } from '../src/pond.mjs';
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

test('translate keyTimes span exactly 0 to 1', () => {
  const svg = renderSvg({ grid, route, theme: getTheme('day') });
  const keyTimes = svg
    .match(/type="translate"[^>]*keyTimes="([^"]+)"/)[1]
    .split(';')
    .map(Number);
  assert.equal(keyTimes[0], 0);
  assert.equal(keyTimes.at(-1), 1);
});

test('both themes render and differ', () => {
  const day = renderSvg({ grid, route, theme: getTheme('day') });
  const night = renderSvg({ grid, route, theme: getTheme('night') });
  assert.notEqual(day, night);
  assert.match(day, /#d9eaf5/);
  assert.match(night, /#0a1a2e/);
});

test('no render emits NaN coordinates', () => {
  for (const name of ['day', 'night']) {
    for (const monsoon of [true, false]) {
      for (const still of [true, false]) {
        const svg = renderSvg({ grid, route, theme: getTheme(name), monsoon, still });
        assert.ok(!svg.includes('NaN'), `${name} monsoon=${monsoon} still=${still}`);
      }
    }
  }
});

test('svg keeps motion, fallback and accessible title', () => {
  const svg = renderSvg({ grid, route, theme: getTheme('day') });
  assert.match(svg, /animateTransform/);
  assert.match(svg, /prefers-reduced-motion: reduce/);
  assert.match(svg, /<title id="pond-title">/);
  assert.match(svg, /role="img"/);
});

test('still render emits no SMIL and keeps the resting frog', () => {
  const svg = renderSvg({ grid, route, theme: getTheme('day'), still: true });
  assert.ok(!svg.includes('<animate'));
  assert.match(svg, /still-frog/);
});

test('still render of an empty grid rests the frog on an empty pond', () => {
  const empty = buildGrid([]);
  const emptyRoute = buildRoute(empty);
  const svg = renderSvg({ grid: empty, route: emptyRoute, theme: getTheme('day'), still: true });
  assert.ok(!svg.includes('<animate'));
  assert.match(svg, /empty pond/);
});

test('svg stays under 250 KB', () => {
  const svg = renderSvg({ grid, route, theme: getTheme('day') });
  assert.ok(Buffer.byteLength(svg) < 250_000);
});

test('current bands drift at 60s or slower', () => {
  const wet = renderSvg({ grid, route, theme: getTheme('day'), monsoon: true });
  const bands = [...wet.matchAll(/<path class="currents"[\s\S]*?<\/path>/g)];
  assert.equal(bands.length, 5);
  for (const band of bands) {
    const dur = Number(band[0].match(/dur="(\d+)s"/)[1]);
    assert.ok(dur >= 60, `current band dur ${dur}s must be 60s or slower`);
  }
});

test('monsoon render adds rain and changes nothing else', () => {
  const dry = renderSvg({ grid, route, theme: getTheme('day') });
  const wet = renderSvg({ grid, route, theme: getTheme('day'), monsoon: true });
  assert.match(wet, /class="rain"/);
  assert.equal((wet.match(/<ellipse/g) || []).length, (dry.match(/<ellipse/g) || []).length);
  assert.ok(!dry.includes('class="rain"'));
});

test('monsoon still render has no SMIL', () => {
  const svg = renderSvg({ grid, route, theme: getTheme('day'), still: true, monsoon: true });
  assert.ok(!svg.includes('<animate'));
});

test('rain streaks are paths not pads', () => {
  const dry = renderSvg({ grid, route, theme: getTheme('day') });
  const wet = renderSvg({ grid, route, theme: getTheme('day'), monsoon: true });
  assert.match(wet, /<path class="rain"/);
  assert.equal((wet.match(/<ellipse/g) || []).length, (dry.match(/<ellipse/g) || []).length);
});

test('borsha rain renders 26 streaks with 26 splash rings', () => {
  const wet = renderSvg({ grid, route, theme: getTheme('night'), monsoon: true });
  assert.equal((wet.match(/<path class="rain"/g) || []).length, 26);
  assert.equal((wet.match(/<circle class="rain"/g) || []).length, 26);
});

test('square water fills the viewBox', () => {
  const L = layout();
  assert.equal(L.width, 755);
  assert.equal(L.height, 141);
  const svg = renderSvg({ grid, route, theme: getTheme('day') });
  const rect = svg.match(/<rect[^>]*>/)[0];
  assert.ok(!rect.includes('rx='), 'water rect must not have rx');
  assert.ok(
    svg.includes(`x="0.5" y="0.5" width="${(L.width - 1).toFixed(1)}" height="${(L.height - 1).toFixed(1)}"`),
    'water rect is inset by 0.5px so the 1px stroke is not clipped',
  );
  assert.ok(svg.includes('viewBox="0 0 755 141"'));
});

test('splash rings start invisible (no pre-begin paint)', () => {
  const wet = renderSvg({ grid, route, theme: getTheme('day'), monsoon: true });
  for (const m of wet.matchAll(/<circle class="rain"[^>]*>/g)) {
    assert.match(m[0], /opacity="0"/);
  }
});
