/** Deterministic per-day jitter, so dense years look like packed lilies. */
export function jitter(seedText) {
  let h = 2166136261;
  for (const byte of Buffer.from(seedText)) {
    h ^= byte;
    h = Math.imul(h, 16777619);
  }
  const unit = ((h >>> 0) % 10000) / 10000;
  const angle = (((h >>> 16) % 10000) / 10000) * Math.PI * 2;
  return { unit, angle };
}
