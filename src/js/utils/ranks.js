const DEFAULT_COLOR = '#cccccc';

export const colors = {
  F: '#da5d56',
  E: '#f6a37c',
  D: '#fee08b',
  C: '#ffffbf',
  B: '#d9ef8b',
  A: '#91cf60',
  'A+': '#1a9850'
};

export const colorblindColors = {
  F: '#f86d39',
  E: '#d89139',
  D: '#b9a439',
  C: '#a7a7a7',
  B: '#bf9abf',
  A: '#39b0d8',
  'A+': '#00aa55'
};

export function getRankColor(rank, colorblind = false) {
  let color = DEFAULT_COLOR;
  if (colorblind) {
    color = colorblindColors[rank];
  } else {
    color = colors[rank];
  }
  return color || DEFAULT_COLOR;
}
