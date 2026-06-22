import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { colors, fonts, radius, spacing } from '../lib/theme';

type Accent = 'gold' | 'cyan' | 'win' | 'loss' | 'plain';

const ACCENT_COLORS: Record<Accent, string> = {
  gold:  colors.gold,
  cyan:  colors.cyan,
  win:   colors.win,
  loss:  colors.loss,
  plain: colors.textPrimary,
};

interface Props {
  label: string;
  value: string | number;
  sub?: string;
  accent?: Accent;
}

export function KpiCard({ label, value, sub, accent = 'gold' }: Props) {
  return (
    <View style={styles.card}>
      <Text style={styles.label}>{label}</Text>
      <Text style={[styles.value, { color: ACCENT_COLORS[accent] }]}>{value}</Text>
      {sub ? <Text style={styles.sub}>{sub}</Text> : null}
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    flex: 1,
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: colors.gold,
    borderRadius: radius.md,
    padding: spacing.md,
    gap: 4,
    minWidth: 0,
  },
  label: {
    fontSize: 10,
    fontWeight: '700',
    color: colors.textSecondary,
    textTransform: 'uppercase',
    letterSpacing: 1.5,
  },
  value: {
    fontSize: 28,
    fontWeight: '700',
    fontFamily: fonts.display,
    lineHeight: 34,
  },
  sub: {
    fontSize: 12,
    color: colors.textMuted,
  },
});
