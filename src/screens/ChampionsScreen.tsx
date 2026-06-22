import React, { useMemo, useState } from 'react';
import {
  ActivityIndicator,
  FlatList,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Image } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useChampions } from '../hooks/useChampions';
import { useMatches } from '../hooks/useMatches';
import { useAuth } from '../hooks/useAuth';
import { colors, fonts, radius, spacing, typography } from '../lib/theme';
import { ChampionAvatar } from '../components/ChampionAvatar';
import { KpiCard } from '../components/KpiCard';
import { MatchupBar } from '../components/MatchupBar';
import { Champion, ChampionStats } from '../types';

const DOMAIN_COLORS: Record<string, string> = {
  Body:      colors.domainBody,
  Calm:      colors.domainCalm,
  Chaos:     colors.domainChaos,
  Fury:      colors.domainFury,
  Mind:      colors.domainMind,
  Order:     colors.domainOrder,
  Colorless: colors.domainColorless,
};

interface OpponentStat {
  champion: Champion;
  wins: number;
  losses: number;
  draws: number;
  total: number;
}

interface DetailProps {
  stats: ChampionStats;
  isFavorite: boolean;
  opponentStats: OpponentStat[];
  onClose: () => void;
}

function MatchupSection({
  title,
  accent,
  rows,
}: {
  title: string;
  accent: string;
  rows: OpponentStat[];
}) {
  return (
    <View style={detailStyles.matchupCard}>
      <View style={detailStyles.matchupHeader}>
        <View style={[detailStyles.accentBar, { backgroundColor: accent }]} />
        <Text style={detailStyles.matchupTitle}>{title}</Text>
      </View>
      {rows.map((r) => (
        <MatchupBar
          key={r.champion.id}
          champion={r.champion}
          wins={r.wins}
          losses={r.losses}
          draws={r.draws}
          total={r.total}
        />
      ))}
    </View>
  );
}

function ChampionDetailView({ stats, isFavorite, opponentStats, onClose }: DetailProps) {
  const insets = useSafeAreaInsets();
  const domainColor = DOMAIN_COLORS[stats.champion.domain] ?? colors.gold;
  const winRate = stats.total > 0 ? Math.round((stats.wins / stats.total) * 100) : 0;

  const ranked = [...opponentStats]
    .map((o) => ({ ...o, wr: o.total > 0 ? o.wins / o.total : 0 }))
    .sort((a, b) => b.wr - a.wr);
  const advantages  = ranked.slice(0, 3);
  const challenges  = [...ranked].reverse().slice(0, 3);

  return (
    <View style={detailStyles.root}>
      <ScrollView showsVerticalScrollIndicator={false}>
        {/* ── Hero header ── */}
        <View style={detailStyles.hero}>
          {stats.champion.image_url ? (
            <Image
              source={{ uri: stats.champion.image_url }}
              style={detailStyles.heroImage}
              resizeMode="cover"
            />
          ) : null}

          <LinearGradient
            colors={[
              'rgba(1,10,21,0.35)',
              'rgba(1,10,21,0.05)',
              'rgba(1,10,21,0.85)',
              '#010a15',
            ]}
            locations={[0, 0.35, 0.8, 1]}
            style={StyleSheet.absoluteFill}
          />

          {/* domain hairline */}
          <View style={[detailStyles.domainLine, { backgroundColor: domainColor }]} />

          {/* back button — top accounts for Dynamic Island / notch */}
          <Pressable style={[detailStyles.backBtn, { top: insets.top + 8 }]} onPress={onClose}>
            <Text style={detailStyles.backBtnText}>←</Text>
          </Pressable>

          {/* bottom overlay: domain pill + name */}
          <View style={detailStyles.heroBottom}>
            <View style={detailStyles.pills}>
              <View style={[detailStyles.domainPill, { borderColor: domainColor }]}>
                <View style={[detailStyles.domainDot, { backgroundColor: domainColor }]} />
                <Text style={detailStyles.domainLabel}>{stats.champion.domain.toUpperCase()}</Text>
              </View>
              {isFavorite && (
                <View style={detailStyles.favBadge}>
                  <Text style={detailStyles.favBadgeText}>★ Favorito</Text>
                </View>
              )}
            </View>
            <Text style={detailStyles.heroName}>{stats.champion.name}</Text>
          </View>
        </View>

        {/* ── KPI grid ── */}
        <View style={detailStyles.body}>
          <View style={detailStyles.kpiRow}>
            <KpiCard
              label="Win Rate"
              value={`${winRate}%`}
              sub={`${stats.wins}V / ${stats.losses}D / ${stats.draws}E`}
              accent={winRate >= 50 ? 'win' : 'loss'}
            />
            <KpiCard
              label="Partidas"
              value={stats.total}
              sub="registradas"
              accent="gold"
            />
          </View>
          <View style={detailStyles.kpiRow}>
            <KpiCard
              label="Vitórias"
              value={stats.wins}
              sub="jogos ganhos"
              accent="win"
            />
            <KpiCard
              label="Derrotas"
              value={stats.losses}
              sub="jogos perdidos"
              accent="loss"
            />
          </View>

          {/* ── Matchups ── */}
          {opponentStats.length > 0 && (
            <>
              <View style={detailStyles.sectionHeader}>
                <Text style={detailStyles.sectionTitle}>Matchups</Text>
                <Text style={detailStyles.sectionSub}>
                  Seu desempenho contra cada Legend rival
                </Text>
              </View>

              {advantages.length > 0 && (
                <MatchupSection
                  title="Top Vantagens"
                  accent={colors.win}
                  rows={advantages}
                />
              )}
              {challenges.length > 0 && (
                <MatchupSection
                  title="Principais Desafios"
                  accent={colors.loss}
                  rows={challenges}
                />
              )}
            </>
          )}

          <View style={{ height: spacing.xl }} />
        </View>
      </ScrollView>
    </View>
  );
}

