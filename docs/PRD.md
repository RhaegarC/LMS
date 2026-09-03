# LMS V1.0 - Learning Management System
## Requirements Specification Document

---

## 1. Introduction

### 1.1 Purpose
LMS is a cloud-based Learning Management System designed for teaching English to children under 10. The system enables teachers to create assignments, students to submit multimedia responses, and teachers to provide detailed feedback.

### 1.2 Scope - Version 1.0
This document covers the complete feature set for V1.0. The system focuses on the core homework lifecycle: **Assignment Creation → Student Submission → Teacher Feedback**. Future versions will include parent portals, gamification, and advanced analytics.

### 1.3 Target Users
| Role | Description |
| :--- | :--- |
| **Sys Admin** | Superuser with full system access. Can manage all users, classes, assignments, and submissions across the entire platform. |
| **Teacher** | Creates and manages classes, creates assignments, reviews submissions, and provides feedback to students. |
| **Student** | Belongs to one or more classes, submits assignments, views feedback, and tracks their progress. |

---

## 2. Classes

### 2.1 Create Class
**Actor:** Teacher

**Description:** Teacher creates a new class with basic information.

**Fields:**
| Field | Type | Required | Description |
| :--- | :--- | :--- | :--- |
| Class Name | Text (max 100 chars) | Yes | Display name for the class |
| Description | Text (max 500 chars) | No | Additional context about the class |

**Acceptance Criteria:**
- Teacher must be authenticated.
- Class name must be unique within the teacher's account.
- Upon creation, the teacher is automatically the class owner.

---

### 2.2 Edit Class
**Actor:** Teacher

**Description:** Teacher updates class information.

**Actions:**
- Update Class Name
- Update Description

**Acceptance Criteria:**
- Only the class owner (teacher) can edit.
- Changes are saved immediately.
- Existing enrollments and assignments remain unaffected.

---

### 2.3 Student Management

#### 2.3.1 Add Students
**Actor:** Teacher

**Description:** Teacher enrolls students into their class.

**Actions:**
- Search for students by name or email.
- Select one or more students to add.
- Students receive automatic enrollment.

**Acceptance Criteria:**
- Only enrolled students can view the class and its assignments.
- A student can be enrolled in multiple classes simultaneously.
- Duplicate enrollment attempts are ignored.

#### 2.3.2 Remove Students
**Actor:** Teacher

**Description:** Teacher removes a student from their class.

**Actions:**
- Select a student from the class roster.
- Confirm removal.

**Acceptance Criteria:**
- Student immediately loses access to the class and its assignments.
- **Submissions remain in the system** for historical reporting.
- Removed students are flagged as "Removed" in reports.

---

## 3. Assignments

### 3.1 Assignment Structure

