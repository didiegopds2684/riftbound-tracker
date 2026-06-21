export type GameResult = 'win' | 'draw' | 'loss';
export type MatchMode = '1v1' | '2v2';
export type MatchFormat = 'bo1' | 'bo3';
export type TournamentType =
  | 'casual' | 'nexus_nights' | 'summoners_skirmish'
  | 'regional_qualifier' | 'regional_championship'
  | 'world_championship' | 'custom_tournament';

export interface Legend {
  id: string;
  name: string;
  domain: string;
  image_url: string;
}

export interface Match {
  id: string;
  mode: MatchMode;
  match_format: MatchFormat;
  match_date: string;
  my_legend_id: string;
  opponent_legend_ids: string[];
  tournament_type: TournamentType;
  notes?: string;
  final_result: GameResult;
  score_summary: string;
}

export interface Profile {
  name: string;
  nickname: string;
  favorite_legend_id: string | null;
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
