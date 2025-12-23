# User Stories: Exam Taking Flow MVP

> **Project:** Prestige Academy CPNS Exam System  
> **Version:** 1.0.0  
> **Last Updated:** December 2025  
> **Author:** I Gede Bala Putra (Undergraduate Thesis)

---

## Table of Contents

1. [Overview](#1-overview)
2. [Assumptions & Dependencies](#2-assumptions--dependencies)
3. [User Stories: Participant Role](#3-user-stories-participant-role)
4. [User Stories: Admin Role (Monitoring)](#4-user-stories-admin-role-monitoring)
5. [Proctoring Behaviors](#5-proctoring-behaviors)
6. [State Management Rules](#6-state-management-rules)
7. [Edge Cases & Guards](#7-edge-cases--guards)
8. [Non-Functional Requirements](#8-non-functional-requirements)
9. [API Reference Summary](#9-api-reference-summary)

---

## 1. Overview

This document defines the user stories for the **Exam Taking Flow**, which is the core MVP functionality of the CPNS online exam proctoring system. The flow covers the complete participant journey from dashboard entry to result viewing, with AI-powered face detection proctoring throughout the exam session.

### MVP Scope

```
Participant Flow:
Login → Dashboard → Browse Exams → Select Exam → Start Session → 
Instructions/Consent → Take Exam (with proctoring) → Auto-save Answers → 
Submit/Timeout → View Result Summary
```

### Key Features

- **Exam session management** with timer and auto-submit on timeout
- **Question navigation** (previous/next/jump to specific question)
- **Answer auto-save** on every selection
- **YOLO-based face detection** proctoring (thesis demonstration focus)
- **Violation tracking** with progressive warnings
- **Result summary** with score breakdown by question type

---

## 2. Assumptions & Dependencies

### Technical Assumptions

| Assumption | Rationale |
|------------|-----------|
| Backend is production-ready and locked | All endpoints verified via Postman; no modifications needed |
| Single active session per exam | Backend prevents concurrent sessions for same user-exam pair |
| Server time is source of truth | Client time may drift; `remainingTimeMs` from server is authoritative |
| Webcam permission is mandatory | Proctoring requires camera access; exam cannot proceed without it |
| Stable network for proctoring | Face analysis requires periodic API calls (~5 second intervals) |

### Dependencies

| Component | Dependency | Purpose |
|-----------|------------|---------|
| Frontend | Backend API v1 | All data operations |
| Proctoring | YOLO ML Microservice | Face detection analysis |
| Timer | Server `remainingTimeMs` | Exam time synchronization |
| Auth | JWT tokens | All protected endpoints |

### Browser Requirements

- Modern browser with `getUserMedia` API support
- JavaScript enabled
- Cookies enabled (token storage)
- Minimum viewport: 768px width (responsive design)

---

## 3. User Stories: Participant Role

### 3.1 Dashboard Access

#### US-P01: View Participant Dashboard

**As a** logged-in participant,  
**I want to** see my exam dashboard  
**So that I** can navigate to available exams and view my exam history.

**Acceptance Criteria:**

```gherkin
Given I am logged in as a participant
When I navigate to /dashboard
Then I see the dashboard with:
  - Navigation to "Available Exams"
  - Navigation to "My Exam Sessions"
  - Navigation to "My Results"
  - Summary statistics (if available)

Given I am not logged in
When I try to access /dashboard
Then I am redirected to /login with return URL preserved
```

**API Touchpoints:**
- `GET /api/v1/me` - Verify auth status and get user profile
- `GET /api/v1/results?limit=5` - Recent results for dashboard summary

**UI States:**

| State | Display |
|-------|---------|
| Loading | Skeleton cards with shimmer effect |
| Success | Dashboard with navigation cards and stats |
| Error | Error message with retry button |
| Empty | Welcome message with CTA to browse exams |

---

### 3.2 Exam Discovery & Selection

#### US-P02: Browse Available Exams

**As a** participant,  
**I want to** browse all available exams  
**So that I** can choose which exam to take.

**Acceptance Criteria:**

```gherkin
Given I am on the exam list page
When the page loads
Then I see a paginated list of available exams showing:
  - Exam title
  - Description (truncated)
  - Duration in minutes
  - Number of questions
  - Passing score

Given there are more than 10 exams
When I scroll or click "Load More"
Then additional exams are fetched and appended

Given I enter a search term
When I submit the search
Then the list is filtered to matching exam titles/descriptions
```

**API Touchpoints:**
- `GET /api/v1/exams` - List available exams
- Query params: `page`, `limit`, `search`, `sortBy`, `sortOrder`

**UI States:**

| State | Display |
|-------|---------|
| Loading | Skeleton list items (6 items) |
| Success | Exam cards in grid/list layout |
| Empty | "No exams available" with illustration |
| Error | Error message with retry action |
| Searching | Loading spinner in search input |

---

#### US-P03: View Exam Details

**As a** participant,  
**I want to** view detailed information about an exam  
**So that I** can decide whether to take it.

**Acceptance Criteria:**

```gherkin
Given I click on an exam card
When the exam detail page loads
Then I see:
  - Full exam title
  - Complete description
  - Duration (e.g., "90 minutes")
  - Total questions count
  - Question type breakdown (TIU/TKP/TWK)
  - Passing score
  - Start time window (if applicable)
  - "Start Exam" button

Given the exam has start/end time restrictions
When current time is outside the window
Then the "Start Exam" button is disabled with explanation

Given I have an IN_PROGRESS session for this exam
When I view the exam details
Then I see "Resume Exam" instead of "Start Exam"

Given I have completed this exam and retakes are disabled
When I view the exam details
Then I see "Already Completed" and "View Results" link
```

**API Touchpoints:**
- `GET /api/v1/exams/:id` - Get exam details
- `GET /api/v1/exam-sessions?examId=:id` - Check for existing session

**UI States:**

| State | Display |
|-------|---------|
| Loading | Skeleton detail card |
| Success | Full exam details with action button |
| Not Found | 404 page with "Back to Exams" link |
| Error | Error message with retry |

---

### 3.3 Starting the Exam Session

#### US-P04: Start New Exam Session

**As a** participant,  
**I want to** start an exam session  
**So that I** can begin answering questions.

**Acceptance Criteria:**

```gherkin
Given I am on an exam detail page
And I have not started this exam before
When I click "Start Exam"
Then the system creates a new exam session (userExam)
And I am navigated to the exam instructions page

Given the exam has no questions configured
When I try to start
Then I see an error: "Exam has no questions"

Given the exam has no duration set
When I try to start
Then I see an error: "Exam duration not set"
```

**API Touchpoints:**
- `POST /api/v1/exams/:id/start` - Create/resume exam session

**Response Structure:**
```typescript
{
  userExam: UserExamSession,  // Session metadata
  questions: ParticipantQuestion[],  // Questions without answers
  answers: ParticipantAnswer[]  // Existing answers (empty for new)
}
```

**Error Codes:**
| Code | Meaning | UI Action |
|------|---------|-----------|
| `EXAM_NOT_FOUND` | Exam doesn't exist | Redirect to exam list |
| `EXAM_NO_QUESTIONS` | No questions in exam | Show error, disable start |
| `EXAM_NO_DURATION` | Duration not configured | Show error, disable start |
| `EXAM_SESSION_ALREADY_STARTED` | Already completed | Show results link |

---

#### US-P05: Resume Existing Session

**As a** participant,  
**I want to** resume an in-progress exam session  
**So that I** can continue where I left off.

**Acceptance Criteria:**

```gherkin
Given I have an IN_PROGRESS exam session
When I click "Resume Exam"
Then the system retrieves my existing session
And my previously saved answers are restored
And the timer reflects actual remaining time

Given my session has timed out since last access
When I try to resume
Then the session is automatically marked as TIMEOUT
And I see the result summary
```

**API Touchpoints:**
- `POST /api/v1/exams/:id/start` - Same endpoint handles resume
- Backend returns existing session if IN_PROGRESS

**State Preservation:**
- Questions are returned in original order
- Answers array contains previously selected options
- `remainingTimeMs` is recalculated server-side

---

#### US-P06: View Exam Instructions & Grant Consent

**As a** participant,  
**I want to** read exam instructions and grant proctoring consent  
**So that I** understand the rules before starting.

**Acceptance Criteria:**

```gherkin
Given I have started/resumed an exam session
When I am on the instructions page
Then I see:
  - Exam rules and guidelines
  - Proctoring notice (camera will be active)
  - Duration and question count
  - Auto-save notice
  - Consent checkbox

Given I have not checked the consent checkbox
When I click "Begin Exam"
Then the button is disabled with message

Given I have checked consent and clicked "Begin Exam"
When webcam permission is requested
Then browser's permission dialog appears

Given I grant webcam permission
When permission is granted
Then I am navigated to the exam-taking interface
And proctoring starts automatically

Given I deny webcam permission
When permission is denied
Then I see an error explaining webcam is required
And I cannot proceed until permission is granted
```

**UI States:**

| State | Display |
|-------|---------|
| Initial | Instructions with disabled "Begin" button |
| Consented | Instructions with enabled "Begin" button |
| Requesting Camera | Loading indicator "Requesting camera access..." |
| Camera Denied | Error with instructions to enable camera |
| Camera Granted | Redirect to exam interface |

---

### 3.4 Taking the Exam

#### US-P07: Answer Questions

**As a** participant taking an exam,  
**I want to** view and answer questions  
**So that I** can complete the exam.

**Acceptance Criteria:**

```gherkin
Given I am in the exam-taking interface
When a question is displayed
Then I see:
  - Question number and total (e.g., "Question 5 of 30")
  - Question type badge (TIU/TKP/TWK)
  - Question content/text
  - Five answer options (A, B, C, D, E)
  - My previously selected answer (if any)

Given I click on an answer option
When the option is selected
Then the option is visually highlighted
And the answer is auto-saved to backend
And the progress indicator updates

Given I change my answer
When I select a different option
Then the previous selection is deselected
And the new answer is auto-saved
And a "Saving..." indicator briefly appears
```

**API Touchpoints:**
- `POST /api/v1/exam-sessions/:id/answers` - Save answer

**Request Body:**
```typescript
{
  examQuestionId: number,  // NOT questionId!
  selectedOption: 'A' | 'B' | 'C' | 'D' | 'E' | null
}
```

**Response:**
```typescript
{
  answer: { examQuestionId, selectedOption, answeredAt },
  progress: { answered, total, percentage }
}
```

**UI States:**

| State | Display |
|-------|---------|
| Loading Question | Skeleton with shimmer |
| Displaying | Question with answer options |
| Saving | Brief "Saving..." toast/indicator |
| Saved | Brief "Saved ✓" confirmation |
| Save Failed | Error with retry option |

---

#### US-P08: Navigate Between Questions

**As a** participant,  
**I want to** navigate between questions  
**So that I** can review and change my answers.

**Acceptance Criteria:**

```gherkin
Given I am on any question
When I click "Next"
Then I see the next question
And my current answer is preserved

Given I am on any question except the first
When I click "Previous"
Then I see the previous question

Given I am on the last question
When I click "Next"
Then the button is disabled or hidden

Given I click on a question number in the navigation panel
When the question is selected
Then I jump directly to that question

Given the question navigator panel is displayed
Then each question shows status:
  - Answered (filled circle)
  - Unanswered (empty circle)
  - Current (highlighted border)
```

**UI Components:**
- Previous/Next buttons
- Question number grid/list
- Progress bar (X of Y answered)
- Current question indicator

---

#### US-P09: Monitor Exam Timer

**As a** participant,  
**I want to** see the remaining time  
**So that I** can pace myself during the exam.

**Acceptance Criteria:**

```gherkin
Given I am taking an exam
When the timer displays
Then I see remaining time in MM:SS or HH:MM:SS format
And the timer counts down every second

Given remaining time falls below 5 minutes
When the timer updates
Then the timer changes to warning color (red/orange)
And an optional audio/visual warning triggers

Given remaining time reaches zero
When the timeout occurs
Then the exam is automatically submitted
And I see a "Time's Up" notification
And I am navigated to result summary
```

**Timer Implementation Notes:**
- Use server's `remainingTimeMs` as initial value
- Sync with server periodically (every 60 seconds) to prevent drift
- Client-side countdown for smooth UI
- Auto-submit triggers backend `submitExam` on timeout

**API for Time Sync:**
- `GET /api/v1/exam-sessions/:id` - Returns updated `remainingTimeMs`

---

#### US-P10: View Progress During Exam

**As a** participant,  
**I want to** see my progress  
**So that I** know how many questions I've completed.

**Acceptance Criteria:**

```gherkin
Given I am taking an exam
When I view the progress indicator
Then I see:
  - Answered questions count
  - Total questions count
  - Percentage complete (visual bar)

Given I answer a question
When the answer is saved
Then the progress updates immediately

Given I open the question navigator
Then I see a visual map showing:
  - Answered questions (filled)
  - Unanswered questions (empty)
  - Flagged questions (if implemented)
```

**Progress Calculation:**
```typescript
const progress = {
  answered: answers.filter(a => a.selectedOption !== null).length,
  total: questions.length,
  percentage: (answered / total) * 100
}
```

---

### 3.5 Submitting the Exam

#### US-P11: Manual Exam Submission

**As a** participant,  
**I want to** submit my exam when finished  
**So that I** can complete the exam and see my results.

**Acceptance Criteria:**

```gherkin
Given I have answered all questions
When I click "Submit Exam"
Then a confirmation dialog appears showing:
  - Questions answered: X of Y
  - Unanswered questions warning (if any)
  - "Are you sure?" message

Given I confirm submission
When the submission is processed
Then the exam status changes to FINISHED
And I am navigated to the result summary
And proctoring stops

Given I have unanswered questions
When I confirm submission anyway
Then the exam is submitted with partial answers
And unanswered questions score 0 points

Given submission fails due to network error
When an error occurs
Then I see an error message
And I can retry submission
And my answers remain saved
```

**API Touchpoints:**
- `POST /api/v1/exam-sessions/:id/submit` - Finalize exam

**Response:**
```typescript
{
  message: "Exam submitted successfully",
  result: {
    id: number,
    examId: number,
    examTitle: string,
    totalScore: number,
    status: 'FINISHED' | 'TIMEOUT',
    duration: number,  // seconds taken
    answeredQuestions: number,
    totalQuestions: number,
    scoresByType: ScoreByType[]
  }
}
```

---

#### US-P12: Automatic Submission on Timeout

**As a** participant,  
**I want** my exam to auto-submit when time expires  
**So that** my answers are not lost.

**Acceptance Criteria:**

```gherkin
Given the exam timer reaches zero
When timeout occurs
Then the exam is automatically submitted
And status changes to TIMEOUT
And all saved answers are graded
And I see a "Time's Up" notification
And I am navigated to results

Given I'm actively answering when timeout occurs
When the auto-submit triggers
Then my current answer is saved first
Then submission proceeds
```

**Implementation Notes:**
- Frontend timer triggers submission
- Backend also validates timeout on any subsequent request
- Race condition handled: if backend detects timeout first, it returns appropriate error

---

### 3.6 Viewing Results

#### US-P13: View Exam Result Summary

**As a** participant,  
**I want to** view my exam results  
**So that I** understand my performance.

**Acceptance Criteria:**

```gherkin
Given I have completed an exam
When I view the result summary
Then I see:
  - Total score
  - Pass/Fail status (vs passing score)
  - Time taken (duration)
  - Score breakdown by question type (TIU, TKP, TWK)
  - Questions answered vs total
  - Submission timestamp

Given I click "Review Answers"
When the review page loads
Then I see each question with:
  - My selected answer
  - Correct answer
  - Whether I was correct (✓ or ✗)
  - Score earned for that question
```

**API Touchpoints:**
- `GET /api/v1/results` - List all my results
- `GET /api/v1/exam-sessions/:id/answers` - Get answers with correct answers (post-submit only)

**Response for Answer Review:**
```typescript
{
  answers: Array<{
    examQuestionId: number,
    questionContent: string,
    questionType: QuestionType,
    options: { A, B, C, D, E },
    selectedOption: string | null,
    correctAnswer: string,  // Now visible!
    isCorrect: boolean,
    score: number
  }>,
  total: number
}
```

**UI States:**

| State | Display |
|-------|---------|
| Loading | Skeleton result card |
| Pass | Success styling with congratulations |
| Fail | Neutral styling with encouragement |
| Error | Error message with retry |

---

#### US-P14: View Exam History

**As a** participant,  
**I want to** view my exam history  
**So that I** can track my progress over time.

**Acceptance Criteria:**

```gherkin
Given I navigate to "My Results"
When the page loads
Then I see a list of completed exams showing:
  - Exam title
  - Score achieved
  - Status (FINISHED, TIMEOUT, CANCELLED)
  - Date completed
  - Duration taken

Given I click on a result
When the detail page loads
Then I see the full result summary
And option to review answers
```

**API Touchpoints:**
- `GET /api/v1/results?page=1&limit=10` - Paginated results

---

## 4. User Stories: Admin Role (Monitoring)

### 4.1 Session Monitoring

#### US-A01: View Active Exam Sessions

**As an** admin,  
**I want to** monitor active exam sessions  
**So that I** can oversee ongoing exams.

**Acceptance Criteria:**

```gherkin
Given I am logged in as admin
When I navigate to session monitoring
Then I see a list of all exam sessions showing:
  - Participant name and email
  - Exam title
  - Status (IN_PROGRESS, FINISHED, etc.)
  - Start time
  - Violation count

Given I filter by status "IN_PROGRESS"
When the filter is applied
Then I see only active sessions

Given I click on a session
When the detail view opens
Then I see full session details
And proctoring event log
```

**API Touchpoints:**
- `GET /api/v1/admin/exam-sessions` - All sessions
- Query params: `examId`, `userId`, `status`, `page`, `limit`

---

#### US-A02: View Proctoring Events

**As an** admin,  
**I want to** view proctoring events for any session  
**So that I** can review detected violations.

**Acceptance Criteria:**

```gherkin
Given I am viewing a specific session
When I open the proctoring events tab
Then I see a timeline of events:
  - Event type (FACE_DETECTED, NO_FACE_DETECTED, etc.)
  - Timestamp
  - Severity level
  - Metadata (if any)

Given I filter by event type
When the filter is applied
Then only matching events are shown

Given I want to see all violations system-wide
When I navigate to global proctoring events
Then I see events across all sessions
And can filter by user, exam, event type, date range
```

**API Touchpoints:**
- `GET /api/v1/admin/proctoring/exam-sessions/:id/events` - Session events
- `GET /api/v1/admin/proctoring/events` - All events

---

## 5. Proctoring Behaviors

### 5.1 Face Detection During Exam

#### PRO-01: Continuous Face Monitoring

**Behavior:**
- Webcam captures frames every 5 seconds
- Frame is sent to YOLO ML service for analysis
- Analysis result determines if violation occurred
- Violations are logged to backend

**Detection Types:**

| Event Type | Trigger | Severity | Action |
|------------|---------|----------|--------|
| `FACE_DETECTED` | Normal face in frame | LOW | Log only (positive confirmation) |
| `NO_FACE_DETECTED` | No face visible | MEDIUM | Warning + log |
| `MULTIPLE_FACES` | More than one face | HIGH | Warning + log |
| `LOOKING_AWAY` | Face not forward | MEDIUM | Warning + log |

**API Touchpoint:**
- `POST /api/v1/proctoring/exam-sessions/:id/analyze-face`

**Request:**
```typescript
{ imageBase64: string }  // Min 100 characters
```

**Response:**
```typescript
{
  analysis: {
    status: 'success' | 'timeout' | 'error',
    violations: string[],
    confidence: number,  // 0-1
    message: string,
    metadata?: { processingTimeMs, error? }
  },
  eventLogged: boolean,  // True if violation recorded
  eventType: ProctoringEventType | null,
  usedFallback: boolean  // True if mock analyzer used
}
```

---

### 5.2 Proctoring UI Indicators

#### PRO-02: Status Indicator Display

**UI Elements:**

```
┌─────────────────────────────────────┐
│ 🎥 Camera Active      🟢 OK         │
│    Last check: 12:34:56             │
└─────────────────────────────────────┘
```

**Status Colors:**
- 🟢 Green: Face detected, no violations
- 🟡 Yellow: Minor issue (looking away)
- 🔴 Red: Major issue (no face, multiple faces)
- ⚪ Gray: Camera inactive or checking

---

### 5.3 Warning System

#### PRO-03: Progressive Warnings

**Warning Escalation:**

| Warning Level | Trigger | User Notification |
|--------------|---------|-------------------|
| 1 | 3 consecutive violations | Toast: "Please look at the screen" |
| 2 | 5 consecutive violations | Modal: "Warning: Face not detected" |
| 3 | 10 consecutive violations | Modal: "Final Warning: Face required" |
| 4+ | Admin discretion | Potential exam cancellation (future feature) |

**Implementation Notes:**
- Warning count resets when face is properly detected
- Warnings are logged as metadata in proctoring events
- Severity automatically assigned by backend based on event type

---

### 5.4 Network & Error Handling

#### PRO-04: Network Disconnect Behavior

**Scenarios:**

```gherkin
Given the network disconnects during exam
When face analysis API call fails
Then:
  - Show "Connection lost" indicator
  - Continue exam locally (answers cached)
  - Retry face analysis when connected
  - Show "Reconnected" when restored

Given network is restored
When reconnection is detected
Then:
  - Sync any cached answers
  - Resume face analysis
  - Log NETWORK_RECONNECTED event (if applicable)
```

**Retry Policy for Face Analysis:**
- Retry up to 3 times with exponential backoff
- Backoff: 1s, 2s, 4s
- After 3 failures, skip current analysis cycle
- Continue trying on next interval

---

## 6. State Management Rules

### 6.1 Source of Truth

| Data | Source | Storage |
|------|--------|---------|
| Exam session | Backend `UserExam` | React Query cache |
| Questions | Backend `ExamQuestion[]` | React Query cache |
| Answers | Backend `Answer[]` | React Query + local state |
| Remaining time | Backend `remainingTimeMs` | Local state (countdown) |
| Proctoring events | Backend `ProctoringEvent[]` | React Query cache |
| Auth tokens | Backend JWT | Zustand + localStorage |

### 6.2 Exam Status Transitions

```
                    ┌─────────────┐
          ┌────────►│   TIMEOUT   │
          │         └─────────────┘
          │ (time expires)
          │
    ┌─────┴──────┐     submit()    ┌─────────────┐
    │IN_PROGRESS │────────────────►│   FINISHED  │
    └────────────┘                 └─────────────┘
          │
          │ (admin action - future)
          ▼
    ┌─────────────┐
    │  CANCELLED  │
    └─────────────┘
```

**Allowed Transitions:**

| From | To | Trigger |
|------|----|---------|
| `IN_PROGRESS` | `FINISHED` | User submits or completes all |
| `IN_PROGRESS` | `TIMEOUT` | Timer expires (client or server) |
| `IN_PROGRESS` | `CANCELLED` | Admin intervention (future) |

**Forbidden Transitions:**
- `FINISHED` → Any (immutable)
- `TIMEOUT` → Any (immutable)
- `CANCELLED` → Any (immutable)

### 6.3 Answer State Rules

**Allowed Operations:**
- Select answer: `selectedOption = 'A'|'B'|'C'|'D'|'E'`
- Clear answer: `selectedOption = null`
- Change answer: Replace previous selection

**Constraints:**
- Must use `examQuestionId` (NOT `questionId`)
- Cannot modify after exam submitted
- Cannot modify after timeout

**Optimistic Updates:**
```typescript
// 1. Update UI immediately
setLocalAnswer(examQuestionId, option);

// 2. Sync to backend
await submitAnswer({ examQuestionId, selectedOption: option });

// 3. On error, revert local state
if (error) revertLocalAnswer(examQuestionId);
```

### 6.4 Retry Policies

| Operation | Max Retries | Backoff | Failure Action |
|-----------|-------------|---------|----------------|
| Submit Answer | 3 | Exponential (1s, 2s, 4s) | Queue for retry, show error |
| Submit Exam | 3 | Exponential | Keep retrying, block navigation |
| Face Analysis | 3 | Exponential | Skip cycle, continue exam |
| Get Questions | 2 | Linear (2s) | Show error, offer manual retry |
| Timer Sync | 2 | Linear (5s) | Use local timer, show warning |

---

## 7. Edge Cases & Guards

### 7.1 Authentication Guards

#### GUARD-01: Not Logged In

```gherkin
Given I am not authenticated
When I try to access /dashboard, /exams, /exam-session
Then I am redirected to /login
And the original URL is preserved as returnUrl
And after login, I am redirected back
```

**Implementation:**
- Next.js middleware checks auth state
- Redirect with `?returnUrl=` query param
- After login, check and redirect to returnUrl

---

#### GUARD-02: Token Expired Mid-Exam

```gherkin
Given I am taking an exam
And my access token expires
When I make an API call
Then the axios interceptor catches 401
And automatically calls /auth/refresh
And retries the original request with new token

Given refresh also fails
When token refresh returns 401
Then I am redirected to login
And my current question/answer state is lost (but saved answers persist on backend)
```

**Implementation:**
- Axios interceptor with token refresh logic
- Queue requests during refresh
- Replay queued requests after refresh succeeds

---

### 7.2 Session Guards

#### GUARD-03: Exam Not Found

```gherkin
Given I navigate to /exams/999 (non-existent)
When the API returns 404
Then I see a "Exam not found" error page
And I have a link back to exam list
```

**Error Code:** `EXAM_NOT_FOUND`

---

#### GUARD-04: Session Already Submitted

```gherkin
Given I have already completed an exam
When I try to start it again
Then I see "You have already completed this exam"
And I see a link to view my results

Given the exam allows retakes
When I try to start again
Then a new attempt is created with attemptNumber + 1

Given max attempts reached
When I try to start
Then I see "Maximum attempts reached"
```

**Error Codes:**
- `EXAM_SESSION_ALREADY_STARTED` → Show results
- `EXAM_RETAKE_DISABLED` → Show results, no retry option
- `EXAM_MAX_ATTEMPTS_REACHED` → Show all attempt results

---

#### GUARD-05: Resume In-Progress Session

```gherkin
Given I have an IN_PROGRESS session
When I navigate to /exams/:id and click Start
Then the existing session is resumed (not duplicated)
And my answers are restored
And timer shows correct remaining time
```

**Backend Behavior:**
- `POST /exams/:id/start` returns existing IN_PROGRESS session
- No new session created

---

### 7.3 Time-Related Guards

#### GUARD-06: Time Sync Drift

```gherkin
Given my local clock is inaccurate
When the exam starts
Then I use server's remainingTimeMs as truth
And periodic sync every 60 seconds corrects drift
And significant drift (>30s) shows warning
```

**Sync Logic:**
```typescript
const syncTimer = async () => {
  const { remainingTimeMs } = await getSessionDetails(sessionId);
  const localRemaining = calculateLocalRemaining();
  const drift = Math.abs(remainingTimeMs - localRemaining);
  
  if (drift > 30000) {  // 30 seconds
    showDriftWarning();
  }
  
  setRemainingTime(remainingTimeMs);
};
```

---

### 7.4 Browser/Tab Guards

#### GUARD-07: Tab Refresh

```gherkin
Given I am taking an exam
When I refresh the browser tab
Then the exam session is restored from backend
And my answers are intact
And timer resumes from server time
And proctoring restarts

Given I have unsaved answer changes
When I refresh
Then the last saved answer is shown (not unsaved changes)
```

---

#### GUARD-08: Accidental Tab Close

```gherkin
Given I am taking an exam
When I try to close the tab
Then browser shows "Leave site?" confirmation
And I can choose to stay

Given I confirm leaving
When the tab closes
Then my saved answers persist
And I can resume later (if time permits)
```

**Implementation:**
```typescript
useEffect(() => {
  const handleBeforeUnload = (e: BeforeUnloadEvent) => {
    if (isExamInProgress) {
      e.preventDefault();
      e.returnValue = '';
    }
  };
  
  window.addEventListener('beforeunload', handleBeforeUnload);
  return () => window.removeEventListener('beforeunload', handleBeforeUnload);
}, [isExamInProgress]);
```

---

### 7.5 Network Guards

#### GUARD-09: Offline/Slow Network

```gherkin
Given the network goes offline during exam
When I select an answer
Then the answer is saved locally
And a "Offline" indicator appears
And answers are queued for sync

Given the network recovers
When connectivity is restored
Then queued answers are synced in order
And "Back online" indicator appears
And sync status is confirmed
```

**Offline Queue Implementation:**
```typescript
const answerQueue: SubmitAnswerRequest[] = [];

const submitWithQueue = async (answer: SubmitAnswerRequest) => {
  try {
    await submitAnswer(answer);
  } catch (error) {
    if (isNetworkError(error)) {
      answerQueue.push(answer);
      setOfflineMode(true);
    }
  }
};

const syncQueue = async () => {
  while (answerQueue.length > 0) {
    const answer = answerQueue[0];
    try {
      await submitAnswer(answer);
      answerQueue.shift();
    } catch {
      break;  // Stop on error, retry later
    }
  }
};
```

---

#### GUARD-10: API Error Handling

```gherkin
Given an API call fails with 500
When the error occurs
Then I see a user-friendly error message
And I have option to retry
And error is logged for debugging

Given an API call fails with validation error (400)
When the error contains field-level errors
Then I see specific error messages per field
```

**Error Display Strategy:**

| HTTP Status | User Message | Action |
|-------------|--------------|--------|
| 400 | Show validation errors | Fix and retry |
| 401 | "Session expired" | Redirect to login |
| 403 | "Not authorized" | Show error, no retry |
| 404 | "Not found" | Back navigation |
| 500 | "Server error, please try again" | Retry button |
| Network | "Connection lost" | Auto-retry with backoff |

---

## 8. Non-Functional Requirements

### 8.1 Performance

| Metric | Target | Measurement |
|--------|--------|-------------|
| Page Load | < 2s | Time to interactive |
| API Response | < 500ms | Average latency |
| Answer Save | < 1s | User perception |
| Face Analysis | < 3s | ML service response |
| Timer Accuracy | ±5s | Drift from server time |

**Optimization Strategies:**
- React Query caching for questions
- Debounced answer saves (300ms)
- Lazy loading for result details
- Image compression for face frames (JPEG quality 0.7)

---

### 8.2 Reliability

| Requirement | Implementation |
|-------------|----------------|
| Data persistence | All answers saved to backend immediately |
| Session recovery | Resume from any point via API |
| Offline tolerance | Local queue with sync on reconnect |
| Error resilience | Retry logic with exponential backoff |

**Critical Data Protection:**
- Answers: Saved on every selection
- Session state: Recovered from server on refresh
- Timer: Server-authoritative with local countdown
- Proctoring: Events logged independently

---

### 8.3 Auditability

| Event | Logged Data | Purpose |
|-------|-------------|---------|
| Session Start | userId, examId, timestamp | Audit trail |
| Answer Submit | examQuestionId, selectedOption, timestamp | Answer history |
| Exam Submit | sessionId, totalScore, timestamp | Completion record |
| Proctoring Event | eventType, severity, metadata, timestamp | Cheating detection |
| Timer Events | remainingTime, clientTime, serverTime | Dispute resolution |

**Proctoring Event Metadata:**
```typescript
{
  confidence: number,
  violations: string[],
  frameTimestamp: string,
  processingTimeMs: number,
  usedFallback: boolean
}
```

---

### 8.4 Security

| Aspect | Requirement |
|--------|-------------|
| Authentication | JWT with short-lived access tokens |
| Authorization | Session owner validation on all endpoints |
| Data Access | Users can only access own sessions |
| Answer Integrity | Server validates examQuestionId belongs to session |
| Time Manipulation | Server calculates remaining time, not client |

---

### 8.5 Accessibility (Basic MVP)

| Feature | Implementation |
|---------|----------------|
| Keyboard Navigation | Tab through questions and options |
| Screen Reader | ARIA labels on interactive elements |
| Color Contrast | WCAG AA compliance for text |
| Focus Indicators | Visible focus ring on all controls |
| Timer Announcement | Periodic time announcements (screen reader) |

---

## 9. API Reference Summary

### 9.1 Participant Endpoints

| Method | Endpoint | Purpose |
|--------|----------|---------|
| `GET` | `/api/v1/me` | Get current user profile |
| `GET` | `/api/v1/exams` | List available exams |
| `GET` | `/api/v1/exams/:id` | Get exam details |
| `POST` | `/api/v1/exams/:id/start` | Start or resume exam |
| `GET` | `/api/v1/exam-sessions` | List my exam sessions |
| `GET` | `/api/v1/exam-sessions/:id` | Get session details |
| `GET` | `/api/v1/exam-sessions/:id/questions` | Get questions (during exam) |
| `POST` | `/api/v1/exam-sessions/:id/answers` | Submit/update answer |
| `POST` | `/api/v1/exam-sessions/:id/submit` | Finalize and submit exam |
| `GET` | `/api/v1/exam-sessions/:id/answers` | Get answers (after submit) |
| `GET` | `/api/v1/results` | Get my exam results |
| `POST` | `/api/v1/proctoring/exam-sessions/:id/analyze-face` | Analyze webcam frame |
| `GET` | `/api/v1/proctoring/exam-sessions/:id/events` | Get my proctoring events |
| `POST` | `/api/v1/proctoring/events` | Log proctoring event manually |

### 9.2 Admin Endpoints (Monitoring)

| Method | Endpoint | Purpose |
|--------|----------|---------|
| `GET` | `/api/v1/admin/exam-sessions` | List all exam sessions |
| `GET` | `/api/v1/admin/exam-sessions/:id` | Get any session details |
| `GET` | `/api/v1/admin/results` | Get all results |
| `GET` | `/api/v1/admin/proctoring/events` | Get all proctoring events |
| `GET` | `/api/v1/admin/proctoring/exam-sessions/:id/events` | Get session events |

### 9.3 Authentication Endpoints

| Method | Endpoint | Purpose |
|--------|----------|---------|
| `POST` | `/api/v1/auth/login` | User login |
| `POST` | `/api/v1/auth/register` | User registration |
| `POST` | `/api/v1/auth/refresh` | Refresh access token |
| `POST` | `/api/v1/auth/logout` | Logout and invalidate tokens |

### 9.4 Rate Limits

| Endpoint Group | Limit | Window |
|----------------|-------|--------|
| Global | 100 requests | 15 minutes |
| Auth (login/register) | 5 requests | 15 minutes |
| Token Refresh | 10 requests | 15 minutes |
| Proctoring | 30 requests | 1 minute |

---

## Appendix A: Glossary

| Term | Definition |
|------|------------|
| **UserExam** | A participant's exam session record |
| **ExamQuestion** | Junction table linking questions to exams with order |
| **examQuestionId** | ID of ExamQuestion (use for answers) |
| **questionId** | ID in Question bank (don't use for answers) |
| **Proctoring Event** | Logged violation or status from face detection |
| **YOLO** | ML model used for face detection |
| **TIU/TKP/TWK** | CPNS exam question categories |

---

## Appendix B: Error Codes Reference

| Code | HTTP | Message |
|------|------|---------|
| `AUTH_INVALID_CREDENTIALS` | 401 | Wrong email/password |
| `AUTH_INVALID_TOKEN` | 401 | Token expired/invalid |
| `EXAM_NOT_FOUND` | 404 | Exam ID doesn't exist |
| `EXAM_NO_QUESTIONS` | 400 | Exam has 0 questions |
| `EXAM_NO_DURATION` | 400 | Duration not set |
| `EXAM_SESSION_NOT_FOUND` | 404 | Session doesn't exist |
| `EXAM_SESSION_ALREADY_STARTED` | 400 | Can't restart submitted exam |
| `EXAM_SESSION_TIMEOUT` | 400 | Time limit exceeded |
| `EXAM_SESSION_ALREADY_SUBMITTED` | 400 | Already finalized |
| `EXAM_SESSION_INVALID_QUESTION` | 400 | examQuestionId not in exam |
| `EXAM_RETAKE_DISABLED` | 400 | Retake not allowed |
| `EXAM_MAX_ATTEMPTS_REACHED` | 400 | Maximum attempts exceeded |

---

*Document generated for thesis project: "Online Exam Proctoring System with AI-Powered Cheating Detection Using YOLO"*
