import React, { useState } from 'react';
import { c, card, r, sp } from '../theme';
import { MatchFormat, MatchMode } from '../types';
import { Button } from '../components/Button';
import { SegmentControl } from '../components/SegmentControl';

const SKINS = ['⚔', '🛡', '🔮', '🌪', '🌊', '🌿', '💀'];

interface PlayerState { points: number; gamesWon: number; }

function PlayerPanel({ player, name, onAdd, onSub, winTarget, flipped }: {
  player: PlayerState; name: string;
  onAdd: () => void; onSub: () => void;
  winTarget: number; flipped?: boolean;
}) {
  const pct = Math.min(player.points / winTarget, 1);
  return (
    <div style={{
      flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center',
      justifyContent: 'center', gap: sp.sm, padding: sp.lg,
      transform: flipped ? 'rotate(180deg)' : undefined,
    }}>
      <div style={{ width: '100%', height: 6, background: c.border, borderRadius: r.full, overflow: 'hidden' }}>
        <div style={{ height: '100%', width: `${pct * 100}%`, background: c.primary, borderRadius: r.full, transition: 'width 0.2s' }} />
      </div>
      <div style={{ color: c.textSecondary, fontSize: 13, fontWeight: 600 }}>{name}</div>
      <div style={{ color: c.textMuted, fontSize: 11 }}>Games: {player.gamesWon}</div>
      <div style={{ display: 'flex', alignItems: 'center', gap: sp.xl }}>
        <button onClick={onSub} style={{
          width: 52, height: 52, borderRadius: '50%', fontSize: 28, fontWeight: 300,
          background: c.surfaceElevated, border: `1px solid ${c.border}`,
          color: c.textPrimary, cursor: 'pointer', lineHeight: 1,
        }}>−</button>
        <div style={{ fontSize: 72, fontWeight: 700, minWidth: 110, textAlign: 'center' }}>
          {player.points}
        </div>
        <button onClick={onAdd} style={{
          width: 52, height: 52, borderRadius: '50%', fontSize: 24,
          background: c.primary + '22', border: `1px solid ${c.primary}`,
          color: c.primary, cursor: 'pointer', fontWeight: 700,
        }}>+</button>
      </div>
    </div>
  );
}

