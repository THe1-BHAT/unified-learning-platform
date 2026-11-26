# API Design

## Conventions

- Base URL: `/api/v1`
- JSON request and response bodies; UTF-8; ISO 8601 timestamps.
- Validate every request with shared Zod/class-validator schemas.
- Authentication uses secure HTTP-only session cookies. The API derives the current user; clients never submit a user ID for their own records.
- Use `401` for unauthenticated requests, `403` for authenticated but unauthorized requests, `404` when a resource is not visible, `409` for state conflicts, and `422` for valid JSON with invalid business input.
- Error response: `{ "error": { "code": "COUPON_INVALID", "message": "This code cannot be used for this course." }, "requestId": "..." }`.

## Endpoint groups

| Method | Path | Auth | Purpose |
| --- | --- | --- | --- |
| `POST` | `/auth/register` | Public | Create learner account |
| `POST` | `/auth/login` | Public | Start session |
| `POST` | `/auth/logout` | Learner | End session |
| `GET` | `/me` | Learner | Current profile, roles, enrollments summary |
| `GET` | `/courses` | Public | Public catalog including ₹2,500 display price |
| `GET` | `/courses/:slug` | Public | Course overview and preview metadata |
| `GET` | `/courses/:slug/content` | Learner + entitlement | Protected curriculum/content payload |
| `GET` | `/resources/:id/download` | Learner + entitlement | Redirect to a short-lived signed download URL |
| `POST` | `/courses/:courseId/coupons/redeem` | Learner | Redeem eligible 100%-off coupon |
| `GET` | `/learning/dashboard` | Learner | Cross-course progress and next lessons |
| `PUT` | `/lessons/:lessonId/progress` | Learner + entitlement | Save completion/view state |
| `POST` | `/quizzes/:quizId/attempts` | Learner + entitlement | Submit answers; server scores attempt |
| `PUT` | `/lessons/:lessonId/note` | Learner + entitlement | Upsert personal note |
| `PUT` | `/resources/:resourceId/saved` | Learner + entitlement | Save/unsave resource |
| `POST` | `/admin/coupons` | Admin | Create designated coupon |
| `PATCH` | `/admin/coupons/:id` | Admin | Activate, deactivate, or update dates/limit |
| `GET` | `/admin/coupons` | Admin | List coupon metadata and redemption counts |

## Coupon request

```http
POST /api/v1/courses/7d.../coupons/redeem
Content-Type: application/json

{ "code": "NXGEN-STUDENT-2026" }
```

Successful response:

```json
{
  "enrollment": {
    "courseId": "7d...",
    "status": "active",
    "source": "coupon",
    "amountPaidPaise": 0,
    "accessGrantedAt": "2026-11-26T10:00:00Z"
  }
}
```

The service must be idempotent for a learner who already has an active enrollment: it returns the existing enrollment without incrementing coupon usage. A simultaneous redemption race resolves safely at the database transaction/constraint level.

## Access policy matrix

| Resource/action | Visitor | Learner without enrollment | Active learner | Admin |
| --- | --- | --- | --- | --- |
| Catalog/course landing | Yes | Yes | Yes | Yes |
| Preview lesson | Yes | Yes | Yes | Yes |
| Protected lesson/lab/quiz/download | No | No | Yes | Yes |
| Own progress/notes | No | Own empty state | Own only | As needed for support/audit |
| Coupon redemption | No | Yes | Yes | Yes |
| Coupon administration | No | No | No | Yes |

## Future payment seam

When real payments are approved, add `orders`, `payment_attempts`, provider webhooks, signature verification, and an enrollment activation event. Only a verified webhook or manual admin approval can change `pending_payment` to `active`; the future UI must not do so directly.

