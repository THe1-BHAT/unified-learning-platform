# Design System and UX

## Product structure

```text
Public:  Home → Catalog → Course landing → Sign in / Register
Learner: Dashboard → My courses → Course overview → Module → Lesson/Lab/Quiz
          └─────────→ Redeem coupon → Access confirmed → Course overview
Admin:   Admin → Coupons → Create / deactivate / inspect redemptions
```

## Navigation rules

- A shared desktop sidebar/top navigation and compact mobile menu appear throughout authenticated learning pages.
- Global destinations: Dashboard, Explore courses, My learning, Profile. Admin is visible only to admins.
- A course context bar identifies the active course and provides Course overview, Curriculum, Practice, Resources, and Progress.
- Preserve the user’s return path after authentication or coupon redemption.
- Avoid the legacy product names as competing brand shells; present Cybersecurity and Data Engineering & MLOps as course titles under one product name.

## Course cards and paid access

Each catalog card shows course title, level, lesson/module count, short outcome, price **₹2,500**, and one of these states:

| State | Primary action | Supporting text |
| --- | --- | --- |
| Visitor | Sign in to access | `₹2,500 per course` |
| Signed-in, no access | Redeem student coupon | `₹2,500 · Payment integration coming soon` |
| Coupon active | Continue course | `Student access applied · ₹0` |
| Paid active (future) | Continue course | `Access active` |

Do not label a non-functional button “Pay now.” Until payment exists, use `Payment integration coming soon` and make coupon redemption the only version-1 access path.

## Component foundation

Create reusable components in `packages/ui`:

- `AppShell`, `GlobalNav`, `CourseContextNav`, `PageHeader`
- `CourseCard`, `ModuleList`, `LessonLayout`, `ProgressIndicator`
- `AccessGate`, `PriceLabel`, `CouponRedeemForm`, `AccessStatus`
- `ResourceCard`, `Quiz`, `LabPanel`, `EmptyState`, `ErrorState`
- Inputs, buttons, dialogs, toast/status message, tables, and pagination

Use design tokens for color, spacing, type, radius, shadows, transitions, breakpoints, and focus states. Subject-specific accent colors may distinguish courses, but typography, spacing, button behavior, cards, and accessibility behavior must remain identical.

## Accessibility and responsive requirements

- Semantic landmarks, logical heading order, skip link, visible focus, and keyboard-operable dialogs/forms.
- Inputs always have labels; coupon results use an `aria-live` status region.
- Meet WCAG 2.2 AA contrast; never convey access, quiz correctness, or error state by color alone.
- Support 320px+ width, touch targets at least 44×44 CSS pixels, reduced motion, and readable zoom to 200%.
- Publish alt text for course images; caption/transcript video where content is essential.

## Content migration UX

Retain both curricula’s learning value, but normalize page patterns: module card, lesson objective, content blocks, activity, related resources, completion control, and next-step navigation. Mark preview material deliberately; do not accidentally expose full paid lessons through search, preloaded JSON, or static asset URLs.

