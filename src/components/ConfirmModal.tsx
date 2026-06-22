import React from 'react';
import { Modal, Platform, Pressable, StyleSheet, Text, View } from 'react-native';
import { colors, fonts, radius, spacing } from '../lib/theme';
import { Button } from './Button';

interface Props {
  visible: boolean;
  title: string;
  message?: string;
  confirmLabel?: string;
  cancelLabel?: string;
  variant?: 'danger' | 'cyan';
  onConfirm: () => void;
  onCancel: () => void;
}

export function ConfirmModal({
  visible,
  title,
  message,
  confirmLabel = 'Confirmar',
  cancelLabel = 'Cancelar',
  variant = 'danger',
  onConfirm,
  onCancel,
}: Props) {
  // On web, Modal renders as a full-screen overlay — works for confirm dialogs.
  // Wrap inner card in a Pressable so taps inside don't close the modal.
  return (
    <Modal
      visible={visible}
      transparent
      animationType="fade"
      onRequestClose={onCancel}
      statusBarTranslucent
    >
      <Pressable style={styles.backdrop} onPress={onCancel}>
        <Pressable style={styles.card} onPress={() => {}}>
          <View style={[styles.iconCircle, variant === 'danger' ? styles.iconDanger : styles.iconCyan]}>
            <Text style={styles.iconText}>{variant === 'danger' ? '✕' : '⚔'}</Text>
          </View>

          <Text style={styles.title}>{title}</Text>
          {message ? <Text style={styles.message}>{message}</Text> : null}

          <View style={styles.buttons}>
            <Button
              label={cancelLabel}
              onPress={onCancel}
              variant="ghost"
              style={styles.btn}
            />
            <Button
              label={confirmLabel}
              onPress={onConfirm}
              variant={variant}
              style={styles.btn}
            />
          </View>
        </Pressable>
      </Pressable>
    </Modal>
  );
}

const styles = StyleSheet.create({
  backdrop: {
    flex: 1,
    backgroundColor: 'rgba(1,10,21,0.75)',
    alignItems: 'center',
    justifyContent: 'center',
    padding: spacing.xl,
  },
  card: {
    width: '100%',
    maxWidth: Platform.OS === 'web' ? 400 : undefined,
    backgroundColor: colors.surface,
    borderRadius: radius.lg,
    borderWidth: 1,
    borderColor: colors.borderStrong,
    padding: spacing.xl,
    alignItems: 'center',
    gap: spacing.md,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.5,
    shadowRadius: 24,
    elevation: 12,
  },
  iconCircle: {
    width: 52,
    height: 52,
    borderRadius: 26,
    borderWidth: 1.5,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: spacing.xs,
  },
  iconDanger: {
    backgroundColor: colors.danger + '18',
    borderColor: colors.danger + '88',
  },
  iconCyan: {
    backgroundColor: colors.cyan + '18',
    borderColor: colors.cyan + '88',
  },
  iconText: {
    fontSize: 20,
    color: colors.textPrimary,
  },
  title: {
    fontSize: 18,
    fontWeight: '700',
    color: colors.textPrimary,
    fontFamily: fonts.display,
    letterSpacing: 0.4,
    textAlign: 'center',
  },
  message: {
    fontSize: 14,
    color: colors.textSecondary,
    textAlign: 'center',
    lineHeight: 20,
  },
  buttons: {
    flexDirection: 'row',
    gap: spacing.sm,
    width: '100%',
    marginTop: spacing.xs,
  },
  btn: { flex: 1 },
});
