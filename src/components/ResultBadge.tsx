import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { GameResult } from '../types';
import { colors, radius } from '../lib/theme';

const CONFIG = {
  win: { label: 'Vitória', bg: colors.win + '22', text: colors.win },
  loss: { label: 'Derrota', bg: colors.loss + '22', text: colors.loss },
  draw: { label: 'Empate', bg: colors.draw + '22', text: colors.draw },
};

export function ResultBadge({ result }: { result: GameResult }) {
  const cfg = CONFIG[result];
  return (
    <View style={[styles.badge, { backgroundColor: cfg.bg }]}>
      <Text style={[styles.text, { color: cfg.text }]}>{cfg.label}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  badge: {
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: radius.full,
  },
  text: { fontSize: 12, fontWeight: '700' },
});
