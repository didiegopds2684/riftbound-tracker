import React from 'react';
import { ActivityIndicator, Pressable, StyleSheet, Text, ViewStyle } from 'react-native';
import { colors, radius, spacing } from '../lib/theme';

type Variant = 'primary' | 'cyan' | 'secondary' | 'danger' | 'ghost';

interface Props {
  label: string;
  onPress: () => void;
  variant?: Variant;
  loading?: boolean;
  disabled?: boolean;
  style?: ViewStyle;
}

const variantStyles: Record<Variant, { container: object; textColor: string }> = {
  primary: {
    container: { backgroundColor: colors.gold },
    textColor: colors.textOnGold,
  },
  cyan: {
    container: {
      backgroundColor: '#00bcff1a',
      borderWidth: 1,
      borderColor: colors.cyan,
      shadowColor: colors.cyan,
      shadowOffset: { width: 0, height: 0 },
      shadowOpacity: 0.5,
      shadowRadius: 8,
      elevation: 4,
    },
    textColor: colors.cyan,
  },
  secondary: {
    container: {
      backgroundColor: colors.surfaceElevated,
      borderWidth: 1,
      borderColor: colors.borderStrong,
    },
    textColor: colors.textPrimary,
  },
  danger: {
    container: {
      backgroundColor: colors.danger + '22',
      borderWidth: 1,
      borderColor: colors.danger,
    },
    textColor: colors.danger,
  },
  ghost: {
    container: { backgroundColor: 'transparent' },
    textColor: colors.textSecondary,
  },
};

export function Button({ label, onPress, variant = 'primary', loading, disabled, style }: Props) {
  const vs = variantStyles[variant];
  return (
    <Pressable
      style={({ pressed }) => [
        styles.base,
        vs.container,
        pressed && styles.pressed,
        (disabled || loading) && styles.disabled,
        style,
      ]}
      onPress={onPress}
      disabled={disabled || loading}
    >
      {loading ? (
        <ActivityIndicator color={vs.textColor} />
      ) : (
        <Text style={[styles.label, { color: vs.textColor }]}>{label}</Text>
      )}
    </Pressable>
  );
}

const styles = StyleSheet.create({
  base: {
    borderRadius: radius.md,
    paddingVertical: spacing.md,
    paddingHorizontal: spacing.lg,
    alignItems: 'center',
    justifyContent: 'center',
  },
  label: { fontSize: 15, fontWeight: '700', letterSpacing: 0.3 },
  pressed: { opacity: 0.8, transform: [{ scale: 0.97 }] },
  disabled: { opacity: 0.45 },
});
