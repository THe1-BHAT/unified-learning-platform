# Paid Access & Student Coupon Plan

This document captures the agreed architecture and implementation plan for the unified **Paid Access** and **Student Coupon** flow, building on [`docs/SUPABASE-IMPLEMENTATION.md`](SUPABASE-IMPLEMENTATION.md).

## 1. User Flow (Option 2: Browse First, Single `/checkout` Paywall)

1. **Sign in / Sign up (`/login`):** Learners sign in normally and land on `/studio/` or `/dashboard`.
2. **Browse freely:** Signed-in learners can view the unified platform overview, `/dashboard` (coin wallet + leaderboard), and free preview content.
3. **Single unified `/checkout` page:** One shared payment & coupon page for the platform (not separate payment pages per course).
4. **Paywall triggers:**
   - Clicking **Subscribe / Unlock Access** in the navigation or on `/dashboard`.
   - Clicking a **locked** course, module, or resource (redirects to `/checkout` if not enrolled; opens directly if already enrolled).

## 2. Single `/checkout` Page Structure

- **Order Summary (Single All-Access Pass):**
  - Displays **₹2,500 one-time payment** for full unified access (**Cybersecurity** + **Data Engineering & MLOps** together — not separate ₹2,500 charges per course).
  - Shows current access status (`Active / Unlocked` vs. `Locked`).
- **Coupon Code Box (with `STUDENTOFFER` Demo Coupon):**
  - Input field + **Apply** button, plus a clickable **`STUDENTOFFER`** demo coupon chip.
  - Clicking/applying `STUDENTOFFER` calls `POST /functions/v1/redeem-coupon` with the user's Supabase `access_token` and changes the total from **₹2,500** to **₹0 (100% off)**.
  - Note: Coupon codes are stored in `public.coupons` as SHA-256 hex digests of `upper(trim(code))` with `discount_percent = 100`. If `STUDENTOFFER` is not yet seeded in `public.coupons` on the hosted DB, the UI still demonstrates the ₹2,500 → ₹0 discount state cleanly.
- **Payment Gateway UI (Card + UPI):**
  - Tabbed selector for **Card** (card number, expiry, CVV, cardholder name) and **UPI** (UPI ID / QR preview).
  - Per [`docs/SUPABASE-IMPLEMENTATION.md`](SUPABASE-IMPLEMENTATION.md#L65-L67), the Card/UPI submit button remains in a **Demo / Coming Soon** state until a live payment gateway + signed webhook Edge Function is integrated—real enrollments are never granted from a client-side fake payment.

## 3. Frontend & Backend Integration Points

- **`web/lib/course-access.ts`:**
  - Fetch published `courses` (`id`, `slug`, `title`, `description`, `price_paise`) and the signed-in user's `enrollments` (`course_id`, `status`, `source`, `access_granted_at`).
  - Format `price_paise` to INR (`₹2,500`).
- **`web/app/checkout/`:**
  - Server page (`page.tsx`) checks auth, loads courses + enrollments, and renders the client checkout experience (`checkout-experience.tsx`).
- **`web/app/dashboard/page.tsx`:**
  - Shows course access status and links to `/checkout` to subscribe or redeem a coupon.
- **`app/dist/` & `web/app/studio/[[...path]]/route.ts`:**
  - Add a **Subscribe / Unlock** link in the studio header/banner pointing to `/checkout` (and enforce/surface course access status).

## 4. Verification Checklist

- [ ] `npm run lint` passes with 0 errors.
- [ ] Unauthenticated visit to `/checkout` redirects to `/login?next=/checkout`.
- [ ] Authenticated learner sees `₹2,500` order summary, Card & UPI tabs (Coming Soon), and Coupon Code form.
- [ ] Valid coupon in `public.coupons` redeems via `/functions/v1/redeem-coupon`, updates UI to Unlocked (`₹0`), and persists `enrollments` in Supabase.
- [ ] Invalid/expired/exhausted coupon shows generic error without leaking DB details.

## 5. Seed `STUDENTOFFER` in Supabase (for persistent DB enrollments)

Run this once in the Supabase SQL Editor so `STUDENTOFFER` is persisted in `public.coupons` (note: `code_hash` is unique per row in `public.coupons`, so this seeds it for `cybersecurity`, which unlocks `/studio/`):

```sql
insert into public.coupons (course_id, code_hash, discount_percent, active)
select
  c.id,
  encode(extensions.digest(convert_to(upper(trim('STUDENTOFFER')), 'UTF8'), 'sha256'), 'hex'),
  100,
  true
from public.courses c
where c.slug = 'cybersecurity'
on conflict (code_hash) do nothing;
```

