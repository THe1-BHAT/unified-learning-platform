# Architecture

## Version 1 decision

Version 1 uses **Supabase as the single backend platform**. Supabase provides PostgreSQL, Auth, Storage, database migrations, Row Level Security (RLS), and Edge Functions. This deliberately replaces the earlier Next.js + NestJS + Prisma + Redis proposal: we will not build two competing backends.

The current static site remains the content prototype. It will call Supabase only for authenticated learner state and protected access; public course pages may remain static during the migration.

    Browser / static learning app
      │ Supabase Auth session
      ▼
    Supabase Auth ─────────► Google and email/password sign-in
      │
      ├──► Supabase PostgreSQL ─► courses, enrollments, coupons, progress
      ├──► Edge Functions / SQL RPC ─► coupon redemption and signed downloads
      └──► Private Storage ─► protected PDFs and other downloads

## Responsibilities

| Layer | Responsibilities | Must not do |
| --- | --- | --- |
| Frontend | Render catalog/course UI, collect coupon input, show access state | Decide entitlement or create active enrollments |
| Supabase Auth | Authenticate users and maintain sessions | Grant course access by itself |
| PostgreSQL + RLS | Store durable data and constrain user-level reads/writes | Trust client-provided user IDs or roles |
| Edge Function / RPC | Validate and atomically redeem coupons, check entitlement, create signed URLs | Expose service-role credentials to the browser |
| Private Storage | Store protected PDFs/assets | Serve protected files from public URLs |

## Authentication and authorization

- Enable Google OAuth and email/password authentication in Supabase Auth.
- Create a profiles record linked to auth.users when a user first signs in.
- Store roles in protected database data; learners must never be able to make themselves an admin.
- Enable RLS on every exposed learner-data table. Learners can access only their own profile, progress, notes, and enrollment rows.
- The browser may read an active enrollment for the signed-in user, but cannot insert or activate an enrollment directly.
- Coupon redemption, admin changes, and signed download creation run only in an Edge Function or a carefully permissioned SQL RPC.
- Keep Supabase service-role keys server-side only. Commit only environment-variable names in .env.example.

## Entitlement rule

An enrollment is the source of truth for paid access. Protected lessons, quizzes, labs, and downloads require an enrollment where status is active.

    Sign in → redeem valid coupon → transaction activates enrollment → access check passes → protected content opens

Frontend route guards improve usability but are not security. The Edge Function/RPC or server layer must re-check active enrollment before returning protected content or signed download URLs.

## Coupon redemption boundary

The redemption operation is a single database transaction:

1. Normalize and hash the submitted code.
2. Lock and validate the matching coupon: active, 100% discount, correct course, valid date window, available uses.
3. Handle any existing enrollment according to the lifecycle in DATABASE.md.
4. Create or update the enrollment at ₹0.
5. Record the immutable redemption and increment the usage count.
6. Commit, or roll back every change on failure.

Rate-limit coupon redemption by authenticated user and IP at the Edge Function boundary. Log redemption attempts without storing coupon plaintext.

## Deployment and operations

- Use separate Supabase development and production projects before release.
- Keep schema changes in ordered SQL migrations under supabase/migrations/.
- Run migrations and RLS tests in CI before merging backend changes.
- Use Supabase backups/Point-in-Time Recovery according to the chosen plan; document restoration before launch.
- Add structured application/Edge Function logs and error monitoring.
- Store PDFs in a private bucket and return short-lived signed URLs only after entitlement verification.

## Future boundary

A separate API service can be introduced later if integrations, complex billing, or scale require it. Until then, do not add NestJS, Prisma, or a second database-access layer. Real payment processing is not part of version 1: the UI displays ₹2,500, while valid 100%-discount coupons are the only automated access mechanism.
