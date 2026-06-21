import React, { useMemo, useState } from 'react';
import { c, card, r, sp } from '../theme';
import { Legend, Match } from '../types';
import { LegendAvatar } from '../components/LegendAvatar';

interface LegendStats {
  legend: Legend;
  wins: number; losses: number; draws: number; total: number; winRate: number; isMostPlayed: boolean;
}

function DetailView({ stats, opponentStats, onBack }: {
  stats: LegendStats;
  opponentStats: { legend: Legend; wins: number; total: number }[];
  onBack: () => void;
}) {
  return (
    <div style={{ flex: 1, overflowY: 'auto' }}>
      <div style={{ padding: sp.md, paddingTop: sp.lg }}>
        <button onClick={onBack} style={{ color: c.primary, background: 'none', border: 'none', cursor: 'pointer', fontSize: 15 }}>← Voltar</button>
      </div>
      <div style={{ display: 'flex', alignItems: 'center', gap: sp.md, padding: `0 ${sp.lg}px ${sp.md}px` }}>
        <LegendAvatar legend={stats.legend} size={72} />
        <div>
          <div style={{ fontSize: 22, fontWeight: 700 }}>{stats.legend.name}</div>
          <div style={{ color: c.textSecondary, fontSize: 13 }}>{stats.legend.domain}</div>
        </div>
      </div>

      <div style={{ ...card, margin: sp.md, marginTop: 0, display: 'flex', flexDirection: 'column', gap: sp.sm }}>
        <div style={{ fontSize: 16, fontWeight: 600 }}>Estatísticas gerais</div>
        {([['Total de partidas', stats.total], ['Vitórias', stats.wins], ['Derrotas', stats.losses], ['Empates', stats.draws], ['Taxa de vitória', `${stats.winRate.toFixed(1)}%`]] as [string, string | number][]).map(([l, v]) => (
          <div key={l} style={{ display: 'flex', justifyContent: 'space-between' }}>
            <span style={{ color: c.textSecondary, fontSize: 14 }}>{l}</span>
            <span style={{ fontWeight: 600, fontSize: 14 }}>{v}</span>
          </div>
        ))}
      </div>

      {opponentStats.length > 0 && (
        <div style={{ ...card, margin: sp.md, marginTop: 0, display: 'flex', flexDirection: 'column', gap: sp.sm }}>
          <div style={{ fontSize: 16, fontWeight: 600 }}>Confrontos por oponente</div>
          {opponentStats.map((op) => {
            const wr = op.total > 0 ? (op.wins / op.total) * 100 : 0;
            return (
              <div key={op.legend.id} style={{ display: 'flex', alignItems: 'center', gap: sp.sm }}>
                <LegendAvatar legend={op.legend} size={36} />
                <div style={{ flex: 1 }}>
                  <div style={{ fontSize: 14 }}>{op.legend.name}</div>
                  <div style={{ fontSize: 12, color: c.textSecondary }}>{op.wins}V / {op.total - op.wins}D em {op.total} partidas</div>
                </div>
                <span style={{ fontSize: 16, fontWeight: 700, color: wr >= 50 ? c.win : c.loss }}>{wr.toFixed(0)}%</span>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}

interface Props { matches: Match[]; legends: Legend[]; }

export function LegendsScreen({ matches, legends }: Props) {
  const [search, setSearch] = useState('');
  const [selected, setSelected] = useState<LegendStats | null>(null);

  const allStats = useMemo<LegendStats[]>(() => {
    const map = new Map<string, { wins: number; losses: number; draws: number }>();
    for (const m of matches) {
      const p = map.get(m.my_legend_id) ?? { wins: 0, losses: 0, draws: 0 };
      map.set(m.my_legend_id, {
        wins: p.wins + (m.final_result === 'win' ? 1 : 0),
        losses: p.losses + (m.final_result === 'loss' ? 1 : 0),
        draws: p.draws + (m.final_result === 'draw' ? 1 : 0),
      });
    }
    const stats = Array.from(map.entries()).map(([id, s]) => {
      const legend = legends.find((l) => l.id === id);
      if (!legend) return null;
      const total = s.wins + s.losses + s.draws;
      return { legend, ...s, total, winRate: total > 0 ? (s.wins / total) * 100 : 0, isMostPlayed: false };
    }).filter(Boolean) as LegendStats[];
    if (!stats.length) return stats;
    const max = Math.max(...stats.map((s) => s.total));
    return stats.map((s) => ({ ...s, isMostPlayed: s.total === max })).sort((a, b) => b.total - a.total);
  }, [matches, legends]);

  const oppStatsForSelected = useMemo(() => {
    if (!selected) return [];
    const myMatches = matches.filter((m) => m.my_legend_id === selected.legend.id);
    const map = new Map<string, { wins: number; total: number }>();
    for (const m of myMatches)
      for (const id of m.opponent_legend_ids) {
        const p = map.get(id) ?? { wins: 0, total: 0 };
        map.set(id, { wins: p.wins + (m.final_result === 'win' ? 1 : 0), total: p.total + 1 });
      }
    return Array.from(map.entries()).map(([id, s]) => {
      const legend = legends.find((l) => l.id === id);
      return legend ? { legend, ...s } : null;
    }).filter(Boolean).sort((a, b) => b!.total - a!.total) as { legend: Legend; wins: number; total: number }[];
  }, [selected, matches, legends]);

  const filtered = allStats.filter((s) => s.legend.name.toLowerCase().includes(search.toLowerCase()));

  if (selected) return <DetailView stats={selected} opponentStats={oppStatsForSelected} onBack={() => setSelected(null)} />;

  return (
    <div style={{ flex: 1, display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>
      <div style={{ padding: `${sp.lg}px ${sp.lg}px ${sp.sm}px`, fontSize: 26, fontWeight: 700 }}>Legends</div>

      {allStats.length === 0 ? (
        <div style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: sp.xl }}>
          <span style={{ color: c.textSecondary, textAlign: 'center', lineHeight: 1.6 }}>
            Nenhuma Legend registrada ainda.{'\n'}Registre sua primeira partida!
          </span>
        </div>
      ) : (
        <>
          <div style={{ padding: `0 ${sp.md}px ${sp.sm}px` }}>
            <input value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Buscar Legend..."
              style={{ width: '100%', padding: sp.md, borderRadius: r.md, background: c.surfaceElevated, border: `1px solid ${c.border}`, color: c.textPrimary, fontSize: 15 }} />
          </div>
          <div style={{ flex: 1, overflowY: 'auto', padding: sp.md, paddingTop: 0, display: 'flex', flexDirection: 'column', gap: sp.sm }}>
            {filtered.map((item) => (
              <button key={item.legend.id} onClick={() => setSelected(item)} style={{
                background: c.surface, borderRadius: r.md, padding: sp.md,
                border: `1px solid ${c.border}`, display: 'flex', alignItems: 'center',
                gap: sp.md, cursor: 'pointer', textAlign: 'left', width: '100%',
              }}>
                <LegendAvatar legend={item.legend} size={52} />
                <div style={{ flex: 1 }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: sp.xs, flexWrap: 'wrap' }}>
                    <span style={{ fontWeight: 600, fontSize: 15 }}>{item.legend.name}</span>
                    {item.isMostPlayed && (
                      <span style={{ background: c.primary + '22', color: c.primary, fontSize: 10, fontWeight: 700, padding: '2px 8px', borderRadius: r.full }}>
                        Mais jogada
                      </span>
                    )}
                  </div>
                  <span style={{ color: c.textSecondary, fontSize: 13 }}>
                    {item.wins}V / {item.losses}D / {item.draws}E · {item.total} partidas
                  </span>
                </div>
                <div style={{ textAlign: 'center' }}>
                  <div style={{ fontSize: 20, fontWeight: 700, color: item.winRate >= 50 ? c.win : c.loss }}>{item.winRate.toFixed(0)}%</div>
                  <div style={{ fontSize: 11, color: c.textMuted }}>winrate</div>
                </div>
              </button>
            ))}
          </div>
        </>
      )}
    </div>
  );
}
