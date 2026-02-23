-- EcoCity Builder – initial schema (matches ERD)
-- Run once against empty DB (e.g. after docker-compose up -d db)

-- Enable UUID generation (PG13+ has gen_random_uuid() built-in)
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- Players (users)
CREATE TABLE IF NOT EXISTS players (
  id            uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  email         text NOT NULL UNIQUE,
  password_hash text NOT NULL,
  display_name  text NOT NULL DEFAULT '',
  created_at    timestamptz NOT NULL DEFAULT now()
);

-- Cities (one per player, many per player)
CREATE TABLE IF NOT EXISTS cities (
  id         uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  player_id  uuid NOT NULL REFERENCES players(id) ON DELETE CASCADE,
  name       text NOT NULL,
  difficulty text NOT NULL,
  seed       bigint NOT NULL,
  turn       int NOT NULL DEFAULT 0,
  budget     int NOT NULL DEFAULT 0,
  state_json jsonb NOT NULL DEFAULT '{}',
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_cities_player_id ON cities(player_id);

-- Decisions (turn history per city)
CREATE TABLE IF NOT EXISTS decisions (
  id        uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  city_id   uuid NOT NULL REFERENCES cities(id) ON DELETE CASCADE,
  turn      int NOT NULL,
  kind      text NOT NULL,
  payload   jsonb NOT NULL DEFAULT '{}',
  delta     jsonb NOT NULL DEFAULT '{}',
  created_at timestamptz NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_decisions_city_id ON decisions(city_id);

-- Achievements (unlocked per city)
CREATE TABLE IF NOT EXISTS achievements (
  id          uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  city_id     uuid NOT NULL REFERENCES cities(id) ON DELETE CASCADE,
  code        text NOT NULL,
  title       text NOT NULL,
  description text NOT NULL DEFAULT '',
  unlocked_at timestamptz NOT NULL DEFAULT now(),
  UNIQUE(city_id, code)
);

CREATE INDEX IF NOT EXISTS idx_achievements_city_id ON achievements(city_id);
