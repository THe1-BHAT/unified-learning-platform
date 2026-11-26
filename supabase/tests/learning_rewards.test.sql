begin;
create extension if not exists pgtap with schema extensions;
select plan(12);

insert into auth.users (
  id, aud, role, email, encrypted_password, email_confirmed_at,
  raw_app_meta_data, raw_user_meta_data, created_at, updated_at
) values (
  '33333333-3333-4333-8333-333333333333', 'authenticated', 'authenticated',
  'rewards@example.test', '', now(), '{}', '{"full_name":"Rewards Learner"}', now(), now()
);

insert into public.enrollments(user_id, course_id, status, source, amount_paid_paise, access_granted_at)
select '33333333-3333-4333-8333-333333333333', c.id, 'active', 'admin', 0, now()
from public.courses c where c.slug = 'cybersecurity';

insert into public.course_modules(id, course_id, slug, title, position)
select '44444444-4444-4444-8444-444444444444', c.id, 'rewards-test', 'Rewards test', 900
from public.courses c where c.slug = 'cybersecurity';
insert into public.lessons(id, module_id, slug, title, content, position)
values
  ('55555555-5555-4555-8555-555555555551', '44444444-4444-4444-8444-444444444444', 'lesson-one', 'Lesson one', '{}', 1),
  ('55555555-5555-4555-8555-555555555552', '44444444-4444-4444-8444-444444444444', 'lesson-two', 'Lesson two', '{}', 2);
insert into public.quizzes(id, module_id, slug, title)
values ('66666666-6666-4666-8666-666666666666', '44444444-4444-4444-8444-444444444444', 'rewards-test', 'Rewards test quiz');
insert into public.quiz_questions(id, quiz_id, prompt, options, correct_option, position)
values
  ('77777777-7777-4777-8777-777777777771', '66666666-6666-4666-8666-666666666666', 'Question one?', '["A","B"]', 1, 1),
  ('77777777-7777-4777-8777-777777777772', '66666666-6666-4666-8666-666666666666', 'Question two?', '["A","B"]', 0, 2);

select set_config('request.jwt.claim.sub', '33333333-3333-4333-8333-333333333333', true);
set local role authenticated;
select is((select w.balance from public.coin_wallets w where w.user_id = auth.uid()), 50::bigint, 'new learner receives 50 coins');
select is((select r.coins_awarded from public.mark_lesson_complete('55555555-5555-4555-8555-555555555551') r), 0, 'first lesson does not complete the module');
select is((select r.coins_awarded from public.mark_lesson_complete('55555555-5555-4555-8555-555555555552') r), 10, 'last lesson awards 10 coins');
select is((select r.coins_awarded from public.mark_lesson_complete('55555555-5555-4555-8555-555555555552') r), 0, 'repeating lesson completion does not duplicate coins');
select is((select w.balance from public.coin_wallets w where w.user_id = auth.uid()), 60::bigint, 'module reward updates the wallet balance');
select ok((public.get_quiz('66666666-6666-4666-8666-666666666666'))::text !~ 'correct_option', 'quiz fetch never returns answer keys');
select is((select r.score_percent from public.submit_quiz('66666666-6666-4666-8666-666666666666', '{"77777777-7777-4777-8777-777777777771":1,"77777777-7777-4777-8777-777777777772":0}') r), 100::smallint, 'database scores the submitted answers');
select is((select r.coins_awarded from public.submit_quiz('66666666-6666-4666-8666-666666666666', '{"77777777-7777-4777-8777-777777777771":1,"77777777-7777-4777-8777-777777777772":0}') r), 0, 'a repeated quiz does not duplicate its reward');
select is((select w.balance from public.coin_wallets w where w.user_id = auth.uid()), 80::bigint, 'quiz reward is reflected once in wallet');
select is((select count(*)::integer from public.get_coin_leaderboard(10, 0)), 0, 'learners are hidden from leaderboard until they opt in');
update public.profiles set show_on_leaderboard = true where id = auth.uid();
select is((select count(*)::integer from public.get_coin_leaderboard(10, 0)), 1, 'opted-in learner appears on leaderboard');
select ok(not has_table_privilege('authenticated', 'public.coin_transactions', 'INSERT'), 'learners cannot write coin ledger rows directly');

select * from finish();
rollback;
