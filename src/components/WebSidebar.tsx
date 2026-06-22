import React from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { colors, fonts, radius, spacing } from '../lib/theme';

export type TabName = 'Jogar' | 'Partidas' | 'Legends' | 'Perfil';

const NAV_ITEMS: { key: TabName; icon: string; label: string }[] = [
  { key: 'Jogar',    icon: '⚔',  label: 'Jogar' },
  { key: 'Partidas', icon: '📋', label: 'Partidas' },
  { key: 'Legends',  icon: '🏆', label: 'Legends' },
  { key: 'Perfil',   icon: '👤', label: 'Perfil' },
];

interface Props {
  active: TabName;
  onNavigate: (key: TabName) => void;
}

export function WebSidebar({ active, onNavigate }: Props) {
  return (
    <View style={styles.sidebar}>
      <View style={styles.logo}>
        <Text style={styles.logoMark}>⚔</Text>
        <Text style={styles.logoText}>Riftbound</Text>
      </View>

      <View style={styles.divider} />

      <View style={styles.nav}>
        {NAV_ITEMS.map((item) => {
          const isActive = item.key === active;
          return (
            <Pressable
              key={item.key}
              style={({ pressed }) => [
                styles.navItem,
                isActive && styles.navItemActive,
                pressed && styles.navItemPressed,
              ]}
              onPress={() => onNavigate(item.key)}
            >
              {isActive && <View style={styles.activeBar} />}
              <Text style={[styles.navIcon, isActive && styles.navIconActive]}>
                {item.icon}
              </Text>
              <Text style={[styles.navLabel, isActive && styles.navLabelActive]}>
                {item.label}
              </Text>
            </Pressable>
          );
        })}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  sidebar: {
    width: 240,
    backgroundColor: colors.surface,
    borderRightWidth: 1,
    borderRightColor: colors.border,
    paddingTop: spacing.xl,
    paddingHorizontal: spacing.md,
  },
  logo: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
    paddingHorizontal: spacing.sm,
    paddingBottom: spacing.lg,
  },
  logoMark: {
    fontSize: 22,
    color: colors.gold,
    textShadowColor: colors.gold + '66',
    textShadowOffset: { width: 0, height: 0 },
    textShadowRadius: 10,
  },
  logoText: {
    fontSize: 18,
    fontWeight: '700',
    color: colors.gold,
    fontFamily: fonts.display,
    letterSpacing: 1.2,
  },
  divider: {
    height: 1,
    backgroundColor: colors.border,
    marginBottom: spacing.md,
  },
  nav: {
    gap: 2,
  },
  navItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
    paddingVertical: 12,
    paddingHorizontal: spacing.sm,
    paddingLeft: spacing.md,
    borderRadius: radius.md,
    position: 'relative',
    overflow: 'hidden',
  },
  navItemActive: {
    backgroundColor: colors.cyan + '14',
  },
  navItemPressed: {
    backgroundColor: colors.surfaceElevated,
  },
  activeBar: {
    position: 'absolute',
    left: 0,
    top: 8,
    bottom: 8,
    width: 3,
    backgroundColor: colors.cyan,
    borderRadius: radius.full,
    shadowColor: colors.cyan,
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.9,
    shadowRadius: 6,
  },
  navIcon: {
    fontSize: 18,
    color: colors.textMuted,
  },
  navIconActive: {
    textShadowColor: colors.cyan + '99',
    textShadowOffset: { width: 0, height: 0 },
    textShadowRadius: 8,
  },
  navLabel: {
    fontSize: 14,
    fontWeight: '600',
    color: colors.textMuted,
    letterSpacing: 0.4,
    flex: 1,
  },
  navLabelActive: {
    color: colors.cyan,
  },
});
