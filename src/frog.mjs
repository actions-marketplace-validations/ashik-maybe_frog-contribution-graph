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

/** Sample each hop as a quadratic arc: takeoff, apex, landing. */
export function hopSamples(points, { samplesPerHop = 6, hopHeight = 9 } = {}) {
  if (points.length === 0) return [];
  const samples = [{ x: points[0].x, y: points[0].y, hop: 0, step: 0 }];
  for (let i = 1; i < points.length; i++) {
    const a = points[i - 1];
    const b = points[i];
    const apex = Math.min(a.y, b.y) - hopHeight;
    for (let s = 1; s <= samplesPerHop; s++) {
      const u = s / samplesPerHop;
      samples.push({
        x: quad(a.x, (a.x + b.x) / 2, b.x, u),
        y: quad(a.y, apex, b.y, u),
        hop: i - 1,
        step: s,
      });
    }
  }
  return samples;
}

/** Even time per hop, so ripple offsets land exactly on the frog's feet. */
export function motionTiming(samples, hops, samplesPerHop) {
  const values = samples
    .map((p) => `${p.x.toFixed(1)},${p.y.toFixed(1)}`)
    .join(';');
  const keyTimes = samples
    .map((p) => Math.min(1, (p.hop + p.step / samplesPerHop) / hops).toFixed(4))
    .join(';');
  return { values, keyTimes };
}
