import { test } from 'node:test';
import assert from 'node:assert/strict';
import { buildGrid, gridStats, monthLabels, COLS, ROWS } from '../src/grid.mjs';
import { weeks } from './helpers.mjs';

test('buildGrid always returns 53 columns of 7', () => {
  const grid = buildGrid(weeks());
  assert.equal(grid.length, COLS);
  assert.ok(grid.every((column) => column.length === ROWS));
});

test('buildGrid maps quartiles to levels', () => {
  const grid = buildGrid(weeks());
  assert.equal(grid[0][0].level, 1);
  assert.equal(grid[0][3].level, 4);
});

test('monthLabels finds one label per month', () => {
  assert.equal(monthLabels(buildGrid(weeks())).length, 12);
});

test('gridStats totals contributions', () => {
  const data = weeks();
  const days = data.flatMap((week) => week.contributionDays);
  const expectedTotal = days.reduce((sum, day) => sum + day.contributionCount, 0);
  const expectedActive = days.filter((day) => day.contributionCount > 0).length;

  const stats = gridStats(buildGrid(data));
  assert.equal(stats.total, expectedTotal);
  assert.equal(stats.active, expectedActive);
});
