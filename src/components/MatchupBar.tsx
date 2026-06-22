import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { Champion } from '../types';
import { colors, fonts, radius, spacing } from '../lib/theme';
import { ChampionAvatar } from './ChampionAvatar';

interface Props {
  champion: Champion | undefined;
  wins: number;
  losses: number;
  draws?: number;
  total: number;
}

export function MatchupBar({ champion, wins, losses, draws = 0, total }: Props) {
  const pct = (n: number): `${number}%` =>
    `${total > 0 ? Math.round((n / total) * 100) : 0}%`;
  const wr = total > 0 ? (wins / total) * 100 : 0;
  const wrColor = wr >= 50 ? colors.win : colors.loss;

  return (
    <View style={styles.row}>
      <ChampionAvatar champion={champion} size={36} />
      <View style={styles.mid}>
        <View style={styles.nameRow}>
          <Text style={styles.name} numberOfLines={1}>{champion?.name ?? '—'}</Text>
          <Text style={styles.record}>{wins}V / {losses}D{draws > 0 ? ` / ${draws}E` : ''}</Text>
        </View>
        <View style={styles.track}>
          <View style={{ width: pct(wins),  height: '100%', backgroundColor: colors.win }} />
          {draws > 0 && (
            <View style={{ width: pct(draws), height: '100%', backgroundColor: colors.draw }} />
          )}
          <View style={{ width: pct(losses), height: '100%', backgroundColor: colors.loss }} />
        </View>
      </View>
      <Text style={[styles.wr, { color: wrColor }]}>{wr.toFixed(0)}%</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.md,
  },
  mid: { flex: 1, minWidth: 0, gap: 6 },
  nameRow: {
    flexDirection: 'row',
    alignItems: 'baseline',
    justifyContent: 'space-between',
    gap: spacing.sm,
  },
  name: {
    fontSize: 14,
    fontWeight: '600',
    color: colors.textPrimary,
    flex: 1,
  },
  record: {
    fontSize: 12,
    color: colors.textMuted,
    flexShrink: 0,
  },
  track: {
    height: 7,
    borderRadius: radius.full,
    overflow: 'hidden',
    backgroundColor: colors.surfaceSunken,
    flexDirection: 'row',
  },
  wr: {
    fontSize: 17,
    fontWeight: '700',
    fontFamily: fonts.display,
    minWidth: 44,
    textAlign: 'right',
  },
});
