export const c = {
  bg: '#0A0E1A',
  surface: '#141828',
  surfaceElevated: '#1C2238',
  border: '#2A3150',
  primary: '#C89B3C',
  win: '#4CAF82',
  loss: '#E05C5C',
  draw: '#8B8FA8',
  textPrimary: '#F0E8D0',
  textSecondary: '#9A9DB8',
  textMuted: '#5A5E78',
} as const;

export const sp = { xs: 4, sm: 8, md: 16, lg: 24, xl: 32, xxl: 48 } as const;
export const r = { sm: 6, md: 12, lg: 20, full: 999 } as const;

export const card = {
  backgroundColor: c.surface,
  borderRadius: r.lg,
  border: `1px solid ${c.border}`,
  padding: sp.lg,
} as const;

export const DOMAIN_COLORS: Record<string, string> = {
  Body: '#C06020', Calm: '#4A8090', Chaos: '#904A90',
  Fury: '#C03030', Mind: '#6080C0', Order: '#90A050', Colorless: '#706880',
};
