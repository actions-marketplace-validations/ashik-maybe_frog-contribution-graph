import { test } from 'node:test';
import assert from 'node:assert/strict';
import { detectShape, intensity, activeStats, activeRatio } from '../src/stats.mjs';
import { buildGrid } from '../src/grid.mjs';
import { weeks } from './helpers.mjs';

function fromCounts(counts) {
  const days = counts.map((count, index) => ({
    date: new Date(Date.UTC(2025, 0, 1 + index)).toISOString().slice(0, 10),
    weekday: index % 7,
    contributionCount: count,
    contributionLevel: 'FIRST_QUARTILE',
  }));
  const weeksOut = [];
  for (let i = 0; i < days.length; i += 7) weeksOut.push({ contributionDays: days.slice(i, i + 7) });
  return buildGrid(weeksOut);
}

test('detects empty year', () => {
  assert.equal(detectShape(buildGrid([])), 'empty');
});

test('detects sparse year', () => {
  const counts = new Array(371).fill(0);
  for (let i = 0; i < 12; i++) counts[i * 30] = 3;
  assert.equal(detectShape(fromCounts(counts)), 'sparse');
});

test('detects dense year', () => {
  assert.equal(detectShape(fromCounts(new Array(371).fill(2))), 'dense');
});

test('detects normal year', () => {
  const counts = new Array(371).fill(0).map((_, i) => (i % 2));
  assert.equal(detectShape(fromCounts(counts)), 'normal');
});

test('degenerate distribution gets flat intensity', () => {
  const grid = fromCounts([1, 1, 1, 2, 1, 1]);
  const stats = activeStats(grid);
  assert.equal(intensity(stats, 1), 0.5);
  assert.equal(intensity(stats, 2), 0.5);
});

test('p95 reference resists a single outlier', () => {
  const counts = [...new Array(100).fill(1), 500];
  const grid = fromCounts(counts);
  const stats = activeStats(grid);
  assert.equal(stats.ref, 1);
  assert.equal(intensity(stats, 500), 1);
  assert.ok(intensity(stats, 1) > 0.9);
});

test('intensity is monotonic in count', () => {
  const grid = fromCounts([1, 3, 7, 15, 40]);
  const stats = activeStats(grid);
  const values = [1, 3, 7, 15, 40].map((c) => intensity(stats, c));
  assert.deepEqual(values, [...values].sort((a, b) => a - b));
});

test('activeRatio ignores empty trailing columns', () => {
  const grid = buildGrid([]);
  assert.equal(activeRatio(grid), 0);
});

test('your tied distribution stays degenerate', () => {
  const counts = [
    ...new Array(159).fill(0),
    ...new Array(189).fill(1),
    ...new Array(10).fill(2),
    ...new Array(4).fill(3),
    ...new Array(5).fill(4),
  ];
  const grid = fromCounts(counts);
  assert.equal(detectShape(grid), 'normal');
  const stats = activeStats(grid);
  assert.equal(new Set(stats.counts).size, 4);
});
