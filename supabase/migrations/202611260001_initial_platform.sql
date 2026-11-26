-- Supabase is the schema source of truth. Prisma is generated/introspected from
-- this schema and is used only by trusted server-side code.
create extension if not exists pgcrypto with schema extensions;

create type public.profile_role as enum ('learner', 'admin');
create type public.enrollment_status as enum ('pending_payment', 'active', 'revoked', 'expired');
create type public.enrollment_source as enum ('coupon', 'payment', 'admin');
create type public.resource_kind as enum ('pdf', 'video', 'link', 'file');
create type public.order_status as enum ('pending', 'paid', 'failed', 'cancelled', 'refunded');
create type public.payment_attempt_status as enum ('created', 'pending', 'succeeded', 'failed', 'cancelled');

create table public.profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  email text unique,
  full_name text,
  avatar_url text,
  role public.profile_role not null default 'learner',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table public.courses (
  id uuid primary key default gen_random_uuid(),
  slug text not null unique,
  title text not null,
  description text not null default '',
  price_paise integer not null check (price_paise >= 0),
  published boolean not null default false,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table public.course_modules (
  id uuid primary key default gen_random_uuid(),
  course_id uuid not null references public.courses(id) on delete cascade,
  slug text not null,
  title text not null,
  position integer not null check (position >= 0),
  unique (course_id, slug),
  unique (course_id, position)
);

create table public.lessons (
  id uuid primary key default gen_random_uuid(),
  module_id uuid not null references public.course_modules(id) on delete cascade,
  slug text not null,
  title text not null,
  content jsonb not null default '{}'::jsonb,
  position integer not null check (position >= 0),
  is_preview boolean not null default false,
  unique (module_id, slug),
  unique (module_id, position)
);

create table public.course_resources (
  id uuid primary key default gen_random_uuid(),
  course_id uuid not null references public.courses(id) on delete cascade,
  title text not null,
  kind public.resource_kind not null,
  storage_key text,
  external_url text,
  is_preview boolean not null default false,
  created_at timestamptz not null default now(),
  check ((storage_key is null) or (external_url is null))
);
create index course_resources_course_idx on public.course_resources(course_id);

create table public.enrollments (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references public.profiles(id) on delete cascade,
  course_id uuid not null references public.courses(id) on delete cascade,
  status public.enrollment_status not null default 'pending_payment',
  source public.enrollment_source not null,
  amount_paid_paise integer not null default 0 check (amount_paid_paise >= 0),
  access_granted_at timestamptz,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (user_id, course_id)
);
create index enrollments_user_status_idx on public.enrollments(user_id, status);
create index enrollments_course_idx on public.enrollments(course_id);

create table public.coupons (
  id uuid primary key default gen_random_uuid(),
  course_id uuid not null references public.courses(id) on delete cascade,
  code_hash text not null unique,
  discount_percent integer not null check (discount_percent between 0 and 100),
  max_redemptions integer check (max_redemptions is null or max_redemptions > 0),
  redemption_count integer not null default 0 check (redemption_count >= 0),
  starts_at timestamptz,
  ends_at timestamptz,
  active boolean not null default true,
  created_at timestamptz not null default now(),
  check (ends_at is null or starts_at is null or ends_at > starts_at)
);
create index coupons_course_active_window_idx on public.coupons(course_id, active, starts_at, ends_at);

create table public.coupon_redemptions (
  id uuid primary key default gen_random_uuid(),
  coupon_id uuid not null references public.coupons(id) on delete restrict,
  user_id uuid not null references public.profiles(id) on delete cascade,
  enrollment_id uuid not null references public.enrollments(id) on delete restrict,
  redeemed_at timestamptz not null default now(),
  unique (coupon_id, user_id)
);
create index coupon_redemptions_user_idx on public.coupon_redemptions(user_id);

create table public.coupon_redemption_attempts (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references public.profiles(id) on delete cascade,
  attempted_at timestamptz not null default now()
);
create index coupon_attempts_user_time_idx on public.coupon_redemption_attempts(user_id, attempted_at desc);

create table public.lesson_progress (
  user_id uuid not null references public.profiles(id) on delete cascade,
  lesson_id uuid not null references public.lessons(id) on delete cascade,
  completed_at timestamptz,
  last_viewed_at timestamptz,
  updated_at timestamptz not null default now(),
  primary key (user_id, lesson_id)
);
create index lesson_progress_lesson_idx on public.lesson_progress(lesson_id);

-- Payment-ready records. No client may create or mark these paid. A future
-- provider webhook must verify its signature, deduplicate provider event IDs,
-- then activate an enrollment in one trusted transaction.
create table public.orders (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references public.profiles(id) on delete restrict,
  course_id uuid not null references public.courses(id) on delete restrict,
  amount_paise integer not null check (amount_paise > 0),
  currency char(3) not null default 'INR' check (currency = 'INR'),
  status public.order_status not null default 'pending',
  idempotency_key text not null unique,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);
create index orders_user_created_idx on public.orders(user_id, created_at desc);

create table public.payment_attempts (
  id uuid primary key default gen_random_uuid(),
  order_id uuid not null references public.orders(id) on delete restrict,
  provider text not null,
  provider_payment_id text,
  status public.payment_attempt_status not null default 'created',
  amount_paise integer not null check (amount_paise > 0),
  currency char(3) not null default 'INR' check (currency = 'INR'),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (provider, provider_payment_id)
);
create index payment_attempts_order_idx on public.payment_attempts(order_id);

create table public.payment_webhook_events (
  id uuid primary key default gen_random_uuid(),
  provider text not null,
  provider_event_id text not null,
  event_type text not null,
  order_id uuid references public.orders(id) on delete restrict,
  payload_sha256 text not null,
  processed_at timestamptz,
  received_at timestamptz not null default now(),
  unique (provider, provider_event_id)
);
create index payment_webhook_events_order_idx on public.payment_webhook_events(order_id)
where order_id is not null;

create table public.audit_events (
  id uuid primary key default gen_random_uuid(),
  actor_user_id uuid references public.profiles(id) on delete set null,
  event_type text not null,
  target_type text not null,
  target_id uuid,
  metadata jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now()
);
create index audit_events_type_created_idx on public.audit_events(event_type, created_at desc);

create or replace function public.set_updated_at()
returns trigger language plpgsql set search_path = '' as $$
begin
  new.updated_at := now();
  return new;
end;
$$;

create trigger profiles_set_updated_at before update on public.profiles
for each row execute function public.set_updated_at();
create trigger lesson_progress_set_updated_at before update on public.lesson_progress
for each row execute function public.set_updated_at();
create trigger courses_set_updated_at before update on public.courses
for each row execute function public.set_updated_at();
create trigger enrollments_set_updated_at before update on public.enrollments
for each row execute function public.set_updated_at();
create trigger orders_set_updated_at before update on public.orders
for each row execute function public.set_updated_at();
create trigger payment_attempts_set_updated_at before update on public.payment_attempts
for each row execute function public.set_updated_at();

create or replace function public.handle_new_auth_user()
returns trigger language plpgsql security definer set search_path = '' as $$
begin
  insert into public.profiles (id, email, full_name, avatar_url)
  values (
    new.id,
    lower(new.email),
    coalesce(new.raw_user_meta_data ->> 'full_name', new.raw_user_meta_data ->> 'name'),
    new.raw_user_meta_data ->> 'avatar_url'
  )
  on conflict (id) do update set email = excluded.email;
  return new;
end;
$$;

create trigger on_auth_user_created after insert on auth.users
for each row execute function public.handle_new_auth_user();

create or replace function public.is_admin()
returns boolean language sql stable security definer set search_path = '' as $$
  select exists (
    select 1 from public.profiles p
    where p.id = (select auth.uid()) and p.role = 'admin'::public.profile_role
  );
$$;

create or replace function public.has_active_enrollment(p_course_id uuid)
returns boolean language sql stable security definer set search_path = '' as $$
  select exists (
    select 1 from public.enrollments e
    where e.user_id = (select auth.uid())
      and e.course_id = p_course_id
      and e.status = 'active'::public.enrollment_status
  );
$$;

grant execute on function public.is_admin() to anon, authenticated;
grant execute on function public.has_active_enrollment(uuid) to anon, authenticated;

alter table public.profiles enable row level security;
alter table public.courses enable row level security;
alter table public.course_modules enable row level security;
alter table public.lessons enable row level security;
alter table public.course_resources enable row level security;
alter table public.enrollments enable row level security;
alter table public.coupons enable row level security;
alter table public.coupon_redemptions enable row level security;
alter table public.coupon_redemption_attempts enable row level security;
alter table public.lesson_progress enable row level security;
alter table public.orders enable row level security;
alter table public.payment_attempts enable row level security;
alter table public.payment_webhook_events enable row level security;
alter table public.audit_events enable row level security;

create policy "profiles read own or admin" on public.profiles for select to authenticated
using (id = (select auth.uid()) or (select public.is_admin()));
create policy "profiles update own basic fields" on public.profiles for update to authenticated
using (id = (select auth.uid())) with check (id = (select auth.uid()));
revoke update on public.profiles from anon, authenticated;
grant update (full_name, avatar_url) on public.profiles to authenticated;

create policy "published courses are public" on public.courses for select to anon, authenticated
using (published or (select public.is_admin()));
create policy "admins manage courses" on public.courses for all to authenticated
using ((select public.is_admin())) with check ((select public.is_admin()));

create policy "modules for previews or enrolled learners" on public.course_modules for select to anon, authenticated
using (
  exists (select 1 from public.courses c where c.id = course_modules.course_id and c.published)
  or (select public.has_active_enrollment(course_modules.course_id))
  or (select public.is_admin())
);
create policy "admins manage modules" on public.course_modules for all to authenticated
using ((select public.is_admin())) with check ((select public.is_admin()));

create policy "preview or enrolled lessons" on public.lessons for select to anon, authenticated
using (
  (
    is_preview and exists (
      select 1 from public.course_modules m join public.courses c on c.id = m.course_id
    where m.id = lessons.module_id and c.published
    )
  )
  or exists (
    select 1 from public.course_modules m
    where m.id = lessons.module_id and (select public.has_active_enrollment(m.course_id))
  )
  or (select public.is_admin())
);
create policy "admins manage lessons" on public.lessons for all to authenticated
using ((select public.is_admin())) with check ((select public.is_admin()));

create policy "preview or enrolled resources" on public.course_resources for select to anon, authenticated
using (
  (is_preview and exists (select 1 from public.courses c where c.id = course_id and c.published))
  or (select public.has_active_enrollment(course_id))
  or (select public.is_admin())
);
create policy "admins manage resources" on public.course_resources for all to authenticated
using ((select public.is_admin())) with check ((select public.is_admin()));

create policy "learners read own enrollments" on public.enrollments for select to authenticated
using (user_id = (select auth.uid()) or (select public.is_admin()));
create policy "admins manage enrollments" on public.enrollments for all to authenticated
using ((select public.is_admin())) with check ((select public.is_admin()));

create policy "admins manage coupons" on public.coupons for all to authenticated
using ((select public.is_admin())) with check ((select public.is_admin()));
create policy "learners read own coupon redemptions" on public.coupon_redemptions for select to authenticated
using (user_id = (select auth.uid()) or (select public.is_admin()));

create policy "learners read own progress" on public.lesson_progress for select to authenticated
using (user_id = (select auth.uid()) or (select public.is_admin()));
create policy "learners write own accessible progress" on public.lesson_progress for insert to authenticated
with check (
  user_id = (select auth.uid()) and exists (
    select 1 from public.lessons l join public.course_modules m on m.id = l.module_id
    where l.id = lesson_id and (l.is_preview or (select public.has_active_enrollment(m.course_id)))
  )
);
create policy "learners update own accessible progress" on public.lesson_progress for update to authenticated
using (user_id = (select auth.uid()))
with check (
  user_id = (select auth.uid()) and exists (
    select 1 from public.lessons l join public.course_modules m on m.id = l.module_id
    where l.id = lesson_id and (l.is_preview or (select public.has_active_enrollment(m.course_id)))
  )
);
create policy "learners delete own progress" on public.lesson_progress for delete to authenticated
using (user_id = (select auth.uid()));

create policy "learners read own orders" on public.orders for select to authenticated
using (user_id = (select auth.uid()) or (select public.is_admin()));
create policy "learners read own payment attempts" on public.payment_attempts for select to authenticated
using (
  exists (select 1 from public.orders o where o.id = order_id and o.user_id = (select auth.uid()))
  or (select public.is_admin())
);
create policy "admins read webhook events" on public.payment_webhook_events for select to authenticated
using ((select public.is_admin()));
create policy "admins read audit events" on public.audit_events for select to authenticated
using ((select public.is_admin()));

-- RLS policies authorize rows; these grants authorize the requested operations.
grant usage on schema public to anon, authenticated;
grant select on public.profiles to authenticated;
grant select on public.courses, public.course_modules, public.lessons, public.course_resources to anon, authenticated;
grant insert, update, delete on public.courses, public.course_modules, public.lessons, public.course_resources to authenticated;
grant select, insert, update, delete on public.enrollments, public.coupons to authenticated;
grant select on public.coupon_redemptions, public.lesson_progress, public.orders,
  public.payment_attempts, public.payment_webhook_events, public.audit_events to authenticated;
grant insert, update, delete on public.lesson_progress to authenticated;

-- Coupon plaintext is never stored. Create an admin coupon with
-- encode(extensions.digest(convert_to(upper(trim(code)), 'UTF8'), 'sha256'), 'hex').
create or replace function public.redeem_course_coupon(p_course_slug text, p_code text)
returns table (enrollment_id uuid, course_slug text, already_enrolled boolean)
language plpgsql security definer set search_path = '' as $$
declare
  v_user_id uuid := auth.uid();
  v_course_id uuid;
  v_coupon public.coupons%rowtype;
  v_enrollment_id uuid;
begin
  if v_user_id is null then
    raise exception using errcode = '28000', message = 'AUTH_REQUIRED';
  end if;
  if p_code is null or length(trim(p_code)) < 4 or length(trim(p_code)) > 128 then
    raise exception using errcode = 'P0001', message = 'COUPON_UNAVAILABLE';
  end if;

  select c.id into v_course_id from public.courses c
  where c.slug = lower(trim(p_course_slug)) and c.published;
  if v_course_id is null then
    raise exception using errcode = 'P0001', message = 'COUPON_UNAVAILABLE';
  end if;

  -- Existing access is returned idempotently and never consumes coupon uses.
  select e.id into v_enrollment_id from public.enrollments e
  where e.user_id = v_user_id and e.course_id = v_course_id and e.status = 'active';
  if v_enrollment_id is not null then
    return query select v_enrollment_id, lower(trim(p_course_slug)), true;
    return;
  end if;

  if exists (
    select 1 from public.enrollments e
    where e.user_id = v_user_id and e.course_id = v_course_id and e.status = 'revoked'
  ) then
    raise exception using errcode = 'P0001', message = 'COUPON_UNAVAILABLE';
  end if;

  select cp.* into v_coupon from public.coupons cp
  where cp.course_id = v_course_id
    and cp.code_hash = encode(extensions.digest(convert_to(upper(trim(p_code)), 'UTF8'), 'sha256'), 'hex')
  for update;
  if not found
    or not v_coupon.active
    or v_coupon.discount_percent <> 100
    or (v_coupon.starts_at is not null and v_coupon.starts_at > now())
    or (v_coupon.ends_at is not null and v_coupon.ends_at <= now())
    or (v_coupon.max_redemptions is not null and v_coupon.redemption_count >= v_coupon.max_redemptions)
    or exists (select 1 from public.coupon_redemptions cr where cr.coupon_id = v_coupon.id and cr.user_id = v_user_id)
  then
    raise exception using errcode = 'P0001', message = 'COUPON_UNAVAILABLE';
  end if;

  insert into public.enrollments (user_id, course_id, status, source, amount_paid_paise, access_granted_at)
  values (v_user_id, v_course_id, 'active', 'coupon', 0, now())
  on conflict (user_id, course_id) do update
    set status = 'active', source = 'coupon', amount_paid_paise = 0,
        access_granted_at = now(), updated_at = now()
    where enrollments.status in ('pending_payment', 'expired')
  returning id into v_enrollment_id;

  if v_enrollment_id is null then
    raise exception using errcode = 'P0001', message = 'COUPON_UNAVAILABLE';
  end if;

  insert into public.coupon_redemptions (coupon_id, user_id, enrollment_id)
  values (v_coupon.id, v_user_id, v_enrollment_id);
  update public.coupons set redemption_count = redemption_count + 1 where id = v_coupon.id;
  insert into public.audit_events (actor_user_id, event_type, target_type, target_id, metadata)
  values (v_user_id, 'coupon.redeemed', 'enrollment', v_enrollment_id,
          jsonb_build_object('course_id', v_course_id, 'coupon_id', v_coupon.id));

  return query select v_enrollment_id, lower(trim(p_course_slug)), false;
end;
$$;

revoke all on function public.redeem_course_coupon(text, text) from public, anon;
grant execute on function public.redeem_course_coupon(text, text) to authenticated;

-- Service-role-only sliding-window limit, called by the Edge Function before
-- redemption. Advisory locking makes parallel requests for one account safe.
create or replace function public.consume_coupon_redemption_attempt(p_user_id uuid)
returns boolean language plpgsql security definer set search_path = '' as $$
declare
  v_recent_count integer;
begin
  if auth.role() <> 'service_role' or p_user_id is null then
    raise exception using errcode = '42501', message = 'NOT_ALLOWED';
  end if;

  perform pg_advisory_xact_lock(hashtextextended(p_user_id::text, 0));
  select count(*)::integer into v_recent_count
  from public.coupon_redemption_attempts a
  where a.user_id = p_user_id and a.attempted_at > now() - interval '15 minutes';

  if v_recent_count >= 10 then
    return false;
  end if;

  insert into public.coupon_redemption_attempts(user_id) values (p_user_id);
  return true;
end;
$$;
revoke all on function public.consume_coupon_redemption_attempt(uuid) from public, anon, authenticated;
grant execute on function public.consume_coupon_redemption_attempt(uuid) to service_role;

-- Private files use the object path convention {course-slug}/{file-name}.
insert into storage.buckets (id, name, public)
values ('course-downloads', 'course-downloads', false)
on conflict (id) do update set public = false;
create policy "enrolled learners read protected course files" on storage.objects for select to authenticated
using (
  bucket_id = 'course-downloads'
  and exists (
    select 1 from public.courses c
    where c.slug = (storage.foldername(name))[1]
      and (select public.has_active_enrollment(c.id))
  )
);
create policy "admins manage protected course files" on storage.objects for all to authenticated
using (bucket_id = 'course-downloads' and (select public.is_admin()))
with check (bucket_id = 'course-downloads' and (select public.is_admin()));

insert into public.courses (slug, title, description, price_paise, published)
values
  ('cybersecurity', 'Cybersecurity', 'Practical cybersecurity learning path.', 250000, true),
  ('data-engineering-mlops', 'Data Engineering & MLOps', 'Data engineering and MLOps learning path.', 250000, true)
on conflict (slug) do nothing;
