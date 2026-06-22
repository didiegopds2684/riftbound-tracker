import React, { useMemo, useState } from 'react';
import {
  Alert,
  Pressable,
  SectionList,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useMatches } from '../hooks/useMatches';
import { useChampions } from '../hooks/useChampions';
import { colors, fonts, radius, spacing, typography } from '../lib/theme';
import { Champion, Match, MatchFormat, MatchMode, TournamentType, TOURNAMENT_LABELS } from '../types';
import { ChampionAvatar } from '../components/ChampionAvatar';
import { Button } from '../components/Button';
import { NewMatchScreen } from './NewMatchScreen';

// ── Match card (portrait, fixed width for horizontal scroll) ─────────────────

const CARD_WIDTH = 148;

function MatchCard({
  match,
  findChampion,
  onDelete,
}: {
  match: Match;
  findChampion: (id: string) => Champion | undefined;
  onDelete: () => void;
}) {
  const myChamp  = findChampion(match.my_champion_id);
  const oppChamp = findChampion(match.opponent_champion_ids[0]);

  const resultColor = colors[match.final_result];
  const resultLabel = { win: 'VITÓRIA', loss: 'DERROTA', draw: 'EMPATE' }[match.final_result];

  function confirmDelete() {
    Alert.alert('Remover partida', 'Deseja remover esta partida?', [
      { text: 'Cancelar', style: 'cancel' },
      { text: 'Remover', style: 'destructive', onPress: onDelete },
    ]);
  }

  return (
    <View style={card.container}>
      {/* Visible delete button */}
      <Pressable style={card.deleteBtn} onPress={confirmDelete} hitSlop={8}>
        <Text style={card.deleteTxt}>✕</Text>
      </Pressable>

      {/* My champion — top */}
      <View style={card.playerSlot}>
        <ChampionAvatar champion={myChamp} size={48} />
        <Text style={card.champName} numberOfLines={1}>{myChamp?.name ?? '—'}</Text>
        <Text style={card.sideLabel}>Eu</Text>
      </View>

      {/* Divider */}
      <View style={card.divider} />

      {/* Score + result — center */}
      <View style={card.scoreBlock}>
        <Text style={card.score}>{match.score_summary}</Text>
        <Text style={[card.result, { color: resultColor }]}>{resultLabel}</Text>
        <Text style={card.meta}>{match.mode.toUpperCase()} · {match.match_format.toUpperCase()}</Text>
      </View>

      {/* Divider */}
      <View style={card.divider} />

      {/* Opponent champion — bottom */}
      <View style={card.playerSlot}>
        <ChampionAvatar champion={oppChamp} size={48} />
        <Text style={card.champName} numberOfLines={1}>{oppChamp?.name ?? '—'}</Text>
        <Text style={card.sideLabel}>Oponente</Text>
      </View>
    </View>
  );
}

// ── Horizontal arrow connector ───────────────────────────────────────────────

function NextArrow() {
  return (
    <View style={arrow.wrapper}>
      <Text style={arrow.text}>→</Text>
    </View>
  );
}

// ── Day section header ────────────────────────────────────────────────────────

function DaySectionHeader({
  date,
  matches,
  onNewMatch,
}: {
  date: string;
  matches: Match[];
  onNewMatch: () => void;
}) {
  const d = new Date(date + 'T12:00:00');
  const formattedDate = d
    .toLocaleDateString('pt-BR', { day: '2-digit', month: 'short', year: 'numeric' })
    .toUpperCase()
    .replace(/\./g, '');

  const uniqueTypes = [...new Set(matches.map((m) => TOURNAMENT_LABELS[m.tournament_type]))];
  const typeLabel =
    uniqueTypes.length === 1 ? uniqueTypes[0] : `${uniqueTypes[0]} +${uniqueTypes.length - 1}`;

  return (
    <View style={day.wrapper}>
      <View style={day.headerRow}>
        <View style={day.divider} />
        <Text style={day.diamond}>◆</Text>
        <Text style={day.date}>{formattedDate}</Text>
        <Text style={day.diamond}>◆</Text>
        <View style={day.divider} />
        <Pressable style={day.newBtn} onPress={onNewMatch}>
          <Text style={day.newBtnTxt}>+ Nova</Text>
        </Pressable>
      </View>
      <Text style={day.meta}>
        {typeLabel} · {matches.length} partida{matches.length !== 1 ? 's' : ''}
      </Text>
    </View>
  );
}

