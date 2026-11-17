import { test } from 'node:test';
import assert from 'node:assert/strict';
import { pickFlowers, MAX_FLOWERS } from '../src/flowers.mjs';
import { buildGrid } from '../src/grid.mjs';

function gridFrom(counts) {
  const days = counts.map((count, index) => ({
    date: new Date(Date.UTC(2025, 0, 1 + index)).toISOString().slice(0, 10),
    weekday: index % 7,
    contributionCount: count,
    contributionLevel: 'FIRST_QUARTILE',
  }));
  const weeks = [];
  for (let i = 0; i < days.length; i += 7) weeks.push({ contributionDays: days.slice(i, i + 7) });
  return buildGrid(weeks);
}

test('quiet year blooms exactly one flower', () => {
  const grid = gridFrom([3, 2, 1, 0, 0, 0, 0]);
  assert.equal(pickFlowers(grid, 3).size, 1);
});

test('monster year blooms at most eight', () => {
  const counts = Array.from({ length: 300 }, (_, i) => 10 + (i % 90));
  const grid = gridFrom(counts);
  const blooms = pickFlowers(grid, 300).size;
  assert.ok(blooms <= MAX_FLOWERS, `expected <= ${MAX_FLOWERS}, got ${blooms}`);
});

test('fully tied year blooms one flower', () => {
  const grid = gridFrom(new Array(30).fill(1));
  assert.equal(pickFlowers(grid, 30).size, 1);
});

test('flowers prefer highest counts', () => {
  const counts = new Array(100).fill(1);
  counts[10] = 50;
  counts[50] = 40;
  const grid = gridFrom(counts);
  const blooms = pickFlowers(grid, 100);
  const dates = [...blooms].map((cell) => cell.count).sort((a, b) => b - a);
  assert.deepEqual(dates.slice(0, 2), [50, 40]);
});

test('empty pond blooms nothing', () => {
  assert.equal(pickFlowers(buildGrid([]), 0).size, 0);
});
