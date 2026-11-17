/**
 * Two palettes for the same pond: morning and monsoon night.
 * Water is blue in both; pads stay green because they carry the data.
 * Hex values live here only; renderers use role names, not raw colours.
 */
export const THEMES = {
  day: {
    name: 'day',
    water: '#d9eaf5',
    waterEdge: '#bcd8e8',
    levels: ['#a3d4af', '#7fc898', '#55b275', '#33945a', '#1f7a4c'],
    labels: '#41586a',
    frog: '#69c24a',
    frogBelly: '#eaf7c8',
    frogEye: '#f5fff0',
    ripple: '#6fa5c4',
    rainStreak: '#7aa9c6',
    splashRing: '#a8cfe3',
    shaplaPetal: '#fdf7f8',
    shaplaHeart: '#e6a4b4',
  },
  night: {
    name: 'night',
    water: '#0a1a2e',
    waterEdge: '#12283f',
    levels: ['#173f30', '#174e37', '#1d6142', '#217a50', '#33a06c'],
    labels: '#8cabc6',
    frog: '#7de05b',
    frogBelly: '#f2ffd0',
    frogEye: '#ffffff',
    ripple: '#84b9dc',
    rainStreak: '#6ea5cf',
    splashRing: '#9dc9e6',
    shaplaPetal: '#f1edf6',
    shaplaHeart: '#d68ba1',
  },
};

export function getTheme(name) {
  return name === 'night' || name === 'dark' ? THEMES.night : THEMES.day;
}
