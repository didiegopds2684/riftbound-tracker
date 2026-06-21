import React, { useState } from 'react';
import {
  Alert,
  Pressable,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import { colors, radius, spacing, typography } from '../lib/theme';
import { MatchFormat, MatchMode } from '../types';

interface PlayerState {
  points: number;
  gamesWon: number;
  name: string;
}

const DOMAIN_SKINS = ['⚔', '🛡', '🔮', '🌪', '🌊', '🌿', '💀'];

function SegBtn<T extends string>({ options, value, onChange }: {
  options: { v: T; label: string }[];
  value: T;
  onChange: (v: T) => void;
}) {
  return (
    <View style={seg.row}>
      {options.map((o) => (
        <Pressable
          key={o.v}
          style={[seg.btn, o.v === value && seg.btnActive]}
          onPress={() => onChange(o.v)}
        >
          <Text style={[seg.text, o.v === value && seg.textActive]}>{o.label}</Text>
        </Pressable>
      ))}
    </View>
  );
}

function PlayerPanel({
  player,
  onIncrement,
  onDecrement,
  flipped,
  winTarget,
}: {
  player: PlayerState;
  onIncrement: () => void;
  onDecrement: () => void;
  flipped?: boolean;
  winTarget: number;
}) {
  const progress = Math.min(player.points / winTarget, 1);
  return (
    <View style={[panel.container, flipped && { transform: [{ rotate: '180deg' }] }]}>
      <View style={panel.progressBar}>
        <View style={[panel.progressFill, { width: `${progress * 100}%` }]} />
      </View>
      <Text style={panel.name}>{player.name}</Text>
      <Text style={panel.games}>Games: {player.gamesWon}</Text>
      <View style={panel.pointsRow}>
        <Pressable style={panel.btn} onPress={onDecrement}>
          <Text style={panel.btnText}>−</Text>
        </Pressable>
        <Text style={panel.points}>{player.points}</Text>
        <Pressable style={[panel.btn, panel.btnAdd]} onPress={onIncrement}>
          <Text style={panel.btnText}>+</Text>
        </Pressable>
      </View>
    </View>
  );
}

export function MatchCounterScreen() {
  const [setup, setSetup] = useState(true);
  const [mode, setMode] = useState<MatchMode>('1v1');
  const [format, setFormat] = useState<MatchFormat>('bo1');
  const [winTarget, setWinTarget] = useState(20);
  const [skin, setSkin] = useState(0);

  const [player1, setPlayer1] = useState<PlayerState>({ points: 0, gamesWon: 0, name: 'Jogador 1' });
  const [player2, setPlayer2] = useState<PlayerState>({ points: 0, gamesWon: 0, name: 'Jogador 2' });
  const [gameNum, setGameNum] = useState(1);
  const [winner, setWinner] = useState<string | null>(null);

  const maxGames = format === 'bo3' ? 3 : 1;
  const gamesNeeded = format === 'bo3' ? 2 : 1;

  function increment(setter: React.Dispatch<React.SetStateAction<PlayerState>>, current: PlayerState, name: string) {
    if (winner) return;
    const next = current.points + 1;
    setter((p) => ({ ...p, points: next }));
    if (next >= winTarget) {
      const newGamesWon = current.gamesWon + 1;
      setter((p) => ({ ...p, gamesWon: newGamesWon }));
      if (newGamesWon >= gamesNeeded) {
        setWinner(name);
      } else if (gameNum < maxGames) {
        setGameNum((g) => g + 1);
        setPlayer1((p) => ({ ...p, points: 0 }));
        setPlayer2((p) => ({ ...p, points: 0 }));
      }
    }
  }

  function decrement(setter: React.Dispatch<React.SetStateAction<PlayerState>>) {
    setter((p) => ({ ...p, points: Math.max(0, p.points - 1) }));
  }

  function resetGame() {
    Alert.alert('Reiniciar', 'Reiniciar a partida?', [
      { text: 'Cancelar', style: 'cancel' },
      {
        text: 'Reiniciar', style: 'destructive', onPress: () => {
          setPlayer1({ points: 0, gamesWon: 0, name: 'Jogador 1' });
          setPlayer2({ points: 0, gamesWon: 0, name: 'Jogador 2' });
          setGameNum(1);
          setWinner(null);
        }
      },
    ]);
  }

  if (setup) {
    return (
      <View style={styles.root}>
        <Text style={[typography.h1, { padding: spacing.lg }]}>Placar</Text>
        <View style={styles.setupCard}>
          <Text style={typography.h3}>Configurar partida</Text>
          <SegBtn
            options={[{ v: '1v1', label: '1v1' }, { v: '2v2', label: '2v2' }]}
            value={mode}
            onChange={setMode}
          />
          <SegBtn
            options={[{ v: 'bo1', label: 'Bo1' }, { v: 'bo3', label: 'Bo3' }]}
            value={format}
            onChange={setFormat}
          />
          <View>
            <Text style={styles.setupLabel}>Pontos para vencer</Text>
            <View style={seg.row}>
              {[15, 20, 25, 30].map((t) => (
                <Pressable
                  key={t}
                  style={[seg.btn, t === winTarget && seg.btnActive]}
                  onPress={() => setWinTarget(t)}
                >
                  <Text style={[seg.text, t === winTarget && seg.textActive]}>{t}</Text>
                </Pressable>
              ))}
            </View>
          </View>
          <View>
            <Text style={styles.setupLabel}>Avatar</Text>
            <View style={styles.skinRow}>
              {DOMAIN_SKINS.map((s, i) => (
                <Pressable
                  key={i}
                  style={[styles.skinBtn, i === skin && styles.skinBtnActive]}
                  onPress={() => setSkin(i)}
                >
                  <Text style={styles.skinIcon}>{s}</Text>
                </Pressable>
              ))}
            </View>
          </View>
          <Pressable
            style={styles.startBtn}
            onPress={() => setSetup(false)}
          >
            <Text style={styles.startBtnText}>Iniciar Placar</Text>
          </Pressable>
        </View>
      </View>
    );
  }

  return (
    <View style={styles.counter}>
      {winner ? (
        <View style={styles.winnerOverlay}>
          <Text style={styles.winnerText}>🏆 {winner} venceu!</Text>
          <Pressable style={styles.startBtn} onPress={resetGame}>
            <Text style={styles.startBtnText}>Reiniciar</Text>
          </Pressable>
          <Pressable onPress={() => setSetup(true)}>
            <Text style={styles.back}>Voltar ao setup</Text>
          </Pressable>
        </View>
      ) : null}

      <PlayerPanel
        player={player2}
        onIncrement={() => increment(setPlayer2, player2, player2.name)}
        onDecrement={() => decrement(setPlayer2)}
        flipped
        winTarget={winTarget}
      />

      <View style={styles.divider}>
        <Text style={styles.gameInfo}>
          {DOMAIN_SKINS[skin]} Game {gameNum}/{maxGames}
        </Text>
        <View style={styles.dividerLine} />
        <View style={styles.gamesWonRow}>
          <Text style={styles.gamesWon}>{player1.gamesWon}</Text>
          <Text style={styles.gamesWonSep}>:</Text>
          <Text style={styles.gamesWon}>{player2.gamesWon}</Text>
        </View>
        <Pressable onPress={resetGame}>
          <Text style={styles.resetBtn}>↺ Reset</Text>
        </Pressable>
      </View>

      <PlayerPanel
        player={player1}
        onIncrement={() => increment(setPlayer1, player1, player1.name)}
        onDecrement={() => decrement(setPlayer1)}
        winTarget={winTarget}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: colors.background },
  setupCard: {
    backgroundColor: colors.surface,
    borderRadius: radius.lg,
    margin: spacing.lg,
    padding: spacing.lg,
    gap: spacing.lg,
    borderWidth: 1,
    borderColor: colors.border,
  },
  setupLabel: { ...typography.label, textTransform: 'uppercase', marginBottom: spacing.xs },
  skinRow: { flexDirection: 'row', gap: spacing.sm, flexWrap: 'wrap' },
  skinBtn: {
    width: 44,
    height: 44,
    borderRadius: radius.md,
    backgroundColor: colors.surfaceElevated,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: colors.border,
  },
  skinBtnActive: { borderColor: colors.primary, backgroundColor: colors.primary + '22' },
  skinIcon: { fontSize: 22 },
  startBtn: {
    backgroundColor: colors.primary,
    borderRadius: radius.md,
    padding: spacing.md,
    alignItems: 'center',
  },
  startBtnText: { color: '#0A0E1A', fontWeight: '700', fontSize: 16 },
  counter: { flex: 1, backgroundColor: colors.background },
  divider: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: spacing.md,
    gap: spacing.md,
  },
  dividerLine: { flex: 1, height: 1, backgroundColor: colors.border },
  gameInfo: { color: colors.primary, fontWeight: '700', fontSize: 14 },
  gamesWonRow: { flexDirection: 'row', alignItems: 'center', gap: spacing.xs },
  gamesWon: { color: colors.textPrimary, fontSize: 18, fontWeight: '700' },
  gamesWonSep: { color: colors.textMuted, fontSize: 14 },
  resetBtn: { color: colors.textSecondary, fontSize: 13 },
  winnerOverlay: {
    position: 'absolute',
    inset: 0,
    zIndex: 10,
    backgroundColor: '#000000AA',
    alignItems: 'center',
    justifyContent: 'center',
    gap: spacing.lg,
    padding: spacing.xl,
  },
  winnerText: { fontSize: 28, fontWeight: '700', color: colors.primary, textAlign: 'center' },
  back: { color: colors.textSecondary, fontSize: 14, marginTop: spacing.sm },
});

