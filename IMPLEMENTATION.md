# Implementation Plan

## Phase 0 — alignment and inventory (2–3 days)

1. Freeze feature edits to both legacy repositories while content is inventoried.
2. List every module, lesson, quiz, lab, resource, PDF, image, and external link in both repositories.
3. Agree on exact product name, supported deployment provider, administrator identities, and the designated coupon naming policy.
4. Review and approve the seven planning documents. Create issues from the requirements and label dependencies.

Deliverable: signed-off scope and a content inventory spreadsheet/JSON, with a named owner for every migration item.

## Phase 1 — foundation (3–5 days)

1. Create the new monorepo and TypeScript workspace.
2. Configure Next.js, NestJS, Prisma/PostgreSQL, Redis, Docker Compose, environment validation, linting, formatting, commit checks, and GitHub Actions.
3. Implement users, roles, login/logout, secure session handling, `courses`, and empty dashboard/catalog endpoints.
4. Deploy a protected preview environment and establish database migration workflow.

Deliverable: a user can register/sign in and see a catalog served from the API.

## Phase 2 — entitlement and coupon vertical slice (3–5 days)

1. Add `enrollments`, `coupons`, `coupon_redemptions`, audit events, and transactional redemption.
2. Build admin coupon creation/listing and learner coupon redemption UI.
3. Add API tests for valid, invalid, expired, wrong-course, duplicate, exhausted, and concurrent redemption cases.
4. Add protected course route and asset-download authorization check.

Deliverable: a designated 100%-off coupon gives exactly one learner active ₹0 access; unauthorized users are blocked server-side.

## Phase 3 — shared UI and first course migration (4–6 days)

1. Build the design tokens and shared component library.
2. Implement app shell, catalog, dashboard, course page, module/lesson routes, progress, notes, and resource saves.
3. Convert and import the Cybersecurity course content with stable slugs.
4. Validate content counts, links, downloads, preview boundaries, responsive layout, and accessibility.

Deliverable: complete Cybersecurity course available through the shared learner experience.

## Phase 4 — second course migration (3–5 days)

1. Convert/import Data Engineering & MLOps content using the same schema and components.
2. Migrate quizzes and scoring to server-side evaluation.
3. Migrate labs as safe interactive activities and protect relevant resources.
4. Verify shared dashboard correctly aggregates both courses.

Deliverable: both courses operate inside one product without duplicated UI code.

## Phase 5 — hardening and launch (3–5 days)

1. End-to-end test the visitor → learner → coupon → protected lesson → progress persistence journey.
2. Run security review: authorization bypass, IDOR, XSS, rate limits, secrets, dependency audit, signed asset URLs.
3. Run performance/accessibility checks and manual mobile QA.
4. Configure backups, monitoring, error alerts, runbook, production environment, and rollback rehearsal.
5. Migrate approved content, enable production coupon(s), and launch.

## Suggested responsibilities for three people

| Person | Primary ownership | Reviews |
| --- | --- | --- |
| A — platform/backend | API, database, auth, coupon/entitlement rules, deployment | Content/admin UX changes |
| B — frontend/design | app shell, design system, catalog, course UX, accessibility | API contract and auth flows |
| C — content/quality | content transformation, seed scripts, tests, QA, documentation | Course UX and migration integrity |

Everyone reviews pull requests outside their primary area. Pair on Phase 2; it contains the most security-sensitive feature.

## Engineering definition of done

- Acceptance criteria in `REQUIREMENTS.md` are demonstrably met.
- TypeScript strict mode, linting, formatting, unit tests, API integration tests, and end-to-end smoke tests pass in CI.
- Database migration and seed work on a clean environment.
- No passwords, API keys, real coupon codes, or personal data are committed.
- Access is checked by the API for every protected route and asset.
- Mobile, keyboard, screen-reader baseline, and error states are manually verified.
- README, API contract, environment sample, operations runbook, and release notes are updated.

## First build ticket sequence

1. Repository/workspace and CI
2. Database schema and local Docker services
3. Authentication/session vertical slice
4. Catalog/course schema + seed data
5. Enrollment authorization guard
6. Coupon redemption transaction + tests
7. Admin coupon management
8. Shared UI shell/design tokens
9. Cybersecurity content migration
10. Data/MLOps content migration
11. Progress/quiz/notes/resources
12. Protected downloads and hardening

