# NxGenVarsity Unified Learning Platform

This repository brings the Cybersecurity and Data Engineering & MLOps learning experiences together in one browser-based platform. The project blueprint and planning documents are in [`docs/README.md`](docs/README.md).

## Run the real website locally

The Next.js site in `web/` is the production application entry point. It includes Supabase email/password sign-in, account creation, password recovery, a database-backed course catalog, account-scoped lesson progress, protected course content, server-scored quizzes, and learning rewards. After signing in, learners land on `/dashboard`; the older browser-only prototype remains in `app/dist/` for content review and is not the production app.

Prerequisites: Node.js, npm, and Docker Desktop for the local Supabase service.

```powershell
npm.cmd install
Copy-Item .env.example web/.env.local
npx.cmd supabase start
npx.cmd supabase migration up --local
npm.cmd run dev
```

When Supabase starts, copy its API URL and `anon` key into `NEXT_PUBLIC_SUPABASE_URL` and `NEXT_PUBLIC_SUPABASE_ANON_KEY` in `web/.env.local` (Next.js runs from `web/`). Then open [http://localhost:3000/login](http://localhost:3000/login); after signing in, the site opens at `/dashboard`. Keep `.env.local` private; it is ignored by Git. OAuth buttons stay disabled until the provider is configured in Supabase Auth and its ID (such as `google`) is added to `NEXT_PUBLIC_SUPABASE_AUTH_PROVIDERS`. Production payment processing is not enabled until a provider and credentials are selected. For hosted Supabase setup and OAuth redirect configuration, see [`docs/SUPABASE-IMPLEMENTATION.md`](docs/SUPABASE-IMPLEMENTATION.md).

## Repository structure

- `web/` - Next.js website, real Supabase authentication, and learner dashboard
- `supabase/` - Database migrations, row-level security, storage rules, and Edge Functions
- `prisma/` - Typed ORM schema for trusted server-side code
- `app/dist/` - Older static prototype with demo-only authentication
- `source/` - Preserved Data Engineering & MLOps source project
- `docs/` - Product plans and technical setup