export function MatchCounterScreen() {
  const [setup, setSetup] = useState(true);
  const [mode, setMode] = useState<MatchMode>('1v1');
  const [format, setFormat] = useState<MatchFormat>('bo1');
  const [winTarget, setWinTarget] = useState(20);
  const [skin, setSkin] = useState(0);

  const [p1, setP1] = useState<PlayerState>({ points: 0, gamesWon: 0 });
  const [p2, setP2] = useState<PlayerState>({ points: 0, gamesWon: 0 });
  const [gameNum, setGameNum] = useState(1);
  const [winner, setWinner] = useState<string | null>(null);

  const maxGames = format === 'bo3' ? 3 : 1;
  const gamesNeeded = format === 'bo3' ? 2 : 1;

  function addPoint(player: 'p1' | 'p2') {
    if (winner) return;
    const current = player === 'p1' ? p1 : p2;
    const setter = player === 'p1' ? setP1 : setP2;
    const name = player === 'p1' ? 'Jogador 1' : 'Jogador 2';
    const next = current.points + 1;
    if (next >= winTarget) {
      const newGames = current.gamesWon + 1;
      setter({ points: next, gamesWon: newGames });
      if (newGames >= gamesNeeded) { setWinner(name); return; }
      if (gameNum < maxGames) {
        setGameNum((g) => g + 1);
        setP1((p) => ({ ...p, points: 0 }));
        setP2((p) => ({ ...p, points: 0 }));
      }
    } else {
      setter((p) => ({ ...p, points: next }));
    }
  }

  function reset() {
    setP1({ points: 0, gamesWon: 0 });
    setP2({ points: 0, gamesWon: 0 });
    setGameNum(1);
    setWinner(null);
  }

  if (setup) {
    return (
      <div style={{ flex: 1, overflowY: 'auto', padding: sp.lg, display: 'flex', flexDirection: 'column', gap: sp.lg }}>
        <div style={{ fontSize: 26, fontWeight: 700 }}>Placar</div>
        <div style={{ ...card, display: 'flex', flexDirection: 'column', gap: sp.lg }}>
          <div style={{ fontSize: 18, fontWeight: 600 }}>Configurar partida</div>
          <SegmentControl label="Modo" options={[{value:'1v1',label:'1v1'},{value:'2v2',label:'2v2'}]} value={mode} onChange={setMode} />
          <SegmentControl label="Formato" options={[{value:'bo1',label:'Bo1'},{value:'bo3',label:'Bo3'}]} value={format} onChange={setFormat} />
          <div>
            <div style={{ fontSize: 12, fontWeight: 600, color: c.textSecondary, textTransform: 'uppercase', marginBottom: sp.xs }}>Pontos para vencer</div>
            <div style={{ display: 'flex', gap: sp.xs }}>
              {[15,20,25,30].map((t) => (
                <button key={t} onClick={() => setWinTarget(t)} style={{
                  flex: 1, padding: sp.sm, borderRadius: r.md, cursor: 'pointer', fontWeight: 600,
                  border: `1px solid ${t === winTarget ? c.primary : c.border}`,
                  background: t === winTarget ? c.primary + '22' : c.surfaceElevated,
                  color: t === winTarget ? c.primary : c.textSecondary,
                }}>{t}</button>
              ))}
            </div>
          </div>
          <div>
            <div style={{ fontSize: 12, fontWeight: 600, color: c.textSecondary, textTransform: 'uppercase', marginBottom: sp.xs }}>Avatar</div>
            <div style={{ display: 'flex', gap: sp.sm, flexWrap: 'wrap' }}>
              {SKINS.map((s, i) => (
                <button key={i} onClick={() => setSkin(i)} style={{
                  width: 44, height: 44, borderRadius: r.md, fontSize: 22, cursor: 'pointer',
                  border: `1px solid ${i === skin ? c.primary : c.border}`,
                  background: i === skin ? c.primary + '22' : c.surfaceElevated,
                }}>{s}</button>
              ))}
            </div>
          </div>
          <Button label="Iniciar Placar" onClick={() => setSetup(false)} fullWidth />
        </div>
      </div>
    );
  }

  return (
    <div style={{ flex: 1, display: 'flex', flexDirection: 'column', position: 'relative' }}>
      {winner && (
        <div style={{
          position: 'absolute', inset: 0, zIndex: 10,
          background: '#000000AA', display: 'flex', flexDirection: 'column',
          alignItems: 'center', justifyContent: 'center', gap: sp.lg, padding: sp.xl,
        }}>
          <div style={{ fontSize: 28, fontWeight: 700, color: c.primary, textAlign: 'center' }}>🏆 {winner} venceu!</div>
          <Button label="Reiniciar" onClick={reset} />
          <button onClick={() => { reset(); setSetup(true); }} style={{ color: c.textSecondary, background: 'none', border: 'none', cursor: 'pointer' }}>
            Voltar ao setup
          </button>
        </div>
      )}

      <PlayerPanel player={p2} name="Jogador 2" onAdd={() => addPoint('p2')} onSub={() => setP2((p) => ({ ...p, points: Math.max(0, p.points - 1) }))} winTarget={winTarget} flipped />

      <div style={{ display: 'flex', alignItems: 'center', gap: sp.md, padding: `0 ${sp.md}px` }}>
        <span style={{ color: c.primary, fontWeight: 700, fontSize: 14 }}>{SKINS[skin]} Game {gameNum}/{maxGames}</span>
        <div style={{ flex: 1, height: 1, background: c.border }} />
        <span style={{ color: c.textPrimary, fontWeight: 700 }}>{p1.gamesWon} : {p2.gamesWon}</span>
        <button onClick={reset} style={{ color: c.textSecondary, background: 'none', border: 'none', cursor: 'pointer', fontSize: 13 }}>↺ Reset</button>
      </div>

      <PlayerPanel player={p1} name="Jogador 1" onAdd={() => addPoint('p1')} onSub={() => setP1((p) => ({ ...p, points: Math.max(0, p.points - 1) }))} winTarget={winTarget} />
    </div>
  );
}