export function ChampionsScreen() {
  const insets = useSafeAreaInsets();
  const { champions, loading: champsLoading } = useChampions();
  const { matches, loading: matchesLoading } = useMatches();
  const { profile } = useAuth();
  const [search, setSearch]     = useState('');
  const [selected, setSelected] = useState<ChampionStats | null>(null);

  const statsMap = useMemo(() => {
    const map = new Map<string, { wins: number; losses: number; draws: number }>();
    for (const m of matches) {
      const prev = map.get(m.my_champion_id) ?? { wins: 0, losses: 0, draws: 0 };
      map.set(m.my_champion_id, {
        wins:   prev.wins   + (m.final_result === 'win'  ? 1 : 0),
        losses: prev.losses + (m.final_result === 'loss' ? 1 : 0),
        draws:  prev.draws  + (m.final_result === 'draw' ? 1 : 0),
      });
    }
    return map;
  }, [matches]);

  const allStats: ChampionStats[] = useMemo(() => {
    const played = Array.from(statsMap.entries()).map(([id, s]) => {
      const champion = champions.find((c) => c.id === id);
      if (!champion) return null;
      const total   = s.wins + s.losses + s.draws;
      const winRate = total > 0 ? (s.wins / total) * 100 : 0;
      return { champion, ...s, total, winRate, isMostPlayed: false } as ChampionStats;
    }).filter(Boolean) as ChampionStats[];

    if (played.length === 0) return played;
    const maxPlayed = Math.max(...played.map((s) => s.total));
    return played
      .map((s) => ({ ...s, isMostPlayed: s.total === maxPlayed }))
      .sort((a, b) => b.total - a.total);
  }, [statsMap, champions]);

  const opponentStatsForSelected = useMemo((): OpponentStat[] => {
    if (!selected) return [];
    const myMatches = matches.filter((m) => m.my_champion_id === selected.champion.id);
    const oppMap = new Map<string, { wins: number; draws: number; total: number }>();
    for (const m of myMatches) {
      for (const oppId of m.opponent_champion_ids) {
        const prev = oppMap.get(oppId) ?? { wins: 0, draws: 0, total: 0 };
        oppMap.set(oppId, {
          wins:  prev.wins  + (m.final_result === 'win'  ? 1 : 0),
          draws: prev.draws + (m.final_result === 'draw' ? 1 : 0),
          total: prev.total + 1,
        });
      }
    }
    return Array.from(oppMap.entries())
      .map(([id, s]) => {
        const champion = champions.find((c) => c.id === id);
        if (!champion) return null;
        return {
          champion,
          wins:   s.wins,
          draws:  s.draws,
          losses: s.total - s.wins - s.draws,
          total:  s.total,
        };
      })
      .filter(Boolean)
      .sort((a, b) => b!.total - a!.total) as OpponentStat[];
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
        isFavorite={profile?.favorite_champion_id === selected.champion.id}
        opponentStats={opponentStatsForSelected}
        onClose={() => setSelected(null)}
      />
    );
  }

  return (
    <View style={[styles.root, { paddingTop: insets.top }]}>
      <Text style={styles.title}>Legends</Text>

      {loading ? (
        <ActivityIndicator color={colors.cyan} style={{ marginTop: spacing.xl }} />
      ) : allStats.length === 0 ? (
        <View style={styles.empty}>
          <Text style={styles.emptyText}>
            Nenhuma Legend registrada ainda.{'\n'}Registre sua primeira partida!
          </Text>
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
              <Pressable
                style={({ pressed }) => [styles.card, pressed && styles.cardPressed]}
                onPress={() => setSelected(item)}
              >
                <ChampionAvatar
                  champion={item.champion}
                  size={52}
                  favorite={item.champion.id === profile?.favorite_champion_id}
                />
                <View style={{ flex: 1 }}>
                  <View style={styles.nameRow}>
                    <Text style={styles.name}>{item.champion.name}</Text>
                    {item.isMostPlayed && (
                      <View style={styles.badge}>
                        <Text style={styles.badgeText}>Mais jogada</Text>
                      </View>
                    )}
                  </View>
                  <Text style={styles.sub}>
                    {item.wins}V / {item.losses}D / {item.draws}E · {item.total} partidas
                  </Text>
                </View>
                <View style={styles.wrBlock}>
                  <Text
                    style={[
                      styles.wrText,
                      { color: item.winRate >= 50 ? colors.win : colors.loss },
                    ]}
                  >
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

// ── List styles ──────────────────────────────────────────────────────────────
const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: colors.background },
  title: {
    ...typography.h1,
    padding: spacing.lg,
    paddingBottom: spacing.sm,
  },
  empty: { flex: 1, justifyContent: 'center', alignItems: 'center', padding: spacing.xl },
  emptyText: { color: colors.textSecondary, textAlign: 'center', lineHeight: 22, fontSize: 15 },
  search: {
    marginHorizontal: spacing.md,
    marginBottom: spacing.sm,
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
  cardPressed: { borderColor: colors.borderStrong, backgroundColor: colors.surfaceElevated },
  nameRow: { flexDirection: 'row', alignItems: 'center', gap: spacing.xs, flexWrap: 'wrap' },
  name: { ...typography.body, fontWeight: '600' },
  sub: { ...typography.bodySmall, marginTop: 2 },
  badge: {
    backgroundColor: colors.gold + '22',
    borderRadius: radius.full,
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderWidth: 1,
    borderColor: colors.gold,
  },
  badgeText: { color: colors.gold, fontSize: 10, fontWeight: '700' },
  wrBlock: { alignItems: 'center' },
  wrText: { fontSize: 20, fontWeight: '700', fontFamily: fonts.display },
  wrLabel: { ...typography.caption },
});

// ── Detail styles ─────────────────────────────────────────────────────────────
const detailStyles = StyleSheet.create({
  root: { flex: 1, backgroundColor: colors.background },
  hero: {
    height: 300,
    overflow: 'hidden',
    position: 'relative',
    justifyContent: 'flex-end',
  },
  heroImage: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    height: 520,
  },
  domainLine: {
    position: 'absolute',
    left: 0,
    right: 0,
    bottom: 0,
    height: 2,
    opacity: 0.85,
    zIndex: 2,
  },
  backBtn: {
    position: 'absolute',
    top: 16,
    left: 16,
    width: 38,
    height: 38,
    borderRadius: 19,
    backgroundColor: 'rgba(1,10,21,0.55)',
    borderWidth: 1,
    borderColor: colors.borderStrong,
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 10,
  },
  backBtnText: { color: colors.textPrimary, fontSize: 18, lineHeight: 22 },
  heroBottom: {
    position: 'absolute',
    left: spacing.lg,
    right: spacing.lg,
    bottom: spacing.md,
    zIndex: 3,
    gap: spacing.xs,
  },
  pills: { flexDirection: 'row', alignItems: 'center', gap: spacing.sm },
  domainPill: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    paddingHorizontal: 10,
    paddingVertical: 3,
    borderRadius: radius.full,
    backgroundColor: 'rgba(1,10,21,0.5)',
    borderWidth: 1,
  },
  domainDot: { width: 8, height: 8, borderRadius: 4 },
  domainLabel: {
    fontSize: 11,
    fontWeight: '700',
    color: colors.textPrimary,
    letterSpacing: 1.4,
  },
  favBadge: {
    backgroundColor: colors.gold + '22',
    borderRadius: radius.full,
    paddingHorizontal: 10,
    paddingVertical: 3,
    borderWidth: 1,
    borderColor: colors.gold,
  },
  favBadgeText: { color: colors.gold, fontSize: 11, fontWeight: '700' },
  heroName: {
    fontSize: 36,
    fontWeight: '700',
    color: colors.textPrimary,
    fontFamily: fonts.display,
    letterSpacing: 0.6,
    textShadowColor: 'rgba(1,10,21,0.9)',
    textShadowOffset: { width: 0, height: 2 },
    textShadowRadius: 12,
    lineHeight: 42,
  },
  body: { padding: spacing.md, gap: spacing.md },
  kpiRow: { flexDirection: 'row', gap: spacing.md },
  sectionHeader: { marginTop: spacing.xs },
  sectionTitle: {
    fontSize: 20,
    fontWeight: '600',
    color: colors.textPrimary,
    fontFamily: fonts.display,
    letterSpacing: 0.4,
  },
  sectionSub: { fontSize: 12, color: colors.textMuted, marginTop: 2 },
  matchupCard: {
    backgroundColor: colors.surface,
    borderRadius: radius.md,
    padding: spacing.md,
    gap: spacing.md,
    borderWidth: 1,
    borderColor: colors.border,
  },
  matchupHeader: { flexDirection: 'row', alignItems: 'center', gap: spacing.sm },
  accentBar: { width: 4, height: 16, borderRadius: 2 },
  matchupTitle: {
    fontSize: 11,
    fontWeight: '700',
    color: colors.textSecondary,
    textTransform: 'uppercase',
    letterSpacing: 1.4,
  },
});
