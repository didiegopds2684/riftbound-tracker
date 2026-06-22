import { Platform } from 'react-native';

export const colors = {
  // Surfaces — deep Hextech blue-black
  background:       '#010a15',  // deepest app bg
  bg2:              '#04101f',
  surfaceSunken:    '#06101d',  // wells, track backgrounds
  surface:          '#0a1428',  // card bg
  surfaceElevated:  '#122039',  // inputs, raised cards, hover
  border:           '#1e2d4a',  // default hairline
  borderStrong:     '#2a3a5c',  // emphasized divider

  // Gold — frames, medals, favorite, brand
  gold:       '#c89b3c',
  goldDark:   '#785a28',
  goldLight:  '#f0e6d2',

  // Cyan / mana — active, glowing, interactive
  cyan:       '#00bcff',
  cyanDark:   '#0a7bb0',
  cyanGlow:   '#5ed8ff',

  // Text — warm parchment on cold field
  textPrimary:   '#f0e6d2',  // main reading text
  textSecondary: '#8a93b0',  // secondary / labels
  textMuted:     '#5a6485',  // captions
  textOnGold:    '#010a15',  // text on solid gold fills

  // Results
  win:  '#4caf82',
  loss: '#e05c5c',
  draw: '#8b8fa8',

  // Semantic
  danger:  '#e05c5c',
  success: '#4caf82',

  // Backwards-compat aliases
  primary:      '#c89b3c',
  primaryDark:  '#785a28',
  primaryLight: '#f0e6d2',
  accent:       '#00bcff',

  // Runeterra domain ring colors
  domainBody:      '#c06020',
  domainCalm:      '#4a8090',
  domainChaos:     '#904a90',
  domainFury:      '#c03030',
  domainMind:      '#6080c0',
  domainOrder:     '#90a050',
  domainColorless: '#706880',
};

export const spacing = {
  xs:  4,
  sm:  8,
  md:  16,
  lg:  24,
  xl:  32,
  xxl: 48,
};

export const radius = {
  sm:   6,
  md:   12,
  lg:   20,
  full: 999,
};

// Display font: Cinzel / Beaufort substitute using system serif
export const fonts = {
  display: Platform.select({ ios: 'Georgia', default: 'serif' }),
  body: undefined as string | undefined,
};

export const typography = {
  h1: {
    fontSize: 26,
    fontWeight: '700' as const,
    color: colors.textPrimary,
    letterSpacing: 0.8,
    fontFamily: fonts.display,
  },
  h2: {
    fontSize: 20,
    fontWeight: '700' as const,
    color: colors.textPrimary,
    letterSpacing: 0.4,
  },
  h3: {
    fontSize: 16,
    fontWeight: '600' as const,
    color: colors.textPrimary,
  },
  body: {
    fontSize: 15,
    fontWeight: '400' as const,
    color: colors.textPrimary,
  },
  bodySmall: {
    fontSize: 13,
    fontWeight: '400' as const,
    color: colors.textSecondary,
  },
  label: {
    fontSize: 11,
    fontWeight: '700' as const,
    color: colors.textSecondary,
    textTransform: 'uppercase' as const,
    letterSpacing: 1.4,
  },
  caption: {
    fontSize: 10,
    fontWeight: '400' as const,
    color: colors.textMuted,
    textTransform: 'uppercase' as const,
    letterSpacing: 1.2,
  },
};
