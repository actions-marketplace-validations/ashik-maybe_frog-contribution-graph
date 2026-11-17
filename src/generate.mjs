import { mkdir, writeFile } from 'node:fs/promises';
import { join } from 'node:path';
import { fetchCalendar } from './github.mjs';
import { buildGrid } from './grid.mjs';
import { buildRoute } from './route.mjs';
import { renderSvg } from './svg.mjs';
import { getTheme } from './theme.mjs';

function parseArgs(argv) {
  const args = {};
  for (let i = 0; i < argv.length; i++) {
    if (argv[i] === '--user' || argv[i] === '-u') args.user = argv[++i];
    else if (argv[i] === '--token') args.token = argv[++i];
    else if (argv[i] === '--out') args.out = argv[++i];
  }
  return args;
}

const args = parseArgs(process.argv.slice(2));
const user = args.user ?? process.env.INPUT_GITHUB_USER_NAME ?? process.env.GITHUB_REPOSITORY_OWNER;
const token = args.token ?? process.env.INPUT_GITHUB_TOKEN ?? process.env.GITHUB_TOKEN;
const outDir = args.out ?? process.env.INPUT_OUTPUT_DIR ?? 'dist';

if (!user || !token) {
  console.error('frog-contribution-graph: need --user and --token (or INPUT_GITHUB_*)');
  process.exit(1);
}

try {
  const weeks = await fetchCalendar({ login: user, token });
  const grid = buildGrid(weeks);
  const route = buildRoute(grid);
  await mkdir(outDir, { recursive: true });

  for (const name of ['day', 'night']) {
    const svg = renderSvg({ grid, route, theme: getTheme(name) });
    const path = join(outDir, `pond-${name}.svg`);
    await writeFile(path, svg);
    console.log(`wrote ${path} (${(Buffer.byteLength(svg) / 1024).toFixed(1)} KB)`);
  }
} catch (error) {
  console.error(`frog-contribution-graph: ${error.message}`);
  process.exit(1);
}
