import React, { useState } from 'react';
import {
  Alert,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useAuth } from '../hooks/useAuth';
import { useChampions } from '../hooks/useChampions';
import { colors, fonts, radius, spacing, typography } from '../lib/theme';
import { Button } from '../components/Button';
import { ChampionPicker } from '../components/ChampionPicker';
import { ChampionAvatar } from '../components/ChampionAvatar';
import { FormField } from '../components/FormField';

export function ProfileScreen() {
  const insets = useSafeAreaInsets();
  const { profile, signOut, updateProfile } = useAuth();
  const { champions } = useChampions();
  const [editing, setEditing] = useState(false);
  const [name, setName]       = useState(profile?.name ?? '');
  const [nickname, setNick]   = useState(profile?.nickname ?? '');
  const [favChamp, setFav]    = useState(profile?.favorite_champion_id ?? null);
  const [loading, setLoading] = useState(false);
  const [error, setError]     = useState<string | null>(null);

  const favoriteChampion = champions.find((c) => c.id === (profile?.favorite_champion_id ?? ''));

  async function save() {
    setLoading(true);
    setError(null);
    const err = await updateProfile({ name, nickname, favorite_champion_id: favChamp });
    setLoading(false);
    if (err) { setError(err); return; }
    setEditing(false);
  }

  function cancelEdit() {
    setName(profile?.name ?? '');
    setNick(profile?.nickname ?? '');
    setFav(profile?.favorite_champion_id ?? null);
    setEditing(false);
    setError(null);
  }

  function confirmSignOut() {
    Alert.alert('Sair', 'Deseja encerrar a sessão?', [
      { text: 'Cancelar', style: 'cancel' },
      { text: 'Sair', style: 'destructive', onPress: signOut },
    ]);
  }

  return (
    <KeyboardAvoidingView style={{ flex: 1 }} behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
      <ScrollView style={styles.root} contentContainerStyle={[styles.content, { paddingTop: insets.top + spacing.sm }]}>
        <Text style={styles.title}>Perfil</Text>

        {/* Identity card */}
        <View style={styles.heroCard}>
          <ChampionAvatar
            champion={favoriteChampion}
            size={80}
            favorite={!!favoriteChampion}
          />
          <View style={{ flex: 1 }}>
            <Text style={styles.heroName}>{profile?.name}</Text>
            <Text style={styles.heroNick}>@{profile?.nickname}</Text>
            {favoriteChampion && (
              <View style={styles.favBadge}>
                <Text style={styles.favBadgeText}>★ Favorita · {favoriteChampion.name}</Text>
              </View>
            )}
          </View>
        </View>

        {/* Actions */}
        {!editing ? (
          <View style={styles.section}>
            <Button label="Editar perfil" onPress={() => setEditing(true)} variant="secondary" />
            <Button label="Sair"          onPress={confirmSignOut}          variant="danger" />
          </View>
        ) : (
          <View style={styles.section}>
            <Text style={typography.h3}>Editar perfil</Text>
            <FormField label="Nome"     value={name}     onChangeText={setName} />
            <FormField label="Nickname" value={nickname} onChangeText={setNick} autoCapitalize="none" />
            <View>
              <Text style={styles.fieldLabel}>Legend favorita</Text>
              <ChampionPicker
                champions={champions}
                value={favChamp}
                onChange={setFav}
                placeholder="Selecionar Legend favorita"
              />
            </View>
            {error ? <Text style={styles.error}>{error}</Text> : null}
            <Button label="Salvar"   onPress={save}       loading={loading} variant="cyan" />
            <Button label="Cancelar" onPress={cancelEdit}                   variant="ghost" />
          </View>
        )}

        {/* About */}
        <View style={styles.aboutSection}>
          <Text style={styles.aboutTitle}>Sobre</Text>
          <Text style={styles.aboutText}>
            Riftbound Tracker é um app não-oficial de diário de partidas para o TCG Riftbound.{'\n\n'}
            Não é afiliado, endossado ou patrocinado pela Riot Games.{'\n\n'}
            Dados de cartas fornecidos por Riftcodex, um projeto de fãs independente.
          </Text>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: colors.background },
  content: { padding: spacing.lg, gap: spacing.lg },
  title: { ...typography.h1 },
  heroCard: {
    backgroundColor: colors.surface,
    borderRadius: radius.lg,
    padding: spacing.lg,
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.md,
    borderWidth: 1,
    borderColor: colors.border,
  },
  heroName: {
    fontSize: 20,
    fontWeight: '700',
    color: colors.textPrimary,
    fontFamily: fonts.display,
  },
  heroNick: { color: colors.gold, fontSize: 14, marginTop: 2 },
  favBadge: {
    marginTop: spacing.sm,
    alignSelf: 'flex-start',
    backgroundColor: colors.gold + '22',
    borderRadius: radius.full,
    paddingHorizontal: 10,
    paddingVertical: 3,
    borderWidth: 1,
    borderColor: colors.gold,
  },
  favBadgeText: { color: colors.gold, fontSize: 11, fontWeight: '700' },
  section: {
    backgroundColor: colors.surface,
    borderRadius: radius.lg,
    padding: spacing.lg,
    gap: spacing.md,
    borderWidth: 1,
    borderColor: colors.border,
  },
  fieldLabel: {
    ...typography.label,
    marginBottom: spacing.xs,
  },
  error: { color: colors.danger, fontSize: 13 },
  aboutSection: {
    backgroundColor: colors.surface,
    borderRadius: radius.lg,
    padding: spacing.lg,
    borderWidth: 1,
    borderColor: colors.border,
  },
  aboutTitle: { ...typography.h3, marginBottom: spacing.sm },
  aboutText: { color: colors.textSecondary, fontSize: 13, lineHeight: 20 },
});
