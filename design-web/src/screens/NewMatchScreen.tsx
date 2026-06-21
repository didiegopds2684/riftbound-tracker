import React, { useState } from 'react';
import { c, r, sp } from '../theme';
import { GameResult, Legend, Match, MatchFormat, MatchMode, TOURNAMENT_LABELS, TournamentType } from '../types';
import { Button } from '../components/Button';
import { LegendPicker } from '../components/LegendPicker';
import { SegmentControl } from '../components/SegmentControl';

type ResultOption = { v: GameResult; label: string; color: string };
const RESULTS: ResultOption[] = [
  { v: 'win',  label: 'Vitória', color: '#4CAF82' },
  { v: 'draw', label: 'Empate',  color: '#8B8FA8' },
  { v: 'loss', label: 'Derrota', color: '#E05C5C' },
];

function ResultSelector({ value, onChange }: { value: GameResult | null; onChange: (r: GameResult) => void }) {
  return (
    <div style={{ display: 'flex', gap: sp.xs }}>
      {RESULTS.map((opt) => (
        <button key={opt.v} onClick={() => onChange(opt.v)} style={{
          flex: 1, padding: sp.md, borderRadius: r.md, cursor: 'pointer', fontWeight: 600, fontSize: 13,
          border: `1px solid ${value === opt.v ? opt.color : c.border}`,
          background: value === opt.v ? opt.color + '33' : c.surfaceElevated,
          color: value === opt.v ? opt.color : c.textSecondary,
        }}>{opt.label}</button>
      ))}
    </div>
  );
}

const TOURNAMENTS = Object.entries(TOURNAMENT_LABELS) as [TournamentType, string][];

interface Props {
  legends: Legend[];
  onDone: () => void;
  onSave?: (match: Match) => void;
}

