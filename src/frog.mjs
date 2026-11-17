/**
 * Tiny pixel frog, seven pixels wide and six tall.
 * 1 = body, 2 = eye, 3 = belly.
 * A dark silhouette is drawn one expansion behind every part, so the frog
 * separates from pads and water at any depth.
 */
const FROG = [
  '..2.2..',
  '.11111.',
  '1111111',
  '1333331',
  '.13331.',
  '1.....1',
];

const WIDTH = 7;
const HEIGHT = 6;
const ROLE = { 1: 'frog', 2: 'frogEye', 3: 'frogBelly' };
const OUTLINE = '#101f16';
const PUPIL = '#101f16';
const EXPANSION = 0.7;

function cells(row) {
  return row.split('').map((kind, index) => [index, kind]);
}

/** Rects centred on 0,0 so scale transforms squash about the frog's middle. */
export function frogMarkup(theme, pixel) {
  const w = WIDTH * pixel;
  const h = HEIGHT * pixel;
  const cx = (x) => x * pixel - w / 2;
  const cy = (y) => y * pixel - h / 2;
  const parts = [];

  for (let y = 0; y < FROG.length; y++) {
    for (const [x, kind] of cells(FROG[y])) {
      if (kind === '.') continue;
      const px = (cx(x) - EXPANSION).toFixed(2);
      const py = (cy(y) - EXPANSION).toFixed(2);
      const size = (pixel + 2 * EXPANSION).toFixed(2);
      parts.push(`<rect x="${px}" y="${py}" width="${size}" height="${size}" fill="${OUTLINE}"/>`);
    }
  }
  for (let y = 0; y < FROG.length; y++) {
    for (const [x, kind] of cells(FROG[y])) {
      if (kind === '.') continue;
      const px = cx(x).toFixed(2);
      const py = cy(y).toFixed(2);
      parts.push(`<rect x="${px}" y="${py}" width="${pixel}" height="${pixel}" fill="${theme[ROLE[kind]]}"/>`);
      if (kind === '2') {
        const pupil = pixel * 0.55;
        const offset = (pixel - pupil) / 2;
        parts.push(
          `<rect x="${(cx(x) + offset).toFixed(2)}" y="${(cy(y) + offset).toFixed(2)}" width="${pupil.toFixed(2)}" height="${pupil.toFixed(2)}" fill="${PUPIL}"/>`,
        );
      }
    }
  }
  return parts.join('');
}

function quad(p0, p1, p2, t) {
  const u = 1 - t;
  return u * u * p0 + 2 * u * t * p1 + t * t * p2;
}

/**
 * Sample one move per transition with three beats baked in:
 * sit on the pad, fly the arc, then hold a beat on landing.
 * Dives mirror the arc downward and fade the frog toward invisible.
 */
export const SAMPLES_PER_BEAT = { sit: 2, arc: 8, land: 2 };
const SIT_HOLD = 0.22;
const LAND_HOLD = 0.08;

export function hopSamples(points, marks = [], { hopHeight = 22 } = {}) {
  if (points.length === 0) return [];
const samples = [{ x: points[0].x, y: points[0].y, phase: 0, beat: 'sit', move: 0, sink: 0 }];
  for (let i = 1; i < points.length; i++) {
    const a = points[i - 1];
    const b = points[i];
    const dives = marks[i]?.dive ?? false;
    const apex = dives ? Math.min(a.y, b.y) + 6 : Math.min(a.y, b.y) - hopHeight;
    for (let s = 1; s <= SAMPLES_PER_BEAT.sit; s++) {
      samples.push({ x: a.x, y: a.y, phase: s / SAMPLES_PER_BEAT.sit, beat: 'sit', move: i - 1, sink: 0 });
    }
    for (let s = 1; s <= SAMPLES_PER_BEAT.arc; s++) {
      const u = s / SAMPLES_PER_BEAT.arc;
      samples.push({
        x: quad(a.x, (a.x + b.x) / 2, b.x, u),
        y: quad(a.y, apex, b.y, u),
        phase: u,
        beat: 'arc',
        move: i - 1,
        sink: dives ? Math.sin(u * Math.PI) : 0,
      });
    }
    for (let s = 1; s <= SAMPLES_PER_BEAT.land; s++) {
      samples.push({ x: b.x, y: b.y, phase: s / SAMPLES_PER_BEAT.land, beat: 'land', move: i - 1, sink: 0 });
    }
  }
  return samples;
}

export function beatWeights() {
  const { sit, arc, land } = SAMPLES_PER_BEAT;
  const sitSeconds = SIT_HOLD;
  const arcSeconds = 0.3;
  const landSeconds = LAND_HOLD;
  return { sit: sitSeconds, arc: arcSeconds, land: landSeconds, total: sitSeconds + arcSeconds + landSeconds };
}

/** Time each sample by its beat, so the frog truly holds still while sitting.
 * Every move occupies an identical span, so a move's keyTimes progress from
 * move/moves to (move + 1)/moves and the final sample lands exactly on 1. */
export function motionTiming(samples, moves) {
  const weights = beatWeights();
  const values = [];
  const keyTimes = [];

  for (const p of samples) {
    const beatOffset =
      p.beat === 'sit' ? 0
      : p.beat === 'arc' ? weights.sit
      : weights.sit + weights.arc;
    const beatSpan =
      p.beat === 'sit' ? weights.sit
      : p.beat === 'arc' ? weights.arc
      : weights.land;
    const beatSamples =
      p.beat === 'sit' ? SAMPLES_PER_BEAT.sit
      : p.beat === 'arc' ? SAMPLES_PER_BEAT.arc
      : SAMPLES_PER_BEAT.land;
    const withinMove = (beatOffset + p.phase * beatSpan) / weights.total;
    const t = Math.min(1, (p.move + withinMove) / moves);
    values.push(`${p.x.toFixed(1)},${p.y.toFixed(1)}`);
    keyTimes.push(t.toFixed(4));
  }
  return { values: values.join(';'), keyTimes: keyTimes.join(';') };
}
