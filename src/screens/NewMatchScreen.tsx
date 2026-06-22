import React, { useState } from 'react';
import {
  KeyboardAvoidingView,
  Modal,
  Platform,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
} from 'react-native';
import DateTimePicker from '@react-native-community/datetimepicker';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useMatches, CreateMatchInput } from '../hooks/useMatches';
import { useChampions } from '../hooks/useChampions';
import { useAuth } from '../hooks/useAuth';
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
        {options.map((opt) => {
          const active = opt.value === value;
          return (
            <Pressable
              key={opt.value}
              style={[seg.option, active && seg.optionActive]}
              onPress={() => onChange(opt.value)}
            >
              <Text style={[seg.optionText, active && seg.optionTextActive]}>
                {opt.label}
              </Text>
            </Pressable>
          );
        })}
      </View>
    </View>
  );
}

function ResultSelector({
  value,
  onChange,
}: {
  value: GameResult | null;
  onChange: (r: GameResult) => void;
}) {
  const options: { v: GameResult; label: string; color: string }[] = [
    { v: 'win',  label: 'Vitória', color: colors.win },
    { v: 'draw', label: 'Empate',  color: colors.draw },
    { v: 'loss', label: 'Derrota', color: colors.loss },
  ];
  return (
    <View style={res.row}>
      {options.map((opt) => {
        const on = value === opt.v;
        return (
          <Pressable
            key={opt.v}
            style={[res.btn, on && { backgroundColor: opt.color + '33', borderColor: opt.color }]}
            onPress={() => onChange(opt.v)}
          >
            <Text style={[res.text, on && { color: opt.color }]}>{opt.label}</Text>
          </Pressable>
        );
      })}
    </View>
  );
}

const TOURNAMENT_OPTIONS = Object.entries(TOURNAMENT_LABELS).map(([value, label]) => ({
  value: value as TournamentType,
  label,
}));

interface NewMatchProps {
  onDone: () => void;
  initialDate?: Date;
  initialMode?: MatchMode;
  initialFormat?: MatchFormat;
  initialTournament?: TournamentType;
}