const seg = StyleSheet.create({
  row: { flexDirection: 'row', gap: spacing.xs },
  btn: {
    flex: 1,
    backgroundColor: colors.surfaceElevated,
    borderRadius: radius.md,
    padding: spacing.sm,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: colors.border,
  },
  btnActive: { backgroundColor: colors.primary + '22', borderColor: colors.primary },
  text: { color: colors.textSecondary, fontWeight: '600' },
  textActive: { color: colors.primary },
});

const panel = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: spacing.lg,
    gap: spacing.sm,
  },
  progressBar: {
    width: '100%',
    height: 6,
    backgroundColor: colors.border,
    borderRadius: radius.full,
    overflow: 'hidden',
    marginBottom: spacing.xs,
  },
  progressFill: {
    height: '100%',
    backgroundColor: colors.primary,
    borderRadius: radius.full,
  },
  name: { color: colors.textSecondary, fontSize: 13, fontWeight: '600' },
  games: { color: colors.textMuted, fontSize: 11 },
  pointsRow: { flexDirection: 'row', alignItems: 'center', gap: spacing.xl },
  points: { fontSize: 80, fontWeight: '700', color: colors.textPrimary, minWidth: 120, textAlign: 'center' },
  btn: {
    width: 56,
    height: 56,
    borderRadius: radius.full,
    backgroundColor: colors.surfaceElevated,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: colors.border,
  },
  btnAdd: { backgroundColor: colors.primary + '22', borderColor: colors.primary },
  btnText: { color: colors.textPrimary, fontSize: 28, fontWeight: '300', lineHeight: 34 },
});
