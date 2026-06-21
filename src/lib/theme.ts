export const colors = {
  background: '#0A0E1A',
  surface: '#141828',
  surfaceElevated: '#1C2238',
  border: '#2A3150',
  primary: '#C89B3C',
  primaryDark: '#9A7530',
  primaryLight: '#E8C06A',
  accent: '#4A6FA5',
  success: '#4CAF82',
  danger: '#E05C5C',
  draw: '#8B8FA8',
  textPrimary: '#F0E8D0',
  textSecondary: '#9A9DB8',
  textMuted: '#5A5E78',
  win: '#4CAF82',
  loss: '#E05C5C',
};

export const spacing = {
  xs: 4,
  sm: 8,
  md: 16,
  lg: 24,
  xl: 32,
  xxl: 48,
};

export const radius = {
  sm: 6,
  md: 12,
  lg: 20,
  full: 999,
};

export const typography = {
  h1: { fontSize: 28, fontWeight: '700' as const, color: colors.textPrimary },
  h2: { fontSize: 22, fontWeight: '700' as const, color: colors.textPrimary },
  h3: { fontSize: 18, fontWeight: '600' as const, color: colors.textPrimary },
  body: { fontSize: 15, fontWeight: '400' as const, color: colors.textPrimary },
  bodySmall: { fontSize: 13, fontWeight: '400' as const, color: colors.textSecondary },
  label: { fontSize: 12, fontWeight: '600' as const, color: colors.textSecondary },
  caption: { fontSize: 11, fontWeight: '400' as const, color: colors.textMuted },
};
