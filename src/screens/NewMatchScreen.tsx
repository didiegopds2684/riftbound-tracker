import React, { useState } from 'react';
import {
  KeyboardAvoidingView,
  Platform,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
} from 'react-native';
import { useMatches, CreateMatchInput } from '../hooks/useMatches';
import { useChampions } from '../hooks/useChampions';
import { colors, radius, spacing, typography } from '../lib/theme';
import { GameResult, MatchFormat, MatchMode, TournamentType, TOURNAMENT_LABELS } from '../types';
import { Button } from '../components/Button';
import { ChampionPicker } from '../components/ChampionPicker';

function SegmentControl<T extends string>({
  label,
  options,
  value,
  onChange,
}: {
  label: string;
  options: { value: T; label: string }[];
  value: T;
  onChange: (v: T) => void;
}) {
  return (
    <View style={seg.container}>
      <Text style={seg.label}>{label}</Text>
      <View style={seg.row}>
        {options.map((opt) => (
          <Pressable
            key={opt.value}
            style={[seg.option, opt.value === value && seg.optionActive]}
            onPress={() => onChange(opt.value)}
          >
            <Text style={[seg.optionText, opt.value === value && seg.optionTextActive]}>
              {opt.label}
            </Text>
          </Pressable>
        ))}
      </View>
    </View>
  );
}

function ResultSelector({ value, onChange }: { value: GameResult | null; onChange: (r: GameResult) => void }) {
  const options: { v: GameResult; label: string; color: string }[] = [
    { v: 'win', label: 'Vitória', color: colors.win },
    { v: 'draw', label: 'Empate', color: colors.draw },
    { v: 'loss', label: 'Derrota', color: colors.loss },
  ];
  return (
    <View style={res.row}>
      {options.map((opt) => (
        <Pressable
          key={opt.v}
          style={[res.btn, value === opt.v && { backgroundColor: opt.color + '33', borderColor: opt.color }]}
          onPress={() => onChange(opt.v)}
        >
          <Text style={[res.text, value === opt.v && { color: opt.color }]}>{opt.label}</Text>
        </Pressable>
      ))}
    </View>
  );
}

const TOURNAMENT_OPTIONS = Object.entries(TOURNAMENT_LABELS).map(([value, label]) => ({ value: value as TournamentType, label }));

