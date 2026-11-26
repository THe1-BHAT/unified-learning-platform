# Database Design

## Version 1 data platform

Supabase PostgreSQL is the source of truth for identities, entitlements, coupon redemption, payment records, and learning records. Supabase Auth owns authentication identities in auth.users; application tables in the public schema reference that user ID. Store timestamps in UTC and use UUID primary keys. Supabase SQL migrations under supabase/migrations/ are authoritative; Prisma is synchronized from them for typed server-side access. Browser localStorage is never a source of truth for authentication or paid access.

    Auth user ── 1:1 ── Profile
        │
        ├──< Enrollment >── Course ──< Module ──< Lesson
        ├──< CouponRedemption >── Coupon
        ├──< LessonProgress
        ├──< QuizAttempt
        ├──< LearnerNote
        └──< SavedResource

## Core tables

| Table | Essential fields | Notes |
| --- | --- | --- |
| profiles | id, full_name, email, role, created_at | id references auth.users; role is learner or admin |
| courses | id, slug, title, description, price_paise, published | ₹2,500 is stored as 250000 paise, never a floating point value |
| modules | id, course_id, slug, title, position | unique course/slug and course/position |
| lessons | id, module_id, slug, title, content, position, is_preview | only deliberate previews are public |
| resources | id, course_id, title, kind, storage_key, is_preview | storage_key points to a private Storage object, not a public URL |
| enrollments | id, user_id, course_id, status, source, amount_paid_paise, access_granted_at, created_at, updated_at | unique user/course; this is the access source of truth |
| coupons | id, course_id, code_hash, discount_percent, max_redemptions, redemption_count, starts_at, ends_at, active | store normalized code hash, never coupon plaintext |
| coupon_redemptions | id, coupon_id, user_id, enrollment_id, redeemed_at | immutable audit record; unique coupon/user |
| lesson_progress | user_id, lesson_id, completed_at, last_viewed_at | unique user/lesson; course completion is derived from this table |
| quiz_attempts | id, user_id, quiz_id, score, answers, submitted_at | score must not be trusted from the client |
| learner_notes | id, user_id, lesson_id, body, created_at, updated_at | private to the learner |
| saved_resources | user_id, resource_id, created_at | unique user/resource |
| audit_events | id, actor_user_id, event_type, target_type, target_id, metadata, created_at | redact secrets and coupon values from metadata |

## Enrollment lifecycle

The enrollment table has one row per learner/course. Do not insert a second row when a learner uses a coupon after a failed or pending attempt.

| Current status | Valid coupon redemption behavior |
| --- | --- |
| No enrollment | Insert active enrollment with source coupon and amount 0 |
| pending_payment | Update to active, source coupon, amount 0 |
| active | Return the existing enrollment; do not consume the coupon again |
| expired | Update to active only when the coupon is currently valid |
| revoked | Reject redemption and require an admin to restore access |

A future verified payment may transition pending_payment to active. Only an admin may revoke access. Record every administrative transition in audit_events.

## Coupon redemption transaction

Run redemption only in a Supabase Edge Function or permissioned SQL RPC, never in browser code. In one transaction:

1. Normalize the submitted code by trimming and uppercasing, then hash it.
2. Select and lock the matching coupon.
3. Verify active status, 100% discount, date range, selected course, and remaining uses.
4. Check the existing enrollment and apply the lifecycle above.
5. Insert an immutable coupon_redemptions record only when a coupon is newly consumed.
6. Increment redemption_count, write audit_events, and commit together.
7. Roll back everything if any check or constraint fails.

The coupon row lock plus unique constraints prevents two learners from consuming the final use simultaneously.

## Row Level Security

Enable RLS on every exposed application table.

- A learner may read and update only their own profile fields, progress, notes, saved resources, quiz attempts, and enrollment rows.
- A learner cannot insert or update an enrollment to active status.
- A learner cannot create, modify, or inspect coupons or other users' redemptions.
- Admin actions use a server-only service role or an admin Edge Function; service-role credentials never reach the browser.
- Test both allow and deny cases for each policy in the migration/test suite.

## Protected files and content

RLS controls database rows, not an already-public file URL. Store protected PDFs and assets in a private Supabase Storage bucket. A protected download request must first verify an active enrollment in server-side code, then return a short-lived signed URL.

## Required indexes and constraints

- courses slug unique
- enrollments user_id/course_id unique; index user_id/status
- coupons code_hash unique; index course_id, active, starts_at, ends_at
- coupon_redemptions coupon_id/user_id unique
- lesson_progress user_id/lesson_id unique
- saved_resources user_id/resource_id unique
- indexes on all foreign-key columns used by course/module/lesson queries

## Content migration

Keep course content in reviewed, versioned source files with stable course/module/lesson/resource slugs. Import or seed idempotently by slug, then verify lesson counts, quizzes, PDFs, links, preview flags, and asset licensing against the legacy repositories before publishing.
