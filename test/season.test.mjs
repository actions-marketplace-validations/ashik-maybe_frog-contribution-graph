import { test } from 'node:test';
import assert from 'node:assert/strict';
import { isBorsha, wantsRain } from '../src/season.mjs';

test('borsha starts at midnight June 15 in Bangladesh', () => {
  assert.equal(isBorsha(new Date('2026-06-14T11:00:00Z')), false);
});

test('borsha rolls in across the UTC to Bangladesh boundary', () => {
  assert.equal(isBorsha(new Date('2026-06-14T18:00:00Z')), true);
});

test('midsummer is borsha', () => {
  assert.equal(isBorsha(new Date('2026-07-20T00:00:00Z')), true);
});

test('borsha ends at midnight August 17 in Bangladesh', () => {
  assert.equal(isBorsha(new Date('2026-08-16T11:00:00Z')), true);
});

test('borsha rolls out across the UTC to Bangladesh boundary', () => {
  assert.equal(isBorsha(new Date('2026-08-16T18:30:00Z')), false);
});

test('borsha is false in Magh', () => {
  assert.equal(isBorsha(new Date('2026-01-10T12:00:00Z')), false);
});

test('borsha is false after August 16 in Bangladesh', () => {
  assert.equal(isBorsha(new Date('2026-08-17T00:00:00Z')), false);
});

test('seasonal_effects false disables rain even inside borsha', () => {
  assert.equal(wantsRain('false', new Date('2026-07-01T00:00:00Z')), false);
});

test('rain is on by default inside borsha', () => {
  assert.equal(wantsRain('true', new Date('2026-07-01T00:00:00Z')), true);
  assert.equal(wantsRain(undefined, new Date('2026-07-01T00:00:00Z')), true);
});

test('rain is off by default outside borsha', () => {
  assert.equal(wantsRain(undefined, new Date('2026-12-01T00:00:00Z')), false);
});
