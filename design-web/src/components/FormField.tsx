import React, { CSSProperties, InputHTMLAttributes } from 'react';
import { c, r, sp } from '../theme';

interface Props extends InputHTMLAttributes<HTMLInputElement> {
  label: string;
  error?: string;
  multiline?: boolean;
  rows?: number;
  style?: CSSProperties;
}

export function FormField({ label, error, multiline, rows = 3, style, ...rest }: Props) {
  const inputStyle: CSSProperties = {
    background: c.surfaceElevated,
    border: `1px solid ${error ? c.loss : c.border}`,
    borderRadius: r.md,
    padding: `${sp.md}px`,
    color: c.textPrimary,
    fontSize: 15,
    width: '100%',
    resize: 'none',
    ...style,
  };
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: sp.xs }}>
      <label style={{ fontSize: 12, fontWeight: 600, color: c.textSecondary, textTransform: 'uppercase', letterSpacing: '0.5px' }}>
        {label}
      </label>
      {multiline ? (
        <textarea
          rows={rows}
          style={inputStyle}
          value={rest.value as string}
          onChange={rest.onChange as any}
          placeholder={rest.placeholder}
        />
      ) : (
        <input style={inputStyle} {...rest} />
      )}
      {error && <span style={{ color: c.loss, fontSize: 12 }}>{error}</span>}
    </div>
  );
}
