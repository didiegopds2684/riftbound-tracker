import { useCallback, useEffect, useRef, useState } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Champion } from '../types';
import { getChampions } from '../lib/riftcodex';

const STORAGE_KEY = 'champions_v1';
const TTL_MS = 6 * 60 * 60 * 1000; // 6 h before background refresh

interface Stored { data: Champion[]; ts: number }

export function useChampions() {
  const [champions, setChampions] = useState<Champion[]>([]);
  const [loading, setLoading]     = useState(true);
  const [error, setError]         = useState<string | null>(null);
  // ref so the background fetch can read current length without stale closure
  const champRef = useRef<Champion[]>([]);

  const load = useCallback(async () => {
    setError(null);

    // ── 1. Device cache — instant, no network ────────────────────────────────
    let stale = true;
    try {
      const raw = await AsyncStorage.getItem(STORAGE_KEY);
      if (raw) {
        const stored: Stored = JSON.parse(raw);
        if (stored.data?.length > 0) {
          setChampions(stored.data);
          champRef.current = stored.data;
          setLoading(false);
          stale = Date.now() - stored.ts > TTL_MS;
          if (!stale) return; // cache is fresh, skip network entirely
        }
      }
    } catch (_) {}

    // ── 2. Background refresh (Supabase → API if needed) ────────────────────
    try {
      const fresh = await getChampions();
      if (fresh.length > 0) {
        setChampions(fresh);
        champRef.current = fresh;
        const stored: Stored = { data: fresh, ts: Date.now() };
        await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(stored));
      }
    } catch (_) {
      if (champRef.current.length === 0) setError('Erro ao carregar Champions.');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { load(); }, [load]);

  const findById = (id: string) => champRef.current.find((c) => c.id === id);

  return { champions, loading, error, reload: load, findById };
}
