# NxGenVarsity Unified Learning Platform

This repository brings the Cybersecurity and Data Engineering & MLOps learning experiences together in one browser-based platform. The project blueprint and planning documents are in [`docs/README.md`](docs/README.md).

## Run the real website locally

The Next.js site in `web/` is the application entry point. It includes Supabase email/password sign-in, account creation, password recovery, and a protected learner experience. After signing in, learners open `/studio/` for the Cybersecurity and Data Engineering & MLOps lessons, labs, and resources; `/dashboard` contains account and rewards details. Course progress in the existing studio is still stored in the browser, while account authentication is handled by Supabase.

Prerequisites: Node.js, npm, and Docker Desktop for the local Supabase service.

```powershell
npm install
Copy-Item .env.example web/.env.local
npx supabase start
npx supabase db reset
npm run dev
```

When Supabase starts, copy its API URL and `anon` key into `NEXT_PUBLIC_SUPABASE_URL` and `NEXT_PUBLIC_SUPABASE_ANON_KEY` in `web/.env.local` (Next.js runs from `web/`). Then open [http://localhost:3000/login](http://localhost:3000/login); after signing in, the site opens at `/studio/`. Keep `.env.local` private; it is ignored by Git. OAuth buttons stay disabled until the provider is configured in Supabase Auth and its ID (such as `google`) is added to `NEXT_PUBLIC_SUPABASE_AUTH_PROVIDERS`. For hosted Supabase setup and OAuth redirect configuration, see [`docs/SUPABASE-IMPLEMENTATION.md`](docs/SUPABASE-IMPLEMENTATION.md).

## Repository structure

- `web/` - Next.js website, real Supabase authentication, and learner dashboard
- `supabase/` - Database migrations, row-level security, storage rules, and Edge Functions
- `prisma/` - Typed ORM schema for trusted server-side code
- `app/dist/` - Older static prototype with demo-only authentication
- `source/` - Preserved Data Engineering & MLOps source project
- `docs/` - Product plans and technical setup
