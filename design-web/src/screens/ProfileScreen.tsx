import React, { useState } from 'react';
import { c, card, sp } from '../theme';
import { Legend, Profile } from '../types';
import { LegendAvatar } from '../components/LegendAvatar';
import { LegendPicker } from '../components/LegendPicker';
import { FormField } from '../components/FormField';
import { Button } from '../components/Button';

interface Props { initialProfile: Profile; legends: Legend[]; }

export function ProfileScreen({ initialProfile, legends }: Props) {
  const [profile, setProfile] = useState<Profile>(initialProfile);
  const [editing, setEditing] = useState(false);
  const [name, setName] = useState(initialProfile.name);
  const [nickname, setNickname] = useState(initialProfile.nickname);
  const [favLegend, setFavLegend] = useState(initialProfile.favorite_legend_id);
  const [loading, setLoading] = useState(false);

  const favLegendObj = legends.find((l) => l.id === profile.favorite_legend_id);

  function save() {
    setLoading(true);
    setTimeout(() => {
      setProfile({ name, nickname, favorite_legend_id: favLegend });
      setEditing(false);
      setLoading(false);
    }, 800);
  }

  function cancel() {
    setName(profile.name);
    setNickname(profile.nickname);
    setFavLegend(profile.favorite_legend_id);
    setEditing(false);
  }

  return (
    <div style={{ flex: 1, overflowY: 'auto', padding: sp.lg, display: 'flex', flexDirection: 'column', gap: sp.lg }}>
      <div style={{ ...card, display: 'flex', alignItems: 'center', gap: sp.md }}>
        <LegendAvatar legend={favLegendObj} size={80} />
        <div>
          <div style={{ fontSize: 20, fontWeight: 700 }}>{profile.name}</div>
          <div style={{ color: '#C89B3C', fontSize: 14, marginTop: 2 }}>@{profile.nickname}</div>
          {favLegendObj && (
            <div style={{ color: c.textSecondary, fontSize: 12, marginTop: 4 }}>Legend favorita: {favLegendObj.name}</div>
          )}
        </div>
      </div>

      {!editing ? (
        <div style={{ ...card, display: 'flex', flexDirection: 'column', gap: sp.md }}>
          <Button label="Editar perfil" onClick={() => setEditing(true)} variant="secondary" fullWidth />
          <Button label="Sair" onClick={() => {}} variant="danger" fullWidth />
        </div>
      ) : (
        <div style={{ ...card, display: 'flex', flexDirection: 'column', gap: sp.md }}>
          <div style={{ fontSize: 17, fontWeight: 600 }}>Editar perfil</div>
          <FormField label="Nome" value={name} onChange={(e) => setName(e.target.value)} />
          <FormField label="Nickname" value={nickname} onChange={(e) => setNickname(e.target.value)} />
          <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
            <label style={{ fontSize: 12, fontWeight: 600, color: c.textSecondary, textTransform: 'uppercase' }}>Legend favorita</label>
            <LegendPicker legends={legends} value={favLegend} onChange={setFavLegend} placeholder="Selecionar Legend favorita" />
          </div>
          <Button label="Salvar" onClick={save} loading={loading} fullWidth />
          <Button label="Cancelar" onClick={cancel} variant="ghost" fullWidth />
        </div>
      )}

      <div style={{ ...card }}>
        <div style={{ fontSize: 16, fontWeight: 600, marginBottom: sp.sm }}>Sobre</div>
        <div style={{ color: c.textSecondary, fontSize: 13, lineHeight: 1.6 }}>
          Riftbound Tracker é um app não-oficial de diário de partidas para o TCG Riftbound.{'\n\n'}
          Não é afiliado, endossado ou patrocinado pela Riot Games.{'\n\n'}
          Dados de cartas fornecidos por Riftcodex, um projeto de fãs independente.
        </div>
      </div>
    </div>
  );
}
