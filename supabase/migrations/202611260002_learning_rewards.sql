-- Rewards are issued only by trusted database functions. The append-only ledger
-- is the audit source; coin_wallets is an indexed, transactionally maintained
-- balance cache for fast profile and leaderboard reads.

create type public.coin_reward_type as enum ('signup', 'module_completion', 'quiz_completion');

alter table public.profiles
  add column show_on_leaderboard boolean not null default false;
grant update (full_name, avatar_url, show_on_leaderboard) on public.profiles to authenticated;

create table public.coin_wallets (
  user_id uuid primary key references public.profiles(id) on delete cascade,
  balance bigint not null default 0 check (balance >= 0),
  updated_at timestamptz not null default now()
);

create table public.coin_transactions (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references public.profiles(id) on delete cascade,
  reward_type public.coin_reward_type not null,
  amount integer not null check (amount > 0),
  reference_id uuid not null,
  idempotency_key text not null,
  balance_after bigint not null check (balance_after >= 0),
  created_at timestamptz not null default now(),
  unique (user_id, idempotency_key)
);
create index coin_transactions_user_created_idx on public.coin_transactions(user_id, created_at desc);
create index coin_wallets_leaderboard_idx on public.coin_wallets(balance desc, user_id);
create index profiles_leaderboard_optin_idx on public.profiles(id) where show_on_leaderboard;

create table public.module_completions (
  user_id uuid not null references public.profiles(id) on delete cascade,
  module_id uuid not null references public.course_modules(id) on delete cascade,
  completed_at timestamptz not null default now(),
  primary key (user_id, module_id)
);
create index module_completions_module_idx on public.module_completions(module_id);

create table public.quizzes (
  id uuid primary key default gen_random_uuid(),
  module_id uuid not null references public.course_modules(id) on delete cascade,
  slug text not null,
  title text not null,
  passing_percent smallint not null default 70 check (passing_percent between 1 and 100),
  created_at timestamptz not null default now(),
  unique (module_id, slug)
);
create index quizzes_module_idx on public.quizzes(module_id);

create table public.quiz_questions (
  id uuid primary key default gen_random_uuid(),
  quiz_id uuid not null references public.quizzes(id) on delete cascade,
  prompt text not null,
  options jsonb not null check (jsonb_typeof(options) = 'array' and jsonb_array_length(options) >= 2),
  correct_option smallint not null check (correct_option >= 0 and correct_option < jsonb_array_length(options)),
  position integer not null check (position >= 0),
  unique (quiz_id, position)
);
create index quiz_questions_quiz_idx on public.quiz_questions(quiz_id, position);

create table public.quiz_attempts (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references public.profiles(id) on delete cascade,
  quiz_id uuid not null references public.quizzes(id) on delete cascade,
  score_percent smallint not null check (score_percent between 0 and 100),
  passed boolean not null,
  answers jsonb not null,
  submitted_at timestamptz not null default now()
);
create index quiz_attempts_user_quiz_time_idx on public.quiz_attempts(user_id, quiz_id, submitted_at desc);

alter table public.coin_wallets enable row level security;
alter table public.coin_transactions enable row level security;
alter table public.module_completions enable row level security;
alter table public.quizzes enable row level security;
alter table public.quiz_questions enable row level security;
alter table public.quiz_attempts enable row level security;

create policy "learners read own wallet" on public.coin_wallets for select to authenticated
  using (user_id = (select auth.uid()) or (select public.is_admin()));
create policy "learners read own coin history" on public.coin_transactions for select to authenticated
  using (user_id = (select auth.uid()) or (select public.is_admin()));
create policy "learners read own module completions" on public.module_completions for select to authenticated
  using (user_id = (select auth.uid()) or (select public.is_admin()));
create policy "admins manage quizzes" on public.quizzes for all to authenticated
  using ((select public.is_admin())) with check ((select public.is_admin()));