export function NewMatchScreen({
  onDone,
  initialDate,
  initialMode,
  initialFormat,
  initialTournament,
}: NewMatchProps) {
  const insets = useSafeAreaInsets();
  const { createMatch }  = useMatches();
  const { champions }    = useChampions();
  const { profile }      = useAuth();

  const [mode, setMode]                   = useState<MatchMode>(initialMode ?? '1v1');
  const [format, setFormat]               = useState<MatchFormat>(initialFormat ?? 'bo3');
  const [dateObj, setDateObj]             = useState(initialDate ?? new Date());
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [myChampion, setMyChampion]       = useState<string | null>(profile?.favorite_champion_id ?? null);
  const [partnerChampion, setPartner]     = useState<string | null>(null);
  const [oppChampions, setOppChampions]   = useState<(string | null)[]>(initialMode === '2v2' ? [null, null] : [null]);
  const [game1, setGame1]                 = useState<GameResult | null>(null);
  const [game2, setGame2]                 = useState<GameResult | null>(null);
  const [game3, setGame3]                 = useState<GameResult | null>(null);
  const [tournament, setTournament]       = useState<TournamentType>(initialTournament ?? 'casual');
  const [notes, setNotes]                 = useState('');
  const [loading, setLoading]             = useState(false);
  const [error, setError]                 = useState<string | null>(null);
  const [tournamentOpen, setTournOpen]    = useState(false);

  const showGame3   = format === 'bo3' && game1 !== null && game2 !== null && game1 !== game2;
  const numOpponents = mode === '1v1' ? 1 : 2;

  function updateOpp(index: number, id: string) {
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
      match_date: dateObj.toISOString().split('T')[0],
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
      {/* sticky header */}
      <View style={[styles.topBar, { paddingTop: Math.max(spacing.lg, insets.top + spacing.xs) }]}>
        <Pressable onPress={onDone}>
          <Text style={styles.back}>← Cancelar</Text>
        </Pressable>
        <Text style={styles.topTitle}>Nova Partida</Text>
        <View style={{ width: 80 }} />
      </View>

      <ScrollView style={styles.root} contentContainerStyle={styles.content}>
        <View style={styles.section}>
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
        </View>

        <View style={styles.section}>
          <View style={styles.field}>
            <Text style={styles.fieldLabel}>Data da partida</Text>
            <Pressable style={styles.dateBtn} onPress={() => setShowDatePicker(true)}>
              <Text style={styles.dateBtnIcon}>📅</Text>
              <Text style={styles.dateBtnText}>
                {dateObj.toLocaleDateString('pt-BR', { day: '2-digit', month: 'long', year: 'numeric' })}
              </Text>
            </Pressable>

            {/* Android: dialog nativo (abre direto) */}
            {showDatePicker && Platform.OS === 'android' && (
              <DateTimePicker
                value={dateObj}
                mode="date"
                display="default"
                onChange={(_, picked) => {
                  setShowDatePicker(false);
                  if (picked) setDateObj(picked);
                }}
              />
            )}

            {/* iOS: modal com spinner */}
            {Platform.OS === 'ios' && (
              <Modal
                visible={showDatePicker}
                transparent
                animationType="slide"
                onRequestClose={() => setShowDatePicker(false)}
              >
                <Pressable style={datePicker.backdrop} onPress={() => setShowDatePicker(false)} />
                <View style={datePicker.sheet}>
                  <View style={datePicker.handle} />
                  <View style={datePicker.toolbar}>
                    <Pressable onPress={() => setShowDatePicker(false)}>
                      <Text style={datePicker.done}>Pronto</Text>
                    </Pressable>
                  </View>
                  <DateTimePicker
                    value={dateObj}
                    mode="date"
                    display="spinner"
                    onChange={(_, picked) => { if (picked) setDateObj(picked); }}
                    locale="pt-BR"
                    style={{ width: '100%' }}
                  />
                </View>
              </Modal>
            )}
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
                onChange={setPartner}
                placeholder="Selecionar (opcional)"
              />
            </View>
          )}

          {Array.from({ length: numOpponents }).map((_, i) => (
            <View key={i} style={styles.field}>
              <Text style={styles.fieldLabel}>
                Legend do oponente{numOpponents > 1 ? ` ${i + 1}` : ''}
              </Text>
              <ChampionPicker
                champions={champions}
                value={oppChampions[i] ?? null}
                onChange={(id) => updateOpp(i, id)}
              />
            </View>
          ))}
        </View>

        <View style={styles.section}>
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
            <Pressable
              style={styles.select}
              onPress={() => setTournOpen(!tournamentOpen)}
            >
              <Text style={styles.selectText}>{TOURNAMENT_LABELS[tournament]}</Text>
              <Text style={styles.chevron}>{tournamentOpen ? '▲' : '▼'}</Text>
            </Pressable>
            {tournamentOpen && (
              <View style={styles.dropdown}>
                {TOURNAMENT_OPTIONS.map((opt) => (
                  <Pressable
                    key={opt.value}
                    style={[
                      styles.dropdownItem,
                      opt.value === tournament && styles.dropdownItemActive,
                    ]}
                    onPress={() => {
                      setTournament(opt.value);
                      setTournOpen(false);
                    }}
                  >
                    <Text
                      style={[
                        styles.dropdownText,
                        opt.value === tournament && styles.dropdownTextActive,
                      ]}
                    >
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
        </View>

        {error ? <Text style={styles.error}>{error}</Text> : null}

        <Button
          label="Salvar partida"
          onPress={submit}
          loading={loading}
          variant="cyan"
        />
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
    backgroundColor: colors.surface,
  },
  topTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: colors.textPrimary,
  },
  back: { color: colors.gold, fontSize: 15 },
  content: { padding: spacing.lg, gap: spacing.lg },
  section: {
    backgroundColor: colors.surface,
    borderRadius: radius.lg,
    padding: spacing.md,
    gap: spacing.lg,
    borderWidth: 1,
    borderColor: colors.border,
  },
  field: { gap: spacing.xs },
  fieldLabel: { ...typography.label },
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
  dropdownItemActive: { backgroundColor: colors.borderStrong },
  dropdownText: { color: colors.textPrimary, fontSize: 15 },
  dropdownTextActive: { color: colors.gold, fontWeight: '600' },
  error: { color: colors.danger, fontSize: 13, textAlign: 'center' },
  dateBtn: {
    backgroundColor: colors.surfaceElevated,
    borderRadius: radius.md,
    padding: spacing.md,
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
    borderWidth: 1,
    borderColor: colors.border,
  },
  dateBtnIcon: { fontSize: 16 },
  dateBtnText: { color: colors.textPrimary, fontSize: 15, flex: 1 },
});

const datePicker = StyleSheet.create({
  backdrop: {
    flex: 1,
    backgroundColor: 'rgba(1,10,21,0.6)',
  },
  sheet: {
    backgroundColor: colors.surface,
    borderTopLeftRadius: radius.lg,
    borderTopRightRadius: radius.lg,
    paddingBottom: spacing.xl,
    borderTopWidth: 1,
    borderColor: colors.borderStrong,
  },
  handle: {
    width: 36,
    height: 4,
    borderRadius: 2,
    backgroundColor: colors.borderStrong,
    alignSelf: 'center',
    marginTop: spacing.sm,
  },
  toolbar: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.sm,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  done: { color: colors.cyan, fontSize: 16, fontWeight: '600' },
});

const seg = StyleSheet.create({
  container: { gap: spacing.xs },
  label: { ...typography.label },
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
  optionActive: {
    backgroundColor: colors.gold + '22',
    borderColor: colors.gold,
  },
  optionText: { color: colors.textSecondary, fontWeight: '600', fontSize: 14 },
  optionTextActive: { color: colors.gold },
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
