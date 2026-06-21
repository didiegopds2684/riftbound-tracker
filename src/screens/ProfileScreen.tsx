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
import { useAuth } from '../hooks/useAuth';
import { useChampions } from '../hooks/useChampions';
import { colors, radius, spacing, typography } from '../lib/theme';
import { Button } from '../components/Button';
import { ChampionPicker } from '../components/ChampionPicker';
import { ChampionAvatar } from '../components/ChampionAvatar';
import { FormField } from '../components/FormField';

export function ProfileScreen() {
  const { profile, signOut, updateProfile } = useAuth();
  const { champions } = useChampions();
  const [editing, setEditing] = useState(false);
  const [name, setName] = useState(profile?.name ?? '');
  const [nickname, setNickname] = useState(profile?.nickname ?? '');
  const [favChamp, setFavChamp] = useState(profile?.favorite_champion_id ?? null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

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
    setNickname(profile?.nickname ?? '');
    setFavChamp(profile?.favorite_champion_id ?? null);
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
      <ScrollView style={styles.root} contentContainerStyle={styles.content}>
        <View style={styles.heroCard}>
          <ChampionAvatar champion={favoriteChampion} size={80} showName={false} />
          <View style={{ flex: 1 }}>
            <Text style={typography.h2}>{profile?.name}</Text>
            <Text style={styles.nick}>@{profile?.nickname}</Text>
            {favoriteChampion && (
              <Text style={styles.favLabel}>Legend favorita: {favoriteChampion.name}</Text>
            )}
          </View>
        </View>

        {!editing ? (
          <View style={styles.section}>
            <Button label="Editar perfil" onPress={() => setEditing(true)} variant="secondary" />
            <Button label="Sair" onPress={confirmSignOut} variant="danger" />
          </View>
        ) : (
          <View style={styles.section}>
            <Text style={typography.h3}>Editar perfil</Text>
            <FormField label="Nome" value={name} onChangeText={setName} />
            <FormField label="Nickname" value={nickname} onChangeText={setNickname} autoCapitalize="none" />
            <View>
              <Text style={styles.fieldLabel}>Legend favorita</Text>
              <ChampionPicker
                champions={champions}
                value={favChamp}
                onChange={setFavChamp}
                placeholder="Selecionar Legend favorita"
              />
            </View>
            {error && <Text style={styles.error}>{error}</Text>}
            <Button label="Salvar" onPress={save} loading={loading} />
            <Button label="Cancelar" onPress={cancelEdit} variant="ghost" />
          </View>
        )}

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
  nick: { color: colors.primary, fontSize: 14, marginTop: 2 },
  favLabel: { color: colors.textSecondary, fontSize: 12, marginTop: 4 },
  section: {
    backgroundColor: colors.surface,
    borderRadius: radius.lg,
    padding: spacing.lg,
    gap: spacing.md,
    borderWidth: 1,
    borderColor: colors.border,
  },
  fieldLabel: { ...typography.label, textTransform: 'uppercase', letterSpacing: 0.5, marginBottom: spacing.xs },
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
