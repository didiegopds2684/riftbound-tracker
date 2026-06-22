import { useCallback, useEffect, useState } from 'react';
import { supabase } from '../lib/supabase';
import { Match, MatchGame, GameResult, MatchMode, MatchFormat, TournamentType } from '../types';
import { useAuth } from './useAuth';

export interface CreateMatchInput {
  mode: MatchMode;
  match_format: MatchFormat;
  match_date: string;
  my_champion_id: string;
  partner_champion_id?: string;
  opponent_champion_ids: string[];
  tournament_type: TournamentType;
  notes?: string;
  games: { game_number: number; result: GameResult }[];
}

function computeFinalResult(games: { result: GameResult }[]): { final_result: GameResult; score_summary: string } {
  let wins = 0, losses = 0, draws = 0;
  for (const g of games) {
    if (g.result === 'win') wins++;
    else if (g.result === 'loss') losses++;
    else draws++;
  }
  const final_result: GameResult = wins > losses ? 'win' : losses > wins ? 'loss' : 'draw';
  const score_summary = `${wins}-${losses}${draws > 0 ? `-${draws}` : ''}`;
  return { final_result, score_summary };
}

export function useMatches() {
  const { user } = useAuth();
  const [matches, setMatches] = useState<Match[]>([]);
  const [loading, setLoading] = useState(true);

  const load = useCallback(async () => {
    if (!user) { setLoading(false); return; }
    setLoading(true);
    const { data } = await supabase
      .from('matches')
      .select('*, games:match_games(*)')
      .eq('user_id', user.id)
      .order('match_date', { ascending: false })
      .order('created_at', { ascending: false });
    setMatches((data as Match[]) ?? []);
    setLoading(false);
  }, [user]);

  useEffect(() => { load(); }, [load]);

  async function createMatch(input: CreateMatchInput): Promise<string | null> {
    if (!user) return 'Não autenticado';
    const { final_result, score_summary } = computeFinalResult(input.games);

    // ── Optimistic insert: show the match immediately ─────────────────────────
    const tempId = `temp-${Date.now()}`;
    const optimistic: Match = {
      id: tempId,
      user_id: user.id,
      mode: input.mode,
      match_format: input.match_format,
      match_date: input.match_date,
      my_champion_id: input.my_champion_id,
      partner_champion_id: input.partner_champion_id ?? null,
      opponent_champion_ids: input.opponent_champion_ids,
      tournament_type: input.tournament_type,
      notes: input.notes ?? null,
      final_result,
      score_summary,
      created_at: new Date().toISOString(),
      games: input.games.map((g, i) => ({
        id: `temp-game-${i}`,
        match_id: tempId,
        game_number: g.game_number,
        result: g.result,
      })),
    };
    setMatches((prev) => [optimistic, ...prev]);

    // ── Persist to Supabase ───────────────────────────────────────────────────
    const { data: match, error } = await supabase
      .from('matches')
      .insert({
        user_id: user.id,
        mode: input.mode,
        match_format: input.match_format,
        match_date: input.match_date,
        my_champion_id: input.my_champion_id,
        partner_champion_id: input.partner_champion_id ?? null,
        opponent_champion_ids: input.opponent_champion_ids,
        tournament_type: input.tournament_type,
        notes: input.notes ?? null,
        final_result,
        score_summary,
      })
      .select()
      .single();

    if (error) {
      setMatches((prev) => prev.filter((m) => m.id !== tempId));
      return error.message;
    }

    const realId = (match as Match).id;
    const gameRows = input.games.map((g) => ({
      match_id: realId,
      game_number: g.game_number,
      result: g.result,
    }));

    const { error: gamesError } = await supabase.from('match_games').insert(gameRows);
    if (gamesError) {
      setMatches((prev) => prev.filter((m) => m.id !== tempId));
      return gamesError.message;
    }

    // Replace optimistic entry with real data (correct ID + games)
    const confirmed: Match = {
      ...(match as Match),
      games: input.games.map((g, i) => ({
        id: `confirmed-${i}`,
        match_id: realId,
        game_number: g.game_number,
        result: g.result,
      })),
    };
    setMatches((prev) => prev.map((m) => (m.id === tempId ? confirmed : m)));

    // Background sync to get real game IDs from DB (silent, non-blocking)
    load();
    return null;
  }

  async function deleteMatch(id: string): Promise<string | null> {
    // Optimistic remove
    setMatches((prev) => prev.filter((m) => m.id !== id));
    const { error } = await supabase.from('matches').delete().eq('id', id);
    if (error) {
      // Rollback: reload to restore the deleted item
      load();
      return error.message;
    }
    return null;
  }

  return { matches, loading, reload: load, createMatch, deleteMatch };
}
