import React, { CSSProperties } from 'react';
import { c, r, sp } from '../theme';

type Variant = 'primary' | 'secondary' | 'danger' | 'ghost';

interface Props {
  label: string;
  onClick?: () => void;
  variant?: Variant;
  loading?: boolean;
  disabled?: boolean;
  style?: CSSProperties;
  fullWidth?: boolean;
}

const variants: Record<Variant, CSSProperties> = {
  primary: { background: c.primary, color: '#0A0E1A' },
  secondary: { background: c.surfaceElevated, color: c.textPrimary, border: `1px solid ${c.border}` },
  danger: { background: c.loss + '22', color: c.loss, border: `1px solid ${c.loss}` },
  ghost: { background: 'transparent', color: c.textSecondary },
};

export function Button({ label, onClick, variant = 'primary', loading, disabled, style, fullWidth }: Props) {
  return (
    <button
      onClick={onClick}
      disabled={disabled || loading}
      style={{
        borderRadius: r.md,
        padding: `${sp.md}px ${sp.lg}px`,
        fontSize: 15,
        fontWeight: 700,
        cursor: disabled || loading ? 'not-allowed' : 'pointer',
        opacity: disabled || loading ? 0.5 : 1,
        transition: 'opacity 0.15s',
        width: fullWidth ? '100%' : 'auto',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        gap: sp.sm,
        border: 'none',
        ...variants[variant],
        ...style,
      }}
    >
      {loading ? '…' : label}
    </button>
  );
}
