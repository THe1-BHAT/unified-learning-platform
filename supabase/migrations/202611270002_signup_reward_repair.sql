-- Make the one-time signup reward self-healing for existing and new learners.
-- The ledger idempotency key prevents this from granting the 50 coins twice.
create or replace function public.ensure_my_signup_reward()
returns void language plpgsql security definer set search_path = '' as $$
declare
  v_user_id uuid := auth.uid();
begin
  if v_user_id is null then
    raise exception using errcode = '28000', message = 'AUTH_REQUIRED';
  end if;

  perform public.award_coin_reward(
    v_user_id,
    'signup'::public.coin_reward_type,
    50,
    v_user_id,
    'signup:' || v_user_id::text
  );
end;
$$;

revoke all on function public.ensure_my_signup_reward() from public, anon;
grant execute on function public.ensure_my_signup_reward() to authenticated;
