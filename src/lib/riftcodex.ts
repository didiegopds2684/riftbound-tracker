import { Champion } from '../types';
import { supabase } from './supabase';

const RIFTCODEX_BASE = 'https://api.riftcodex.com';
const CACHE_TTL_HOURS = 24;
const VARIANT_RE = /\(.*\)/;

interface RiftcodexCard {
  id: string;
  name: string;
  classification: {
    type: string;
    supertype: string | null;
    rarity: string;
    domain: string[];
  };
  media: {
    image_url: string;
    artist?: string;
  };
  set: {
    set_id: string;
    label?: string;
  };
}

interface RiftcodexResponse {
  items: RiftcodexCard[];
  total: number;
  page: number;
  size: number;
  pages: number;
}

async function fetchLegendsFromAPI(): Promise<Champion[]> {
  let allCards: RiftcodexCard[] = [];
  let page = 1;
  const size = 100;

  while (true) {
    const res = await fetch(
      `${RIFTCODEX_BASE}/cards?type=Legend&size=${size}&page=${page}&sort=name`
    );
    if (!res.ok) break;

    const json: RiftcodexResponse = await res.json();
    const cards = json.items ?? [];

    if (cards.length === 0) break;
    allCards = [...allCards, ...cards];
    if (page >= json.pages) break;
    page++;
  }

  // API doesn't filter server-side, so filter client-side
  const legends = allCards.filter(
    (c) => c.classification.type === 'Legend' && !VARIANT_RE.test(c.name)
  );

  // Deduplicate by name — keep first occurrence
  const seen = new Set<string>();
  const unique = legends.filter((c) => {
    if (seen.has(c.name)) return false;
    seen.add(c.name);
    return true;
  });

  const now = new Date().toISOString();
  return unique.map((c) => ({
    id: c.id,
    name: c.name,
    domain: c.classification.domain[0] ?? 'Colorless',
    image_url: c.media.image_url ?? '',
    set_code: c.set.set_id ?? '',
    synced_at: now,
  }));
}

export async function getChampions(): Promise<Champion[]> {
  const cutoff = new Date(Date.now() - CACHE_TTL_HOURS * 60 * 60 * 1000).toISOString();

  const { data: cached, error } = await supabase
    .from('champions_cache')
    .select('*')
    .gt('synced_at', cutoff)
    .order('name');

  if (!error && cached && cached.length > 0) {
    return cached as Champion[];
  }

  try {
    const legends = await fetchLegendsFromAPI();
    if (legends.length > 0) {
      await supabase.from('champions_cache').delete().lt('synced_at', cutoff);
      await supabase.from('champions_cache').upsert(legends, { onConflict: 'id' });
      return legends;
    }
  } catch {
    // fall through to stale cache
  }

  const { data: stale } = await supabase.from('champions_cache').select('*').order('name');
  return (stale as Champion[]) ?? [];
}
