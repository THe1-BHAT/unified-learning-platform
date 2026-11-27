create table public.learner_activity_stats (
  user_id uuid primary key references public.profiles(id) on delete cascade,
  watch_seconds bigint not null default 0 check (watch_seconds >= 0),
  tests_taken integer not null default 0 check (tests_taken >= 0),
  welcome_seen_at timestamptz,
  updated_at timestamptz not null default now()
);

create table public.learner_assessment_events (
  user_id uuid not null references public.profiles(id) on delete cascade,
  activity_key text not null check (length(activity_key) between 1 and 160),
  created_at timestamptz not null default now(),
  primary key (user_id, activity_key)
);

alter table public.learner_activity_stats enable row level security;
alter table public.learner_assessment_events enable row level security;

create policy "learners read own activity stats" on public.learner_activity_stats
  for select to authenticated using (user_id = (select auth.uid()));

revoke all on public.learner_activity_stats, public.learner_assessment_events from anon, authenticated;
grant select on public.learner_activity_stats to authenticated;

create or replace function public.record_learner_activity(
  p_activity_key text default null,
  p_watch_seconds integer default 0,
  p_mark_welcome_seen boolean default false
)
returns void language plpgsql security definer set search_path = '' as $$
declare
  v_user_id uuid := auth.uid();
  v_new_attempts integer := 0;
begin
  if v_user_id is null then
    raise exception using errcode = '28000', message = 'AUTH_REQUIRED';
  end if;
  if p_watch_seconds is null or p_watch_seconds < 0 or p_watch_seconds > 60 then
    raise exception using errcode = '22023', message = 'INVALID_WATCH_SECONDS';
  end if;
  if p_activity_key is not null and p_activity_key !~ '^[a-zA-Z0-9:_-]{1,160}$' then
    raise exception using errcode = '22023', message = 'INVALID_ACTIVITY_KEY';
  end if;

  insert into public.learner_activity_stats(user_id)
  values (v_user_id)
  on conflict (user_id) do nothing;

  if p_activity_key is not null then
    insert into public.learner_assessment_events(user_id, activity_key)
    values (v_user_id, p_activity_key)
    on conflict (user_id, activity_key) do nothing;
    get diagnostics v_new_attempts = row_count;
  end if;

  update public.learner_activity_stats
  set watch_seconds = watch_seconds + p_watch_seconds,
      tests_taken = tests_taken + v_new_attempts,
      welcome_seen_at = case
        when p_mark_welcome_seen then coalesce(welcome_seen_at, now())
        else welcome_seen_at
      end,
      updated_at = now()
  where user_id = v_user_id;
end;
$$;

revoke all on function public.record_learner_activity(text, integer, boolean) from public, anon;
grant execute on function public.record_learner_activity(text, integer, boolean) to authenticated;
