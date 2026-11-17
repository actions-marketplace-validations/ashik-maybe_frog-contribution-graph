# Contributing

Small project, small rules. All of them exist so the pond stays honest,
deterministic, and calm.

## Development loop

```sh
npm test          # node --test, Node 20+
npm run examples  # regenerate example/preview and example/animated
```

Requires Node 20+. The action itself runs on `node24` (see `action.yml`).

## House rules

- **Output is deterministic.** Same input grid, byte-identical SVG. Never
  introduce `Math.random()`, unseeded timestamps, or wall-clock-dependent
  layout into the render path. Rain and pads use the seeded hash in
  `src/jitter.mjs`. The one deliberate exception is the season check, which is
  date-driven by design; the example previews force it on.
- **Pads carry the data; water is scenery.** Never recolour, hide, or resize
  data marks (pads, blooms, frog, splash rings) for season or theme. Season
  and theme effects are rain, currents, and water only.
- **No Bangla script anywhere.** Season names are transliterated: Asharh and
  Srabon (spelled exactly so). This is enforced by `test/docs.test.mjs`.
- **Zero runtime dependencies.** Plain ESM plus `fetch`. Do not add packages.
- **Animations are SMIL.** No JavaScript ships to the viewer. Reduced motion
  must always render a usable static pond.
- **Accessible output.** Every SVG keeps `role="img"`, a `<title>`, and a
  `<desc>` with the active-day count and total.

## Changing the render?

`npm run examples` regenerates the gallery. The committed SVGs must be
included in the same commit — CI fails the build if `example/` drifts from
the generator. PRs that change rendering without regenerated previews will
not merge.

## Changing inputs?

- Add the input to `action.yml` (with a truthful description and safe
  default), document it in the README inputs table, and mention it in
  `CHANGELOG.md`. CI checks that every action input is documented in the
  README.

## Commit and PR style

- Conventional Commits (`feat:`, `fix:`, `chore:`, `docs:`, `test:`...),
  one logical change per commit.
- Keep diffs minimal; match the existing code style.
- `CHANGELOG.md` is user-facing; write entries for users, not for git.
