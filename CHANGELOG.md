# Changelog

## 1.0.1 - 2026-11-17

Repository completeness pass; no rendering changes.

### Added
- EULA.md: the MIT License is the end-user license, with a no-data-collection
  summary (Marketplace Developer Agreement 2.4).
- SECURITY.md and a Support section in the README (Marketplace 5.3).
- CONTRIBUTING.md with the house rules: determinism, pads carry the data,
  transliteration only, zero dependencies, SMIL only, reduced-motion fallback.
- CI guards: every action input must be documented in the README; no Bangla
  script may land in tracked files.
- Dependabot, weekly, for GitHub Actions.
- npm metadata: repository, bugs, homepage, keywords.

### Changed
- README: status and license badges, Privacy and Changelog sections, License
  section points at EULA.md.
- LICENSE copyright line uses the maintainer handle.

## 1.0.0 - 2026-11-17

Initial public release.

### Added
- Animated contribution pond SVG (day and night themes) generated daily via GitHub Actions.
- Shape-aware rendering: empty, sparse, normal, dense and tied contribution years each get an honest layout (p95-sized pads, no invented contrast on degenerate data).
- Frog motion: weekly route, quadratic hop (sit/arc/land-squash), landing ripples, dives across wide gaps, and a static reduced-motion fallback.
- Up to eight shapla blooms on the year's strongest days, slow river currents, and a blue day/night water palette (pads carry the data).
- Borsha easter egg: faint rain with splash rings during Asharh-Srabon (~Jun 15 - Aug 16, Bangladesh time, approximate), opt out with `seasonal_effects: false`.
- Deterministic, zero-dependency ESM output (`node24` action runtime, Node 20+ locally) with `role="img"`, `<title>` and `<desc>` for accessibility.
- Example gallery (`example/preview` and `example/animated`) with a CI drift check, so previews stay in sync with the renderer.
