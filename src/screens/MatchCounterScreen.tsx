import React, { useState } from 'react';
import {
  Image,
  Pressable,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { colors, fonts, radius, spacing } from '../lib/theme';
import { useBreakpoint } from '../lib/useBreakpoint';
import { MatchFormat, MatchMode } from '../types';
import { Button } from '../components/Button';

// ── Rune config ──────────────────────────────────────────────────────────────
const RUNES = [
  { source: require('../../assets/runes/Body Rune.png'),  color: colors.domainBody  },
  { source: require('../../assets/runes/Calm Rune.png'),  color: colors.domainCalm  },
  { source: require('../../assets/runes/Chaos Rune.png'), color: colors.domainChaos },
  { source: require('../../assets/runes/Fury Rune.png'),  color: colors.domainFury  },
  { source: require('../../assets/runes/Mind Rune.png'),  color: colors.domainMind  },
  { source: require('../../assets/runes/Order Rune.png'), color: colors.domainOrder },
];

type Rune = typeof RUNES[number];
function pickRune(): Rune { return RUNES[Math.floor(Math.random() * RUNES.length)]; }

function pickTwoRunes(): [Rune, Rune] {
  const r1 = pickRune();
  let r2 = pickRune();
  // Guarantee the two runes are different
  while (r2.source === r1.source) r2 = pickRune();
  return [r1, r2];
}

interface PlayerState { points: number; gamesWon: number; name: string }

// ── Setup segment toggle ─────────────────────────────────────────────────────
function SegBtn<T extends string>({
  options, value, onChange,
}: { options: { v: T; label: string }[]; value: T; onChange: (v: T) => void }) {
  return (
    <View style={seg.row}>
      {options.map((o) => {
        const active = o.v === value;
        return (
          <Pressable key={o.v} style={[seg.btn, active && seg.btnActive]} onPress={() => onChange(o.v)}>
            <Text style={[seg.text, active && seg.textActive]}>{o.label}</Text>
          </Pressable>
        );
      })}
    </View>
  );
}

// ── Crystal button (+/-) with dynamic rune color ─────────────────────────────
function CrystalBtn({
  sign, isAdd, runeColor, onPress,
}: { sign: string; isAdd: boolean; runeColor: string; onPress: () => void }) {
  return (
    <Pressable
      style={({ pressed }) => [
        crystal.btn,
        isAdd
          ? {
              backgroundColor: runeColor + '22',
              borderWidth: 1.5,
              borderColor: runeColor,
              shadowColor: runeColor,
              shadowOffset: { width: 0, height: 0 },
              shadowOpacity: 0.65,
              shadowRadius: 12,
              elevation: 6,
            }
          : crystal.btnSub,
        pressed && { opacity: 0.8, transform: [{ scale: 0.92 }] },
      ]}
      onPress={onPress}
    >
      <Text style={[crystal.sign, { color: isAdd ? runeColor : colors.textSecondary }]}>{sign}</Text>
    </Pressable>
  );
}

// ── Player zone ──────────────────────────────────────────────────────────────
// Rail is positioned absolutely so it never shifts the centered counter.
function PlayerZone({
  player, winTarget, flipped = false, onIncrement, onDecrement,
  inactive = false, runeColor, topPad = 0, bottomPad = 0,
}: {
  player: PlayerState; winTarget: number; flipped?: boolean;
  onIncrement: () => void; onDecrement: () => void;
  inactive?: boolean; runeColor: string; topPad?: number; bottomPad?: number;
}) {
  const progress = Math.min(player.points / winTarget, 1);

  return (
    <View style={[zone.container, flipped && { transform: [{ rotate: '180deg' }] }, inactive && { opacity: 0.55 }]}>
      {/* Absolute rail — visually left, not in flex flow, numbers stay centered */}
      <View style={[zone.rail, { top: topPad + spacing.lg, bottom: bottomPad + spacing.lg }]}>
        <View
          style={[
            zone.railFill,
            {
              height: `${Math.round(progress * 100)}%` as any,
              backgroundColor: runeColor,
              shadowColor: runeColor,
            },
          ]}
        />
      </View>

      {/* Full-width centered content */}
      <View style={[zone.content, { paddingTop: topPad + spacing.lg, paddingBottom: bottomPad + spacing.lg }]}>
        <Text style={zone.nameLabel}>{player.name}</Text>
        <Text style={zone.gamesLabel}>Games: {player.gamesWon}</Text>

        <Text style={[zone.counter, { textShadowColor: runeColor + '55' }]}>
          {player.points}
        </Text>

        <View style={zone.btnRow}>
          <CrystalBtn sign="−" isAdd={false} runeColor={runeColor} onPress={onDecrement} />
          <CrystalBtn sign="+" isAdd={true}  runeColor={runeColor} onPress={onIncrement} />
        </View>
      </View>
    </View>
  );
}

// ── Overlay ──────────────────────────────────────────────────────────────────
function Overlay({ children }: { children: React.ReactNode }) {
  return <View style={overlayStyles.backdrop}>{children}</View>;
}

// ── Main screen ──────────────────────────────────────────────────────────────
export function MatchCounterScreen() {
  const insets = useSafeAreaInsets();
  const { isDesktop } = useBreakpoint();
  const [setup, setSetup]       = useState(true);
  const [format, setFormat]     = useState<MatchFormat>('bo3');
  const [winTarget, setWinTarget] = useState(20);
  const [[rune1, rune2], setRunes] = useState<[Rune, Rune]>(pickTwoRunes);

  const [player1, setPlayer1] = useState<PlayerState>({ points: 0, gamesWon: 0, name: 'Você' });
  const [player2, setPlayer2] = useState<PlayerState>({ points: 0, gamesWon: 0, name: 'Oponente' });
  const [gameNum, setGameNum] = useState(1);
  const [winner, setWinner]   = useState<string | null>(null);
  const [confirmReset, setConfirmReset] = useState(false);

  const maxGames    = format === 'bo3' ? 3 : 1;
  const gamesNeeded = format === 'bo3' ? 2 : 1;

  function increment(setter: React.Dispatch<React.SetStateAction<PlayerState>>, current: PlayerState) {
    if (winner) return;
    const next = current.points + 1;
    if (next >= winTarget) {
      const ng = current.gamesWon + 1;
      setter((p) => ({ ...p, points: next, gamesWon: ng }));
      if (ng >= gamesNeeded) {
        setWinner(current.name);
      } else if (gameNum < maxGames) {
        setGameNum((g) => g + 1);
        setPlayer1((p) => ({ ...p, points: 0 }));
        setPlayer2((p) => ({ ...p, points: 0 }));
        setRunes(pickTwoRunes());
      }
    } else {
      setter((p) => ({ ...p, points: next }));
    }
  }

  function decrement(setter: React.Dispatch<React.SetStateAction<PlayerState>>) {
    if (winner) return;
    setter((p) => ({ ...p, points: Math.max(0, p.points - 1) }));
  }

  function doReset() {
    setPlayer1({ points: 0, gamesWon: 0, name: 'Você' });
    setPlayer2({ points: 0, gamesWon: 0, name: 'Oponente' });
    setGameNum(1);
    setWinner(null);
    setConfirmReset(false);
    setRunes(pickTwoRunes());
  }

  // ── SETUP ──────────────────────────────────────────────────────────────────
  if (setup) {
    return (
      <View style={[styles.root, { paddingTop: insets.top, alignItems: isDesktop ? 'center' : undefined, justifyContent: isDesktop ? 'center' : undefined }]}>
        <Text style={[styles.setupTitle, isDesktop && { textAlign: 'center' }]}>Placar</Text>
        <View style={[styles.setupCard, isDesktop && { width: 480 }]}>
          <Text style={styles.setupSubtitle}>Configurar partida</Text>

          <View style={seg.field}>
            <Text style={seg.fieldLabel}>Formato</Text>
            <SegBtn
              options={[{ v: 'bo1', label: 'Bo1' }, { v: 'bo3', label: 'Bo3' }]}
              value={format}
              onChange={setFormat}
            />
          </View>

          <View style={seg.field}>
            <Text style={seg.fieldLabel}>Pontos para vencer</Text>
            <View style={seg.row}>
              {[7, 8, 9, 10].map((t) => {
                const on = t === winTarget;
                return (
                  <Pressable key={t} style={[seg.btn, on && styles.targetBtnActive]} onPress={() => setWinTarget(t)}>
                    <Text style={[seg.text, on && styles.targetBtnTextActive]}>{t}</Text>
                  </Pressable>
                );
              })}
            </View>
          </View>

          <Button
            label="Iniciar Placar"
            onPress={() => { doReset(); setSetup(false); }}
            variant="cyan"
          />
        </View>
        <Text style={styles.helpText}>
          Posicione o celular entre os dois jogadores.{'\n'}
          A metade superior fica de cabeça para baixo para o oponente.
        </Text>
      </View>
    );
  }

  // ── PLAY ───────────────────────────────────────────────────────────────────
  return (
    <View style={styles.counter}>
      {/* Rune watermarks — each player's rune fills their own half */}
      <View style={[StyleSheet.absoluteFill, { bottom: '50%' }]}>
        <Image source={rune2.source} style={styles.runeWatermark} resizeMode="cover" />
      </View>
      <View style={[StyleSheet.absoluteFill, { top: '50%' }]}>
        <Image source={rune1.source} style={styles.runeWatermark} resizeMode="cover" />
      </View>

      {/* Opponent (top, rotated 180°) — topPad pushes content below Dynamic Island */}
      <PlayerZone
        player={player2}
        winTarget={winTarget}
        flipped
        inactive={!!winner}
        runeColor={rune2.color}
        topPad={insets.top}
        onIncrement={() => increment(setPlayer2, player2)}
        onDecrement={() => decrement(setPlayer2)}
      />

      {/* Gold divider */}
      <View style={styles.divider}>
        <View style={styles.dividerLine} />
        <Pressable style={styles.resetPill} onPress={() => setConfirmReset(true)}>
          <Text style={styles.resetPillText}>↺ Resetar · {gameNum}/{maxGames}</Text>
        </Pressable>
      </View>

      {/* Player (bottom) — bottomPad avoids home indicator */}
      <PlayerZone
        player={player1}
        winTarget={winTarget}
        inactive={!!winner}
        runeColor={rune1.color}
        bottomPad={insets.bottom}
        onIncrement={() => increment(setPlayer1, player1)}
        onDecrement={() => decrement(setPlayer1)}
      />

      {/* Winner overlay */}
      {winner ? (
        <Overlay>
          <Text style={overlayStyles.trophy}>🏆</Text>
          <Text style={overlayStyles.winnerText}>{winner} venceu!</Text>
          <Button label="Nova partida" onPress={doReset} variant="cyan" />
          <Pressable onPress={() => { doReset(); setSetup(true); }}>
            <Text style={overlayStyles.backLink}>Voltar ao setup</Text>
          </Pressable>
        </Overlay>
      ) : null}

      {/* Reset confirm overlay */}
      {confirmReset ? (
        <Overlay>
          <Text style={overlayStyles.confirmText}>Resetar a partida?</Text>
          <View style={overlayStyles.confirmBtns}>
            <Button label="Cancelar" onPress={() => setConfirmReset(false)} variant="ghost" />
            <Button label="Resetar" onPress={doReset} variant="danger" />
          </View>
        </Overlay>
      ) : null}
    </View>
  );
}

// ── Styles ───────────────────────────────────────────────────────────────────
const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: colors.background },
  setupTitle: {
    fontSize: 26,
    fontWeight: '700',
    color: colors.textPrimary,
    fontFamily: fonts.display,
    letterSpacing: 0.8,
    padding: spacing.lg,
    paddingBottom: spacing.sm,
  },
  setupCard: {
    backgroundColor: colors.surface,
    borderRadius: radius.lg,
    marginHorizontal: spacing.lg,
    padding: spacing.lg,
    gap: spacing.lg,
    borderWidth: 1,
    borderColor: colors.border,
  },
  setupSubtitle: { fontSize: 18, fontWeight: '600', color: colors.textPrimary },
  targetBtnActive: {
    backgroundColor: '#00bcff22',
    borderColor: colors.cyan,
    shadowColor: colors.cyan,
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.5,
    shadowRadius: 6,
    elevation: 3,
  },
  targetBtnTextActive: { color: colors.cyan },
  helpText: {
    color: colors.textMuted,
    fontSize: 12,
    textAlign: 'center',
    lineHeight: 18,
    marginTop: spacing.lg,
    paddingHorizontal: spacing.xl,
  },
  counter: { flex: 1, backgroundColor: colors.background },
  runeWatermark: { flex: 1, width: '100%', opacity: 0.15 },
  divider: {
    height: 1,
    position: 'relative',
    alignItems: 'center',
    justifyContent: 'center',
  },
  dividerLine: {
    position: 'absolute',
    left: 0,
    right: 0,
    height: 1,
    backgroundColor: colors.gold,
    opacity: 0.5,
  },
  resetPill: {
    paddingHorizontal: 14,
    paddingVertical: 6,
    borderRadius: radius.full,
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: colors.gold,
  },
  resetPillText: {
    color: colors.gold,
    fontSize: 12,
    fontWeight: '700',
    letterSpacing: 0.4,
  },
});

