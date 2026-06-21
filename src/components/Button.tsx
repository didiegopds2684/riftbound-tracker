import React from 'react';
import { ActivityIndicator, Pressable, StyleSheet, Text, ViewStyle } from 'react-native';
import { colors, radius, spacing } from '../lib/theme';

interface Props {
  label: string;
  onPress: () => void;
  variant?: 'primary' | 'secondary' | 'danger' | 'ghost';
  loading?: boolean;
  disabled?: boolean;
  style?: ViewStyle;
}

export function Button({ label, onPress, variant = 'primary', loading, disabled, style }: Props) {
  const vs = variantStyles[variant];
  return (
    <Pressable
      style={({ pressed }) => [
        styles.base,
        vs.bg,
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

const variantStyles = {
  primary: { bg: { backgroundColor: colors.primary }, textColor: '#0A0E1A' },
  secondary: { bg: { backgroundColor: colors.surfaceElevated, borderWidth: 1, borderColor: colors.border }, textColor: colors.textPrimary },
  danger: { bg: { backgroundColor: colors.danger + '22', borderWidth: 1, borderColor: colors.danger }, textColor: colors.danger },
  ghost: { bg: { backgroundColor: 'transparent' }, textColor: colors.textSecondary },
};

const styles = StyleSheet.create({
  base: {
    borderRadius: radius.md,
    paddingVertical: spacing.md,
    paddingHorizontal: spacing.lg,
    alignItems: 'center',
    justifyContent: 'center',
  },
  label: { fontSize: 15, fontWeight: '700' },
  pressed: { opacity: 0.75 },
  disabled: { opacity: 0.5 },
});