create policy "admins manage quiz questions" on public.quiz_questions for all to authenticated
  using ((select public.is_admin())) with check ((select public.is_admin()));
create policy "learners read own quiz attempts" on public.quiz_attempts for select to authenticated
  using (user_id = (select auth.uid()) or (select public.is_admin()));

grant select on public.coin_wallets, public.coin_transactions, public.module_completions,
  public.quiz_attempts to authenticated;
grant select, insert, update, delete on public.quizzes, public.quiz_questions to authenticated;
revoke insert, update, delete on public.coin_wallets, public.coin_transactions,
  public.module_completions, public.quiz_attempts from anon, authenticated;

-- Existing learner progress was directly writable by clients. Route completion
-- through an RPC so completion rewards and progress are committed together.
revoke insert, update, delete on public.lesson_progress from anon, authenticated;

create or replace function public.award_coin_reward(
  p_user_id uuid,
  p_reward_type public.coin_reward_type,
  p_amount integer,
  p_reference_id uuid,
  p_idempotency_key text
)
returns boolean language plpgsql security definer set search_path = '' as $$
declare
  v_transaction_id uuid;
begin
  if p_amount <= 0 or p_amount > 1000 or p_idempotency_key is null or length(p_idempotency_key) > 160 then
    raise exception using errcode = '22023', message = 'INVALID_REWARD';
  end if;

  insert into public.coin_wallets(user_id, balance)
  values (p_user_id, 0) on conflict (user_id) do nothing;

  insert into public.coin_transactions(user_id, reward_type, amount, reference_id, idempotency_key, balance_after)
  values (p_user_id, p_reward_type, p_amount, p_reference_id, p_idempotency_key, 0)
  on conflict (user_id, idempotency_key) do nothing
  returning id into v_transaction_id;

  if v_transaction_id is null then
    return false;
  end if;

  -- The wallet row lock serializes concurrent awards for this learner.
  update public.coin_wallets
  set balance = balance + p_amount, updated_at = now()
  where user_id = p_user_id;

  update public.coin_transactions
  set balance_after = (select w.balance from public.coin_wallets w where w.user_id = p_user_id)
  where id = v_transaction_id;

  return true;
end;
$$;
revoke all on function public.award_coin_reward(uuid, public.coin_reward_type, integer, uuid, text) from public, anon, authenticated;

create or replace function public.grant_signup_coins()
returns trigger language plpgsql security definer set search_path = '' as $$
begin
  perform public.award_coin_reward(new.id, 'signup'::public.coin_reward_type, 50, new.id, 'signup:' || new.id::text);
  return new;
end;
$$;

create trigger profiles_grant_signup_coins after insert on public.profiles
for each row execute function public.grant_signup_coins();

-- Backfill existing accounts with the one-time new-wallet welcome grant.
do $$
declare
  v_user record;
begin
  for v_user in select p.id from public.profiles p loop
    perform public.award_coin_reward(v_user.id, 'signup'::public.coin_reward_type, 50, v_user.id, 'signup:' || v_user.id::text);
  end loop;
end;
$$;

create or replace function public.mark_lesson_complete(p_lesson_id uuid)
returns table (module_id uuid, module_completed boolean, coins_awarded integer)
language plpgsql security definer set search_path = '' as $$
declare
  v_user_id uuid := auth.uid();
  v_module_id uuid;
  v_course_id uuid;
  v_lesson_preview boolean;
  v_course_published boolean;
  v_lesson_count integer;
  v_completed_count integer;
  v_new_completion uuid;
