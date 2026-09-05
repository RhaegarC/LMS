# LMS PRD — Revision 1 (Proposal): Class Summary

> **Status:** Proposal — for review, not yet implemented.
> **Scope:** Supersedes the teacher **"New Assignment"** flow in [docs/PRD.md](docs/PRD.md).
> The original `docs/PRD.md` is **unchanged** — this document records Revision 1 so it can be
> reviewed before any edits are applied to the source-of-truth PRD.

---

## 1. Overview & Goal

Today a teacher creates a standalone **Assignment** (title + target classes + items) that students
answer. In Revision 1 the unit a teacher creates becomes a **Class Summary** — a record of *one
class session on one date* — and the old assignment content becomes the session's **Homework**.

Why: the product is a daily-teaching companion. A teacher wants to recap what a class did on a
given day (text, photos, videos) **and**, when they set work, attach the homework to that same
class + date — not maintain two disconnected objects.

**Key decisions (confirmed):**

| # | Decision |
| :--- | :--- |
| 1 | **Class Summary is the parent object; Homework is an optional child.** A summary may exist with no homework. |
| 2 | **Students of the selected class can see the published summary** (text / photos / videos) and any published homework. Teacher is the author. |
| 3 | **Homework is optional and addable later** — a published summary can gain a homework afterwards. |
| 4 | **Class Summary fully replaces standalone Assignment creation.** The old "Create Assignment" entry is retired. |
| 5 | **Homework items are Text / Image / Video, each with an optional text or voice explanation.** Replaces V1's Text / Video / Voice item model (see [§3.3](#33-homework-section--collapsible-part-3)). |

---

## 2. Terminology (old → new)

| V1 (today) | Revision 1 |
| :--- | :--- |
| **Assignment** | **Class Summary** — wrapper = {Class, Date} + Summary recap (text/photos/videos) |
| Assignment's **Title** | Removed (identity comes from Class + Date) |
| Assignment's **Target Classes** | Removed (bound to the single class of the summary) |
| Assignment's **Items** + **Due Date** + **Draft** | Move into the **Homework** section — items re-typed as **Text / Image / Video** with an optional **text or voice explanation** (Due Date & Draft unchanged) |
| "Create Assignment" screen | "New Class Summary" screen |
| Assignment list page | Class Summary list / timeline |
| Student submission & teacher feedback | Unchanged, but now attached to a **Homework** |

