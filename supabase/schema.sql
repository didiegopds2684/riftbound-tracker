-- Riftbound Tracker — Supabase schema
-- Run this in the Supabase SQL Editor after creating your project.

-- ────────────────────────────────────────────────────────────────
-- Extensions
-- ────────────────────────────────────────────────────────────────
create extension if not exists "uuid-ossp";

-- ────────────────────────────────────────────────────────────────
-- Enums
-- ────────────────────────────────────────────────────────────────
create type match_mode as enum ('1v1', '2v2');
create type match_format as enum ('bo1', 'bo3');
create type game_result as enum ('win', 'draw', 'loss');
create type tournament_type as enum (
  'casual',
  'nexus_nights',
  'summoners_skirmish',
  'regional_qualifier',
  'regional_championship',
  'world_championship',
  'custom_tournament'
);

-- ────────────────────────────────────────────────────────────────
-- champions_cache
-- Populated by the app via Riftcodex API calls.
-- Public read so all authenticated users can see champions.
-- ────────────────────────────────────────────────────────────────
create table champions_cache (
  id          text primary key,
  name        text not null,
  domain      text not null default 'Colorless',
  image_url   text not null default '',
  set_code    text not null default '',
  synced_at   timestamptz not null default now()
);

alter table champions_cache enable row level security;

create policy "champions readable by authenticated users"
  on champions_cache for select
  to authenticated
  using (true);

create policy "champions writable by authenticated users"
  on champions_cache for all
  to authenticated
  using (true)
  with check (true);

-- ────────────────────────────────────────────────────────────────
-- profiles
-- One row per auth user, created on sign-up.
-- ────────────────────────────────────────────────────────────────
create table profiles (
  id                   uuid primary key references auth.users(id) on delete cascade,
  name                 text not null default '',
  nickname             text not null unique,
  favorite_champion_id text references champions_cache(id) on delete set null,
  created_at           timestamptz not null default now()
);

alter table profiles enable row level security;

create policy "users can read own profile"
  on profiles for select
  to authenticated
  using (auth.uid() = id);

create policy "users can update own profile"
  on profiles for update
  to authenticated
  using (auth.uid() = id);

create policy "users can insert own profile"
  on profiles for insert
  to authenticated
  with check (auth.uid() = id);

-- ────────────────────────────────────────────────────────────────
-- matches
-- ────────────────────────────────────────────────────────────────
create table matches (
  id                   uuid primary key default uuid_generate_v4(),
  user_id              uuid not null references profiles(id) on delete cascade,
  mode                 match_mode not null,
  match_format         match_format not null,
  match_date           date not null,
  my_champion_id       text not null references champions_cache(id),
  partner_champion_id  text references champions_cache(id),
  opponent_champion_ids text[] not null default '{}',
  tournament_type      tournament_type not null default 'casual',
  notes                text,
  final_result         game_result not null,
  score_summary        text not null,
  created_at           timestamptz not null default now()
);

alter table matches enable row level security;

create policy "users can manage own matches"
  on matches for all
  to authenticated
  using (auth.uid() = user_id)
  with check (auth.uid() = user_id);

-- ────────────────────────────────────────────────────────────────
-- match_games
-- ────────────────────────────────────────────────────────────────
create table match_games (
  id          uuid primary key default uuid_generate_v4(),
  match_id    uuid not null references matches(id) on delete cascade,
  game_number int not null check (game_number between 1 and 3),
  result      game_result not null
);

alter table match_games enable row level security;

create policy "users can manage own match games"
  on match_games for all
  to authenticated
  using (
    exists (
      select 1 from matches m
      where m.id = match_games.match_id
        and m.user_id = auth.uid()
    )
  )
  with check (
    exists (
      select 1 from matches m
      where m.id = match_games.match_id
        and m.user_id = auth.uid()
    )
  );

-- ────────────────────────────────────────────────────────────────
-- Indexes
-- ────────────────────────────────────────────────────────────────
create index idx_matches_user_date on matches(user_id, match_date desc);
create index idx_matches_my_champion on matches(user_id, my_champion_id);
create index idx_match_games_match on match_games(match_id);
