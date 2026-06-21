import React, { useState } from 'react';
import { c, sp } from '../theme';
import { MOCK_LEGENDS, MOCK_MATCHES, MOCK_PROFILE } from '../mocks/data';
import { MatchCounterScreen } from './MatchCounterScreen';
import { MatchesScreen } from './MatchesScreen';
import { LegendsScreen } from './LegendsScreen';
import { ProfileScreen } from './ProfileScreen';

type Tab = 'jogar' | 'partidas' | 'legends' | 'perfil';

const TABS: { id: Tab; label: string; icon: string }[] = [
  { id: 'jogar',    label: 'Jogar',    icon: '⚔' },
  { id: 'partidas', label: 'Partidas', icon: '📋' },
  { id: 'legends',  label: 'Legends',  icon: '🏆' },
  { id: 'perfil',   label: 'Perfil',   icon: '👤' },
];

export function FullApp() {
  const [tab, setTab] = useState<Tab>('jogar');

  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
      <div style={{ flex: 1, overflow: 'hidden', display: 'flex', flexDirection: 'column' }}>
        {tab === 'jogar'    && <MatchCounterScreen />}
        {tab === 'partidas' && <MatchesScreen initialMatches={MOCK_MATCHES} legends={MOCK_LEGENDS} />}
        {tab === 'legends'  && <LegendsScreen matches={MOCK_MATCHES} legends={MOCK_LEGENDS} />}
        {tab === 'perfil'   && <ProfileScreen initialProfile={MOCK_PROFILE} legends={MOCK_LEGENDS} />}
      </div>

      <div style={{
        display: 'flex', backgroundColor: c.surface,
        borderTop: `1px solid ${c.border}`, height: 60, flexShrink: 0,
      }}>
        {TABS.map((t) => {
          const active = t.id === tab;
          return (
            <button key={t.id} onClick={() => setTab(t.id)} style={{
              flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center',
              justifyContent: 'center', gap: 2, background: 'none', border: 'none', cursor: 'pointer',
              color: active ? c.primary : c.textMuted,
            }}>
              <span style={{ fontSize: active ? 22 : 18, transition: 'font-size 0.15s' }}>{t.icon}</span>
              <span style={{ fontSize: 11, fontWeight: 600 }}>{t.label}</span>
            </button>
          );
        })}
      </div>
    </div>
  );
}
