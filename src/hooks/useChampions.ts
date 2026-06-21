import { useCallback, useEffect, useState } from 'react';
import { Champion } from '../types';
import { getChampions } from '../lib/riftcodex';

export function useChampions() {
  const [champions, setChampions] = useState<Champion[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const load = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await getChampions();
      setChampions(data);
    } catch (e) {
      setError('Erro ao carregar Champions.');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { load(); }, [load]);

  const findById = (id: string) => champions.find((c) => c.id === id);

  return { champions, loading, error, reload: load, findById };
}
