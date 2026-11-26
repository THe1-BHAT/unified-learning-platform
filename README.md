# NxGenVarsity Unified Learning Platform

This repository brings the Cybersecurity and Data Engineering & MLOps learning experiences together in one browser-based platform. The project blueprint and planning documents are in [`docs/README.md`](docs/README.md).

## Open the website in a browser (no Docker)

The existing learning website is in `app/dist/`. It includes the course pages, lessons, labs, resources, and a login screen. Run a small local web server from the repository root:

```powershell
python -m http.server 4173 --bind 127.0.0.1 --directory app/dist
```

Open [http://127.0.0.1:4173](http://127.0.0.1:4173). Select the profile at the top right or choose **Demo login** in the footer to open the login page. The static site's login is for previewing the existing site only: `student@nxgen.demo` / `cyber123`. It does not create a real account; its learning progress is stored in that browser.

## Use real accounts without local Docker

The Next.js app in `web/` provides real Supabase email/password registration, sign-in, password recovery, a protected learning studio at `/studio/`, and an account dashboard. To use those features without Docker, connect the app to a hosted Supabase project:

```powershell
npm install
Copy-Item .env.example web/.env.local
```

Set `NEXT_PUBLIC_SUPABASE_URL` and `NEXT_PUBLIC_SUPABASE_ANON_KEY` in `web/.env.local` using the hosted project's browser-safe API URL and anon/publishable key, then run `npm run dev` and open [http://localhost:3000/login](http://localhost:3000/login). Apply the repository migrations to that Supabase project before using account-backed features; see [`docs/SUPABASE-IMPLEMENTATION.md`](docs/SUPABASE-IMPLEMENTATION.md). Keep `.env.local` private; it is ignored by Git. Google and other OAuth buttons remain unavailable until that provider is enabled in Supabase Auth, its redirect URL is configured, and its ID is added to `NEXT_PUBLIC_SUPABASE_AUTH_PROVIDERS`.

## Repository structure

- `web/` - Next.js website, real Supabase authentication, and learner dashboard
- `supabase/` - Database migrations, row-level security, storage rules, and Edge Functions
- `prisma/` - Typed ORM schema for trusted server-side code
- `app/dist/` - Browser-ready learning website with demo-only authentication
- `source/` - Preserved Data Engineering & MLOps source project
- `docs/` - Product plans and technical setup