**Fields:**
| Field | Type | Required | Description |
| :--- | :--- | :--- | :--- |
| Title | Text (max 100 chars) | Yes | Assignment title shown to students |
| Due Date | Date (YYYY-MM-DD) | Yes | Assignment deadline at 11:59 PM (teacher's local time) |
| Target Classes | List of Classes | Yes | One or more classes that receive this assignment |
| Items | Array of Items | Yes | Ordered list of assignment items (see below) |
| Draft Mode | Boolean | Yes | Draft status (hidden from students) |

**Item Types:**
| Type | Description |
| :--- | :--- |
| **Text** | Rich text instruction (bold, italics, lists) – teacher writes guidance |
| **Video** | Teacher uploads a reference video (for students to mimic) |
| **Voice Recording** | Teacher records audio instruction |

**Item Fields:**
| Field | Type | Required | Description |
| :--- | :--- | :--- | :--- |
| Item Type | Enum (Text/Video/Voice) | Yes | Type of instruction item |
| Content | Rich Text / URL / Audio | Yes | The actual instruction content |
| Order | Integer | Yes | Position in the assignment (0 = first) |

---

### 3.2 Create Assignment
**Actor:** Teacher

**Description:** Teacher creates a new assignment for one or more classes.

**Acceptance Criteria:**
- Teacher must be authenticated.
- Target classes must be owned by the teacher.
- Items must be in the correct order.
- Draft assignments are **not visible** to students.
- Assignments can be saved as draft without publishing.

---

### 3.3 Draft Mode
**Actor:** Teacher

**Description:** Teacher saves assignment as a draft for later editing.

**Acceptance Criteria:**
- Drafts are only visible to the teacher.
- Students cannot see or access draft assignments.
- Teacher can edit drafts freely.
- Teacher can publish a draft at any time.

---

### 3.4 Clone Assignment
**Actor:** Teacher

**Description:** Teacher duplicates an existing assignment.

**Actions:**
- Select source assignment.
- System duplicates all fields: Title, Items, Due Date, Target Classes.
- Teacher edits the cloned copy before publishing.

**Acceptance Criteria:**
- New assignment is created in draft mode (safe to edit).
- Submissions from the original assignment are **not** copied.
- Cloning does not affect the original assignment.

---

### 3.5 Edit After Publish
**Actor:** Teacher

**Description:** Teacher edits any field of a published assignment.

**Editable Fields:**
- Title
- Description
- Items (add, edit, delete, reorder)
- Due Date
- Target Classes

**Acceptance Criteria:**
- Changes are saved immediately.
- Students see updated version on their next access.
- No notification is required (simplified).
- If editing Target Classes after submissions exist, existing submissions remain attached to the assignment.

---

### 3.6 Assignment Visibility Rules
| Status | Student Visibility |
| :--- | :--- |
| Draft | ❌ Hidden |
| Published (current date ≥ publish date) | ✅ Visible |
| Published (future publish date) | ❌ Hidden until publish date |

---

## 4. Submissions

### 4.1 Submission Structure

**Fields:**
| Field | Type | Description |
| :--- | :--- | :--- |
| Assignment ID | UUID | Reference to the assignment |
| Student ID | UUID | Reference to the student |
| Item Responses | Array | One response per assignment item |
| Submission Date | Timestamp | When the student submitted |
| Is Late | Boolean | Whether submission is past due date |
| Status | Enum | Pending / Submitted / Rejected |

**Item Response Fields:**
| Field | Type | Description |
| :--- | :--- | :--- |
| Item ID | UUID | Reference to assignment item |
| Response Type | Enum | Text / Video URL / Voice URL |
| Content | Text / URL | The actual response content |
| Duration | Integer (seconds) | Duration of video/voice (for information only) |

---

### 4.2 Submit Assignment
**Actor:** Student

**Description:** Student submits responses to all items in an assignment.

**For Each Item:**
| Item Type | Student Action |
| :--- | :--- |
| **Text** | Type response in text box (rich text optional) |
| **Video** | Record video using webcam/mic |
| **Voice** | Record audio using microphone |

**Upload Features:**
- **Preview:** Optional. Student can review before submitting.
- **No Time Limit:** No enforced maximum duration.
- **Progress Indicator:** Shows upload progress.

**Acceptance Criteria:**
- Student must be enrolled in at least one target class.
- Assignment must be published and visible.
- **All items** must have a response before submission.
- Preview is optional (not mandatory).
- Successful submission triggers **confetti celebration** animation.

---

### 4.3 Late Handling
**Actor:** System

**Description:** System handles submissions submitted after the due date.

**Behavior:**
- If submission date > due date → flagged with **"⏰ Late"** badge.
- Submission is still accepted.
- No penalty or blocking – simply flagged for teacher awareness.

**Acceptance Criteria:**
- Late badge is visible to both teacher and student.
- Late submissions appear in the teacher's queue with the badge.

---

### 4.4 Edit After Submission
**Actor:** Student

**Description:** Student updates their submission before grading.

**Rules:**
- Student can edit/re-upload any item **as long as feedback has NOT been published**.
- Once feedback is published, editing is **locked**.
- Version history is kept for audit purposes.

**Acceptance Criteria:**
- Edit button is available on the submission page.
- Updated version replaces the old version for teacher review.
- If teacher had started grading (draft feedback), the grade is **auto-cleared** – teacher must re-grade.
- A notification is sent to the teacher: "Student resubmitted – requires re-grading."

---

### 4.5 Submission Flow Diagram
- Student views assignment ↓
- Student responds to all items ↓
- [Optional] Preview responses ↓
- Click SUBMIT ↓
- System checks due date → Flags Late if applicable ↓
- Confetti celebration 🎉 ↓
- Submission stored. Teacher notified. ↓
- Student can edit until feedback published.
---

## 5. Feedback

### 5.1 Feedback Structure

**Fields:**
| Field | Type | Description |
| :--- | :--- | :--- |
| Submission ID | UUID | Reference to the submission |
| Item Ratings | Array of Stars | One 5-star rating per assignment item |
| Text Feedback | Rich Text | Overall or item-specific written feedback |
| Voice Feedback URL | URL | Optional audio feedback (max 1 minute) |
| Draft Status | Boolean | Draft (hidden) or Published (visible) |
| Published Date | Timestamp | When feedback was published |

**Item Rating Fields:**
| Field | Type | Description |
| :--- | :--- | :--- |
| Item ID | UUID | Reference to assignment item |
| Stars | Decimal (0.5–5.0) | Rating with half-star increments |

---

### 5.2 Pending Queue
**Actor:** Teacher

**Description:** Teacher sees all submissions awaiting feedback.

**Queue Display:**
| Column | Description |
| :--- | :--- |
| Student Name | Submitter's name |
| Assignment Title | Title of the assignment |
| Submission Date | Date/time of submission |
| Late Badge | ⏰ if submitted after due date |
| Action | "Review" button |

**Sorting:**
- Default: Oldest submission first.
- Teacher can toggle to sort by other columns.

**Acceptance Criteria:**
- Teacher only sees submissions for their own classes.
- Sys admin sees all submissions across the platform.
- Queue updates in real-time when new submissions arrive.

---

### 5.3 Review Player
**Actor:** Teacher

**Description:** Embedded player for reviewing video/voice submissions.

**Features:**
| Feature | Description |
| :--- | :--- |
| Play/Pause | Standard playback controls |
| Speed Control | 0.5x, 1x, 1.5x, 2x – skips through long recordings |
| Duration Display | Shows total length of recording |
| Transcript | Auto-generated text transcript (optional in V1) |

**Acceptance Criteria:**
- Teacher can review all item responses in one page.
- Text responses are displayed directly.
- Video/voice responses use the embedded player.

---

### 5.4 5-Star Rating (Per Item)
**Actor:** Teacher

**Description:** Teacher rates each item independently.

**Specifications:**
- **Range:** 0.5 to 5.0 (half-star increments)
- **Visual:** Clickable star picker
- **Per Item:** Each assignment item gets its own rating

**Example Assignment with 3 Items:**
| Item | Rating |
| :--- | :--- |
| Item 1: Speak "Hello" | 4.5 ⭐ |
| Item 2: Write "Apple" | 5.0 ⭐ |
| Item 3: Sing the ABC Song | 3.5 ⭐ |

**Acceptance Criteria:**
- Teacher can change ratings anytime before publishing.
- Ratings are included in student reports.

---

### 5.5 Text Feedback
**Actor:** Teacher

**Description:** Teacher provides written feedback.

**Features:**
- **Rich Text Editor:** Bold, italics, bullet lists.
- **Quick Comments:** Pre-defined emoji-rich responses:

| Quick Comment | Emoji |
| :--- | :--- |
| Great job! | 🌟 |
| Keep practicing! | 💪 |
| Excellent pronunciation! | 🎯 |
| Try again, you can do it! | 😊 |
| Wonderful effort! | ⭐ |
| Fantastic progress! | 🚀 |
| I'm so proud of you! | ❤️ |

**Acceptance Criteria:**
- Teacher clicks a quick comment to insert it.
- Teacher can customize after insertion.
- Maximum 500 characters.

---

### 5.6 Voice Feedback
**Actor:** Teacher

**Description:** Teacher records a personalized audio message.

**Specifications:**
- **Maximum Duration:** 1 minute
- **Feature:** Record, play, re-record before saving
- **Storage:** Uploaded to cloud storage

**Acceptance Criteria:**
- Voice feedback is optional.
- If provided, attached to the overall feedback.
- Auto-transcription is optional (future feature).

---

### 5.7 Draft Feedback
**Actor:** Teacher

**Description:** Teacher saves feedback without publishing to students.

**Features:**
- All feedback fields (ratings, text, voice) can be saved as draft.
- Students see **nothing** until published.
- Teacher can edit drafts repeatedly.
- Draft status is clearly indicated in the UI.

**Acceptance Criteria:**
- Students cannot see draft feedback.
- Teacher can return to draft and complete later.

---

### 5.8 Publish Feedback
**Actor:** Teacher

**Description:** Teacher releases all feedback to the student.

**Actions:**
- Click "Publish" button.
- All ratings, text feedback, and voice feedback become visible to the student.
- Feedback is **permanent** – no unpublish.
- Student receives an in-app notification.

**Acceptance Criteria:**
- Once published, feedback cannot be unpublished or edited.
- Student sees: Individual item ratings, overall text feedback, voice feedback (if provided).
- Published date is recorded.

---

### 5.9 Batch Statistics
**Actor:** Teacher

**Description:** Teacher sees aggregate statistics for the assignment.

**Display:**
| Statistic | Description |
| :--- | :--- |
| Total Submissions | Number of students who submitted |
| On-Time Submissions | Count and percentage |
| Late Submissions | Count and percentage |
| Not Submitted | Count and percentage |
| **Per-Item Average Stars** | Average rating for each assignment item |

**Example:**
Assignment: "My Family Introduction"
Total Submissions: 18/20 (90%)

Per-Item Averages:
Item 1 (Speaking): 4.2 ⭐
Item 2 (Writing): 3.8 ⭐
Item 3 (Vocabulary): 4.5 ⭐

**Acceptance Criteria:**
- Statistics are calculated automatically.
- Updated in real-time as feedback is published.
- Helps teacher identify which items students struggled with.

---

## 6. Reports

### 6.1 Student Progress Card
**Actor:** Teacher, Student, Sys Admin

**Description:** Comprehensive view of a student's performance.

**Filters:**
| Filter | Options |
| :--- | :--- |
| Time Range | This Week / This Month / This Semester / Custom Date Range |
| Classes | All Classes (default) / Specific Class |

**Display:**
| Column | Description |
| :--- | :--- |
| Assignment | Title and class name |
| Submission Date | Date submitted (with Late badge if applicable) |
| Item Ratings | Per-item star ratings (e.g., 4.5⭐, 3.0⭐) |
| Feedback Summary | Brief text feedback (truncated) |
| Trend | Visual indicator: improving / declining / steady |

**Additional Features:**
- **Export:** PDF download (for parent-teacher meetings).
- **Trendline:** Simple graph showing performance over time.

**Access:**
| User | Access Level |
| :--- | :--- |
| Student | Self only |
| Teacher | Students in their own classes |
| Sys Admin | All students |

---

### 6.2 Class Engagement Snapshot
**Actor:** Teacher, Sys Admin

**Description:** Overview of assignment engagement for a class.

**Filters:**
| Filter | Options |
| :--- | :--- |
| Assignment | Select a specific assignment |
| Class | Select a specific class |

**Display:**
Assignment: "My Family Introduction"
Class: Level 1 - Red

Submission Breakdown:
✅ On Time: 12 (60%)
⏰ Late: 4 (20%)
❌ Not Submitted: 4 (20%)

**Per-Item Performance:**
Item 1 (Speaking): Avg 4.2 ⭐
Distribution: 5⭐ (6), 4⭐ (8), 3⭐ (2), 2⭐ (0), 1⭐ (0)

Item 2 (Writing): Avg 3.8 ⭐
Distribution: 5⭐ (4), 4⭐ (6), 3⭐ (4), 2⭐ (2), 1⭐ (0)


**Additional Features:**
- **Export:** PDF or CSV download.
- **Visual:** Bar chart showing submission status breakdown.

**Access:**
| User | Access Level |
| :--- | :--- |
| Teacher | Own classes only |
| Sys Admin | All classes |

---

## 7. Roles & Permissions

### 7.1 Permission Matrix

| Action | Sys Admin | Teacher | Student |
| :--- | :--- | :--- | :--- |
| **User Management** | | | |
| Create/Delete Users | ✅ | ❌ | ❌ |
| Assign/Change Roles | ✅ | ❌ | ❌ |
| **Classes** | | | |
| Create Class | ✅ | ✅ | ❌ |
| Edit Own Class | ✅ | ✅ | ❌ |
| Delete Own Class | ✅ | ✅ | ❌ |
| View All Classes | ✅ | ❌ | ❌ |
| View Own Classes | ✅ | ✅ | ✅ |
| **Student Management** | | | |
| Add Students to Any Class | ✅ | ❌ | ❌ |
| Add Students to Own Class | ✅ | ✅ | ❌ |
| Remove Students from Any Class | ✅ | ❌ | ❌ |
| Remove Students from Own Class | ✅ | ✅ | ❌ |
| **Assignments** | | | |
| Create Assignment | ✅ | ✅ | ❌ |
| Edit Any Assignment | ✅ | ❌ | ❌ |
| Edit Own Assignment | ✅ | ✅ | ❌ |
| Clone Assignment | ✅ | ✅ | ❌ |
| View Assignment | ✅ | ✅ | ✅ (if enrolled) |
| **Submissions** | | | |
| Submit Assignment | ❌ | ❌ | ✅ (if enrolled) |
| Edit Submission (before grading) | ❌ | ❌ | ✅ (own) |
| Edit Submission (after grading) | ❌ | ❌ | ❌ (locked) |
| View Submission History | ✅ | ✅ (own classes) | ✅ (own) |
| **Feedback** | | | |
| View Pending Queue | ✅ | ✅ (own classes) | ❌ |
| Grade Any Submission | ✅ | ❌ | ❌ |
| Grade Own Submissions | ✅ | ✅ | ❌ |
| Save Draft Feedback | ✅ | ✅ | ❌ |
| Publish Feedback | ✅ | ✅ | ❌ |
| View Published Feedback | ✅ | ✅ (own classes) | ✅ (own) |
| **Reports** | | | |
| View Student Progress Card | ✅ | ✅ (own classes) | ✅ (self) |
| View Class Engagement Snapshot | ✅ | ✅ (own classes) | ❌ |
| Export Reports | ✅ | ✅ | ❌ |

---

## 8. Edge Cases & Error Handling

### 8.1 Assignment Edge Cases

| Scenario | System Behavior |
| :--- | :--- |
| Teacher deletes a class with assignments | Soft-delete: assignments hidden from students but remain in reports for 30 days. |
| Teacher edits assignment after publishing | Changes save immediately. Students see updated version on next load. |
| Teacher edits Target Classes after submissions exist | Existing submissions stay attached to the assignment. New students see the assignment. |
| Teacher clones an assignment with no items | Clone is created in draft mode. Teacher must add items before publishing. |
| Teacher sets due date in the past | Warning displayed: "This due date is in the past. Are you sure?" |

### 8.2 Submission Edge Cases

| Scenario | System Behavior |
| :--- | :--- |
| Student submits empty responses | Blocked. All items must have valid responses. |
| Student uploads corrupted file | Rejected with message: "File could not be read. Please try again." |
| Student uploads unsupported file type | Rejected. Only supported formats accepted (JPG/PNG/MP4/MOV/WEBM/MP3/M4A). |
| Student edits submission after feedback published | Edit button disabled. Message: "Feedback already published – cannot edit." |
| Student edits submission while teacher has draft feedback | Allowed. Draft feedback is automatically cleared. Teacher notified to re-grade. |
| Due date passes during upload | If upload started before due date, allowed. Late badge applied. |
| Student submits large file (>500 MB) | Rejected. Max file size: 500 MB (configurable). |
| Internet disconnects during upload | Auto-resume using chunked upload (browser handles it). |

### 8.3 Feedback Edge Cases

| Scenario | System Behavior |
| :--- | :--- |
| Teacher publishes feedback with no ratings | Blocked. All items must have a rating before publishing. |
| Teacher accidentally publishes wrong feedback | No unpublish option. But teacher can contact sys admin for manual override (audit trail). |
| Teacher saves draft feedback for weeks | Drafts persist indefinitely. Students see nothing. |
| Teacher records voice feedback > 1 minute | System truncates or rejects. Max 1 minute. |
| Student views feedback the moment it's published | Notification triggers. Feedback appears immediately. |

### 8.4 Admin Edge Cases

| Scenario | System Behavior |
| :--- | :--- |
| Sys admin deletes a student with submissions | Soft-delete. Student deactivated. Submissions remain for historical reports. |
| Sys admin changes a teacher's classes | All classes reassigned. Existing assignments/submissions transfer to new teacher. |
| Sys admin needs to fix a corrupted submission | Admin can delete submission, allowing student to re-upload (even after due date). |
| System clock/timezone issues | All dates stored in UTC. Display converted to user's local timezone. |

---

## 9. Non-Functional Requirements

### 9.1 Performance
| Requirement | Target |
| :--- | :--- |
| Page Load Time | < 2 seconds (first load) |
| API Response Time | < 500ms (P95) |
| File Upload Speed | 10 MB/s (browser handles chunking) |
| Concurrent Users | Support 50 teachers + 500 students simultaneously |

### 9.2 Security
| Requirement | Description |
| :--- | :--- |
| Authentication | Azure AD B2C (OAuth 2.0) |
| Role-Based Access | JWT tokens with role claims |
| File Security | SAS URLs for direct uploads (5-minute expiry) |
| Data Encryption | At-rest encryption in Azure Storage/SQL |
| Audit Log | All critical actions logged (create, delete, publish) |

### 9.3 Availability
| Requirement | Target |
| :--- | :--- |
| Uptime | 99.5% (mon-fri 8am-8pm) |
| Backup | Daily automated backups (retention: 7 days) |
| Disaster Recovery | Manual restore within 24 hours |

### 9.4 Scalability
| Requirement | Description |
| :--- | :--- |
| Horizontal Scaling | Functions scale automatically on demand |
| Database | Serverless tier (auto-pause during idle) |
| Storage | Unlimited blob storage (pay-as-you-go) |

### 9.5 Responsive Design & Device Support

Browser-only — one responsive web app that adapts to the user's screen. No native apps in V1; the same UI serves **PC / laptop, tablet, and phone**.

| Device | Reference width | Experience |
| :--- | :--- | :--- |
| **PC / laptop** | ≥ 1024 px | Fixed sidebar navigation; multi-column dashboards & reports; full data tables |
| **Tablet** | 640 – 1023 px | Sidebar is used from 768 px up; below that a ☰ drawer + bottom navigation. Content runs single-main-pane layouts |
| **Phone** | < 640 px | ☰ menu and bottom tab bar; tables reflow to stacked cards; thumb-friendly touch targets |

Reference widths are product-level targets — the exact breakpoints are tuned per component in the implementation (mobile-first `sm`/`md`/`lg` scale; see [architecture §7](docs/architecture.md)).

**Acceptance Criteria:**
- The page never scrolls horizontally on any supported screen; very wide tables may scroll within their own card.
- Primary navigation is reachable at every size: sidebar on wide screens, ☰ drawer + bottom tab bar on narrow ones.
- Tap targets are ≥ 44 px on touch devices.
- Data-dense pages (pending queue, reports) keep every required column readable at phone width (via reflow or contained scroll).

---

## 10. Exclusions (V1.0 Out of Scope)

The following features are **deliberately excluded** from V1.0 to maintain simplicity and focus:

| Feature | Notes |
| :--- | :--- |
| Parent Accounts/Portal | Planned for V2.0 |
| Resubmission Workflows | Students submit once; no automated resubmission |
| Email Notifications | In-app notifications only |
| Video Transcoding | Accepts MP4/MOV/WEBM; browser handles playback |
| Advanced Analytics | No heatmaps, predictive analytics, etc. |
| Gamification | No stickers, leaderboards, streaks |
| Mobile Apps | Browser-only (responsive design) |
| Third-Party Integrations | No external LMS or SIS integrations |
| Live Classes/Video Conferencing | No real-time teaching features |
| Plagiarism/AI Detection | Not applicable (students under 10) |

---

## 11. Future Roadmap (V2.0+)

| Feature | Priority | Description |
| :--- | :--- | :--- |
| Parent Portal | High | View-only access for parents to track progress |
| Resubmission Workflow | Medium | Allow students to resubmit after feedback |
| Email Notifications | Medium | Automated reminders and feedback alerts |
| Gamification | Medium | Stickers, badges, and leaderboards |
| Mobile Apps | Low | iOS/Android native apps |
| Video Transcoding | Low | Auto-convert to H.264 for compatibility |
| Advanced Reports | Low | Heatmaps, trend analysis, export to Excel |

---

## 12. Glossary

| Term | Definition |
| :--- | :--- |
| **Assignment** | A set of tasks created by a teacher for students to complete. |
| **Item** | A single task within an assignment (text instruction, video, or voice). |
| **Submission** | A student's completed responses to all items in an assignment. |
| **Feedback** | Teacher's evaluation including star ratings, text, and voice comments. |
| **Draft** | A non-published version (assignment or feedback) only visible to the creator. |
| **Late** | A submission made after the due date. Flagged with a badge. |
| **Pending Queue** | List of submissions awaiting teacher feedback. |
| **Batch Stats** | Aggregate statistics for an assignment (per-item averages, submission rates). |
| **Progress Card** | Individual student report showing all assignments and performance. |
| **Engagement Snapshot** | Class-level report showing submission rates and average scores. |
| **Soft Delete** | Items marked as deleted but retained in the system for 30 days. |

---

## 13. Document Version History

| Version | Date | Author | Changes |
| :--- | :--- | :--- | :--- |
| 1.0 | 2026-08-27 | System Architect | Initial release – complete V1.0 specification |
| 1.1 | 2026-09-04 | System Architect | Add responsive design & device-support targets for PC/tablet/phone (§9.5) |

---

## 14. Approval

| Role | Name | Date | Signature |
| :--- | :--- | :--- | :--- |
| Product Owner | | | |
| Tech Lead | | | |
| Sys Admin | | | |

---

**END OF DOCUMENT**