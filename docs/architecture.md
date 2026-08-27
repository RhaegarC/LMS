# LMS V1.0 — System Architecture

> Aligned via `/grill-me` session · Source of truth: [docs/PRD.md](docs/PRD.md) · 2026-08-27

## 1. Context

LMS is a Learning Management System for teaching English to children under 10.
The core lifecycle is **Assignment Creation → Student Submission → Teacher Feedback**.

**Real scale: fewer than 100 total users** (not the PRD's stated "50 teachers + 500 students").
Several PRD NFRs were written against the larger scale; where the two conflict, the real scale wins.

## 2. Identity & Auth

| Concern | Decision |
| :--- | :--- |
| Identity provider | **Microsoft Entra ID** (Azure), `common` authority (work/school + **personal Microsoft accounts**) |
| Account creation | **Self-registration** — users create their own Entra account, then sign in |
| JWT usage | **Authentication only** — proves *who you are* via `sub`/`oid`; carries no roles |
| Authorization | **Inside the app** — `Role` column on the app `User` table; RBAC resolved from DB per request |
| Provisioning | On login, app **find-or-creates** `User` (keyed by Entra subject); new users default to **Student** |
| Role management | **Only Sys Admin** changes roles / deactivates users (per PRD §7). Teachers have no role-management ability |
| Bootstrap | A seeded bootstrap user is **Sys Admin** |
| Identifier | Email (teachers search students by name/email, §2.3.1) |

**Consequence:** role changes take effect immediately (no token-refresh lag).
The [§7 permission matrix](docs/PRD.md) is enforced server-side against the DB role on every endpoint.

> ⚠️ Kids under 10 creating their own Microsoft account hits Microsoft's account-age restrictions.
> In practice a parent/teacher typically creates the child's account; the child just signs in.
> This works with the design but "student self-registration" may not be a real path for the youngest users.

## 3. Hosting (Azure)

| Piece | Where |
| :--- | :--- |
| Angular SPA | **Azure Static Web Apps** (CDN, SSL, CI/CD) |
| .NET 10 API | **Azure Container Apps** (single container) |
| Database | **Azure SQL (serverless)** — relational, ACID |
| Media | **Azure Blob Storage (Hot)** — read/written **through the API** (no SAS URLs) |
| Monitoring | **Application Insights** |
| Real-time | **Excluded from V1** — no SignalR; notifications are an on-load feed |

## 4. Repository & Solution Layout

```
lms/
├── api/
│   ├── Lms.Api/        # HTTP controllers, authn/authz, validation
│   ├── Lms.Domain/     # entities + business logic (no EF/UI deps)
│   ├── Lms.Data/       # EF Core DbContext, migrations, seeds
│   └── Lms.Tests/      # xUnit (unit + EF InMemory integration)
├── web/                # single Angular app (lazy routes per role, guards, services + signals)
└── docs/
```

Backend is a **modular monolith** — 4 projects, **controllers** (not Minimal APIs), **EF Core**.
No Clean-Architecture ceremony (use-case classes, mediator) at this size.

## 5. Data Model (normalized child tables)

Stored in UTC; displayed in the user's local timezone. Soft-delete via `IsArchived` (30-day archive).

**Standard audit columns — every table carries all four, as the DB-design standard:**
`CreatedBy`, `CreatedOn`, `LastModifiedBy`, `LastModifiedOn`.
Populated by the API on write from the current app user (or `system` for background/system writes);
`CreatedOn`/`LastModifiedOn` stored in UTC. `LastModifiedBy`/`LastModifiedOn` update on any change;
`CreatedBy`/`CreatedOn` never change.

| Table | Key fields |
| :--- | :--- |
| `User` | Email, Name, **Role**, IsActive, EntraSubject |
| `Class` | OwnerTeacherId, Name, Description, IsArchived, ArchivedAtUtc |
| `Enrollment` | ClassId, UserId, Status |
| `Assignment` | TeacherId, Title, DueDateUtc, PublishDateUtc, IsDraft |
| `AssignmentItem` | AssignmentId, **Type** (Text/Video/Voice), Content, **Order** |
| `Submission` | AssignmentId, StudentId, SubmittedAtUtc, IsLate, Status |
| `ItemResponse` | SubmissionId, AssignmentItemId, ResponseType, MediaFileId?, TextContent?, DurationSec? |
| `Feedback` | SubmissionId, Text, VoiceMediaFileId?, IsDraft, PublishedAtUtc, RequiresReGrading |
| `ItemRating` | FeedbackId, AssignmentItemId, **Stars** (0.5–5.0, half-step) |
| `MediaFile` | Container, Path, SizeBytes, ContentType |
| `Notification` | RecipientUserId, Type, Payload, IsRead |

Design choice: the PRD's "arrays" (`Assignment.Items`, `Submission.ItemResponses`,
`Feedback.ItemRatings`) are **normalized child tables** — reporting (§5.9 per-item averages,
§6.2 star distributions) is a plain `GROUP BY`, ordering is a column, and edits/reorders are clean rows.

