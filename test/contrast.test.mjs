import { test } from 'node:test';
import assert from 'node:assert/strict';
import { THEMES } from '../src/theme.mjs';

const OUTLINE = '#101f16';

function luminance(hex) {
  const channels = [1, 3, 5].map((i) => parseInt(hex.slice(i, i + 2), 16) / 255);
  const [r, g, b] = channels.map((v) =>
    v <= 0.03928 ? v / 12.92 : Math.pow((v + 0.055) / 1.055, 2.4),
  );
  return 0.2126 * r + 0.7152 * g + 0.0722 * b;
}

function contrast(a, b) {
  const [lighter, darker] = [luminance(a), luminance(b)].sort((x, y) => y - x);
  return (lighter + 0.05) / (darker + 0.05);
}

for (const theme of Object.values(THEMES)) {
  test(`${theme.name}: outline clears every pad`, () => {
    for (const pad of theme.levels) {
      assert.ok(contrast(OUTLINE, pad) >= 3, `outline on ${pad} is too weak`);
    }
  });

  test(`${theme.name}: frog body clears the darkest pad`, () => {
    const deepest = theme.levels.at(-1);
    assert.ok(contrast(theme.frog, deepest) >= 2.3);
  });

  test(`${theme.name}: eye contrasts with body`, () => {
    assert.ok(contrast(theme.frogEye, theme.frog) >= 2.5);
  });
}
