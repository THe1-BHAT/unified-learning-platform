# Requirements

## Product goal

Offer Cybersecurity and Data Engineering & MLOps as courses inside one coherent NxGenVarsity learning platform. Learners sign in once, browse both courses, purchase access conceptually at ₹2,500 per course, or redeem an authorized 100%-discount coupon.

## Functional requirements

### Accounts and roles

- Visitors can view public catalog and course landing pages.
- Learners can register, sign in, sign out, and view a single cross-course dashboard.
- Administrators can manage courses, coupon codes, and learner enrollments.
- Roles are `learner` and `admin`; privileged actions are enforced by the API.

### Course access

- The catalog displays both courses with a price label of **₹2,500** per course.
- A learner may preview explicitly public material only; protected lessons, labs, downloads, quizzes, and progress require an active enrollment.
- The platform has an explicit course-access state: `active`, `pending_payment`, `expired`, or `revoked`.
- Live payment processing stays disabled until a provider is selected and its signed webhook is implemented. V1 includes payment-ready order and attempt records; the UI may show the course price and a clearly labelled coming-soon state, but must not treat a price label or browser return as payment confirmation.

### Coupon access

- A signed-in learner can submit a code for a chosen course.
- Only active, unexpired, designated 100%-discount coupons may create free access.
- Redemption is atomic: a code cannot exceed its usage limit, and a learner cannot redeem the same coupon twice.
- A valid redemption creates an `active` enrollment at ₹0 and records an immutable redemption/audit record.
- Invalid, expired, exhausted, wrong-course, or non-100% codes reveal no sensitive details; return a friendly generic error.

### Learning experience

- One global shell: shared header, navigation, account menu, dashboard, catalog, and profile.
- Course pages retain subject-appropriate modules, lessons, resources, quizzes, labs, and downloadable guides, but use the same component library and interaction patterns.
- Save lesson completion, quiz outcomes, notes, and resource bookmarks per authenticated learner and course.
- Learners can navigate Dashboard → Catalog → Course → Module → Lesson and return without losing context.

## Non-functional requirements

| Area | Requirement |
| --- | --- |
| Security | HTTPS, password hashing, server-side authorization, validated input, rate-limited authentication and coupon redemption, least-privilege database access |
| Scalability | Stateless web/API services, PostgreSQL indexes and migrations, Redis-backed rate limiting/cache, CDN/object storage for assets |
| Reliability | Database backups, structured logs, health checks, error tracking, and migration rollback plan |
| Performance | Cached public catalog, paginated/admin list APIs, optimized images, lazy-loaded course assets |
| Accessibility | WCAG 2.2 AA target, keyboard navigation, semantic HTML, focus management, contrast, captions/transcripts where applicable |
| Maintainability | TypeScript, modular domain boundaries, API contracts, linting, formatting, tests, CI, and documented decisions |

## Version 1 scope

Included: account system, catalog, unified design system, both course migrations, gated access, 100% coupons, progress, admin coupon management, deployment baseline, tests, and documentation.

Excluded: live payment gateway, refunds, tax invoices, subscriptions, multi-organization tenancy, social learning, certificates, native mobile apps, and external LMS integration. These remain future roadmap items.

## Acceptance criteria

1. A visitor sees both courses in one catalog and a consistent navigation system.
2. A signed-in learner without an enrollment cannot load protected course API data or downloads.
3. An administrator creates a designated 100%-off coupon for one course; an eligible learner redeems it once and immediately receives active access at ₹0.
4. Reusing an exhausted code, an expired code, a code for another course, or the same code by the same learner fails without granting access.
5. The ₹2,500 price appears on each paid course; no UI claims that payment succeeded without a future verified payment event.
6. Lesson progress persists after sign-out/sign-in and is isolated between accounts.
7. CI passes type checks, lint, unit tests, integration tests for entitlement/coupon flows, and a basic end-to-end learner journey.

