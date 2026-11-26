# Unified Learning Platform — Plan of Action

## Objective

Combine the existing Cybersecurity and Data Engineering & MLOps learning sites into one secure, scalable NxGenVarsity platform. Each course shows a price of **₹2,500**. In version 1, payment is displayed but not processed; a valid designated coupon gives a student 100% free course access.

## What we are building

```text
One account
   └── One dashboard
         ├── Cybersecurity course
         └── Data Engineering & MLOps course

Access to each course:
₹2,500 label  OR  valid 100%-off student coupon → active enrollment
```

## Team responsibilities

| Person | Owns | First responsibility |
| --- | --- | --- |
| Friend 1 | Backend/platform | Database, authentication, access control, coupons, deployment |
| Friend 2 | Frontend/design | Unified interface, navigation, course pages, responsive design |
| You | Product/content/quality | Content migration, task tracking, testing, documentation, final QA |

Everyone reviews another person’s pull request before it is merged. Pair together on coupon/access work because it is security-sensitive.

## Ground rules before coding

1. Create one new GitHub repository named `unified-learning-platform`.
2. Do not modify or delete the two existing repositories; they are our content sources and fallback demos.
3. Create GitHub issues from the milestones below and assign one owner per issue.
4. Create a new branch per task: `feature/<area>-<short-name>`.
5. No direct changes to `main`; open a pull request, request review, merge only after checks pass.
6. Never commit passwords, database URLs, API keys, or real coupon codes.

## Implementation sequence

### Milestone 0 — Agree on scope and inventory

**Goal:** know exactly what must be carried forward before changing code.

Tasks:

- Review and approve the project documents in this folder.
- Decide the platform name, logo, domain/deployment provider, and initial administrator.
- Make a content inventory for both source projects: modules, lessons, quizzes, labs, PDFs, images, videos, external links, and downloadable assets.
- Decide what is public preview content and what is protected paid content.
- Decide the initial designated coupon policy: course-specific or both-course, maximum uses, expiry date, and who may receive it.

**Done when:** both courses have a reviewed inventory and every item has an owner/migration status.

### Milestone 1 — Create the technical foundation

**Goal:** establish a professional project skeleton that all three people can use safely.

Tasks:

- Create a TypeScript monorepo using pnpm workspaces.
- Add `apps/web` (Next.js) and `apps/api` (NestJS).
- Add PostgreSQL, Prisma migrations, Redis, Docker Compose, environment-variable templates, linting, formatting, and tests.
- Add CI that runs type checking, linting, and tests for every pull request.
- Deploy a preview environment.

**Done when:** a clean clone can start locally with documented commands, and a sample web page successfully calls the API.

### Milestone 2 — Build accounts and access control

**Goal:** make access secure before placing real course material behind it.

Tasks:

- Build registration, login, logout, secure sessions, and learner/admin roles.
- Create `users`, `courses`, and `enrollments` tables.
- Build a public course catalog showing Cybersecurity and Data/MLOps at **₹2,500** each.
- Add a server-side access guard: only learners with an active enrollment can request protected content or downloads.
- Add an empty learner dashboard showing enrolled courses.

**Done when:** an unauthenticated or unenrolled user cannot get protected API content, even by typing the URL directly.

### Milestone 3 — Add coupon access

**Goal:** satisfy the student 100%-access requirement safely.

Tasks:

- Create coupon and coupon-redemption database tables.
- Build an admin interface/API to create, deactivate, expire, and limit coupons.
- Build a learner coupon redemption form on each course page.
- On valid redemption, create active ₹0 enrollment and record the redemption.
- Add protection against invalid, expired, exhausted, wrong-course, duplicate, and simultaneous redemptions.
- Add rate limits and audit logs for coupon actions.

**Done when:** a valid code grants access exactly once according to its rules, and all failure cases are tested.

### Milestone 4 — Build the unified UI

**Goal:** make the product feel like one platform, not two websites joined together.

Tasks:

- Define shared colors, typography, spacing, buttons, cards, forms, dialogs, and error states.
- Build shared navigation: Dashboard, Explore Courses, My Learning, Profile, and Admin (admin only).
- Build reusable course, module, lesson, quiz, resource, and progress components.
- Make the experience responsive and keyboard accessible.
- Clearly show access state: `₹2,500`, `Redeem student coupon`, `Payment integration coming soon`, or `Access active`.

**Done when:** both course experiences use the same design system and navigation patterns.

### Milestone 5 — Migrate Cybersecurity content

**Goal:** fully move the Cybersecurity learning experience into the unified platform.

Tasks:

- Convert course material into structured, versioned content files with stable IDs/slugs.
- Import modules, lessons, quizzes, labs, resources, videos, images, and PDFs.
- Add course progress, notes, saved resources, and quiz-result persistence.
- Mark preview versus protected content deliberately.
- Verify every link/download and compare counts with the source site.

**Done when:** an enrolled learner can complete the Cybersecurity course end-to-end in the new platform.

### Milestone 6 — Migrate Data Engineering & MLOps content

**Goal:** complete the second course using the same platform components.

Tasks:

- Convert and import Data/MLOps modules, lessons, quizzes, pipeline lab, resources, guides, videos, and PDFs.
- Reuse shared UI components rather than copying a second application shell.
- Validate server-side quiz scoring and protected-resource access.
- Ensure the dashboard shows progress from both courses.

**Done when:** an enrolled learner can complete either course through one account and one dashboard.

### Milestone 7 — Test, secure, and release

**Goal:** launch a dependable version 1.

Tasks:

- Run unit, API integration, and end-to-end tests.
- Test full journeys: visitor → sign up → coupon redemption → protected lesson → saved progress after sign-in again.
- Test mobile layouts, keyboard-only flows, screen-reader labels, error states, and slow-network behaviour.
- Review authorization, rate limiting, input validation, downloads, secrets, dependency vulnerabilities, backups, and logs.
- Prepare production database, deployment, monitoring, error alerts, and rollback plan.

**Done when:** every acceptance criterion in `REQUIREMENTS.md` passes and the team can deploy/rollback confidently.

## First week checklist

### Day 1

- Create GitHub repository and invite both friends.
- Share this folder and agree on the seven core documents.
- Create the content-inventory issue and decide who documents Cybersecurity versus Data/MLOps.

### Day 2

- Complete source-content inventories.
- Decide preview content, coupon rules, platform name, and the initial admin account.
- Create milestone issues and assign owners.

### Day 3

- Scaffold monorepo, web app, API, Docker, PostgreSQL, and CI.
- Confirm every team member can run it locally.

### Day 4–5

- Build the first vertical slice: registration/login → catalog → course card → protected test lesson.
- Review the pull request together and deploy a preview.

## Weekly team routine

- **Start of week (15–20 minutes):** choose issues, identify dependencies, and assign owners.
- **During development:** post a short update when a pull request is ready; request review before merge.
- **End of week (30 minutes):** demo working software, record bugs/decisions, and update this plan if scope changes.

## First decision needed

Before Milestone 1, decide whether the coupon should grant access to **one selected course** or **both courses**. The recommended default is **one selected course per coupon**, since it makes pricing, reporting, and future payments much clearer.