// ── Zone styles ───────────────────────────────────────────────────────────────
const zone = StyleSheet.create({
  container: { flex: 1 },
  rail: {
    position: 'absolute',
    left: spacing.lg,
    width: 6,
    borderRadius: radius.full,
    backgroundColor: colors.surfaceSunken,
    overflow: 'hidden',
    justifyContent: 'flex-end',
  },
  railFill: {
    width: '100%',
    borderRadius: radius.full,
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.7,
    shadowRadius: 4,
  },
  content: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    gap: spacing.sm,
  },
  nameLabel: {
    fontSize: 11,
    fontWeight: '700',
    color: colors.textSecondary,
    textTransform: 'uppercase',
    letterSpacing: 1.4,
  },
  gamesLabel: { fontSize: 11, color: colors.textMuted },
  counter: {
    fontSize: 88,
    fontWeight: '700',
    color: colors.textPrimary,
    fontFamily: 'VarelaRound_400Regular',
    lineHeight: 96,
    minWidth: 120,
    textAlign: 'center',
    textShadowOffset: { width: 0, height: 0 },
    textShadowRadius: 20,
  },
  btnRow: { flexDirection: 'row', gap: spacing.xl, marginTop: spacing.sm },
});

// ── Crystal button styles ─────────────────────────────────────────────────────
const crystal = StyleSheet.create({
  btn: {
    width: 76,
    height: 76,
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
  },
  btnSub: {
    backgroundColor: colors.surfaceElevated,
    borderWidth: 1.5,
    borderColor: colors.borderStrong,
  },
  sign: { fontSize: 36, fontWeight: '300', lineHeight: 42 },
});

