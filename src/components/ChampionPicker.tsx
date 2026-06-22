import React, { useMemo, useState } from 'react';
import {
  FlatList,
  Modal,
  Platform,
  Pressable,
  StyleSheet,
  Text,
  TextInput,
  View,
} from 'react-native';
import { Champion } from '../types';
import { colors, radius, spacing, typography } from '../lib/theme';
import { ChampionAvatar } from './ChampionAvatar';

interface Props {
  champions: Champion[];
  value: string | null;
  onChange: (id: string) => void;
  placeholder?: string;
}

export function ChampionPicker({ champions, value, onChange, placeholder = 'Selecionar Legend' }: Props) {
  const [open, setOpen] = useState(false);
  const [search, setSearch] = useState('');

  const selected = champions.find((c) => c.id === value);

  const filtered = useMemo(
    () => champions.filter((c) => c.name.toLowerCase().includes(search.toLowerCase())),
    [champions, search]
  );

  function close() {
    setOpen(false);
    setSearch('');
  }

  function pick(id: string) {
    onChange(id);
    close();
  }

  const triggerEl = (
    <Pressable
      style={({ pressed }) => [styles.trigger, open && styles.triggerOpen, pressed && styles.triggerPressed]}
      onPress={() => setOpen((v) => !v)}
    >
      {selected ? (
        <View style={styles.selectedRow}>
          <ChampionAvatar champion={selected} size={32} />
          <Text style={styles.selectedName}>{selected.name}</Text>
          <Text style={styles.selectedDomain}>{selected.domain}</Text>
        </View>
      ) : (
        <Text style={styles.placeholder}>{placeholder}</Text>
      )}
      <Text style={[styles.chevron, open && styles.chevronOpen]}>›</Text>
    </Pressable>
  );

  const listEl = (
    <FlatList
      data={filtered}
      keyExtractor={(item) => item.id}
      keyboardShouldPersistTaps="handled"
      contentContainerStyle={styles.listContent}
      renderItem={({ item }) => (
        <Pressable
          style={({ pressed }) => [
            styles.item,
            item.id === value && styles.itemSelected,
            pressed && styles.itemPressed,
          ]}
          onPress={() => pick(item.id)}
        >
          <ChampionAvatar champion={item} size={40} />
          <View style={{ flex: 1 }}>
            <Text style={styles.itemName}>{item.name}</Text>
            <Text style={styles.itemDomain}>{item.domain}</Text>
          </View>
          {item.id === value && <Text style={styles.check}>✓</Text>}
        </Pressable>
      )}
    />
  );

  // ── Web: inline dropdown (no absolute — ScrollView would clip it) ─────────
  if (Platform.OS === 'web') {
    return (
      <View>
        {triggerEl}

        {open && (
          <View style={styles.webDropdown}>
            <TextInput
              style={styles.webSearch}
              placeholder="Buscar Legend..."
              placeholderTextColor={colors.textMuted}
              value={search}
              onChangeText={setSearch}
              autoFocus
            />
            <View style={{ maxHeight: 260 }}>
              {listEl}
            </View>
          </View>
        )}
      </View>
    );
  }

  // ── Mobile: full-screen modal sheet ───────────────────────────────────────
  return (
    <>
      {triggerEl}

      <Modal visible={open} animationType="slide" presentationStyle="pageSheet">
        <View style={styles.modal}>
          <View style={styles.modalHeader}>
            <Text style={typography.h3}>Escolher Legend</Text>
            <Pressable onPress={close} style={styles.closeHit}>
              <Text style={styles.closeBtn}>✕</Text>
            </Pressable>
          </View>
          <TextInput
            style={styles.search}
            placeholder="Buscar..."
            placeholderTextColor={colors.textMuted}
            value={search}
            onChangeText={setSearch}
            autoFocus
          />
          {listEl}
        </View>
      </Modal>
    </>
  );
}

const styles = StyleSheet.create({
  trigger: {
    backgroundColor: colors.surfaceElevated,
    borderRadius: radius.md,
    padding: spacing.md,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    borderWidth: 1,
    borderColor: colors.border,
    minHeight: 52,
  },
  triggerOpen:    { borderColor: colors.cyan },
  triggerPressed: { borderColor: colors.cyan },
  selectedRow:   { flexDirection: 'row', alignItems: 'center', gap: spacing.sm, flex: 1 },
  selectedName:  { ...typography.body, flex: 1 },
  selectedDomain:{ fontSize: 11, color: colors.textMuted, marginRight: spacing.sm },
  placeholder:   { color: colors.textMuted, fontSize: 15 },
  chevron:       { color: colors.textMuted, fontSize: 20, transform: [{ rotate: '0deg' }] },
  chevronOpen:   { color: colors.cyan, transform: [{ rotate: '90deg' }] },

  // ── Web dropdown ──────────────────────────────────────────────────────────
  webDropdown: {
    marginTop: 4,
    backgroundColor: colors.surface,
    borderRadius: radius.md,
    borderWidth: 1,
    borderColor: colors.borderStrong,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
  },
  webSearch: {
    margin: spacing.sm,
    backgroundColor: colors.surfaceElevated,
    borderRadius: radius.sm,
    padding: spacing.sm,
    paddingHorizontal: spacing.md,
    color: colors.textPrimary,
    fontSize: 14,
    borderWidth: 1,
    borderColor: colors.border,
  },

  // ── List ──────────────────────────────────────────────────────────────────
  listContent: { padding: spacing.sm, gap: 2 },
  item: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.md,
    padding: spacing.sm,
    paddingHorizontal: spacing.md,
    borderRadius: radius.sm,
    borderWidth: 1,
    borderColor: 'transparent',
  },
  itemSelected: { backgroundColor: colors.surfaceElevated, borderColor: colors.cyan },
  itemPressed:  { backgroundColor: colors.surfaceElevated },
  itemName:     { ...typography.body },
  itemDomain:   { ...typography.bodySmall },
  check:        { color: colors.cyan, fontSize: 18, fontWeight: '700' },

  // ── Mobile modal ──────────────────────────────────────────────────────────
  modal:       { flex: 1, backgroundColor: colors.background },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: spacing.lg,
    paddingTop: spacing.xl,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  closeHit: { padding: spacing.sm },
  closeBtn: { color: colors.textSecondary, fontSize: 20 },
  search: {
    margin: spacing.md,
    backgroundColor: colors.surfaceElevated,
    borderRadius: radius.md,
    padding: spacing.md,
    color: colors.textPrimary,
    fontSize: 15,
    borderWidth: 1,
    borderColor: colors.border,
  },
});
