import React from 'react';
import { GameResult } from '../types';
import { c, r } from '../theme';

const CFG = {
  win:  { label: 'Vitória', bg: c.win  + '22', color: c.win  },
  loss: { label: 'Derrota', bg: c.loss + '22', color: c.loss },
  draw: { label: 'Empate',  bg: c.draw + '22', color: c.draw },
};

export function ResultBadge({ result }: { result: GameResult }) {
  const cfg = CFG[result];
  return (
    <span style={{
      padding: '3px 10px', borderRadius: r.full,
      background: cfg.bg, color: cfg.color,
      fontSize: 12, fontWeight: 700,
    }}>
      {cfg.label}
    </span>
  );
}
