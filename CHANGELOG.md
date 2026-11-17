# Changelog

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
