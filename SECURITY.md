# Security Policy

## Scope

- The action itself (`src/`): zero runtime dependencies, plain ECMAScript
  modules, no network access beyond the GitHub GraphQL API call that fetches
  your own contribution calendar.
- The input token (`github_token`) stays inside your runner; the action never
  stores, prints, or transmits it anywhere else.
- The repository's CI pins GitHub Actions and depends on no third-party
  packages.

## Reporting a vulnerability

Preferred: use GitHub's **private vulnerability reporting** on this repository
(Security tab → Report a vulnerability). If that is not available, open a
minimal public issue at
<https://github.com/ashik-maybe/frog-contribution-graph/issues> asking for a
private contact — do not post exploit details in public.

Please include: affected version/tag, what the issue allows, and a minimal
reproduction. Best-effort response; this is a volunteer-maintained project.

## A note on permissions

The action only reads your contribution calendar. The
`contents: write` permission in the README example is for the *follow-up*
`ghaction-github-pages` step that pushes generated SVGs to your `output`
branch, not for this action.
