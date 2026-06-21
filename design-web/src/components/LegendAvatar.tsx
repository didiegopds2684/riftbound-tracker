import React, { useState } from 'react';
import { Legend } from '../types';
import { c, DOMAIN_COLORS } from '../theme';

interface Props {
  legend: Legend | undefined;
  size?: number;
  showName?: boolean;
}

export function LegendAvatar({ legend, size = 48, showName = false }: Props) {
  const [imgError, setImgError] = useState(false);
  const borderColor = DOMAIN_COLORS[legend?.domain ?? 'Colorless'] ?? c.border;

  return (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 4 }}>
      <div style={{
        width: size, height: size, borderRadius: '50%',
        border: `2px solid ${borderColor}`,
        overflow: 'hidden', flexShrink: 0,
        background: c.surfaceElevated,
        display: 'flex', alignItems: 'center', justifyContent: 'center',
      }}>
        {legend?.image_url && !imgError ? (
          <img
            src={legend.image_url}
            alt={legend.name}
            onError={() => setImgError(true)}
            style={{ width: '100%', height: '100%', objectFit: 'cover', objectPosition: 'top' }}
          />
        ) : (
          <span style={{ fontSize: size * 0.4, fontWeight: 700, color: c.textSecondary }}>
            {legend?.name?.[0] ?? '?'}
          </span>
        )}
      </div>
      {showName && legend && (
        <span style={{ fontSize: 11, color: c.textSecondary, textAlign: 'center', maxWidth: 64, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
          {legend.name}
        </span>
      )}
    </div>
  );
}
