# Database Design

## Principles

PostgreSQL is the source of truth for users, entitlements, coupon redemption, and learning records. Store timestamps in UTC, use UUID primary keys, create schema migrations only through Prisma, and never use browser localStorage for paid-access decisions.

## Core entities

```text
User ──< Enrollment >── Course ──< Module ──< Lesson
  │                         │                    │
  ├──< CouponRedemption >── Coupon               ├──< LessonProgress
  ├──< QuizAttempt                                   
  ├──< LearnerNote
  └──< SavedResource
Course ──< Resource
```

| Table | Essential fields | Notes |
| --- | --- | --- |
| `users` | `id`, `email`, `password_hash`, `role`, `status`, timestamps | `email` unique, normalized lowercase |
| `courses` | `id`, `slug`, `title`, `description`, `price_paise`, `published` | ₹2,500 is stored as `250000` paise, never floating point |
| `modules` | `id`, `course_id`, `slug`, `title`, `position` | unique `(course_id, slug)` and `(course_id, position)` |
| `lessons` | `id`, `module_id`, `slug`, `title`, `content`, `position`, `is_preview` | structured content/version is preferred over HTML blobs |
| `resources` | `id`, `course_id`, `title`, `kind`, `storage_key`, `is_preview` | `storage_key` identifies object-store asset, not public URL |
| `enrollments` | `id`, `user_id`, `course_id`, `status`, `access_granted_at`, `source`, `amount_paid_paise` | unique `(user_id, course_id)` |
| `coupons` | `id`, `course_id`, `code_hash`, `discount_percent`, `max_redemptions`, `redemption_count`, `starts_at`, `ends_at`, `active` | coupon text is normalized then hashed; never return its hash |
| `coupon_redemptions` | `id`, `coupon_id`, `user_id`, `enrollment_id`, `redeemed_at` | unique `(coupon_id, user_id)`; audit record |
| `lesson_progress` | `user_id`, `lesson_id`, `completed_at`, `last_viewed_at` | composite unique `(user_id, lesson_id)` |
| `quiz_attempts` | `id`, `user_id`, `quiz_id`, `score`, `answers`, `submitted_at` | avoid client-trusted score calculations |
| `learner_notes` | `id`, `user_id`, `lesson_id`, `body`, timestamps | notes belong only to their author |
| `saved_resources` | `user_id`, `resource_id`, `created_at` | composite unique `(user_id, resource_id)` |
| `audit_events` | `id`, `actor_user_id`, `event_type`, `target_type`, `target_id`, `metadata`, `created_at` | metadata is redacted and excludes secrets |

## Coupon redemption transaction

Within one database transaction:

1. Normalize submitted code (trim + uppercase), hash it, and select the matching coupon with a row lock.
2. Verify `active`, 100% discount, time window, matching course, and `redemption_count < max_redemptions`.
3. Confirm the learner has not already redeemed the coupon and does not already have active paid/coupon access.
4. Insert an `active` enrollment with `source = coupon` and `amount_paid_paise = 0` (or preserve an existing inactive enrollment by updating it).
5. Insert `coupon_redemptions`, increment `redemption_count`, and write `audit_events`.
6. Commit. Any constraint failure rolls back every change.

The row lock plus unique constraints protect against two learners redeeming the last available use at the same time.

## Required indexes

- `users(email)` unique
- `courses(slug)` unique
- `enrollments(user_id, course_id)` unique and `(user_id, status)`
- `coupons(code_hash)` unique and `(course_id, active, starts_at, ends_at)`
- `coupon_redemptions(coupon_id, user_id)` unique
- `lesson_progress(user_id, lesson_id)` unique
- Foreign-key indexes for common course/module/lesson lookups

## Data migration approach

1. Convert each legacy app’s JavaScript/JSON curriculum into reviewed, versioned source files in `packages/course-content`.
2. Assign stable course/module/lesson/resource slugs; do not depend on legacy array indexes.
3. Write an idempotent seed/import script that upserts content by slug.
4. Manually verify lesson count, quiz count, resource links, PDFs, image licensing, and preview flags against each source repository.
5. Keep legacy repositories untouched and deployable until the new platform passes content and access acceptance tests.

