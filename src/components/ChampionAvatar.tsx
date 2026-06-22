import React from 'react';
import { Image, StyleSheet, Text, View } from 'react-native';
import { Champion } from '../types';
import { colors, fonts, radius } from '../lib/theme';

interface Props {
  champion: Champion | undefined;
  size?: number;
  showName?: boolean;
  favorite?: boolean;
}

const DOMAIN_COLORS: Record<string, string> = {
  Body:      colors.domainBody,
  Calm:      colors.domainCalm,
  Chaos:     colors.domainChaos,
  Fury:      colors.domainFury,
  Mind:      colors.domainMind,
  Order:     colors.domainOrder,
  Colorless: colors.domainColorless,
};

export function ChampionAvatar({ champion, size = 48, showName = false, favorite = false }: Props) {
  const domainColor = DOMAIN_COLORS[champion?.domain ?? 'Colorless'] ?? colors.borderStrong;
  const starSize = Math.max(14, size * 0.3);

  return (
    <View style={[styles.wrapper, showName && styles.wrapperColumn]}>
      <View style={{ position: 'relative', flexShrink: 0 }}>
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
              <Text style={[styles.initial, { fontSize: size * 0.42, fontFamily: fonts.display }]}>
                {champion?.name?.[0] ?? '?'}
              </Text>
            </View>
          )}
        </View>
        {favorite && (
          <View
            style={[
              styles.star,
              {
                width: starSize,
                height: starSize,
                borderRadius: starSize / 2,
              },
            ]}
          >
            <Text style={{ fontSize: starSize * 0.62, lineHeight: starSize * 0.72, color: colors.textOnGold }}>★</Text>
          </View>
        )}
      </View>
      {showName && champion && (
        <Text style={[styles.name, { maxWidth: Math.max(56, size + 16) }]} numberOfLines={1}>
          {champion.name}
        </Text>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  wrapper: { alignItems: 'center' },
  wrapperColumn: { gap: 4 },
  avatar: {
    borderWidth: 2,
    overflow: 'hidden',
  },
  placeholder: {
    backgroundColor: colors.surfaceElevated,
    alignItems: 'center',
    justifyContent: 'center',
  },
  initial: { color: colors.textSecondary, fontWeight: '700' },
  star: {
    position: 'absolute',
    bottom: -2,
    right: -2,
    backgroundColor: colors.gold,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 2,
    borderColor: colors.background,
  },
  name: {
    fontSize: 11,
    color: colors.textSecondary,
    textAlign: 'center',
    overflow: 'hidden',
  },
});
