export const ROWS = 7;
export const COLS = 53;

const LEVELS = {
  NONE: 0,
  FIRST_QUARTILE: 1,
  SECOND_QUARTILE: 2,
  THIRD_QUARTILE: 3,
  FOURTH_QUARTILE: 4,
};

const MONTHS = [
  'Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun',
  'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec',
];

/** Convert GitHub weeks into a 53 x 7 grid indexed [column][weekday]. */
export function buildGrid(weeks) {
  const grid = [];
  for (const week of weeks) {
    const column = new Array(ROWS).fill(null);
    for (const day of week.contributionDays ?? []) {
      const weekday = day.weekday;
      if (weekday < 0 || weekday >= ROWS) continue;
      column[weekday] = {
        date: day.date,
        count: day.contributionCount,
        level: LEVELS[day.contributionLevel] ?? 0,
      };
    }
    grid.push(column);
  }
  while (grid.length < COLS) grid.push(new Array(ROWS).fill(null));
  return grid.slice(0, COLS);
}

/** Label a column the first time a new month appears in the data. */
export function monthLabels(grid) {
  const labels = [];
  let previous = -1;
  for (let x = 0; x < grid.length; x++) {
    const first = grid[x].find(Boolean);
    if (!first) continue;
    const month = new Date(`${first.date}T00:00:00Z`).getUTCMonth();
    if (month !== previous) {
      labels.push({ x, label: MONTHS[month] });
      previous = month;
    }
  }
  return labels;
}

export function gridStats(grid) {
  let total = 0;
  let active = 0;
  for (const column of grid) {
    for (const cell of column) {
      if (!cell) continue;
      total += cell.count;
      if (cell.count > 0) active++;
    }
  }
  return { total, active };
}
