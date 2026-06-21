import React, { useState } from 'react';
import { c, r, sp } from '../theme';
import { Legend, Match, TOURNAMENT_LABELS } from '../types';
import { LegendAvatar } from '../components/LegendAvatar';
import { ResultBadge } from '../components/ResultBadge';
import { Button } from '../components/Button';
import { NewMatchScreen } from './NewMatchScreen';

function MatchCard({ match, findLegend, onDelete }: {
  match: Match;
  findLegend: (id: string) => Legend | undefined;
  onDelete: () => void;
}) {
  const myLegend = findLegend(match.my_legend_id);
  const oppLegends = match.opponent_legend_ids.map(findLegend);
  const date = new Date(match.match_date + 'T12:00:00').toLocaleDateString('pt-BR');

  return (
    <div style={{
      background: c.surface, borderRadius: r.md, padding: sp.md,
      border: `1px solid ${c.border}`, display: 'flex', flexDirection: 'column', gap: sp.sm,
    }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: sp.sm }}>
        <span style={{ fontWeight: 600, fontSize: 14 }}>{date}</span>
        <span style={{ color: c.textSecondary, fontSize: 12, flex: 1 }}>
          {match.mode.toUpperCase()} · {match.match_format.toUpperCase()}
        </span>
        <button onClick={onDelete} style={{ color: c.textMuted, background: 'none', border: 'none', cursor: 'pointer', fontSize: 16 }}>✕</button>
      </div>

      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 4 }}>
          <LegendAvatar legend={myLegend} size={44} showName />
          <span style={{ color: c.textMuted, fontSize: 10, textTransform: 'uppercase' }}>Eu</span>
        </div>
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: sp.xs }}>
          <span style={{ fontSize: 22, fontWeight: 700, color: c.primary }}>{match.score_summary}</span>
          <ResultBadge result={match.final_result} />
        </div>
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 4 }}>
          <div style={{ display: 'flex', gap: sp.xs }}>
            {oppLegends.map((l, i) => <LegendAvatar key={i} legend={l} size={44} showName />)}
          </div>
          <span style={{ color: c.textMuted, fontSize: 10, textTransform: 'uppercase' }}>Oponente</span>
        </div>
      </div>

      <span style={{ color: c.textSecondary, fontSize: 12 }}>{TOURNAMENT_LABELS[match.tournament_type]}</span>
      {match.notes && <span style={{ color: c.textSecondary, fontSize: 13, fontStyle: 'italic' }}>{match.notes}</span>}
    </div>
  );
}

interface Props {
  initialMatches?: Match[];
  legends: Legend[];
}

export function MatchesScreen({ initialMatches = [], legends }: Props) {
  const [matches, setMatches] = useState<Match[]>(initialMatches);
  const [showNew, setShowNew] = useState(false);
  const findLegend = (id: string) => legends.find((l) => l.id === id);

  function handleNewMatch(match: Match) {
    setMatches((prev) => [match, ...prev]);
    setShowNew(false);
  }

  if (showNew) {
    return <NewMatchScreen legends={legends} onDone={() => setShowNew(false)} onSave={handleNewMatch} />;
  }

  return (
    <div style={{ flex: 1, display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: `${sp.lg}px ${sp.lg}px ${sp.sm}px` }}>
        <span style={{ fontSize: 26, fontWeight: 700 }}>Partidas</span>
        <Button label="+ Nova" onClick={() => setShowNew(true)} style={{ padding: `${sp.sm}px ${sp.md}px`, fontSize: 14 }} />
      </div>

      {matches.length === 0 ? (
        <div style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: sp.xl }}>
          <span style={{ color: c.textSecondary, textAlign: 'center', lineHeight: 1.6 }}>
            Nenhuma partida registrada ainda.{'\n'}Toque em "+ Nova" para começar!
          </span>
        </div>
      ) : (
        <div style={{ flex: 1, overflowY: 'auto', padding: sp.md, display: 'flex', flexDirection: 'column', gap: sp.sm }}>
          {matches.map((m) => (
            <MatchCard
              key={m.id}
              match={m}
              findLegend={findLegend}
              onDelete={() => setMatches((prev) => prev.filter((x) => x.id !== m.id))}
            />
          ))}
        </div>
      )}
    </div>
  );
}
