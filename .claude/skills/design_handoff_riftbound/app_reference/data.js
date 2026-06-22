// Riftbound Tracker — mock data for the UI kit (plain global script).
(function () {
  const splash = (n) => `https://ddragon.leagueoflegends.com/cdn/img/champion/splash/${n}_0.jpg`;

  const LEGENDS = [
    { id: '1',  name: 'Ahri',    domain: 'Calm',  image_url: splash('Ahri') },
    { id: '2',  name: 'Ashe',    domain: 'Order', image_url: splash('Ashe') },
    { id: '3',  name: 'Garen',   domain: 'Order', image_url: splash('Garen') },
    { id: '4',  name: 'Jhin',    domain: 'Mind',  image_url: splash('Jhin') },
    { id: '5',  name: 'Jinx',    domain: 'Chaos', image_url: splash('Jinx') },
    { id: '6',  name: 'Lux',     domain: 'Order', image_url: splash('Lux') },
    { id: '7',  name: 'Vi',      domain: 'Body',  image_url: splash('Vi') },
    { id: '8',  name: 'Yasuo',   domain: 'Fury',  image_url: splash('Yasuo') },
    { id: '9',  name: 'Zed',     domain: 'Mind',  image_url: splash('Zed') },
    { id: '10', name: 'Caitlyn', domain: 'Order', image_url: splash('Caitlyn') },
    { id: '11', name: 'Thresh',  domain: 'Chaos', image_url: splash('Thresh') },
    { id: '12', name: 'Darius',  domain: 'Fury',  image_url: splash('Darius') },
  ];
  const byId = Object.fromEntries(LEGENDS.map((l) => [l.id, l]));

  const PROFILE = { name: 'Diego Santos', nickname: 'diegosantos', favorite_legend_id: '1' };

  const TOURNAMENT_LABELS = {
    casual: 'Jogo Casual', nexus_nights: 'Nexus Nights',
    summoners_skirmish: "Summoner's Skirmish", regional_qualifier: 'Regional Qualifier',
    regional_championship: 'Regional Championship', world_championship: 'World Championship',
    custom_tournament: 'Custom Tournament',
  };

  const MATCHES = [
    { id: 'm1', mode: '1v1', match_format: 'bo3', match_date: '2026-06-20', my_legend_id: '1', opponent_legend_ids: ['5'], tournament_type: 'nexus_nights', final_result: 'win',  score_summary: '2-1', notes: 'Partida difícil, mas consegui virar no game 3.' },
    { id: 'm2', mode: '1v1', match_format: 'bo1', match_date: '2026-06-19', my_legend_id: '1', opponent_legend_ids: ['8'], tournament_type: 'casual',       final_result: 'loss', score_summary: '0-1' },
    { id: 'm3', mode: '1v1', match_format: 'bo3', match_date: '2026-06-18', my_legend_id: '1', opponent_legend_ids: ['4'], tournament_type: 'summoners_skirmish', final_result: 'win', score_summary: '2-0' },
    { id: 'm4', mode: '2v2', match_format: 'bo1', match_date: '2026-06-17', my_legend_id: '1', opponent_legend_ids: ['3','6'], tournament_type: 'casual',   final_result: 'draw', score_summary: '1-1' },
    { id: 'm5', mode: '1v1', match_format: 'bo3', match_date: '2026-06-15', my_legend_id: '1', opponent_legend_ids: ['11'], tournament_type: 'regional_qualifier', final_result: 'win', score_summary: '2-0' },
    { id: 'm6', mode: '1v1', match_format: 'bo1', match_date: '2026-06-14', my_legend_id: '8', opponent_legend_ids: ['1'], tournament_type: 'casual',      final_result: 'win',  score_summary: '1-0' },
  ];

  // Per-Legend aggregate + head-to-head matchups for the Champion-Detail screen.
  // wins/total are vs each rival; winrate sorts them into advantages / challenges.
  const LEGEND_STATS = {
    '1': {
      legend: byId['1'],
      wins: 9, losses: 4, draws: 1, total: 14,
      firstWinRate: 71, secondWinRate: 57,
      matchups: [
        { id: '4',  wins: 5, total: 6, draws: 0 },
        { id: '11', wins: 4, total: 5, draws: 0 },
        { id: '5',  wins: 6, total: 9, draws: 0 },
        { id: '3',  wins: 2, total: 4, draws: 1 },
        { id: '8',  wins: 1, total: 6, draws: 0 },
        { id: '9',  wins: 1, total: 5, draws: 1 },
      ],
    },
  };

  window.RBData = { splash, LEGENDS, byId, PROFILE, MATCHES, TOURNAMENT_LABELS, LEGEND_STATS };
})();