// ── Day row (horizontal scroll) ───────────────────────────────────────────────

function DayRow({
  matches,
  findChampion,
  onDelete,
}: {
  matches: Match[];
  findChampion: (id: string) => Champion | undefined;
  onDelete: (id: string) => void;
}) {
  return (
    <ScrollView
      horizontal
      showsHorizontalScrollIndicator={false}
      contentContainerStyle={row.content}
    >
      {matches.map((match, index) => (
        <View key={match.id} style={row.item}>
          <MatchCard
            match={match}
            findChampion={findChampion}
            onDelete={() => onDelete(match.id)}
          />
          {index < matches.length - 1 && <NextArrow />}
        </View>
      ))}
    </ScrollView>
  );
}

// ── Section data type ─────────────────────────────────────────────────────────

type Section = { date: string; data: [Match[]] };

interface NewMatchConfig {
  date: Date;
  mode: MatchMode;
  format: MatchFormat;
  tournament: TournamentType;
}

// ── Main screen ───────────────────────────────────────────────────────────────

export function MatchesScreen() {
  const insets = useSafeAreaInsets();
  const { matches, loading, deleteMatch } = useMatches();
  const { findById } = useChampions();
  const [newConfig, setNewConfig] = useState<NewMatchConfig | null>(null);

  // Group by date; each section has one "row" item (the full day's array)
  const sections: Section[] = useMemo(() => {
    const map = new Map<string, Match[]>();
    for (const m of matches) {
      const key = (m.match_date as string).split('T')[0];
      if (!map.has(key)) map.set(key, []);
      map.get(key)!.push(m);
    }
    return [...map.entries()]
      .sort(([a], [b]) => b.localeCompare(a))
      .map(([date, dayMatches]) => ({ date, data: [dayMatches] }));
  }, [matches]);

  function openNewForDay(date: string, dayMatches: Match[]) {
    const first = dayMatches[0];
    setNewConfig({
      date: new Date(date + 'T12:00:00'),
      mode: first?.mode ?? '1v1',
      format: first?.match_format ?? 'bo3',
      tournament: first?.tournament_type ?? 'casual',
    });
  }

  function openNewDefault() {
    setNewConfig({ date: new Date(), mode: '1v1', format: 'bo3', tournament: 'casual' });
  }

  if (newConfig) {
    return (
      <NewMatchScreen
        onDone={() => setNewConfig(null)}
        initialDate={newConfig.date}
        initialMode={newConfig.mode}
        initialFormat={newConfig.format}
        initialTournament={newConfig.tournament}
      />
    );
  }

  return (
    <View style={styles.root}>
      <View style={[styles.topBar, { paddingTop: insets.top + spacing.sm }]}>
        <Text style={styles.title}>Partidas</Text>
        <Button label="+ Nova" onPress={openNewDefault} style={styles.newBtn} />
      </View>

      {matches.length === 0 && !loading ? (
        <View style={styles.empty}>
          <Text style={styles.emptyText}>
            Nenhuma partida registrada ainda.{'\n'}Toque em "+ Nova" para começar!
          </Text>
        </View>
      ) : (
        <SectionList
          sections={sections}
          keyExtractor={(_, index) => String(index)}
          stickySectionHeadersEnabled={false}
          contentContainerStyle={{ paddingVertical: spacing.md, paddingBottom: spacing.xxl }}
          renderSectionHeader={({ section }) => (
            <DaySectionHeader
              date={section.date}
              matches={section.data[0]}
              onNewMatch={() => openNewForDay(section.date, section.data[0])}
            />
          )}
          renderItem={({ item: dayMatches }) => (
            <DayRow
              matches={dayMatches}
              findChampion={findById}
              onDelete={deleteMatch}
            />
          )}
          SectionSeparatorComponent={() => <View style={{ height: spacing.lg }} />}
        />
      )}
    </View>
  );
}

