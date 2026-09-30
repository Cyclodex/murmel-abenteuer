-- Online-Rangliste (#9): einmal im Supabase SQL-Editor ausführen (New query -> einfügen -> Run).
-- Mehrmals ausführen schadet nicht.
--
-- Eine Tabelle: pro Name (ohne Gross/Klein) und Level die Fahrt mit den meisten Punkten, mit Geist-Aufnahme.
-- Das Spiel (src/online.js) greift nur über die drei Funktionen unten zu, nie direkt auf die Tabelle:
--   submit_run  Fahrt eintragen, ersetzt die alte nur bei mehr Punkten
--   get_ranking alle Fahrten ohne Aufnahme (klein), die Punkte rechnet das Spiel mit src/score.js neu
--   get_ghost   Aufnahme einer Fahrt, erst wenn jemand gegen sie fahren will

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

-- Kein direkter Zugriff mit dem öffentlichen Key: RLS an, keine Policies, keine Rechte auf die Tabelle
alter table public.runs enable row level security;
revoke all on table public.runs from anon, authenticated, public;

create or replace function public.submit_run(
  p_name text, p_level text, p_stars int, p_total int, p_seconds numeric, p_falls int, p_power text, p_score int,
  p_ghost jsonb default null
) returns boolean
language plpgsql security definer set search_path = '' as $$
declare
  n text := regexp_replace(btrim(coalesce(p_name, '')), '\s+', ' ', 'g');
  changed int;
begin
  if char_length(n) not between 1 and 16 or n ~ '[[:cntrl:]]' then raise exception 'name'; end if;
  if coalesce(p_level, '') !~ '^[a-z0-9]{1,16}$' then raise exception 'level'; end if;
  if p_total not between 0 and 50 or p_stars not between 0 and p_total then raise exception 'stars'; end if;
  if p_seconds is null or p_seconds <= 0 or p_seconds >= 10000 then raise exception 'seconds'; end if;
  if p_falls not between 0 and 9999 then raise exception 'falls'; end if;
  if p_power not in ('sanft', 'normal', 'extrem') then raise exception 'power'; end if;
  if p_score not between 0 and 100000 then raise exception 'score'; end if;
  -- Aufnahme: { t, skin, p: [x, y, z, ...] }, höchstens 64 KB (bei 134 Bytes pro Sekunde etwa 8 Minuten Fahrt)
  if p_ghost is not null and (jsonb_typeof(p_ghost) <> 'object' or jsonb_typeof(p_ghost -> 'p') <> 'array'
      or octet_length(p_ghost::text) > 65536) then raise exception 'ghost'; end if;

  insert into public.runs as r (name, level, stars, total, seconds, falls, power, score, ghost)
  values (n, p_level, p_stars, p_total, p_seconds, p_falls, p_power, p_score, p_ghost)
  on conflict (name_key, level) do update
    set name = excluded.name, stars = excluded.stars, total = excluded.total, seconds = excluded.seconds,
        falls = excluded.falls, power = excluded.power, score = excluded.score, ghost = excluded.ghost, updated_at = now()
    where excluded.score > r.score;
  get diagnostics changed = row_count;
  return changed > 0;
end $$;

create or replace function public.get_ranking()
returns table (name text, level text, stars int, total int, seconds numeric, falls int, power text, score int, ghost boolean)
language sql stable security definer set search_path = '' as $$
  select r.name, r.level, r.stars, r.total, r.seconds, r.falls, r.power, r.score, r.ghost is not null
  from public.runs r order by r.score desc limit 20000;
$$;

create or replace function public.get_ghost(p_name text, p_level text)
returns jsonb
language sql stable security definer set search_path = '' as $$
  select r.ghost from public.runs r where r.name_key = lower(btrim(p_name)) and r.level = p_level;
$$;

-- Nur diese drei Funktionen sind mit dem öffentlichen Key aufrufbar
revoke all on function public.submit_run(text, text, int, int, numeric, int, text, int, jsonb) from public;
revoke all on function public.get_ranking() from public;
revoke all on function public.get_ghost(text, text) from public;
grant execute on function public.submit_run(text, text, int, int, numeric, int, text, int, jsonb) to anon, authenticated;
grant execute on function public.get_ranking() to anon, authenticated;
grant execute on function public.get_ghost(text, text) to anon, authenticated;

-- PostgREST soll die neuen Funktionen sofort kennen
notify pgrst, 'reload schema';
