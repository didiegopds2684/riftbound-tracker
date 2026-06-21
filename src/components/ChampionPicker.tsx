import React, { useMemo, useState } from 'react';
import {
  FlatList,
  Image,
  Modal,
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
    () =>
      champions.filter((c) => c.name.toLowerCase().includes(search.toLowerCase())),
    [champions, search]
  );

  return (
    <>
      <Pressable style={styles.trigger} onPress={() => setOpen(true)}>
        {selected ? (
          <View style={styles.selectedRow}>
            <ChampionAvatar champion={selected} size={32} />
            <Text style={styles.selectedName}>{selected.name}</Text>
          </View>
        ) : (
          <Text style={styles.placeholder}>{placeholder}</Text>
        )}
        <Text style={styles.chevron}>›</Text>
      </Pressable>

      <Modal visible={open} animationType="slide" presentationStyle="pageSheet">
        <View style={styles.modal}>
          <View style={styles.modalHeader}>
            <Text style={typography.h3}>Escolher Legend</Text>
            <Pressable onPress={() => setOpen(false)}>
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
          <FlatList
            data={filtered}
            keyExtractor={(item) => item.id}
            contentContainerStyle={{ padding: spacing.md }}
            renderItem={({ item }) => (
              <Pressable
                style={[styles.item, item.id === value && styles.itemSelected]}
                onPress={() => {
                  onChange(item.id);
                  setOpen(false);
                  setSearch('');
                }}
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
  },
  selectedRow: { flexDirection: 'row', alignItems: 'center', gap: spacing.sm },
  selectedName: { ...typography.body, flex: 1 },
  placeholder: { color: colors.textMuted, fontSize: 15 },
  chevron: { color: colors.textMuted, fontSize: 20 },
  modal: { flex: 1, backgroundColor: colors.background },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: spacing.lg,
    paddingTop: spacing.xl,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  closeBtn: { color: colors.textSecondary, fontSize: 20, padding: spacing.sm },
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
  item: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.md,
    padding: spacing.md,
    borderRadius: radius.md,
    marginBottom: spacing.xs,
  },
  itemSelected: { backgroundColor: colors.surfaceElevated },
  itemName: { ...typography.body },
  itemDomain: { ...typography.bodySmall },
  check: { color: colors.primary, fontSize: 18, fontWeight: '700' },
});