> Note: existing V1 objects keep working in this proposal; see [§11 Backward compatibility](#11-backward-compatibility).

---

## 3. The Class Summary

### 3.1 Identity & metadata (Part 1 of the creation page)

| Field | Control | Required | Notes |
| :--- | :--- | :--- | :--- |
| **Class** | Dropdown — the current teacher's classes | ✅ | Single-select. Shows only classes the teacher owns. |
| **Date** | Date picker | ✅ | The class session date (teacher-local, stored UTC). Defaults to today. |

These two fields *are* the summary's identity: **one summary per (Class, Date)**.
A second summary for the same class + date is blocked, or the teacher is offered the existing one
to edit.

### 3.2 "Summary" section — collapsible (Part 2)

A recap of the class on that date, in three sub-parts:

| Sub-part | What the teacher can do |
| :--- | :--- |
| **Text** | Write a free-text summary of the class (e.g. what was covered, how the kids did). |
| **Photo library** | Upload **multiple photos** taken in class. Thumbnails, reorderable, removable. |
| **Video library** | Upload **multiple videos** of the class. Reorderable, removable. |

Behavior:
- Section is **collapsible**; collapsible state is remembered during the editing session.
- All three sub-parts are **optional** (a teacher may post only photos, or only text).
- Photo / video reuse the existing media rules: API-mediated upload, allowlisted formats
  (photos `JPG/PNG`; video `MP4/MOV/WEBM`), per-file size cap (V1 = 500 MB configurable).
- Media appear to students in the order the teacher arranged them.

### 3.3 "Homework" section — collapsible (Part 3)

The old assignment body, with **Title and Target Class removed**:

| Element | Behavior (unchanged from V1 PRD §3 unless noted) |
| :--- | :--- |
| **Due date** | ✅ Kept — required. Defaults to **class date + 7 days**, 11:59 PM teacher-local. Past-date warning retained. |
| **Instruction items** | ✅ Revised — each item is a task of **Text / Image / Video** content, add / reorder / delete. **Text** = rich-text question or instruction; **Image** = uploaded picture the student looks at (JPG/PNG); **Video** = uploaded clip the student watches (MP4/MOV/WEBM). |
| **Optional explanation** | ✅ New — any item may carry **one optional explanation: a text note or a voice recording** (teacher recorded or uploaded) that helps the student understand the task (e.g., a spoken prompt for a pre-reader). Per-item, not required. |
| **Draft / Publish** | ✅ Kept — see [§4 Lifecycle](#4-lifecycle--visibility). |
| **Edit after publish** | ✅ Kept — edits save immediately; students see the new version next load. |
| **Clone** | ✅ Kept — clones the homework (items + due date) into the current summary; no submissions copied. |
| **Target classes / Title** | ❌ Removed — the class and date come from the parent summary. |

A homework may only exist under a Class Summary; it always targets exactly the summary's class.

---

## 4. Lifecycle & visibility

### 4.1 Draft vs published

- A **Class Summary** starts as a **Draft** — invisible to students.
- Publishing reveals the recap (text/photos/videos) to the **students of the selected class**.
- A **Homework** inside a published summary is itself Draft until its own Publish — so a teacher
  can publish the recap first and attach a homework later without students seeing half-written work.

| Scenario | Students of the class see |
| :--- | :--- |
| Summary Draft | Nothing |
| Summary Published, no homework | The recap (text/photos/videos) for that date |
| Summary Published + homework Draft | The recap only |
| Summary Published + homework Published | The recap + the homework (can submit / answer items) |

### 4.2 Publishing

On the creation page a single toggle/button mirrors today's app:

- **Save Draft** — saves everything quietly (summary + any homework as draft).
- **Publish** — publishes the summary **and** any homework present in the same edit.

"Add homework later" is a separate action from the class-summary detail/list page: it opens the
Homework builder, saves as Draft, and is published explicitly when ready.

### 4.3 Edit after publish

Mirrors V1: teacher may edit the recap or homework after publishing; students see the updated
version on their next load. A published summary cannot be *unpublished*; homework, once published,
cannot be unpublished (consistent with feedback permanence rules).

---

## 5. Student-facing view

A student in the class sees their class summaries — grouped by class and ordered by date (newest
first) — and can open one to view:

1. The day's recap: text, photo gallery, and video list.
2. Any **published homework** for that date, with its items.
3. The existing submit / edit-until-graded / confetti 🎉 / view-feedback experience, unchanged —
   but scoped to the homework.

---

## 6. Deltas to existing PRD sections (for the eventual PRD merge)

| PRD § | Change in Revision 1 |
| :--- | :--- |
| §3 Assignments | Replaced by **Class Summary** (§3 here). Content splits into the summary recap + Homework child. |
| §3 Assignment Items | Homework items re-typed from **Text / Video / Voice** to **Text / Image / Video**, each with an **optional text or voice explanation**. |
| §4 Submissions | Largely unchanged; now keyed to a **Homework** under a class summary. |
| §5 Feedback | Unchanged. |
| §6 Reports | Keyed via homework; unchanged math. Optional future: per-(class, date) recap archive. |
| §7 Permission matrix | "Create Assignment" rows become **Create Class Summary**; same owner rules (Teacher/Sys Admin). Students view summaries/homework only for their own class. |
| §8 Edge cases | Updated: duplicate (Class, Date); homework attached after publish; media rules for recap photos/videos. |
| §10 Exclusions / §11 Roadmap | Unchanged. |

---

## 7. Data model deltas (architecture impact — not yet applied)

| Change | Detail |
| :--- | :--- |
| **New table `ClassSummary`** | `Id`, `TeacherId` (owner), `ClassId`, `DateUtc`, `TextContent`, `IsDraft`, `PublishedAtUtc` + standard audit columns. Unique on (`ClassId`, `DateUtc`, `TeacherId`). |
| **New child table `ClassSummaryMedia`** | `ClassSummaryId`, `Type` (Photo/Video), `MediaFileId`, `Order`. |
| **`Assignment` → `Homework`** | Add `ClassSummaryId` (FK). Drop `Title` and its own class targeting (single class via summary). Keep `DueDateUtc`, `IsDraft`, `PublishedAtUtc`, `Items[]`. |
| **`AssignmentItem` → homework item** | `Type` re-scoped to **Text / Image / Video** content. New optional explanation fields: `ExplanationType` (Text/Voice) + content (rich text or media file). `Order` kept. |
| `Submission` / `Feedback` | Unchanged (FKs now resolve through `Homework`). |

---

## 8. Edge cases (deltas)

| Scenario | Behavior |
| :--- | :--- |
| Teacher creates a second summary for the same (Class, Date) | Blocked; surface the existing summary to edit. |
| Summary published with no recap content and no homework | Allowed as a draft-saving convenience, but **Publish** warns if both recap and homework are empty. |
| Teacher adds homework to an already-published summary | New homework starts as Draft; published later (nothing leaks to students meanwhile). |
| Teacher removes the class while a summary exists | Follows V1 soft-delete rules (archive class/summary; media retained for the archive window). |
| Photos/videos exceed size or wrong format | Rejected with existing media error messages (allowlist, 500 MB cap). |
| Homework due date before the summary date | Warning: "Due date is before the class date. Are you sure?" |

---

## 9. Acceptance criteria (draft)

1. Teacher can create a Class Summary choosing **only their own classes** and a **date**.
2. The **Summary** section can hold free text plus **multiple photos and videos**, all optional,
   collapsible, reorderable.
3. The **Homework** section builds items as **Text / Image / Video** tasks — each with an
   **optional text or voice explanation** — **without** Title and Target Class; Due Date remains.
4. A summary can be published with **no homework**.
5. Homework can be **added later** to an already-published summary and published independently.
6. Published recaps and homework are visible **only** to the selected class's students.
7. Students submit homework items and receive feedback with no change to the V1 flow.
8. All existing tests stay green; new component/unit tests cover the (Class, Date) uniqueness and
   the publish-state rules.

---

## 10. Open questions / to confirm

| # | Question | Proposed default |
| :--- | :--- | :--- |
| 1 | Is the summary's own **due-date-free** recap always required before publish, or may a teacher post homework-only? | Publish allowed with either recap **or** homework present (warn if both empty). |
| 2 | Recap text: rich text or plain? | Rich text (reuse existing editor). |
| 3 | Do photos/videos need **captions**? | No — captions are a future nicety. |
| 4 | Default homework due date? | Class date + 7 days (11:59 PM). |
| 5 | **Naming in the student UI:** still call the child "Homework", and the page "Class Summary"? | Yes, per this doc. |

---

## 11. Backward compatibility

V1 has no production data yet (system is in UI/design stage), so a full data migration is **not**
required. Existing prototype assignments remain readable as legacy until the Class Summary flow
replaces them in the UI; then the old "Create Assignment" entry is removed.
