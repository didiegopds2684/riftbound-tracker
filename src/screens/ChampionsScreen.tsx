import React, { useMemo, useState } from 'react';
import {
  ActivityIndicator,
  FlatList,
  Pressable,
  StyleSheet,
  Text,
  TextInput,
  View,
} from 'react-native';
import { useChampions } from '../hooks/useChampions';
import { useMatches } from '../hooks/useMatches';
import { colors, radius, spacing, typography } from '../lib/theme';
import { ChampionAvatar } from '../components/ChampionAvatar';
import { ResultBadge } from '../components/ResultBadge';
import { ChampionStats } from '../types';

interface ChampionDetailModalProps {
  stats: ChampionStats;
  onClose: () => void;
  allStats: ChampionStats[];
  opponentStats: { champion: ChampionStats['champion']; wins: number; total: number }[];
}

function StatRow({ label, value }: { label: string; value: string | number }) {
  return (
    <View style={detailStyles.statRow}>
      <Text style={detailStyles.statLabel}>{label}</Text>
      <Text style={detailStyles.statValue}>{value}</Text>
    </View>
  );
}

function ChampionDetailView({ stats, onClose, opponentStats }: ChampionDetailModalProps) {
  return (
    <View style={detailStyles.container}>
      <View style={detailStyles.header}>
        <Pressable onPress={onClose} style={detailStyles.backBtn}>
          <Text style={detailStyles.backText}>← Voltar</Text>
        </Pressable>
      </View>

      <View style={detailStyles.heroRow}>
        <ChampionAvatar champion={stats.champion} size={72} />
        <View>
          <Text style={typography.h2}>{stats.champion.name}</Text>
          <Text style={detailStyles.domain}>{stats.champion.domain}</Text>
        </View>
      </View>

      <View style={detailStyles.card}>
        <Text style={detailStyles.cardTitle}>Estatísticas gerais</Text>
        <StatRow label="Total de partidas" value={stats.total} />
        <StatRow label="Vitórias" value={stats.wins} />
        <StatRow label="Derrotas" value={stats.losses} />
        <StatRow label="Empates" value={stats.draws} />
        <StatRow label="Taxa de vitória" value={`${stats.winRate.toFixed(1)}%`} />
      </View>

      {opponentStats.length > 0 && (
        <View style={detailStyles.card}>
          <Text style={detailStyles.cardTitle}>Confrontos por oponente</Text>
          {opponentStats.map((op) => {
            const wr = op.total > 0 ? (op.wins / op.total) * 100 : 0;
            return (
              <View key={op.champion.id} style={detailStyles.opponentRow}>
                <ChampionAvatar champion={op.champion} size={36} />
                <View style={{ flex: 1 }}>
                  <Text style={detailStyles.opponentName}>{op.champion.name}</Text>
                  <Text style={detailStyles.opponentSub}>{op.wins}V / {op.total - op.wins}D em {op.total} partidas</Text>
                </View>
                <Text style={[detailStyles.wr, { color: wr >= 50 ? colors.win : colors.loss }]}>
                  {wr.toFixed(0)}%
                </Text>
              </View>
            );
          })}
        </View>
      )}
    </View>
  );
}