begin
  if v_user_id is null then
    raise exception using errcode = '28000', message = 'AUTH_REQUIRED';
  end if;

  select l.module_id, m.course_id, l.is_preview, c.published
  into v_module_id, v_course_id, v_lesson_preview, v_course_published
  from public.lessons l
  join public.course_modules m on m.id = l.module_id
  join public.courses c on c.id = m.course_id
  where l.id = p_lesson_id;
  if v_module_id is null then
    raise exception using errcode = 'P0002', message = 'LESSON_NOT_FOUND';
  end if;
  if (v_lesson_preview and not v_course_published)
    or (not v_lesson_preview and not public.has_active_enrollment(v_course_id)) then
    raise exception using errcode = '42501', message = 'ENROLLMENT_REQUIRED';
  end if;

  -- Serialize module completion checks so concurrent final lesson requests
  -- cannot both miss the completed module.
  perform pg_advisory_xact_lock(hashtextextended(v_user_id::text || v_module_id::text, 0));

  insert into public.lesson_progress as existing_progress(user_id, lesson_id, completed_at, last_viewed_at)
  values (v_user_id, p_lesson_id, now(), now())
  on conflict (user_id, lesson_id) do update
    set completed_at = coalesce(existing_progress.completed_at, now()),
        last_viewed_at = now(), updated_at = now();

  select count(*)::integer into v_lesson_count
  from public.lessons l where l.module_id = v_module_id;
  select count(*)::integer into v_completed_count
  from public.lesson_progress lp join public.lessons l on l.id = lp.lesson_id
  where lp.user_id = v_user_id and l.module_id = v_module_id and lp.completed_at is not null;

  if v_lesson_count > 0 and v_completed_count = v_lesson_count then
    insert into public.module_completions as created_completion(user_id, module_id)
    values (v_user_id, v_module_id)
    on conflict (user_id, module_id) do nothing
    returning created_completion.module_id into v_new_completion;
    if v_new_completion is not null then
      perform public.award_coin_reward(v_user_id, 'module_completion'::public.coin_reward_type, 10,
        v_module_id, 'module:' || v_module_id::text);
      return query select v_module_id, true, 10;
      return;
    end if;
    return query select v_module_id, true, 0;
    return;
  end if;

  return query select v_module_id, false, 0;
end;
$$;
revoke all on function public.mark_lesson_complete(uuid) from public, anon;
grant execute on function public.mark_lesson_complete(uuid) to authenticated;

create or replace function public.get_quiz(p_quiz_id uuid)
returns jsonb language plpgsql stable security definer set search_path = '' as $$
declare
  v_user_id uuid := auth.uid();
  v_result jsonb;
begin
  if v_user_id is null then
    raise exception using errcode = '28000', message = 'AUTH_REQUIRED';
  end if;

  select jsonb_build_object(
    'id', q.id, 'slug', q.slug, 'title', q.title, 'passingPercent', q.passing_percent,
    'questions', coalesce((
      select jsonb_agg(jsonb_build_object('id', qq.id, 'prompt', qq.prompt, 'options', qq.options) order by qq.position)
      from public.quiz_questions qq where qq.quiz_id = q.id
    ), '[]'::jsonb)
  ) into v_result
  from public.quizzes q
  join public.course_modules m on m.id = q.module_id
  where q.id = p_quiz_id and public.has_active_enrollment(m.course_id);

  if v_result is null then
    raise exception using errcode = '42501', message = 'QUIZ_UNAVAILABLE';
  end if;
  return v_result;
end;
$$;
revoke all on function public.get_quiz(uuid) from public, anon;
grant execute on function public.get_quiz(uuid) to authenticated;

create or replace function public.submit_quiz(p_quiz_id uuid, p_answers jsonb)
returns table (attempt_id uuid, score_percent smallint, passed boolean, coins_awarded integer, coin_balance bigint)
language plpgsql security definer set search_path = '' as $$
declare
  v_user_id uuid := auth.uid();
  v_passing_percent smallint;
  v_total integer;
  v_answer_count integer;
  v_correct integer;
  v_score smallint;
  v_passed boolean;
  v_attempt_id uuid;
  v_coins_awarded integer := 0;
  v_balance bigint;