// ── Segment styles ────────────────────────────────────────────────────────────
const seg = StyleSheet.create({
  field: { gap: spacing.xs },
  fieldLabel: {
    fontSize: 11,
    fontWeight: '700',
    color: colors.textSecondary,
    textTransform: 'uppercase',
    letterSpacing: 1.4,
    marginBottom: spacing.xs,
  },
  row: { flexDirection: 'row', gap: spacing.xs },
  btn: {
    flex: 1,
    backgroundColor: colors.surfaceElevated,
    borderRadius: radius.md,
    paddingVertical: 12,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: colors.border,
  },
  btnActive: { backgroundColor: colors.gold + '22', borderColor: colors.gold },
  text: { color: colors.textSecondary, fontWeight: '600', fontSize: 14 },
  textActive: { color: colors.gold },
});

// ── Overlay styles ────────────────────────────────────────────────────────────
const overlayStyles = StyleSheet.create({
  backdrop: {
    position: 'absolute',
    top: 0, left: 0, right: 0, bottom: 0,
    backgroundColor: 'rgba(1,10,21,0.85)',
    alignItems: 'center',
    justifyContent: 'center',
    gap: spacing.lg,
    padding: spacing.xl,
    zIndex: 20,
  },
  trophy: { fontSize: 52 },
  winnerText: {
    fontSize: 28,
    fontWeight: '700',
    color: colors.gold,
    fontFamily: fonts.display,
    textAlign: 'center',
    letterSpacing: 0.6,
  },
  backLink: { color: colors.textSecondary, fontSize: 14, marginTop: spacing.xs },
  confirmText: { fontSize: 17, fontWeight: '600', color: colors.textPrimary, textAlign: 'center' },
  confirmBtns: { flexDirection: 'row', gap: spacing.sm },
});