// ── Styles ────────────────────────────────────────────────────────────────────

const card = StyleSheet.create({
  container: {
    width: CARD_WIDTH,
    backgroundColor: colors.surface,
    borderRadius: radius.md,
    borderWidth: 1,
    borderColor: colors.border,
    padding: spacing.sm,
    paddingTop: spacing.md,  // extra room for delete button
    alignItems: 'center',
    gap: spacing.xs,
  },
  deleteBtn: {
    position: 'absolute',
    top: 4,
    right: 4,
    width: 22,
    height: 22,
    borderRadius: 11,
    backgroundColor: colors.surfaceElevated,
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 1,
  },
  deleteTxt: { color: colors.textMuted, fontSize: 10, fontWeight: '700' },
  playerSlot: { alignItems: 'center', gap: 3, width: '100%' },
  champName: {
    fontSize: 11,
    color: colors.textPrimary,
    fontWeight: '600',
    textAlign: 'center',
    maxWidth: CARD_WIDTH - spacing.md,
  },
  sideLabel: {
    fontSize: 9,
    color: colors.textMuted,
    textTransform: 'uppercase',
    letterSpacing: 1,
  },
  divider: { height: 1, width: '80%', backgroundColor: colors.border },
  scoreBlock: { alignItems: 'center', gap: 2 },
  score: {
    fontSize: 22,
    fontWeight: '700',
    color: colors.gold,
    fontFamily: fonts.display,
    letterSpacing: 0.8,
  },
  result: { fontSize: 10, fontWeight: '700', letterSpacing: 1 },
  meta:   { fontSize: 9, color: colors.textMuted, letterSpacing: 0.6 },
});

const arrow = StyleSheet.create({
  wrapper: { justifyContent: 'center', alignItems: 'center', paddingHorizontal: 6 },
  text: { color: colors.cyan, fontSize: 20, fontWeight: '700' },
});

const row = StyleSheet.create({
  content: { paddingHorizontal: spacing.md, alignItems: 'center' },
  item:    { flexDirection: 'row', alignItems: 'center' },
});

const day = StyleSheet.create({
  wrapper:   { paddingHorizontal: spacing.md, marginBottom: spacing.sm, alignItems: 'center' },
  headerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    width: '100%',
    marginBottom: 4,
  },
  divider:  { flex: 1, height: 1, backgroundColor: colors.borderStrong },
  diamond:  { color: colors.gold, fontSize: 10, marginHorizontal: 6 },
  date: {
    color: colors.gold,
    fontSize: 13,
    fontWeight: '700',
    fontFamily: fonts.display,
    letterSpacing: 1.2,
  },
  meta: { color: colors.textMuted, fontSize: 11, letterSpacing: 0.6 },
  newBtn: {
    marginLeft: spacing.sm,
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: radius.full,
    backgroundColor: colors.cyan + '20',
    borderWidth: 1,
    borderColor: colors.cyan,
  },
  newBtnTxt: { color: colors.cyan, fontSize: 11, fontWeight: '700' },
});

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: colors.background },
  topBar: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: spacing.lg,
    paddingBottom: spacing.sm,
  },
  title:  { ...typography.h1 },
  newBtn: { paddingVertical: spacing.sm, paddingHorizontal: spacing.md },
  empty:  { flex: 1, justifyContent: 'center', alignItems: 'center', padding: spacing.xl },
  emptyText: {
    color: colors.textSecondary,
    textAlign: 'center',
    lineHeight: 22,
    fontSize: 15,
  },
});