begin
  if v_user_id is null then
    raise exception using errcode = '28000', message = 'AUTH_REQUIRED';
  end if;
  if jsonb_typeof(p_answers) <> 'object' then
    raise exception using errcode = '22023', message = 'INVALID_ANSWERS';
  end if;

  select q.passing_percent into v_passing_percent
  from public.quizzes q join public.course_modules m on m.id = q.module_id
  where q.id = p_quiz_id and public.has_active_enrollment(m.course_id);
  if v_passing_percent is null then
    raise exception using errcode = '42501', message = 'QUIZ_UNAVAILABLE';
  end if;

  perform pg_advisory_xact_lock(hashtextextended(v_user_id::text || p_quiz_id::text, 0));
  if (select count(*) from public.quiz_attempts qa
      where qa.user_id = v_user_id and qa.quiz_id = p_quiz_id
        and qa.submitted_at > now() - interval '1 hour') >= 30 then
    raise exception using errcode = 'P0001', message = 'QUIZ_ATTEMPT_LIMIT';
  end if;

  select count(*)::integer into v_total from public.quiz_questions qq where qq.quiz_id = p_quiz_id;
  select count(*)::integer into v_answer_count from jsonb_each(p_answers);
  if v_total = 0 or v_answer_count <> v_total
    or exists (
      select 1 from jsonb_each(p_answers) a
      where a.key !~* '^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$'
        or jsonb_typeof(a.value) <> 'number'
        or a.value::text !~ '^(0|[1-9][0-9]*)$'
    )
    or exists (
      select 1 from jsonb_each(p_answers) a
      left join public.quiz_questions qq
        on qq.id = case
          when a.key ~* '^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$' then a.key::uuid
          else null
        end
       and qq.quiz_id = p_quiz_id
      where qq.id is null
    ) then
    raise exception using errcode = '22023', message = 'INVALID_ANSWERS';
  end if;

  select count(*) filter (where qq.correct_option = (p_answers ->> qq.id::text)::integer)::integer
  into v_correct from public.quiz_questions qq where qq.quiz_id = p_quiz_id;
  v_score := floor((100.0 * v_correct) / v_total)::smallint;
  v_passed := v_score >= v_passing_percent;

  insert into public.quiz_attempts(user_id, quiz_id, score_percent, passed, answers)
  values (v_user_id, p_quiz_id, v_score, v_passed, p_answers)
  returning id into v_attempt_id;

  if public.award_coin_reward(v_user_id, 'quiz_completion'::public.coin_reward_type,
      20, p_quiz_id, 'quiz:' || p_quiz_id::text) then
    v_coins_awarded := 20;
  end if;

  select w.balance into v_balance from public.coin_wallets w where w.user_id = v_user_id;
  return query select v_attempt_id, v_score, v_passed, v_coins_awarded, coalesce(v_balance, 0);
end;
$$;
revoke all on function public.submit_quiz(uuid, jsonb) from public, anon;
grant execute on function public.submit_quiz(uuid, jsonb) to authenticated;

create or replace function public.get_coin_leaderboard(p_limit integer default 25, p_offset integer default 0)
returns table (user_id uuid, display_name text, coins bigint, rank bigint)
language sql stable security definer set search_path = '' as $$
  with page as materialized (
    select p.id, coalesce(nullif(trim(p.full_name), ''), 'Learner') as name,
      w.balance
    from public.coin_wallets w join public.profiles p on p.id = w.user_id
    where p.show_on_leaderboard and w.balance > 0
    order by w.balance desc, p.id asc
    limit least(greatest(coalesce(p_limit, 25), 1), 100)
    offset least(greatest(coalesce(p_offset, 0), 0), 10000)
  )
  select p.id, p.name, p.balance,
    row_number() over (order by p.balance desc, p.id asc) + least(greatest(coalesce(p_offset, 0), 0), 10000)
  from page p
  where auth.uid() is not null
  order by p.balance desc, p.id asc
$$;
revoke all on function public.get_coin_leaderboard(integer, integer) from public, anon;
grant execute on function public.get_coin_leaderboard(integer, integer) to authenticated;
