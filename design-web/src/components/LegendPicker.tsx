import React, { useMemo, useState } from 'react';
import { Legend } from '../types';
import { c, r, sp } from '../theme';
import { LegendAvatar } from './LegendAvatar';

interface Props {
  legends: Legend[];
  value: string | null;
  onChange: (id: string) => void;
  placeholder?: string;
}

export function LegendPicker({ legends, value, onChange, placeholder = 'Selecionar Legend' }: Props) {
  const [open, setOpen] = useState(false);
  const [search, setSearch] = useState('');
  const selected = legends.find((l) => l.id === value);
  const filtered = useMemo(
    () => legends.filter((l) => l.name.toLowerCase().includes(search.toLowerCase())),
    [legends, search]
  );

  return (
    <div style={{ position: 'relative' }}>
      <button
        onClick={() => setOpen(!open)}
        style={{
          width: '100%', padding: sp.md, borderRadius: r.md,
          background: c.surfaceElevated, border: `1px solid ${c.border}`,
          color: selected ? c.textPrimary : c.textMuted,
          display: 'flex', alignItems: 'center', justifyContent: 'space-between',
          fontSize: 15, cursor: 'pointer',
        }}
      >
        {selected ? (
          <span style={{ display: 'flex', alignItems: 'center', gap: sp.sm }}>
            <LegendAvatar legend={selected} size={28} />
            {selected.name}
          </span>
        ) : placeholder}
        <span style={{ color: c.textMuted }}>{open ? '▲' : '▼'}</span>
      </button>

      {open && (
        <div style={{
          position: 'absolute', top: '100%', left: 0, right: 0, zIndex: 100,
          background: c.surface, border: `1px solid ${c.border}`,
          borderRadius: r.md, marginTop: 4, maxHeight: 260, overflow: 'hidden',
          display: 'flex', flexDirection: 'column', boxShadow: '0 8px 32px #00000088',
        }}>
          <div style={{ padding: sp.sm }}>
            <input
              autoFocus
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Buscar..."
              style={{
                width: '100%', padding: sp.sm, borderRadius: r.sm,
                background: c.surfaceElevated, border: `1px solid ${c.border}`,
                color: c.textPrimary, fontSize: 14,
              }}
            />
          </div>
          <div style={{ overflowY: 'auto', maxHeight: 200 }}>
            {filtered.map((l) => (
              <button
                key={l.id}
                onClick={() => { onChange(l.id); setOpen(false); setSearch(''); }}
                style={{
                  width: '100%', padding: `${sp.sm}px ${sp.md}px`,
                  display: 'flex', alignItems: 'center', gap: sp.sm,
                  background: l.id === value ? c.surfaceElevated : 'transparent',
                  border: 'none', color: c.textPrimary, fontSize: 14, cursor: 'pointer',
                  textAlign: 'left',
                }}
              >
                <LegendAvatar legend={l} size={32} />
                <div>
                  <div style={{ fontWeight: l.id === value ? 700 : 400 }}>{l.name}</div>
                  <div style={{ fontSize: 11, color: c.textSecondary }}>{l.domain}</div>
                </div>
                {l.id === value && <span style={{ marginLeft: 'auto', color: c.primary }}>✓</span>}
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
