import { test } from 'node:test';
import assert from 'node:assert/strict';
import { execFileSync } from 'node:child_process';
import { readFileSync } from 'node:fs';

const root = new URL('..', import.meta.url).pathname;
const read = (path) => readFileSync(`${root}${path}`, 'utf8');

test('README documents every action input', () => {
  const actionYml = read('action.yml');
  const inputsBlock = actionYml.match(/^inputs:\n((?:  .*\n|\n)*?)^runs:/m);
  assert.ok(inputsBlock, 'action.yml has an inputs: block');
  const names = [...inputsBlock[1].matchAll(/^  ([a-z_][a-z0-9_]*):/gm)].map(
    (match) => match[1],
  );
  assert.ok(names.length >= 4, `expected at least four inputs, got ${names.length}`);
  const readme = read('README.md');
  for (const name of names) {
    assert.ok(readme.includes(name), `README inputs table is missing ${name}`);
  }
});

test('tracked files contain no Bangla script', () => {
  const files = execFileSync('git', ['ls-files', '-z'], {
    cwd: root,
    encoding: 'utf8',
  })
    .split('\0')
    .filter(Boolean);
  const bangla = /[ঀ-ঁ]/;
  const offenders = [];
  for (const file of files) {
    if (!/\.(md|mjs|json|yml|svg|txt)$/.test(file) && file !== 'LICENSE') continue;
    let text;
    try {
      text = readFileSync(`${root}${file}`, 'utf8');
    } catch {
      continue;
    }
    if (bangla.test(text)) offenders.push(file);
  }
  assert.deepEqual(offenders, [], 'Bangla script is not allowed; transliterate (Asharh, Srabon)');
});
