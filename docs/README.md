# Unified Learning Platform — Project Blueprint

## Purpose

Build one NxGenVarsity learning product that brings together the existing Cybersecurity and Data Engineering & MLOps courses. A learner has one account, a shared dashboard, consistent navigation, course-specific learning experiences, and paid course access.

The present repositories are valuable content sources, not the production architecture: both are static HTML/CSS/JavaScript applications with demo-only browser storage. The unified product will migrate their course data and assets into a new application with a server-side API and database.

## The seven planning documents

| Document | Decision it records |
| --- | --- |
| [Requirements](REQUIREMENTS.md) | Scope, acceptance criteria, and what is deliberately out of scope |
| [Architecture](ARCHITECTURE.md) | Application boundaries, stack, deployment shape, and security choices |
| [Database](DATABASE.md) | Persistent data model, constraints, and access-control source of truth |
| [API design](API-DESIGN.md) | HTTP endpoints, authorization rules, and error conventions |
| [Design system](DESIGN.md) | Shared UI/UX rules, navigation, responsive and accessibility requirements |
| [Implementation plan](IMPLEMENTATION.md) | Phased work, ownership proposal, migration plan, and definition of done |
| This README | Entry point and local-development conventions |

## Recommended repository shape

Create a new repository named `unified-learning-platform` rather than forcing a backend into either legacy static-site repository.

```text
unified-learning-platform/
├── apps/
│   ├── web/                 # Next.js learner-facing web application
│   └── api/                 # NestJS REST API
├── packages/
│   ├── contracts/           # shared DTOs, validation schemas, API types
│   ├── ui/                  # reusable design-system components and tokens
│   ├── config/              # lint, TypeScript, test configuration
│   └── course-content/      # versioned imported course content
├── prisma/                  # schema, migrations, seeds
├── docs/                    # these documents in the new repository
├── infrastructure/          # Docker, deployment and environment templates
└── .github/workflows/       # CI checks
```

Use `pnpm` workspaces with Turborepo. Keep domain logic in the API; the web app must never decide whether a user owns a course.

## Initial local setup (when implementation starts)

1. Install Node.js 22 LTS, pnpm, Docker Desktop, and Git.
2. Create the new repository and copy this `docs/unified-platform/` folder into its root as `docs/`.
3. Initialize the workspace, web app, API, shared packages, PostgreSQL, Redis, CI, and environment templates.
4. Seed only a development administrator and non-secret sample coupon. Never commit production credentials or production coupon values.

## Working agreement for three collaborators

- Keep `main` deployable. Use short-lived branches named `feature/<area>-<summary>` and small pull requests.
- One person owns a pull request; another reviews it before merge. Do not directly edit another person’s unmerged changes.
- Every feature needs tests at the layer where its rule lives. Coupon and entitlement rules require API/integration tests.
- Update the relevant planning document whenever a product or architectural decision changes.
- Use issues with clear acceptance criteria; link the issue in the pull request.

## Source inventory

| Existing repository | Reuse in the new platform |
| --- | --- |
| `cyber-studio` | Cybersecurity modules, lessons, labs, quizzes, resources, downloadable assets, and visual references |
| `data-mlops-studio` | Data/MLOps modules, lessons, quizzes, resources, downloadable assets, and visual references |

Import content as reviewed structured data. Do not copy client-side demo authentication, localStorage entitlement state, or duplicate page shells into the new product.
