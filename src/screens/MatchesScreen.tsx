import React, { useState } from 'react';
import {
  Alert,
  FlatList,
  Pressable,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import { useMatches } from '../hooks/useMatches';
import { useChampions } from '../hooks/useChampions';
import { colors, radius, spacing, typography } from '../lib/theme';
import { Match, TOURNAMENT_LABELS } from '../types';
import { ResultBadge } from '../components/ResultBadge';
import { ChampionAvatar } from '../components/ChampionAvatar';
import { Button } from '../components/Button';
import { NewMatchScreen } from './NewMatchScreen';

function MatchCard({ match, findChampion, onDelete }: {
  match: Match;
  findChampion: (id: string) => any;
  onDelete: () => void;
}) {
  const myChamp = findChampion(match.my_champion_id);
  const oppChamps = match.opponent_champion_ids.map(findChampion);
  const date = new Date(match.match_date).toLocaleDateString('pt-BR');

  return (
    <View style={styles.card}>
      <View style={styles.cardHeader}>
        <Text style={styles.cardDate}>{date}</Text>
        <Text style={styles.cardMeta}>{match.mode.toUpperCase()} · {match.match_format.toUpperCase()}</Text>
        <Pressable onPress={() => {
          Alert.alert('Remover partida', 'Deseja remover esta partida do histórico?', [
            { text: 'Cancelar', style: 'cancel' },
            { text: 'Remover', style: 'destructive', onPress: onDelete },
          ]);
        }}>
          <Text style={styles.deleteBtn}>✕</Text>
        </Pressable>
      </View>

      <View style={styles.champRow}>
        <View style={styles.champSide}>
          <ChampionAvatar champion={myChamp} size={44} showName />
          <Text style={styles.sideLabel}>Eu</Text>
        </View>
        <View style={styles.scoreCenter}>
          <Text style={styles.score}>{match.score_summary}</Text>
          <ResultBadge result={match.final_result} />
        </View>
        <View style={styles.champSide}>
          {oppChamps.map((c, i) => (
            <ChampionAvatar key={i} champion={c} size={44} showName />
          ))}
          <Text style={styles.sideLabel}>Oponente</Text>
        </View>
      </View>

      <Text style={styles.tournament}>{TOURNAMENT_LABELS[match.tournament_type]}</Text>
      {match.notes ? <Text style={styles.notes}>{match.notes}</Text> : null}
    </View>
  );
}

export function MatchesScreen() {
  const { matches, loading, deleteMatch } = useMatches();
  const { findById } = useChampions();
  const [showNew, setShowNew] = useState(false);

  if (showNew) {
    return <NewMatchScreen onDone={() => setShowNew(false)} />;
  }

  return (
    <View style={styles.root}>
      <View style={styles.topBar}>
        <Text style={typography.h1}>Partidas</Text>
        <Button label="+ Nova" onPress={() => setShowNew(true)} style={styles.newBtn} />
      </View>

      {matches.length === 0 && !loading ? (
        <View style={styles.empty}>
          <Text style={styles.emptyText}>Nenhuma partida registrada ainda.{'\n'}Toque em "+ Nova" para começar!</Text>
        </View>
      ) : (
        <FlatList
          data={matches}
          keyExtractor={(item) => item.id}
          contentContainerStyle={{ padding: spacing.md, gap: spacing.sm }}
          renderItem={({ item }) => (
            <MatchCard
              match={item}
              findChampion={findById}
              onDelete={() => deleteMatch(item.id)}
            />
          )}
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: colors.background },
  topBar: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: spacing.lg,
    paddingBottom: spacing.sm,
  },
  newBtn: { paddingVertical: spacing.sm, paddingHorizontal: spacing.md },
  empty: { flex: 1, justifyContent: 'center', alignItems: 'center', padding: spacing.xl },
  emptyText: { color: colors.textSecondary, textAlign: 'center', lineHeight: 22, fontSize: 15 },
  card: {
    backgroundColor: colors.surface,
    borderRadius: radius.md,
    padding: spacing.md,
    borderWidth: 1,
    borderColor: colors.border,
    gap: spacing.sm,
  },
  cardHeader: { flexDirection: 'row', alignItems: 'center', gap: spacing.sm },
  cardDate: { color: colors.textPrimary, fontWeight: '600', fontSize: 14 },
  cardMeta: { color: colors.textSecondary, fontSize: 12, flex: 1 },
  deleteBtn: { color: colors.textMuted, fontSize: 16, padding: spacing.xs },
  champRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: spacing.xs,
  },
  champSide: { alignItems: 'center', gap: spacing.xs },
  sideLabel: { color: colors.textMuted, fontSize: 10, textTransform: 'uppercase' },
  scoreCenter: { alignItems: 'center', gap: spacing.xs },
  score: { ...typography.h2, color: colors.primary },
  tournament: { color: colors.textSecondary, fontSize: 12 },
  notes: { color: colors.textSecondary, fontSize: 13, fontStyle: 'italic' },
});
