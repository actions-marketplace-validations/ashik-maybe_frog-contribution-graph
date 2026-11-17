import { test } from 'node:test';
import assert from 'node:assert/strict';
import { buildGrid } from '../src/grid.mjs';
import { buildRoute } from '../src/route.mjs';
import { renderSvg } from '../src/svg.mjs';
import { getTheme } from '../src/theme.mjs';
import { weeks } from './helpers.mjs';

test('route is deterministic', () => {
  const grid = buildGrid(weeks());
  assert.deepEqual(buildRoute(grid), buildRoute(grid));
});

test('route caps at 48 hops', () => {
  assert.equal(buildRoute(buildGrid(weeks())).length, 48);
});

test('route skips empty weeks', () => {
  const grid = buildGrid(weeks());
  grid[10] = grid[10].map(() => null);
  assert.ok(!buildRoute(grid).some((hop) => hop.x === 10));
});

test('empty year still produces a path', () => {
  const empty = buildGrid([]);
  const route = buildRoute(empty);
  assert.equal(route.length, 1);
  assert.equal(route[0].x, Math.floor(53 / 2));
  assert.equal(route[0].y, 3);
  assert.equal(route[0].count, 0);
});

test('route length 1 is fine downstream', () => {
  const empty = buildGrid([]);
  const route = buildRoute(empty);
  const svg = renderSvg({ grid: empty, route, theme: getTheme('day') });
  assert.match(svg, /still-frog/);
});
