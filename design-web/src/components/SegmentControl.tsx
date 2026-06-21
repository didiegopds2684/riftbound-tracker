import React from 'react';
import { c, r, sp } from '../theme';

interface Option<T extends string> { value: T; label: string; }

interface Props<T extends string> {
  label?: string;
  options: Option<T>[];
  value: T;
  onChange: (v: T) => void;
}

export function SegmentControl<T extends string>({ label, options, value, onChange }: Props<T>) {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: sp.xs }}>
      {label && (
        <span style={{ fontSize: 12, fontWeight: 600, color: c.textSecondary, textTransform: 'uppercase', letterSpacing: '0.5px' }}>
          {label}
        </span>
      )}
      <div style={{ display: 'flex', gap: sp.xs }}>
        {options.map((opt) => {
          const active = opt.value === value;
          return (
            <button
              key={opt.value}
              onClick={() => onChange(opt.value)}
              style={{
                flex: 1, padding: `${sp.sm}px ${sp.md}px`,
                borderRadius: r.md, fontSize: 14, fontWeight: 600, cursor: 'pointer',
                border: `1px solid ${active ? c.primary : c.border}`,
                background: active ? c.primary + '22' : c.surfaceElevated,
                color: active ? c.primary : c.textSecondary,
                transition: 'all 0.15s',
              }}
            >
              {opt.label}
            </button>
          );
        })}
      </div>
    </div>
  );
}