export function NewMatchScreen({ legends, onDone, onSave }: Props) {
  const [mode, setMode] = useState<MatchMode>('1v1');
  const [format, setFormat] = useState<MatchFormat>('bo1');
  const [date, setDate] = useState(new Date().toISOString().split('T')[0]);
  const [myLegend, setMyLegend] = useState<string | null>(null);
  const [partnerLegend, setPartnerLegend] = useState<string | null>(null);
  const [oppLegends, setOppLegends] = useState<(string | null)[]>([null]);
  const [game1, setGame1] = useState<GameResult | null>(null);
  const [game2, setGame2] = useState<GameResult | null>(null);
  const [game3, setGame3] = useState<GameResult | null>(null);
  const [tournament, setTournament] = useState<TournamentType>('casual');
  const [tournOpen, setTournOpen] = useState(false);
  const [notes, setNotes] = useState('');
  const [error, setError] = useState<string | null>(null);

  const showG3 = format === 'bo3' && game1 !== null && game2 !== null && game1 !== game2;
  const numOpp = mode === '1v1' ? 1 : 2;

  function updateOpp(i: number, id: string) {
    setOppLegends((prev) => { const n = [...prev]; while (n.length <= i) n.push(null); n[i] = id; return n; });
  }

  function computeResult(): { final_result: GameResult; score_summary: string } {
    const games = [game1, format === 'bo3' ? game2 : null, showG3 ? game3 : null].filter(Boolean) as GameResult[];
    const wins = games.filter((g) => g === 'win').length;
    const losses = games.filter((g) => g === 'loss').length;
    const draws = games.filter((g) => g === 'draw').length;
    return {
      final_result: wins > losses ? 'win' : losses > wins ? 'loss' : 'draw',
      score_summary: `${wins}-${losses}${draws > 0 ? `-${draws}` : ''}`,
    };
  }

  function handleSave() {
    if (!myLegend) { setError('Selecione sua Legend.'); return; }
    if (oppLegends.some((o) => !o)) { setError('Selecione a(s) Legend(s) do(s) oponente(s).'); return; }
    if (!game1) { setError('Defina o resultado do Game 1.'); return; }
    if (format === 'bo3' && !game2) { setError('Defina o resultado do Game 2.'); return; }
    const { final_result, score_summary } = computeResult();
    onSave?.({
      id: Math.random().toString(36).slice(2),
      mode, match_format: format, match_date: date,
      my_legend_id: myLegend,
      opponent_legend_ids: oppLegends.filter(Boolean) as string[],
      tournament_type: tournament, notes: notes.trim() || undefined,
      final_result, score_summary,
    });
  }

  return (
    <div style={{ flex: 1, display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: sp.md, paddingTop: sp.lg, borderBottom: `1px solid ${c.border}` }}>
        <button onClick={onDone} style={{ color: c.primary, background: 'none', border: 'none', cursor: 'pointer', fontSize: 15 }}>← Cancelar</button>
        <span style={{ fontSize: 17, fontWeight: 600 }}>Nova Partida</span>
        <div style={{ width: 80 }} />
      </div>

      <div style={{ flex: 1, overflowY: 'auto', padding: sp.lg, display: 'flex', flexDirection: 'column', gap: sp.lg }}>
        <SegmentControl label="Modo" options={[{value:'1v1',label:'1v1'},{value:'2v2',label:'2v2'}]} value={mode} onChange={(v) => { setMode(v); setOppLegends(v === '2v2' ? [null, null] : [null]); }} />
        <SegmentControl label="Formato" options={[{value:'bo1',label:'Bo1'},{value:'bo3',label:'Bo3'}]} value={format} onChange={setFormat} />

        <div style={{ display: 'flex', flexDirection: 'column', gap: sp.xs }}>
          <label style={{ fontSize: 12, fontWeight: 600, color: c.textSecondary, textTransform: 'uppercase' }}>Data</label>
          <input type="date" value={date} onChange={(e) => setDate(e.target.value)} style={{
            padding: sp.md, borderRadius: r.md, background: c.surfaceElevated,
            border: `1px solid ${c.border}`, color: c.textPrimary, fontSize: 15,
          }} />
        </div>

        <Field label="Minha Legend"><LegendPicker legends={legends} value={myLegend} onChange={setMyLegend} /></Field>

        {mode === '2v2' && (
          <Field label="Legend do parceiro"><LegendPicker legends={legends} value={partnerLegend} onChange={setPartnerLegend} placeholder="Selecionar (opcional)" /></Field>
        )}

        {Array.from({ length: numOpp }).map((_, i) => (
          <Field key={i} label={`Legend do oponente${numOpp > 1 ? ` ${i + 1}` : ''}`}>
            <LegendPicker legends={legends} value={oppLegends[i] ?? null} onChange={(id) => updateOpp(i, id)} />
          </Field>
        ))}

        <Field label="Game 1"><ResultSelector value={game1} onChange={setGame1} /></Field>
        {format === 'bo3' && <Field label="Game 2"><ResultSelector value={game2} onChange={setGame2} /></Field>}
        {showG3 && <Field label="Game 3 (decisivo)"><ResultSelector value={game3} onChange={setGame3} /></Field>}

        <div style={{ display: 'flex', flexDirection: 'column', gap: sp.xs, position: 'relative' }}>
          <label style={{ fontSize: 12, fontWeight: 600, color: c.textSecondary, textTransform: 'uppercase' }}>Tipo de torneio</label>
          <button onClick={() => setTournOpen(!tournOpen)} style={{
            padding: sp.md, borderRadius: r.md, background: c.surfaceElevated,
            border: `1px solid ${c.border}`, color: c.textPrimary, fontSize: 15,
            display: 'flex', justifyContent: 'space-between', cursor: 'pointer',
          }}>
            {TOURNAMENT_LABELS[tournament]} <span>{tournOpen ? '▲' : '▼'}</span>
          </button>
          {tournOpen && (
            <div style={{ background: c.surface, border: `1px solid ${c.border}`, borderRadius: r.md, overflow: 'hidden' }}>
              {TOURNAMENTS.map(([v, label]) => (
                <button key={v} onClick={() => { setTournament(v); setTournOpen(false); }} style={{
                  width: '100%', padding: sp.md, textAlign: 'left', cursor: 'pointer',
                  background: v === tournament ? c.surfaceElevated : 'transparent',
                  border: 'none', color: v === tournament ? c.primary : c.textPrimary,
                  fontWeight: v === tournament ? 700 : 400, fontSize: 14,
                }}>{label}</button>
              ))}
            </div>
          )}
        </div>

        <Field label="Observações (opcional)">
          <textarea value={notes} onChange={(e) => setNotes(e.target.value)} rows={3} placeholder="Notas sobre a partida..." style={{
            width: '100%', padding: sp.md, borderRadius: r.md, resize: 'none',
            background: c.surfaceElevated, border: `1px solid ${c.border}`,
            color: c.textPrimary, fontSize: 15,
          }} />
        </Field>

        {error && <span style={{ color: c.loss, fontSize: 13, textAlign: 'center' }}>{error}</span>}
        <Button label="Salvar partida" onClick={handleSave} fullWidth />
        <div style={{ height: sp.xl }} />
      </div>
    </div>
  );
}

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: sp.xs }}>
      <label style={{ fontSize: 12, fontWeight: 600, color: c.textSecondary, textTransform: 'uppercase' }}>{label}</label>
      {children}
    </div>
  );
}
