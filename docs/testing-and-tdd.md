# Testing & TDD Strategy

> Cross-cutting | Priority: Must (process) | Source of truth: [docs/PRD.md](docs/PRD.md) · Aligned architecture: [docs/architecture.md](docs/architecture.md)

## Purpose

Define how the team develops **test-first** (TDD) and what the quality bar is for each feature of the LMS.

## TDD process — Red-Green-Refactor

For each behavior, in this order:

1. **Red** — write a failing test that asserts the desired behavior. Run it; confirm it fails for the right reason.
2. **Green** — write the minimum implementation to make the test pass.
3. **Refactor** — clean up code/duplication; re-run the suite; keep it green.

No production code without a failing test first (exceptions: scaffolding, configuration, migrations).

## Test tiers & tooling

| Tier | Tool | Covers | Where it lives |
|---|---|---|---|
| **Unit** | xUnit | Domain/business rules: permission-matrix resolution, late-flag logic, feedback publish rules, draft-clearing on resubmit, item ordering | `api/Lms.Tests/` unit project |
| **Integration** | xUnit + EF Core InMemory (or SQLite) | Persistence: `Submission` round-trips, owner-scoped vs admin-scoped queries, enrollment rules, media-record wiring | `api/Lms.Tests/`, real `DbContext` |
| **Component** | Vitest + Testing Library | Angular components: star picker, review player, confetti, media recorder, quick-comment picker; route guards; services | `web/` test setup (Vitest) |
| **Manual E2E** | — | Deployed SWA + ACA app: sign-in → teacher creates class/assignment → student submits (incl. media) → teacher grades → feedback visible | run against the cloud URL |

**Auth testing note:** Entra ID sign-in can't run in unit/component tests. Mock the authentication
state for component/unit tests; exercise the real flow in manual E2E on the deployed app.
Role/permission tests target the app-side `User.Role` resolution, not the token.

**Pragmatic coverage bar (small product, <100 users):** high coverage on core business logic
(permission matrix, submission/feedback rules, late handling); smoke-level coverage on
straightforward UI wiring. Don't gold-plate UI tests.

## DoD tie-in

A feature is **done** only when:
- Its tests exist, were written **first** (Red), and are committed with the feature.
- The full suite passes with no failures.
- Manual E2E checkpoints in the feature file are recorded as verified.

## Suggested test focus map

| Area | Primary test focus |
|---|---|
| Identity & auth (app-side roles) | find-or-create on login; role default = Student; only Sys Admin changes roles; permission-matrix enforcement per endpoint |
| Classes & enrollment | owner-scoped queries; duplicate enrollment ignored; remove → immediate loss of access, submissions retained |
| Assignments | draft hidden from students; publish-date visibility; item ordering; clone creates draft; edit-after-publish keeps submissions attached |
| Submissions | all-items-required validation; late badge; edit-before-grading overwrite; draft-feedback cleared + `RequiresReGrading`; no submission without published assignment + enrollment |
| Feedback | per-item star range 0.5–5.0; publish = permanent; voice ≤1 min; text ≤500 chars |
| Media | API-mediated upload → `MediaFile` row → `ItemResponse` reference; size/type limits; download RBAC |
| Reports | per-item averages & star distributions via aggregation queries |

## Commands

- Backend: `dotnet test` (from `api/`)
- Frontend: `npm test` (from `web/`, Vitest)