export function NewMatchScreen({ onDone }: { onDone: () => void }) {
  const { createMatch } = useMatches();
  const { champions } = useChampions();

  const [mode, setMode] = useState<MatchMode>('1v1');
  const [format, setFormat] = useState<MatchFormat>('bo1');
  const [date, setDate] = useState(new Date().toISOString().split('T')[0]);
  const [myChampion, setMyChampion] = useState<string | null>(null);
  const [partnerChampion, setPartnerChampion] = useState<string | null>(null);
  const [oppChampions, setOppChampions] = useState<(string | null)[]>([null]);
  const [game1, setGame1] = useState<GameResult | null>(null);
  const [game2, setGame2] = useState<GameResult | null>(null);
  const [game3, setGame3] = useState<GameResult | null>(null);
  const [tournament, setTournament] = useState<TournamentType>('casual');
  const [notes, setNotes] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [tournamentOpen, setTournamentOpen] = useState(false);

  const showGame3 = format === 'bo3' && game1 !== null && game2 !== null && game1 !== game2;
  const numOpponents = mode === '1v1' ? 1 : 2;

  function updateOppChampion(index: number, id: string) {
    const next = [...oppChampions];
    while (next.length <= index) next.push(null);
    next[index] = id;
    setOppChampions(next);
  }

  async function submit() {
    if (!myChampion) { setError('Selecione seu Champion.'); return; }
    if (oppChampions.some((c) => !c)) { setError('Selecione o(s) Champion(s) do(s) oponente(s).'); return; }
    if (!game1) { setError('Defina o resultado do Game 1.'); return; }
    if (format === 'bo3' && !game2) { setError('Defina o resultado do Game 2.'); return; }

    const games: { game_number: number; result: GameResult }[] = [{ game_number: 1, result: game1 }];
    if (format === 'bo3') {
      games.push({ game_number: 2, result: game2! });
      if (showGame3 && game3) games.push({ game_number: 3, result: game3 });
    }

    const input: CreateMatchInput = {
      mode,
      match_format: format,
      match_date: date,
      my_champion_id: myChampion,
      partner_champion_id: partnerChampion ?? undefined,
      opponent_champion_ids: oppChampions.filter(Boolean) as string[],
      tournament_type: tournament,
      notes: notes.trim() || undefined,
      games,
    };

    setLoading(true);
    setError(null);
    const err = await createMatch(input);
    setLoading(false);
    if (err) { setError(err); return; }
    onDone();
  }

  return (
    <KeyboardAvoidingView style={{ flex: 1 }} behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
      <View style={styles.topBar}>
        <Pressable onPress={onDone}><Text style={styles.back}>← Cancelar</Text></Pressable>
        <Text style={typography.h3}>Nova Partida</Text>
        <View style={{ width: 80 }} />
      </View>

      <ScrollView style={styles.root} contentContainerStyle={styles.content}>
        <SegmentControl
          label="Modo"
          options={[{ value: '1v1', label: '1v1' }, { value: '2v2', label: '2v2' }]}
          value={mode}
          onChange={(v) => {
            setMode(v);
            setOppChampions(v === '2v2' ? [null, null] : [null]);
          }}
        />

        <SegmentControl
          label="Formato"
          options={[{ value: 'bo1', label: 'Bo1' }, { value: 'bo3', label: 'Bo3' }]}
          value={format}
          onChange={setFormat}
        />

        <View style={styles.field}>
          <Text style={styles.fieldLabel}>Data da partida</Text>
          <TextInput
            style={styles.input}
            value={date}
            onChangeText={setDate}
            placeholder="AAAA-MM-DD"
            placeholderTextColor={colors.textMuted}
          />
        </View>

        <View style={styles.field}>
          <Text style={styles.fieldLabel}>Minha Legend</Text>
          <ChampionPicker champions={champions} value={myChampion} onChange={setMyChampion} />
        </View>

        {mode === '2v2' && (
          <View style={styles.field}>
            <Text style={styles.fieldLabel}>Legend do parceiro</Text>
            <ChampionPicker
              champions={champions}
              value={partnerChampion}
              onChange={setPartnerChampion}
              placeholder="Selecionar (opcional)"
            />
          </View>
        )}

        {Array.from({ length: numOpponents }).map((_, i) => (
          <View key={i} style={styles.field}>
            <Text style={styles.fieldLabel}>Legend do oponente {numOpponents > 1 ? i + 1 : ''}</Text>
            <ChampionPicker
              champions={champions}
              value={oppChampions[i] ?? null}
              onChange={(id) => updateOppChampion(i, id)}
            />
          </View>
        ))}

        <View style={styles.field}>
          <Text style={styles.fieldLabel}>Game 1</Text>
          <ResultSelector value={game1} onChange={setGame1} />
        </View>

        {format === 'bo3' && (
          <View style={styles.field}>
            <Text style={styles.fieldLabel}>Game 2</Text>
            <ResultSelector value={game2} onChange={setGame2} />
          </View>
        )}

        {showGame3 && (
          <View style={styles.field}>
            <Text style={styles.fieldLabel}>Game 3 (decisivo)</Text>
            <ResultSelector value={game3} onChange={setGame3} />
          </View>
        )}

        <View style={styles.field}>
          <Text style={styles.fieldLabel}>Tipo de torneio</Text>
          <Pressable style={styles.select} onPress={() => setTournamentOpen(!tournamentOpen)}>
            <Text style={styles.selectText}>{TOURNAMENT_LABELS[tournament]}</Text>
            <Text style={styles.chevron}>{tournamentOpen ? '▲' : '▼'}</Text>
          </Pressable>
          {tournamentOpen && (
            <View style={styles.dropdown}>
              {TOURNAMENT_OPTIONS.map((opt) => (
                <Pressable
                  key={opt.value}
                  style={[styles.dropdownItem, opt.value === tournament && styles.dropdownItemActive]}
                  onPress={() => { setTournament(opt.value); setTournamentOpen(false); }}
                >
                  <Text style={[styles.dropdownText, opt.value === tournament && styles.dropdownTextActive]}>
                    {opt.label}
                  </Text>
                </Pressable>
              ))}
            </View>
          )}
        </View>

        <View style={styles.field}>
          <Text style={styles.fieldLabel}>Observações (opcional)</Text>
          <TextInput
            style={[styles.input, { minHeight: 80, textAlignVertical: 'top' }]}
            value={notes}
            onChangeText={setNotes}
            placeholder="Notas sobre a partida..."
            placeholderTextColor={colors.textMuted}
            multiline
          />
        </View>

        {error && <Text style={styles.error}>{error}</Text>}

        <Button label="Salvar partida" onPress={submit} loading={loading} />
        <View style={{ height: spacing.xl }} />
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: colors.background },
  topBar: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: spacing.md,
    paddingTop: spacing.lg,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  back: { color: colors.primary, fontSize: 15 },
  content: { padding: spacing.lg, gap: spacing.lg },
  field: { gap: spacing.xs },
  fieldLabel: { ...typography.label, textTransform: 'uppercase', letterSpacing: 0.5 },
  input: {
    backgroundColor: colors.surfaceElevated,
    borderRadius: radius.md,
    padding: spacing.md,
    color: colors.textPrimary,
    fontSize: 15,
    borderWidth: 1,
    borderColor: colors.border,
  },
  select: {
    backgroundColor: colors.surfaceElevated,
    borderRadius: radius.md,
    padding: spacing.md,
    flexDirection: 'row',
    justifyContent: 'space-between',
    borderWidth: 1,
    borderColor: colors.border,
  },
  selectText: { color: colors.textPrimary, fontSize: 15 },
  chevron: { color: colors.textMuted },
  dropdown: {
    backgroundColor: colors.surfaceElevated,
    borderRadius: radius.md,
    borderWidth: 1,
    borderColor: colors.border,
    overflow: 'hidden',
  },
  dropdownItem: { padding: spacing.md },
  dropdownItemActive: { backgroundColor: colors.border },
  dropdownText: { color: colors.textPrimary, fontSize: 15 },
  dropdownTextActive: { color: colors.primary, fontWeight: '600' },
  error: { color: colors.danger, fontSize: 13, textAlign: 'center' },
});

const seg = StyleSheet.create({
  container: { gap: spacing.xs },
  label: { ...typography.label, textTransform: 'uppercase', letterSpacing: 0.5 },
  row: { flexDirection: 'row', gap: spacing.xs },
  option: {
    flex: 1,
    backgroundColor: colors.surfaceElevated,
    borderRadius: radius.md,
    padding: spacing.md,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: colors.border,
  },
  optionActive: { backgroundColor: colors.primary + '22', borderColor: colors.primary },
  optionText: { color: colors.textSecondary, fontWeight: '600' },
  optionTextActive: { color: colors.primary },
});

const res = StyleSheet.create({
  row: { flexDirection: 'row', gap: spacing.xs },
  btn: {
    flex: 1,
    padding: spacing.md,
    borderRadius: radius.md,
    alignItems: 'center',
    backgroundColor: colors.surfaceElevated,
    borderWidth: 1,
    borderColor: colors.border,
  },
  text: { color: colors.textSecondary, fontWeight: '600', fontSize: 14 },
});
