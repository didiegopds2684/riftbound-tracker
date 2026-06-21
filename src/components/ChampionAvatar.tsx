import React from 'react';
import { Image, StyleSheet, Text, View } from 'react-native';
import { Champion } from '../types';
import { colors, radius } from '../lib/theme';

interface Props {
  champion: Champion | undefined;
  size?: number;
  showName?: boolean;
}

const DOMAIN_COLORS: Record<string, string> = {
  Body: '#C06020',
  Calm: '#4A8090',
  Chaos: '#904A90',
  Fury: '#C03030',
  Mind: '#6080C0',
  Order: '#90A050',
  Colorless: '#706880',
};

export function ChampionAvatar({ champion, size = 48, showName = false }: Props) {
  const domainColor = DOMAIN_COLORS[champion?.domain ?? 'Colorless'] ?? colors.border;

  return (
    <View style={[styles.container, showName && styles.containerColumn]}>
      <View
        style={[
          styles.avatar,
          {
            width: size,
            height: size,
            borderRadius: size / 2,
            borderColor: domainColor,
          },
        ]}
      >
        {champion?.image_url ? (
          <Image
            source={{ uri: champion.image_url }}
            style={{ width: size, height: size, borderRadius: size / 2 }}
            resizeMode="cover"
          />
        ) : (
          <View style={[styles.placeholder, { width: size, height: size, borderRadius: size / 2 }]}>
            <Text style={[styles.initial, { fontSize: size * 0.4 }]}>
              {champion?.name?.[0] ?? '?'}
            </Text>
          </View>
        )}
      </View>
      {showName && champion && (
        <Text style={styles.name} numberOfLines={1}>{champion.name}</Text>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { alignItems: 'center' },
  containerColumn: { gap: 4 },
  avatar: { borderWidth: 2, overflow: 'hidden' },
  placeholder: {
    backgroundColor: colors.surfaceElevated,
    alignItems: 'center',
    justifyContent: 'center',
  },
  initial: { color: colors.textSecondary, fontWeight: '700' },
  name: { fontSize: 11, color: colors.textSecondary, textAlign: 'center', maxWidth: 64 },
});
