import React, { useState } from 'react';
import { c, card, r, sp } from '../theme';
import { Button } from '../components/Button';
import { FormField } from '../components/FormField';

type Mode = 'login' | 'register' | 'forgot';

export function AuthScreen() {
  const [mode, setMode] = useState<Mode>('login');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [nickname, setNickname] = useState('');
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState<string | null>(null);

  function fakeSubmit() {
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      if (mode === 'register') setMessage('Confirme seu email para ativar a conta!');
      if (mode === 'forgot') setMessage('Link de redefinição enviado!');
    }, 1000);
  }

  function switchMode(m: Mode) { setMode(m); setMessage(null); }

  return (
    <div style={{ flex: 1, overflowY: 'auto', padding: sp.lg, display: 'flex', flexDirection: 'column', justifyContent: 'center', gap: sp.xl }}>
      <div style={{ textAlign: 'center' }}>
        <div style={{ fontSize: 56 }}>⚔</div>
        <div style={{ fontSize: 26, fontWeight: 700, color: c.primary, marginTop: sp.sm }}>Riftbound Tracker</div>
        <div style={{ fontSize: 13, color: c.textSecondary, marginTop: 4 }}>Diário de partidas pessoal</div>
      </div>

      <div style={{ ...card, display: 'flex', flexDirection: 'column', gap: sp.md }}>
        <div style={{ fontSize: 20, fontWeight: 700 }}>
          {mode === 'login' ? 'Entrar' : mode === 'register' ? 'Criar conta' : 'Recuperar senha'}
        </div>

        {mode === 'register' && (
          <>
            <FormField label="Nome" value={name} onChange={(e) => setName(e.target.value)} placeholder="Seu nome" />
            <FormField label="Nickname" value={nickname} onChange={(e) => setNickname(e.target.value)} placeholder="nick único" />
          </>
        )}
        <FormField label="Email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="email@exemplo.com" type="email" />
        {mode !== 'forgot' && (
          <FormField label="Senha" value={password} onChange={(e) => setPassword(e.target.value)} placeholder="••••••••" type="password" />
        )}

        {message && <div style={{ color: c.win, fontSize: 13, textAlign: 'center' }}>{message}</div>}

        <Button
          label={mode === 'login' ? 'Entrar' : mode === 'register' ? 'Criar conta' : 'Enviar link'}
          onClick={fakeSubmit}
          loading={loading}
          fullWidth
        />

        <div style={{ display: 'flex', justifyContent: 'space-between', flexWrap: 'wrap', gap: sp.sm }}>
          {mode === 'login' ? (
            <>
              <button onClick={() => switchMode('register')} style={{ color: c.primary, fontSize: 14, background: 'none', border: 'none', cursor: 'pointer' }}>Criar conta</button>
              <button onClick={() => switchMode('forgot')} style={{ color: c.primary, fontSize: 14, background: 'none', border: 'none', cursor: 'pointer' }}>Esqueci a senha</button>
            </>
          ) : (
            <button onClick={() => switchMode('login')} style={{ color: c.primary, fontSize: 14, background: 'none', border: 'none', cursor: 'pointer' }}>← Voltar ao login</button>
          )}
        </div>
      </div>

      <div style={{ color: c.textMuted, fontSize: 11, textAlign: 'center', lineHeight: 1.6 }}>
        App não-oficial • Não afiliado à Riot Games{'\n'}Dados de cartas via Riftcodex (fan project)
      </div>
    </div>
  );
}
