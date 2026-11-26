# NxGenVarsity Unified Learning Platform

This repository brings the Cybersecurity and Data Engineering & MLOps learning experiences together in one browser-based platform. The project blueprint and planning documents are in [`docs/README.md`](docs/README.md).

## Repository structure

- `app/` - Unified website and its content-generation/verification scripts
- `app/dist/` - Browser-ready static website
- `source/` - Preserved Data Engineering & MLOps source project
- `docs/` - Product plans and technical documents

## Run locally

From the repository root:

```sh
python3 -m http.server 4173 --bind 127.0.0.1 --directory app/dist
```

Open `http://127.0.0.1:4173`.

The current website is a static learning prototype. Authentication and progress are demo-only and stored in the browser; this is not the production server-side account, payment, or entitlement architecture described in the planning documents.

## Backend foundation

The Supabase V1 foundation lives alongside the unchanged prototype: `supabase/` contains local configuration, migrations, RLS, private storage rules, and the coupon redemption Edge Function; `web/` contains the Next.js server/client integration scaffold; `prisma/` contains the typed ORM schema. See [`docs/SUPABASE-IMPLEMENTATION.md`](docs/SUPABASE-IMPLEMENTATION.md) for setup and the handoff contract. The login screen has not been redesigned; the frontend can apply the supplied design reference when it is ready.
