-- Online-Rangliste (#9): einmal im Supabase SQL-Editor ausführen (New query -> einfügen -> Run).
-- Mehrmals ausführen schadet nicht.
--
-- Eine Tabelle: pro Name (ohne Gross/Klein) und Level die Fahrt mit den meisten Punkten, mit Geist-Aufnahme,
-- dazu die Bestzeit (best_seconds: schnellste Fahrt ins Ziel, auch wenn sie weniger Punkte hatte) mit ihrer Aufnahme
-- (fast_ghost; die Geister beim Levelstart bleiben die Fahrten mit den meisten Punkten) und die meisten Sterne
-- (max_stars: irgendeine Fahrt ins Ziel, auch mit weniger Punkten; für „Spielstand holen“ auf einem anderen Gerät).
-- updated_at: letzte angenommene Fahrt (mehr Punkte, schneller oder mehr Sterne), also wann jemand zuletzt einen Rekord gefahren ist.
-- Das Spiel (src/online.js) greift nur über die drei Funktionen unten zu, nie direkt auf die Tabelle:
--   submit_run  Fahrt eintragen, ersetzt die alte nur bei mehr Punkten; Bestzeit nur, wenn sie schneller ist,
--              meiste Sterne nur, wenn es mehr sind
--   get_ranking alle Fahrten ohne Aufnahme (klein), die Punkte rechnet das Spiel mit src/score.js neu
--   get_ghost   Aufnahme einer Fahrt (meiste Punkte oder schnellste), erst wenn jemand sie braucht
-- Dazu keepalive für die Action „Rangliste wach halten“ (.github/workflows/rangliste-wach.yml): Supabase pausiert
-- Gratis-Projekte ohne Aktivität, und Lesezugriffe allein haben das im Oktober 2026 nicht verhindert.

create table if not exists public.runs (
  name       text        not null,
  name_key   text        generated always as (lower(name)) stored,
  level      text        not null,
  stars      int         not null,
  total      int         not null,
  seconds    numeric(6,2) not null,
  falls      int         not null,
  power      text        not null,
  score      int         not null,
  ghost      jsonb,
  updated_at timestamptz not null default now(),
  primary key (name_key, level)
);

-- Bestzeit (seit der Rangliste „Schnellste“): bei alten Zeilen die Zeit der Fahrt mit den meisten Punkten
alter table public.runs add column if not exists best_seconds numeric(6,2);
update public.runs set best_seconds = seconds where best_seconds is null or best_seconds > seconds;
-- Aufnahme der schnellsten Fahrt: bei alten Zeilen die der Fahrt mit den meisten Punkten, wenn sie die schnellste ist
alter table public.runs add column if not exists fast_ghost jsonb;
update public.runs set fast_ghost = ghost where fast_ghost is null and ghost is not null and best_seconds = seconds;
-- Meiste Sterne (seit „Spielstand holen“): bei alten Zeilen die der Fahrt mit den meisten Punkten
alter table public.runs add column if not exists max_stars int;
update public.runs set max_stars = stars where max_stars is null or max_stars < stars;

-- Kein direkter Zugriff mit dem öffentlichen Key: RLS an, keine Policies, keine Rechte auf die Tabelle
alter table public.runs enable row level security;
revoke all on table public.runs from anon, authenticated, public;

-- Alte Fassungen entfernen (sonst wären mehrere Funktionen mit gleichem Namen aufrufbar)
drop function if exists public.submit_run(text, text, int, int, numeric, int, text, int, jsonb);
drop function if exists public.submit_run(text, text, int, int, numeric, int, text, int, jsonb, numeric);
drop function if exists public.submit_run(text, text, int, int, numeric, int, text, int, jsonb, numeric, jsonb);

create or replace function public.submit_run(
  p_name text, p_level text, p_stars int, p_total int, p_seconds numeric, p_falls int, p_power text, p_score int,
  p_ghost jsonb default null, p_best numeric default null, p_fast_ghost jsonb default null, p_max_stars int default null
) returns boolean
language plpgsql security definer set search_path = '' as $$
declare
  n text := regexp_replace(btrim(coalesce(p_name, '')), '\s+', ' ', 'g');
  b numeric := least(p_seconds, coalesce(p_best, p_seconds));
  -- Aufnahme der schnellsten Fahrt: eigene, sonst die der gesendeten Fahrt, wenn sie die schnellste ist
  f jsonb := coalesce(p_fast_ghost, case when b = p_seconds then p_ghost end);
  -- meiste Sterne: aus irgendeiner Fahrt, mindestens die der gesendeten
  m int := greatest(p_stars, coalesce(p_max_stars, p_stars));
  changed int;
  faster int;
  more int;
begin
  if char_length(n) not between 1 and 16 or n ~ '[[:cntrl:]]' then raise exception 'name'; end if;
  if coalesce(p_level, '') !~ '^[a-z0-9]{1,16}$' then raise exception 'level'; end if;
  if p_total not between 0 and 50 or p_stars not between 0 and p_total or m > p_total then raise exception 'stars'; end if;
  if p_seconds is null or p_seconds <= 0 or p_seconds >= 10000 then raise exception 'seconds'; end if;
  if p_falls not between 0 and 9999 then raise exception 'falls'; end if;
  if p_power not in ('sanft', 'normal', 'extrem') then raise exception 'power'; end if;
  if p_score not between 0 and 100000 then raise exception 'score'; end if;
  if b <= 0 then raise exception 'best'; end if;
  -- Aufnahme: { t, skin, p: [x, y, z, ...] }, höchstens 64 KB (bei 134 Bytes pro Sekunde etwa 8 Minuten Fahrt)
  if p_ghost is not null and (jsonb_typeof(p_ghost) <> 'object' or jsonb_typeof(p_ghost -> 'p') <> 'array'
      or octet_length(p_ghost::text) > 65536) then raise exception 'ghost'; end if;
  if p_fast_ghost is not null and (jsonb_typeof(p_fast_ghost) <> 'object' or jsonb_typeof(p_fast_ghost -> 'p') <> 'array'
      or octet_length(p_fast_ghost::text) > 65536) then raise exception 'ghost'; end if;

  insert into public.runs as r (name, level, stars, total, seconds, falls, power, score, ghost, best_seconds, fast_ghost, max_stars)
  values (n, p_level, p_stars, p_total, p_seconds, p_falls, p_power, p_score, p_ghost, b, f, m)
  on conflict (name_key, level) do update
    set name = excluded.name, stars = excluded.stars, total = excluded.total, seconds = excluded.seconds,
        falls = excluded.falls, power = excluded.power, score = excluded.score, ghost = excluded.ghost, updated_at = now()
    where excluded.score > r.score;
  get diagnostics changed = row_count;
  update public.runs r set best_seconds = b, fast_ghost = f, updated_at = now()
    where r.name_key = lower(n) and r.level = p_level and (r.best_seconds is null or r.best_seconds > b);
  get diagnostics faster = row_count;
  update public.runs r set max_stars = m, updated_at = now()
    where r.name_key = lower(n) and r.level = p_level and (r.max_stars is null or r.max_stars < m);
  get diagnostics more = row_count;
  return changed + faster + more > 0;
end $$;

-- Neue Spalten (best_seconds, max_stars) in der Antwort: die alte Fassung muss weg, bevor es die neue gibt
drop function if exists public.get_ranking();
create function public.get_ranking()
returns table (name text, level text, stars int, total int, seconds numeric, falls int, power text, score int, ghost boolean,
  best_seconds numeric, fast_ghost boolean, max_stars int)
language sql stable security definer set search_path = '' as $$
  select r.name, r.level, r.stars, r.total, r.seconds, r.falls, r.power, r.score, r.ghost is not null, r.best_seconds,
    r.fast_ghost is not null, coalesce(r.max_stars, r.stars)
  from public.runs r order by r.score desc limit 20000;
$$;

-- p_kind 'zeit': Aufnahme der schnellsten Fahrt, sonst die der Fahrt mit den meisten Punkten
drop function if exists public.get_ghost(text, text);
create or replace function public.get_ghost(p_name text, p_level text, p_kind text default 'punkte')
returns jsonb
language sql stable security definer set search_path = '' as $$
  select case when p_kind = 'zeit' then r.fast_ghost else r.ghost end
  from public.runs r where r.name_key = lower(btrim(p_name)) and r.level = p_level;
$$;

-- Herzschlag: eine einzige Zeile, die keepalive bei jedem Aufruf überschreibt (ein echter Schreibzugriff)
create table if not exists public.heartbeat (
  id    int         primary key default 1 check (id = 1),
  at    timestamptz not null default now(),
  beats bigint      not null default 1
);
alter table public.heartbeat enable row level security;
revoke all on table public.heartbeat from anon, authenticated, public;

create or replace function public.keepalive()
returns timestamptz
language sql volatile security definer set search_path = '' as $$
  insert into public.heartbeat as h (id) values (1)
  on conflict (id) do update set at = now(), beats = h.beats + 1
  returning h.at;
$$;

-- Nur diese Funktionen sind mit dem öffentlichen Key aufrufbar
revoke all on function public.submit_run(text, text, int, int, numeric, int, text, int, jsonb, numeric, jsonb, int) from public;
revoke all on function public.get_ranking() from public;
revoke all on function public.get_ghost(text, text, text) from public;
revoke all on function public.keepalive() from public;
grant execute on function public.submit_run(text, text, int, int, numeric, int, text, int, jsonb, numeric, jsonb, int) to anon, authenticated;
grant execute on function public.get_ranking() to anon, authenticated;
grant execute on function public.get_ghost(text, text, text) to anon, authenticated;
grant execute on function public.keepalive() to anon, authenticated;

-- PostgREST soll die neuen Funktionen sofort kennen
notify pgrst, 'reload schema';
