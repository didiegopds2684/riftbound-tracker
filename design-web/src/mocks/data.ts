import { Legend, Match, Profile } from '../types';

export const MOCK_LEGENDS: Legend[] = [
  { id: '1', name: 'Ahri', domain: 'Calm', image_url: 'https://ddragon.leagueoflegends.com/cdn/img/champion/splash/Ahri_0.jpg' },
  { id: '2', name: 'Ashe', domain: 'Order', image_url: 'https://ddragon.leagueoflegends.com/cdn/img/champion/splash/Ashe_0.jpg' },
  { id: '3', name: 'Garen', domain: 'Order', image_url: 'https://ddragon.leagueoflegends.com/cdn/img/champion/splash/Garen_0.jpg' },
  { id: '4', name: 'Jhin', domain: 'Mind', image_url: 'https://ddragon.leagueoflegends.com/cdn/img/champion/splash/Jhin_0.jpg' },
  { id: '5', name: 'Jinx', domain: 'Chaos', image_url: 'https://ddragon.leagueoflegends.com/cdn/img/champion/splash/Jinx_0.jpg' },
  { id: '6', name: 'Lux', domain: 'Order', image_url: 'https://ddragon.leagueoflegends.com/cdn/img/champion/splash/Lux_0.jpg' },
  { id: '7', name: 'Vi', domain: 'Body', image_url: 'https://ddragon.leagueoflegends.com/cdn/img/champion/splash/Vi_0.jpg' },
  { id: '8', name: 'Yasuo', domain: 'Fury', image_url: 'https://ddragon.leagueoflegends.com/cdn/img/champion/splash/Yasuo_0.jpg' },
  { id: '9', name: 'Zed', domain: 'Mind', image_url: 'https://ddragon.leagueoflegends.com/cdn/img/champion/splash/Zed_0.jpg' },
  { id: '10', name: 'Caitlyn', domain: 'Order', image_url: 'https://ddragon.leagueoflegends.com/cdn/img/champion/splash/Caitlyn_0.jpg' },
  { id: '11', name: 'Thresh', domain: 'Chaos', image_url: 'https://ddragon.leagueoflegends.com/cdn/img/champion/splash/Thresh_0.jpg' },
  { id: '12', name: 'Darius', domain: 'Fury', image_url: 'https://ddragon.leagueoflegends.com/cdn/img/champion/splash/Darius_0.jpg' },
];

export const MOCK_PROFILE: Profile = {
  name: 'Diego Santos',
  nickname: 'diegosantos',
  favorite_legend_id: '1',
};

export const MOCK_MATCHES: Match[] = [
  {
    id: 'm1',
    mode: '1v1',
    match_format: 'bo3',
    match_date: '2026-06-20',
    my_legend_id: '1',
    opponent_legend_ids: ['5'],
    tournament_type: 'nexus_nights',
    final_result: 'win',
    score_summary: '2-1',
    notes: 'Partida difícil, mas consegui virar no game 3.',
  },
  {
    id: 'm2',
    mode: '1v1',
    match_format: 'bo1',
    match_date: '2026-06-19',
    my_legend_id: '1',
    opponent_legend_ids: ['8'],
    tournament_type: 'casual',
    final_result: 'loss',
    score_summary: '0-1',
  },
  {
    id: 'm3',
    mode: '1v1',
    match_format: 'bo3',
    match_date: '2026-06-18',
    my_legend_id: '1',
    opponent_legend_ids: ['4'],
    tournament_type: 'summoners_skirmish',
    final_result: 'win',
    score_summary: '2-0',
  },
  {
    id: 'm4',
    mode: '2v2',
    match_format: 'bo1',
    match_date: '2026-06-17',
    my_legend_id: '1',
    opponent_legend_ids: ['3', '6'],
    tournament_type: 'casual',
    final_result: 'draw',
    score_summary: '1-1',
  },
];