## 6. Key Flows

### 6.1 Assignment is a hard prerequisite for submission
A student can only submit against an **existing, published, non-draft** assignment targeting a class
they are **enrolled in** — enforced server-side (not just UI hiding).

### 6.2 Submit
Student answers **all items** (required) → optional preview → SUBMIT → system flags **Late**
if past due (still accepted, no penalty) → confetti 🎉 → teacher notified (on-load feed).

### 6.3 Edit before grading
Student can edit/re-upload any item **until feedback is published**.
- `ItemResponses` are **overwritten in place — no version history** (de-scoped).
- New media blob **replaces** the old.
- If the teacher has **draft** feedback: it is **wiped**, `RequiresReGrading` set, teacher notified.

### 6.4 Grade
Pending queue (oldest first) → review player (per-item, text inline + video/voice player) →
per-item **star ratings** → rich text feedback + quick comments (≤500 chars) → optional voice (≤1 min)
→ **draft** or **publish**. **Publish is permanent** — no unpublish, no edit.

### 6.5 Media I/O (API-mediated)
Upload: streamed `POST` through the API → Blob Storage + `MediaFile` row → `ItemResponse` reference.
Download: `GET` through the API with the caller's RBAC applied.
Limits: **500 MB max**, allowlist `JPG/PNG/MP4/MOV/WEBM/MP3/M4A`. No chunked-resume protocol in V1
(retry on disconnect).

## 7. Frontend (web/)

- **Single Angular app** — three lazy-loaded route modules (`/teacher`, `/student`, `/admin`)
  guarded by route guards resolving the app role from the current user (DB-backed).
- **No state library** — plain injectable services + signals.
- Shared components: star picker, review player, confetti, media recorder, quick-comment picker.
- Recording uses `MediaRecorder` → blob → normal `HttpClient` upload with progress events
  (no Blob SDK in the browser).

## 8. Reporting & Cross-Cutting

- **Reports** (progress card, class engagement snapshot, batch stats): server-side aggregation
  over the normalized tables.
- **Export**: PDF/CSV — **client-side print-to-PDF for V1**.
- **Timezone**: all dates stored UTC (due date = 11:59 pm teacher-local, converted on save).
- **Soft delete**: 30-day archive for classes/users; submissions remain for historical reporting (§8.1).
- **Audit log**: critical actions logged — create, delete, publish (§9.2).
- **Notifications**: in-app only (no email in V1), read on load, no push.

## 9. De-scoped (by decision, not omission)

| Item | Reason |
| :--- | :--- |
| SignalR / real-time push | <100 users; polling/on-load feed is sufficient. Revisit for V2 parent portal |
| SAS direct uploads | API-mediated I/O chosen; RBAC applies to every media request |
| Submission version history | Current-version-only for simplicity; snapshot table can be added later if audit is needed |
| PRD §10 exclusions | Parent portal, email notifications, resubmission workflow, transcoding, gamification, mobile, integrations, live classes, plagiarism/AI detection — all V1 out-of-scope |

## 10. Testing Strategy

See [docs/testing-and-tdd.md](docs/testing-and-tdd.md). Backend: xUnit (unit + EF InMemory).
Frontend: Vitest + Testing Library. TDD Red-Green-Refactor, full suite green before PR.

---
