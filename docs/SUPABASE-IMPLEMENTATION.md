# Supabase implementation handoff

This document supersedes the earlier NestJS/Prisma-only architecture recommendation. V1 uses Supabase Auth, PostgreSQL, RLS, Edge Functions/SQL RPC, and private Storage. Prisma remains available as a typed ORM in trusted server-side Next.js code. Supabase SQL migrations are the only schema migration history; Prisma is synchronized from that schema with `prisma db pull` and `prisma generate`.

## Implemented foundation

- `supabase/config.toml`: local Supabase Auth, Postgres, Studio, and Storage configuration.
- `supabase/migrations/`: schema, seed courses, profile creation trigger, RLS, private bucket, access helper, rate limiter, coupon RPC, and payment-ready records.
- `supabase/functions/redeem-coupon/`: validates the caller's Supabase session, then invokes the atomic SQL RPC using that caller's JWT.
- `web/lib/supabase/`: browser and server Supabase clients.
- `web/app/auth/callback/route.ts`: OAuth callback exchange.
- `web/lib/prisma.ts`: server-only Prisma client using the pooled database URL.
- `prisma/schema.prisma`: ORM model aligned with the Supabase schema; do not create a second Prisma migration history.

## Local setup

Prerequisites: Node.js, npm, Docker Desktop, and the Supabase CLI (included as a development dependency).

```sh
npm install
cp .env.example .env.local
npx supabase start
npx supabase db reset
npm run db:test
npm run db:types
npm run prisma:pull
npm run prisma:generate
npm run dev
```

Set the local Supabase URL and anon key printed by `supabase start` in `.env.local`. Set `DATABASE_URL` to `postgresql://postgres:postgres@127.0.0.1:54329/postgres?pgbouncer=true` for pooled runtime use and `DIRECT_URL` to `postgresql://postgres:postgres@127.0.0.1:54322/postgres` for Prisma introspection. For hosted Supabase, use its transaction pooler for `DATABASE_URL` and a direct/session connection for `DIRECT_URL`. Never add `.env.local` or a service-role key to Git.

The Supabase CLI applies `supabase/migrations/`; Prisma does not migrate the database. `prisma:pull` and `prisma:generate` refresh the typed ORM after a migration. Prisma is server-only. For the hosted project, create a separate, long-random-password `prisma` database user and use it for the Prisma URLs; keep it server-side. That user may bypass RLS, so every Prisma-backed operation must still verify the signed-in user and authorization in server code. Supabase client and the coupon redemption RPC rely on RLS and the caller's JWT.

## Auth and admin setup

The migration creates a `profiles` row for each Supabase Auth user. Profile roles default to `learner`; a learner can update only `full_name` and `avatar_url`. Configure Google OAuth credentials in Supabase Auth settings, with the local and deployed `/auth/callback` URLs allowlisted. Assign the first admin manually from the Supabase SQL editor after verifying the account:

```sql
update public.profiles
set role = 'admin'
where email = 'verified-admin@example.com';
```

## Coupon and course-access contract

Call `POST /functions/v1/redeem-coupon` with the user's Supabase access token:

```json
{ "courseSlug": "cybersecurity", "code": "STUDENT-CODE" }
```

Success returns an enrollment ID, course slug, and whether the learner already had active access. Invalid, expired, exhausted, duplicate, and wrong-course codes return one generic error. The Edge Function limits each learner to 10 attempts per 15 minutes. The SQL RPC normalizes the code, hashes it, locks the coupon row, checks eligibility, activates the unique learner/course enrollment, records the redemption and audit event, and increments the count in one transaction. The browser never receives coupon storage hashes or writes active enrollments directly. The service-role credential is used only inside the Edge Function for this rate-limit operation and is never exposed to callers.

Create coupon codes by storing only the SHA-256 hex digest:

```sql
encode(extensions.digest(convert_to(upper(trim('CODE-HERE')), 'UTF8'), 'sha256'), 'hex')
```

The private Storage bucket is `course-downloads`; object paths use `{course-slug}/{file-name}`. The existing PDFs in `app/dist/downloads/` are still static prototype assets and must be uploaded to this private bucket before serving them as protected production downloads.

## Payment handoff

The migration includes INR orders, payment attempts, and provider-webhook idempotency records. Browser roles can read only their own order and attempt summaries; they cannot create/mark payments paid or activate enrollments. No live gateway is selected or configured yet. Once the provider is chosen, add a trusted checkout Edge Function and a signed-webhook Edge Function. Verify webhook signatures, deduplicate provider event IDs, and update order/payment/enrollment state atomically. Never grant access from a browser return URL or client-supplied success flag.

For the next UI branch, the course catalog can read `courses.slug`, `title`, and `price_paise`. The coupon form can call the Edge Function above. Payment UI should remain a nonfunctional/coming-soon state until the provider integration is implemented and configured.
