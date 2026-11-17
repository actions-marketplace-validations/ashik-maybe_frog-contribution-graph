# frog-contribution-graph

Your GitHub contribution graph as a Bengali pond. A frog hops your year; your
busiest days ripple the water.

One self-contained animated SVG, generated daily by GitHub Actions. No
dependencies, no JavaScript on the viewer's side, and a static pond for anyone
with `prefers-reduced-motion`.

## Use it

In your own profile repo, add `.github/workflows/pond.yml`:

```yaml
name: Pond
on:
  schedule:
    - cron: "0 3 * * *"
  workflow_dispatch:
permissions:
  contents: write
jobs:
  pond:
    runs-on: ubuntu-latest
    steps:
      - uses: ashik-maybe/frog-contribution-graph@v1
        with:
          github_user_name: ${{ github.repository_owner }}
      - uses: crazy-max/ghaction-github-pages@v4
        with:
          target_branch: output
          build_dir: dist
```

Then embed it in your README:

```html
<picture>
  <source media="(prefers-color-scheme: dark)"
          srcset="https://raw.githubusercontent.com/YOU/YOU/output/pond-night.svg">
  <source media="(prefers-color-scheme: light)"
          srcset="https://raw.githubusercontent.com/YOU/YOU/output/pond-day.svg">
  <img alt="contribution pond"
       src="https://raw.githubusercontent.com/YOU/YOU/output/pond-day.svg">
</picture>
```

## Inputs

| Input | Required | Default | What it does |
| --- | --- | --- | --- |
| `github_user_name` | yes | — | Username whose calendar becomes the pond |
| `github_token` | no | `${{ github.token }}` | GraphQL token. A PAT is needed for private contributions |
| `output_dir` | no | `dist` | Where the two SVGs are written |

## How it works

1. `contributionsCollection` comes from the GraphQL API (REST does not expose
   the calendar), one year ending today.
2. Weeks become a 53x7 grid; quartile levels become pad colour.
3. The frog lands once per active week, on that week's busiest day.
4. Each hop is a quadratic arc via `<animateMotion>`; every landing pushes out
   a fading ripple.
5. Output is deterministic: the same grid gives byte-identical SVG, so the
   daily Action only needs to commit on real change.

## Design

- **Morning pond / monsoon night.** Two palettes, one pond. Light is pale water
  and open flowers; dark is deep teal and moonlight ripples.
- **Reduced motion.** The SMIL animation is wrapped in media queries; a static
  pond renders for `prefers-reduced-motion: reduce`.
- **Zero dependencies.** Plain ESM plus `fetch`, so the action starts in
  milliseconds and has no supply chain to audit.

## Roadmap

- [ ] **Shapla blooms** — a white-and-pink flower opens on your top 5% of days
- [ ] **River current** — faint drift lines so the water reads as moving
- [ ] **Monsoon theme** — raindrops instead of pads

## Develop

```sh
npm test                              # node --test
npm run generate -- --user YOU --token $GITHUB_TOKEN
```

Requires Node 20+. The action itself runs on `node24` inside GitHub's runners;
locally, Bun works too because the code is standard ESM.

## License

MIT