export function ChampionsScreen() {
  const { champions, loading: champsLoading } = useChampions();
  const { matches, loading: matchesLoading } = useMatches();
  const [search, setSearch] = useState('');
  const [selected, setSelected] = useState<ChampionStats | null>(null);

  const statsMap = useMemo(() => {
    const map = new Map<string, { wins: number; losses: number; draws: number }>();
    for (const m of matches) {
      const prev = map.get(m.my_champion_id) ?? { wins: 0, losses: 0, draws: 0 };
      map.set(m.my_champion_id, {
        wins: prev.wins + (m.final_result === 'win' ? 1 : 0),
        losses: prev.losses + (m.final_result === 'loss' ? 1 : 0),
        draws: prev.draws + (m.final_result === 'draw' ? 1 : 0),
      });
    }
    return map;
  }, [matches]);

  const allStats: ChampionStats[] = useMemo(() => {
    const played = Array.from(statsMap.entries()).map(([id, s]) => {
      const champion = champions.find((c) => c.id === id);
      if (!champion) return null;
      const total = s.wins + s.losses + s.draws;
      const winRate = total > 0 ? (s.wins / total) * 100 : 0;
      return { champion, ...s, total, winRate, isMostPlayed: false } as ChampionStats;
    }).filter(Boolean) as ChampionStats[];

    if (played.length === 0) return played;
    const maxPlayed = Math.max(...played.map((s) => s.total));
    return played.map((s) => ({ ...s, isMostPlayed: s.total === maxPlayed }))
      .sort((a, b) => b.total - a.total);
  }, [statsMap, champions]);

  const opponentStatsForSelected = useMemo(() => {
    if (!selected) return [];
    const myMatchesWithChamp = matches.filter((m) => m.my_champion_id === selected.champion.id);
    const oppMap = new Map<string, { wins: number; total: number }>();
    for (const m of myMatchesWithChamp) {
      for (const oppId of m.opponent_champion_ids) {
        const prev = oppMap.get(oppId) ?? { wins: 0, total: 0 };
        oppMap.set(oppId, {
          wins: prev.wins + (m.final_result === 'win' ? 1 : 0),
          total: prev.total + 1,
        });
      }
    }
    return Array.from(oppMap.entries()).map(([id, s]) => {
      const champion = champions.find((c) => c.id === id);
      if (!champion) return null;
      return { champion, ...s };
    }).filter(Boolean).sort((a, b) => b!.total - a!.total) as { champion: ChampionStats['champion']; wins: number; total: number }[];
  }, [selected, matches, champions]);

  const filtered = useMemo(
    () => allStats.filter((s) => s.champion.name.toLowerCase().includes(search.toLowerCase())),
    [allStats, search]
  );

  const loading = champsLoading || matchesLoading;

  if (selected) {
    return (
      <ChampionDetailView
        stats={selected}
        onClose={() => setSelected(null)}
        allStats={allStats}
        opponentStats={opponentStatsForSelected}
      />
    );
  }

  return (
    <View style={styles.root}>
      <Text style={styles.title}>Legends</Text>
      {loading ? (
        <ActivityIndicator color={colors.primary} style={{ marginTop: spacing.xl }} />
      ) : allStats.length === 0 ? (
        <View style={styles.empty}>
          <Text style={styles.emptyText}>Nenhuma Legend registrada ainda.{'\n'}Registre sua primeira partida!</Text>
        </View>
      ) : (
        <>
          <TextInput
            style={styles.search}
            placeholder="Buscar Legend..."
            placeholderTextColor={colors.textMuted}
            value={search}
            onChangeText={setSearch}
          />
          <FlatList
            data={filtered}
            keyExtractor={(item) => item.champion.id}
            contentContainerStyle={{ padding: spacing.md, gap: spacing.sm }}
            renderItem={({ item }) => (
              <Pressable style={styles.card} onPress={() => setSelected(item)}>
                <ChampionAvatar champion={item.champion} size={52} />
                <View style={{ flex: 1 }}>
                  <View style={styles.nameRow}>
                    <Text style={styles.name}>{item.champion.name}</Text>
                    {item.isMostPlayed && (
                      <View style={styles.badge}>
                        <Text style={styles.badgeText}>Mais jogado</Text>
                      </View>
                    )}
                  </View>
                  <Text style={styles.sub}>
                    {item.wins}V / {item.losses}D / {item.draws}E — {item.total} partidas
                  </Text>
                </View>
                <View style={styles.wr}>
                  <Text style={[styles.wrText, { color: item.winRate >= 50 ? colors.win : colors.loss }]}>
                    {item.winRate.toFixed(0)}%
                  </Text>
                  <Text style={styles.wrLabel}>winrate</Text>
                </View>
              </Pressable>
            )}
          />
        </>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: colors.background },
  title: { ...typography.h1, padding: spacing.lg, paddingBottom: spacing.sm },
  empty: { flex: 1, justifyContent: 'center', alignItems: 'center', padding: spacing.xl },
  emptyText: { color: colors.textSecondary, textAlign: 'center', lineHeight: 22, fontSize: 15 },
  search: {
    margin: spacing.md,
    marginTop: 0,
    backgroundColor: colors.surfaceElevated,
    borderRadius: radius.md,
    padding: spacing.md,
    color: colors.textPrimary,
    fontSize: 15,
    borderWidth: 1,
    borderColor: colors.border,
  },
  card: {
    backgroundColor: colors.surface,
    borderRadius: radius.md,
    padding: spacing.md,
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.md,
    borderWidth: 1,
    borderColor: colors.border,
  },
  nameRow: { flexDirection: 'row', alignItems: 'center', gap: spacing.xs, flexWrap: 'wrap' },
  name: { ...typography.body, fontWeight: '600' },
  sub: { ...typography.bodySmall, marginTop: 2 },
  badge: {
    backgroundColor: colors.primary + '22',
    borderRadius: radius.full,
    paddingHorizontal: 8,
    paddingVertical: 2,
  },
  badgeText: { color: colors.primary, fontSize: 10, fontWeight: '700' },
  wr: { alignItems: 'center' },
  wrText: { fontSize: 20, fontWeight: '700' },
  wrLabel: { ...typography.caption },
});

const detailStyles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.background },
  header: { padding: spacing.md, paddingTop: spacing.xl },
  backBtn: { alignSelf: 'flex-start' },
  backText: { color: colors.primary, fontSize: 16 },
  heroRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.md,
    padding: spacing.lg,
    paddingTop: 0,
  },
  domain: { color: colors.textSecondary, fontSize: 13 },
  card: {
    backgroundColor: colors.surface,
    borderRadius: radius.lg,
    padding: spacing.lg,
    margin: spacing.md,
    marginTop: 0,
    borderWidth: 1,
    borderColor: colors.border,
    gap: spacing.sm,
  },
  cardTitle: { ...typography.h3, marginBottom: spacing.xs },
  statRow: { flexDirection: 'row', justifyContent: 'space-between' },
  statLabel: { color: colors.textSecondary, fontSize: 14 },
  statValue: { color: colors.textPrimary, fontSize: 14, fontWeight: '600' },
  opponentRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
    paddingVertical: spacing.xs,
  },
  opponentName: { ...typography.body, fontSize: 14 },
  opponentSub: { ...typography.bodySmall, fontSize: 12 },
  wr: { fontSize: 16, fontWeight: '700' },
});
