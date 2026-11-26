# Architecture

## Recommended baseline

Use a TypeScript monorepo: **Next.js** for the web application, **NestJS** for the API, **PostgreSQL** for durable data, **Prisma** for migrations/data access, and **Redis** for rate limiting and short-lived caching. This is deliberately more structured than the current static sites because identity and entitlement security cannot safely live in browser storage.

```text
Browser
  │ HTTPS
  ▼
Next.js web app ───────► CDN / object storage (images, PDFs)
  │ authenticated API calls
  ▼
NestJS API ────────────► PostgreSQL (users, courses, access, progress)
  │          └─────────► Redis (rate limits, cache, sessions if used)
  ▼
Structured logs / error monitoring
```

## Core boundaries

| Layer | Responsibilities | Must not do |
| --- | --- | --- |
| Web | Render UI, collect input, show access state, call APIs | Decide ownership or store coupon truth locally |
| API | Authenticate, authorize, redeem coupons atomically, manage content/progress | Render page HTML or expose passwords/coupon secrets |
| Database | Durable, transactional source of truth | Be queried directly by browser clients |
| Object storage | Static PDFs/images | Enforce course access by an unprotected public URL |

For protected downloadable assets, return short-lived signed URLs only after an entitlement check, or stream files through the API.

## Modular API design

```text
src/
├── auth/          # registration, sessions/tokens, password reset later
├── users/         # profile and roles
├── catalog/       # public courses and pricing labels
├── courses/       # modules, lessons, resources, protected content delivery
├── enrollments/   # entitlement checks and lifecycle
├── coupons/       # admin management + atomic redemption service
├── learning/      # progress, notes, saved resources, quiz attempts
├── admin/         # administrative routes and audit views
└── common/        # validation, auth guards, errors, logging
```

`EnrollmentService.canAccess(userId, courseId)` is the sole domain service used to grant protected course access. Controllers and asset endpoints call it; front-end flags do not substitute it.

## Authentication and authorization

- Use a mature provider or an API-managed session implementation. For this project, secure HTTP-only, `Secure`, `SameSite=Lax` cookies are preferred over browser-stored bearer tokens.
- Hash passwords with Argon2id. Never store raw passwords.
- Validate request DTOs at the API edge; parameterize all database access through Prisma.
- Require authentication and a role guard for admin endpoints.
- Rate-limit login, registration, password reset, and coupon redemption by IP and account/user identifier.
- Log security-relevant actions (admin coupon changes, redemption attempts, enrollment changes) without logging coupon plaintext or tokens.

## Deployment stages

1. **Local:** Docker Compose provides PostgreSQL and Redis; application runs with local environment variables.
2. **Preview:** every pull request builds, tests, runs migrations against an ephemeral/test database, and deploys a preview.
3. **Production:** managed Postgres with automated backups, managed Redis, separate web/API services, environment secrets in the deployment provider, and migrations executed once in the release pipeline.

Start with a managed platform to minimize operations. Scale web and API instances horizontally because neither retains authoritative in-memory state.

## Observability and resilience

- `/health` and `/ready` endpoints; database and Redis readiness checks.
- JSON structured logs containing request ID, route, status, duration, and user ID only when authenticated.
- Error monitoring for client and API exceptions.
- Nightly database backup and tested restoration procedure before launch.
- Database uniqueness constraints remain the final defense against duplicate coupon redemptions during concurrent requests.

