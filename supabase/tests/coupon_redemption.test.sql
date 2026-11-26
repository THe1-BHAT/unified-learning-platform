begin;
create extension if not exists pgtap with schema extensions;
select plan(13);

select has_table('public', 'profiles', 'profile table exists');
select has_table('public', 'enrollments', 'enrollment table exists');
select has_table('public', 'coupon_redemptions', 'redemption audit table exists');
select ok(
  (select c.relrowsecurity from pg_class c where c.oid = 'public.enrollments'::regclass),
  'enrollments has row level security enabled'
);
select ok(
  not has_column_privilege('authenticated', 'public.profiles', 'role', 'UPDATE'),
  'learners cannot update their role column'
);
select ok(
  not (select b.public from storage.buckets b where b.id = 'course-downloads'),
  'course downloads bucket is private'
);
select is(
  (select c.price_paise from public.courses c where c.slug = 'cybersecurity'),
  250000,
  'Cybersecurity price is stored in paise'
);

insert into auth.users (
  id, aud, role, email, encrypted_password, email_confirmed_at,
  raw_app_meta_data, raw_user_meta_data, created_at, updated_at
) values
  ('11111111-1111-4111-8111-111111111111', 'authenticated', 'authenticated', 'coupon-one@example.test', '', now(), '{}', '{"full_name":"Coupon One"}', now(), now()),
  ('22222222-2222-4222-8222-222222222222', 'authenticated', 'authenticated', 'coupon-two@example.test', '', now(), '{}', '{"full_name":"Coupon Two"}', now(), now());

insert into public.coupons (
  course_id, code_hash, discount_percent, max_redemptions, active
)
select c.id,
       encode(extensions.digest(convert_to('ONEFREESEAT', 'UTF8'), 'sha256'), 'hex'),
       100, 1, true
from public.courses c
where c.slug = 'cybersecurity';

select set_config('request.jwt.claim.sub', '11111111-1111-4111-8111-111111111111', true);
set local role authenticated;
select enrollment_id from public.redeem_course_coupon('CYBERSECURITY', ' onefreesEat ');
select is(
  (select e.status::text from public.enrollments e
   where e.user_id = '11111111-1111-4111-8111-111111111111'
     and e.course_id = (select c.id from public.courses c where c.slug = 'cybersecurity')),
  'active',
  'valid code activates the signed-in learner enrollment'
);
select ok(
  public.has_active_enrollment((select c.id from public.courses c where c.slug = 'cybersecurity')),
  'the access helper recognizes the new enrollment'
);
select is(
  (select r.already_enrolled from public.redeem_course_coupon('cybersecurity', 'ONEFREESEAT') r),
  true,
  'repeated redemption returns current access without a second redemption'
);
reset role;
select is((select c.redemption_count from public.coupons c), 1, 'redemption counter increments exactly once');
select is((select count(*)::integer from public.coupon_redemptions), 1, 'redemption audit row is written');

select set_config('request.jwt.claim.sub', '22222222-2222-4222-8222-222222222222', true);
set local role authenticated;
select throws_ok(
  $$select * from public.redeem_course_coupon('cybersecurity', 'ONEFREESEAT')$$,
  'P0001',
  'COUPON_UNAVAILABLE',
  'an exhausted coupon is rejected without access'
);
reset role;

select * from finish();
rollback;
