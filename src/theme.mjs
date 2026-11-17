/**
 * Two palettes for the same pond: morning and monsoon night.
 * Hex values live here only; renderers use role names, not raw colours.
 */
export const THEMES = {
  day: {
    name: 'day',
    water: '#dcefe4',
    waterEdge: '#c6e4d4',
    levels: ['#cbe6d8', '#a9d9bb', '#79c598', '#48a870', '#1f7a4c'],
    labels: '#4d6f5f',
    frog: '#3c7a38',
    frogBelly: '#b7dd8a',
    frogEye: '#132a18',
    ripple: '#3c7a38',
    shaplaPetal: '#fdf7f8',
    shaplaHeart: '#e6a4b4',
  },
  night: {
    name: 'night',
    water: '#08191d',
    waterEdge: '#0d2529',
    levels: ['#0e2a2f', '#12413a', '#195b47', '#217a58', '#33a06c'],
    labels: '#7ba79a',
    frog: '#5aad68',
    frogBelly: '#c2e28e',
    frogEye: '#050f12',
    ripple: '#8fe0b0',
    shaplaPetal: '#f1edf6',
    shaplaHeart: '#d68ba1',
  },
};

export function getTheme(name) {
  return name === 'night' || name === 'dark' ? THEMES.night : THEMES.day;
}
