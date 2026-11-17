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
    frog: '#69c24a',
    frogBelly: '#eaf7c8',
    frogEye: '#f5fff0',
    ripple: '#3c7a38',
    rainStreak: '#5e9b7d',
    shaplaPetal: '#fdf7f8',
    shaplaHeart: '#e6a4b4',
    rainStreak: '#9cc8ae',
  },
  night: {
    name: 'night',
    water: '#08191d',
    waterEdge: '#0d2529',
    levels: ['#0e2a2f', '#12413a', '#195b47', '#217a58', '#33a06c'],
    labels: '#7ba79a',
    frog: '#7de05b',
    frogBelly: '#f2ffd0',
    frogEye: '#ffffff',
    ripple: '#8fe0b0',
    rainStreak: '#57a181',
    shaplaPetal: '#f1edf6',
    shaplaHeart: '#d68ba1',
    rainStreak: '#2f6b57',
  },
};

export function getTheme(name) {
  return name === 'night' || name === 'dark' ? THEMES.night : THEMES.day;
}
