export type GameResult = 'win' | 'draw' | 'loss';
export type MatchMode = '1v1' | '2v2';
export type MatchFormat = 'bo1' | 'bo3';
export type TournamentType =
  | 'casual'
  | 'nexus_nights'
  | 'summoners_skirmish'
  | 'regional_qualifier'
  | 'regional_championship'
  | 'world_championship'
  | 'custom_tournament';

export interface Profile {
  id: string;
  name: string;
  nickname: string;
  favorite_champion_id: string | null;
  created_at: string;
}

export interface Champion {
  id: string;
  name: string;
  domain: string;
  image_url: string;
  set_code: string;
  synced_at: string;
}

export interface Match {
  id: string;
  user_id: string;
  mode: MatchMode;
  match_format: MatchFormat;
  match_date: string;
  my_champion_id: string;
  partner_champion_id: string | null;
  opponent_champion_ids: string[];
  tournament_type: TournamentType;
  notes: string | null;
  final_result: GameResult;
  score_summary: string;
  created_at: string;
  games?: MatchGame[];
  my_champion?: Champion;
  opponent_champions?: Champion[];
}

export interface MatchGame {
  id: string;
  match_id: string;
  game_number: number;
  result: GameResult;
}

export interface ChampionStats {
  champion: Champion;
  wins: number;
  losses: number;
  draws: number;
  total: number;
  winRate: number;
  isMostPlayed: boolean;
}

export const TOURNAMENT_LABELS: Record<TournamentType, string> = {
  casual: 'Jogo Casual',
  nexus_nights: 'Nexus Nights',
  summoners_skirmish: "Summoner's Skirmish",
  regional_qualifier: 'Regional Qualifier',
  regional_championship: 'Regional Championship',
  world_championship: 'World Championship',
  custom_tournament: 'Custom Tournament',
};
