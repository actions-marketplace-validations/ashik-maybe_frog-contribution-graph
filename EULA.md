# End User License Agreement

This action — `ashik-maybe/frog-contribution-graph` — is licensed to you
under the [MIT License](LICENSE). That license is the EULA for this product:
it governs your rights to use, copy, modify, merge, publish, distribute,
sublicense, and sell copies of the software.

The terms in brief:

- You may use the action in any of your own repositories, including
  commercially, at no cost.
- The software is provided "as is", without warranty of any kind, express or
  implied. Neither the author nor GitHub is liable for damages arising from
  its use.
- You keep your own output. The SVGs you generate are yours.

This action collects no personal data, runs no server, and ships no telemetry.
It executes inside your own GitHub Actions runner using your own token and
makes exactly one network call: the GitHub GraphQL API, to read the
contribution calendar for the username you pass as an input. Nothing else
leaves your runner.

Support: open an issue at
<https://github.com/ashik-maybe/frog-contribution-graph/issues>. Support is
provided best-effort, as described in [README.md](README.md#support).
