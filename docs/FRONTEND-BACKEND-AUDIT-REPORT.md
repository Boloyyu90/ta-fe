# Frontend-Backend Integration Audit Report

**Date:** 2025-12-29
**Auditor:** Senior Full-Stack Integration Auditor
**Scope:** CPNS Tryout Exam System Frontend vs Backend API Contract

---

## Executive Summary

### Overall Assessment: **ALIGNED** (with minor recommendations)

The frontend codebase demonstrates **strong alignment** with the backend API contract documents. The implementation correctly handles:

- API response unwrapping (`{ success, data, message, timestamp }` wrapper)
- JWT token injection and refresh token strategy
- Critical exam taking and proctoring flows
- Type definitions matching backend schemas
- Query invalidation patterns for cache consistency

**Key Risks Identified:**
- P1: Proctoring rate limiting interval could be tightened
- P2: Some admin pages have pending TODO implementations
- P2: Query invalidation promises not awaited (intentional pattern, not a bug)

---

## 1. Contract Extraction Summary

### Backend Endpoints by Module

| Module | Endpoints | Methods |
|--------|-----------|---------|
| Auth | `/auth/register`, `/auth/login`, `/auth/refresh`, `/auth/logout` | POST |
| Users | `/me`, `/admin/users`, `/admin/users/:id` | GET, POST, PATCH, DELETE |
| Exams | `/exams`, `/exams/:id`, `/exams/:id/start`, `/admin/exams`, `/admin/exams/:id`, `/admin/exams/:id/questions` | GET, POST, PATCH, DELETE |
| Exam Sessions | `/exam-sessions`, `/exam-sessions/:id`, `/exam-sessions/:id/questions`, `/exam-sessions/:id/answers`, `/exam-sessions/:id/submit`, `/results` | GET, POST |
| Admin Sessions | `/admin/exam-sessions`, `/admin/exam-sessions/:id`, `/admin/exam-sessions/:id/answers`, `/admin/results` | GET |
| Proctoring | `/proctoring/events`, `/proctoring/exam-sessions/:id/analyze-face`, `/proctoring/exam-sessions/:id/events`, `/admin/proctoring/events`, `/admin/proctoring/exam-sessions/:id/events` | GET, POST |
| Questions | `/admin/questions`, `/admin/questions/:id` | GET, POST, PATCH, DELETE |

### Critical Contract Notes (from docs)

1. **ALWAYS use `examQuestionId` for answer submissions, NOT `questionId`**
2. **Timer should use server-provided `remainingTimeMs`, not client calculation**
3. **Proctoring rate limit: max 30 requests/minute (1 every 2 seconds minimum)**

---

## 2. Integration Coverage Matrix

| Endpoint | Method | FE API File | Hook | Status |
|----------|--------|-------------|------|--------|
| `/auth/register` | POST | `auth.api.ts:35` | `useRegister.ts` | OK |
| `/auth/login` | POST | `auth.api.ts:43` | `useLogin.ts` | OK |
| `/auth/refresh` | POST | `api.ts:95` (interceptor) | N/A (auto) | OK |
| `/auth/logout` | POST | `auth.api.ts:51` | `useLogout.ts` | OK |
| `/me` | GET | `users.api.ts:30` | `useProfile.ts` | OK |
| `/me` | PATCH | `users.api.ts:41` | inline in `profile/page.tsx` | OK |
| `/admin/users` | GET | `users.api.ts:52` | `useUsers.ts` | OK |
| `/admin/users` | POST | `users.api.ts:63` | `useCreateUser.ts` | OK |
| `/admin/users/:id` | GET | `users.api.ts:74` | `useUser.ts` | OK |
| `/admin/users/:id` | PATCH | `users.api.ts:81` | `useUpdateUser.ts` | OK |
| `/admin/users/:id` | DELETE | `users.api.ts:92` | `useDeleteUser.ts` | OK |
| `/exams` | GET | `exams.api.ts:29` | `useExams.ts` | OK |
| `/exams/:id` | GET | `exams.api.ts:40` | `useExam.ts` | OK |
| `/exams/:id/start` | POST | `exams.api.ts:49` | `useStartExam.ts` | OK |
| `/admin/exams` | GET | `exams.api.ts:58` | `useAdminExams.ts` | OK |
| `/admin/exams` | POST | `exams.api.ts:67` | `useCreateExam.ts` | OK |
| `/admin/exams/:id` | GET | `exams.api.ts:78` | `useAdminExam.ts` | OK |
| `/admin/exams/:id` | PATCH | `exams.api.ts:85` | `useUpdateExam.ts` | OK |
| `/admin/exams/:id` | DELETE | `exams.api.ts:96` | `useDeleteExam.ts` | OK |
| `/admin/exams/:id/questions` | GET | `exams.api.ts:104` | `useExamQuestions.ts` | OK |
| `/admin/exams/:id/questions` | POST | `exams.api.ts:115` | `useAttachQuestions.ts` | OK |
| `/admin/exams/:id/questions` | DELETE | `exams.api.ts:126` | `useDetachQuestions.ts` | OK |
| `/exam-sessions` | GET | `exam-sessions.api.ts:49` | `useUserExams.ts` | OK |
| `/exam-sessions/:id` | GET | `exam-sessions.api.ts:64` | `useExamSession.ts` | OK |
| `/exam-sessions/:id/questions` | GET | `exam-sessions.api.ts:77` | `useExamQuestions.ts` | OK |
| `/exam-sessions/:id/answers` | POST | `exam-sessions.api.ts:92` | `useSubmitAnswer.ts` | OK |
| `/exam-sessions/:id/answers` | GET | `exam-sessions.api.ts:122` | `useExamAnswers.ts` | OK |
| `/exam-sessions/:id/submit` | POST | `exam-sessions.api.ts:109` | `useSubmitExam.ts` | OK |
| `/results` | GET | `exam-sessions.api.ts:135` | `useMyResults.ts` | OK |
| `/admin/exam-sessions` | GET | `admin-sessions.api.ts:29` | `useAdminSessions.ts` | OK |
| `/admin/exam-sessions/:id` | GET | `admin-sessions.api.ts:48` | `useAdminSession.ts` | OK |
| `/admin/exam-sessions/:id/answers` | GET | `admin-sessions.api.ts:59` | `useAdminSessionAnswers.ts` | OK |
| `/admin/results` | GET | `admin-sessions.api.ts:70` | `useAdminResults.ts` | OK |
| `/proctoring/exam-sessions/:id/analyze-face` | POST | `proctoring.api.ts:47` | `useAnalyzeFace.ts` | OK |
| `/proctoring/exam-sessions/:id/events` | GET | `proctoring.api.ts:64` | `useProctoringEvents.ts` | OK |
| `/proctoring/events` | POST | `proctoring.api.ts:92` | `useLogEvent.ts` | OK |
| `/admin/proctoring/events` | GET | `proctoring.api.ts:107` | `useAdminProctoringEvents.ts` | OK |
| `/admin/proctoring/exam-sessions/:id/events` | GET | `proctoring.api.ts:133` | `useAdminSessionEvents.ts` | OK |
| `/admin/questions` | GET | `questions.api.ts:27` | `useQuestions.ts` | OK |
| `/admin/questions` | POST | `questions.api.ts:38` | `useCreateQuestion.ts` | OK |
| `/admin/questions/:id` | GET | `questions.api.ts:49` | `useQuestion.ts` | OK |
| `/admin/questions/:id` | PATCH | `questions.api.ts:56` | `useUpdateQuestion.ts` | OK |
| `/admin/questions/:id` | DELETE | `questions.api.ts:67` | `useDeleteQuestion.ts` | OK |

**Coverage: 100% of contract endpoints implemented**

---

## 3. Types Alignment Analysis

### Enums (src/shared/types/enum.types.ts)

| Enum | Backend Contract | Frontend | Status |
|------|-----------------|----------|--------|
| `UserRole` | `ADMIN, PARTICIPANT` | `'ADMIN' \| 'PARTICIPANT'` | OK |
| `ExamStatus` | `IN_PROGRESS, FINISHED, CANCELLED, TIMEOUT` | `'IN_PROGRESS' \| 'FINISHED' \| 'CANCELLED' \| 'TIMEOUT'` | OK |
| `QuestionType` | `TIU, TKP, TWK` | `'TIU' \| 'TKP' \| 'TWK'` | OK |
| `ProctoringEventType` | `FACE_DETECTED, NO_FACE_DETECTED, MULTIPLE_FACES, LOOKING_AWAY` | Matches exactly | OK |
| `Severity` | `LOW, MEDIUM, HIGH` | `'LOW' \| 'MEDIUM' \| 'HIGH'` | OK |
| `AnswerOption` | `A, B, C, D, E (nullable)` | `'A' \| 'B' \| 'C' \| 'D' \| 'E' \| null` | OK |

### Critical Types (src/features/exam-sessions/types/exam-sessions.types.ts)

| Type | Contract Schema | Frontend Type | Status |
|------|-----------------|---------------|--------|
| `UserExamSession` | `remainingTimeMs: required` | `remainingTimeMs: number` (non-optional) | OK |
| `UserExamSession` | `attemptNumber: required` | `attemptNumber: number` | OK |
| `ExamQuestion` | `examQuestionId: required` | `examQuestionId: number` | OK |
| `ParticipantAnswer` | `examQuestionId: required` | `examQuestionId: number` | OK |
| `SubmitAnswerRequest` | `examQuestionId: required` | `examQuestionId: number` | OK |
| `ExamResult` | `attemptNumber: required` | `attemptNumber: number` | OK |
| `ExamInfoInList` | `allowRetake: required, maxAttempts: nullable` | Matches exactly | OK |

### API Response Wrapper (src/shared/types/api.types.ts)

```typescript
// Contract: { success, data, message?, timestamp }
interface ApiResponse<T> {
  success: boolean;
  data: T;
  message?: string;
  timestamp?: string;
}
```
**Status: OK** - Correctly matches backend wrapper structure.

---

## 4. Hooks Layer Analysis

### Query Invalidation Pattern

All mutations use the **fire-and-forget** pattern for `invalidateQueries`:

```typescript
onSuccess: () => {
  queryClient.invalidateQueries({ queryKey: ['user-exams'] });
  // Promise not awaited - this is intentional
}
```

**Assessment:** This is **intentional and correct**. The pattern:
1. Triggers background refetch without blocking the mutation's `onSuccess` callback
2. Prevents race conditions with navigation
3. Is the recommended React Query pattern for cache invalidation

**Files using this pattern (41 occurrences - all correct):**
- `useCreateUser.ts`, `useDeleteUser.ts`, `useUpdateUser.ts`
- `useCreateQuestion.ts`, `useUpdateQuestion.ts`, `useDeleteQuestion.ts`
- `useStartExam.ts`, `useSubmitAnswer.ts`, `useSubmitExam.ts`
- `useCreateExam.ts`, `useUpdateExam.ts`, `useDeleteExam.ts`
- `useAttachQuestions.ts`, `useDetachQuestions.ts`
- `useAnalyzeFace.ts`, `useLogEvent.ts`
- `profile/page.tsx` (2 occurrences)

### Query Key Consistency

| Feature | Query Keys | Invalidation Keys | Status |
|---------|------------|-------------------|--------|
| Users | `['users']`, `['user', id]` | `['users']`, `['user', id]` | OK |
| Exams | `['exams']`, `['exam', id]`, `['admin-exams']`, `['admin-exam', id]` | Matches | OK |
| Exam Sessions | `['user-exams']`, `['exam-session', id]` | Matches | OK |
| Questions | `['questions']`, `['question', id]` | Matches | OK |
| Proctoring | `['proctoring-events', sessionId]` | Matches | OK |
| Results | `['my-results']`, `['my-stats']` | Matches | OK |

---

## 5. Critical User Flows Analysis

### A. Participant Exam Taking Flow

| Step | Implementation | Contract Compliance |
|------|----------------|---------------------|
| **Dashboard List** | `useUserExams()` → `GET /exam-sessions` | OK - Returns `UserExam[]` with `attemptNumber`, `allowRetake`, `maxAttempts` |
| **Start/Resume** | `useStartExam()` → `POST /exams/:id/start` | OK - Handles resume (IN_PROGRESS) and new attempt logic |
| **Answer Submission** | `useSubmitAnswer()` → uses `examQuestionId` | OK - Correctly uses `examQuestionId`, not `questionId` |
| **Timer** | `useTimer()` with `initialRemainingMs` | OK - Uses server-provided `remainingTimeMs` as initial value |
| **Timeout Handling** | Timer calls `onExpire` callback | OK - Triggers auto-submit on timeout |
| **Submit Exam** | `useSubmitExam()` → invalidates all relevant queries | OK - Comprehensive cache invalidation |

**Code Evidence (src/features/exam-sessions/hooks/useTimer.ts:26-29):**
```typescript
if (initialRemainingMs !== undefined && initialRemainingMs > 0) {
    return initialRemainingMs;  // Uses server time
}
```

### B. Proctoring (ML Integration) Flow

| Step | Implementation | Contract Compliance |
|------|----------------|---------------------|
| **Frame Capture** | `ProctoringMonitor.tsx` canvas capture | OK |
| **API Call** | `useAnalyzeFace()` → `POST /proctoring/exam-sessions/:id/analyze-face` | OK |
| **Rate Limiting** | `captureInterval = 10000ms` (10s default) | **CONSERVATIVE** - Contract allows 30/min (2s min) |
| **Violation Detection** | Parses `analysis.violations[]` | OK - Uses `isProctoringEventType()` guard |
| **Event Logging** | Auto-logged by backend (`eventLogged: true`) | OK |
| **UI States** | Camera error, offline mode, tab switching | OK - Comprehensive |

**Proctoring UI States Coverage:**
| State | Handled | Location |
|-------|---------|----------|
| Camera permission denied | OK | `ProctoringMonitor.tsx:296-301` |
| No face detected | OK | Violation alert |
| Multiple faces | OK | Violation alert |
| Network failure | OK | `isOnline` state + toast |
| Tab switching | OK | `visibilitychange` listener |
| ML service timeout | OK | Adaptive backoff |

**Code Evidence (src/features/proctoring/components/ProctoringMonitor.tsx:63-68):**
```typescript
export function ProctoringMonitor({
    sessionId,
    onViolation,
    captureInterval = 10000,  // 10s default (conservative vs 2s contract min)
    enabled = true,
}: ProctoringMonitorProps) {
```

### C. Admin Pages

| Page | Mock Data | Real API | Status |
|------|-----------|----------|--------|
| `/admin/dashboard` | NO | YES - `useQueries` with real endpoints | OK |
| `/admin/users` | NO | YES - `useUsers`, `useCreateUser`, etc. | OK |
| `/admin/exams` | NO | YES - `useAdminExams` | OK |
| `/admin/questions` | NO | YES - `useQuestions` | OK |
| `/admin/results` | NO | YES - `useAdminResults` | OK |
| `/admin/sessions` | NO | YES - `useAdminSessions` | OK |

**Note:** A `.backup` file exists with mock data, but production code is clean.

---

## 6. Findings by Severity

### P0 - Critical (Breaks Core Flow / Runtime)

**None identified.** All critical flows are properly implemented.

---

### P1 - Incorrect Behavior / Contract Drift

#### P1-1: Proctoring Capture Interval Could Be Tightened

**Evidence:**
- File: `src/features/proctoring/components/ProctoringMonitor.tsx:67`
- Current: `captureInterval = 10000` (10 seconds)
- Contract: Max 30 requests/minute = minimum 2 seconds between requests

**Impact:** Lower proctoring fidelity than contract allows. With 10s intervals, only 6 frames/minute are analyzed vs allowed 30.

**Recommendation:** Consider reducing to 3-5 seconds for better violation detection while staying well within rate limit. Example:
```typescript
captureInterval = 3000  // 3s = 20 requests/minute (within 30/min limit)
```

---

### P2 - Tech Debt / Consistency

#### P2-1: Pending TODO Pages

**Evidence:**
- `src/app/(admin)/admin/users/[id]/page.tsx:6` - "TODO: Full implementation pending"
- `src/app/(admin)/admin/users/[id]/edit/page.tsx:6` - "TODO: Full implementation pending"
- `src/app/(admin)/admin/users/create/page.tsx:6` - "TODO: Full implementation pending"
- `src/app/(admin)/admin/exams/[id]/questions/page.tsx:6` - "TODO: Full implementation pending"

**Impact:** These routes may not be fully functional for admin workflows.

**Recommendation:** Complete implementations or add proper "under construction" UI.

#### P2-2: Backup File with Mock Data Exists

**Evidence:**
- `src/app/(admin)/admin/dashboard/page.tsx.backup` contains mock data

**Impact:** None on production (backup file not served), but clutters codebase.

**Recommendation:** Delete backup file once confirmed production dashboard is stable.

#### P2-3: ExamResult Type Has Nested `exam` Object

**Evidence:**
- File: `src/features/exam-sessions/types/exam-sessions.types.ts:165-182`
- Frontend type uses `exam: ExamInfo` object
- OpenAPI spec (lines 571-617) shows flat structure with `examId`, `examTitle`

**Contract Reference:** OpenAPI `ExamResult` schema shows `examId: integer, examTitle: string` as flat fields.

**Impact:** Minor - Could cause issues if backend changes response structure.

**Recommendation:** Verify backend actual response matches frontend expectation. If backend sends nested `exam` object, document this as acceptable deviation.

---

## 7. Contract Inconsistencies

**None identified.** The `backend-api-contract.md` and `openapi-spec.yaml` are consistent with each other.

---

## 8. Next Actions Checklist

### High Priority
- [ ] **P1-1:** Consider reducing proctoring `captureInterval` from 10s to 3-5s for better detection fidelity

### Medium Priority
- [ ] **P2-1:** Complete pending TODO admin pages or add placeholder UI
- [ ] **P2-2:** Delete `page.tsx.backup` file from admin dashboard
- [ ] **P2-3:** Verify `ExamResult` response structure with backend team

### Low Priority
- [ ] Add E2E tests for critical exam taking flow
- [ ] Add integration tests for proctoring ML service
- [ ] Consider adding retry logic for proctoring API failures (currently uses backoff only)

---

## 9. Verification Commands

After any fixes, run:

```bash
# Type checking (must pass)
pnpm run type-check

# Build verification
pnpm run build

# Search for any remaining mock data
rg -n "mock|MOCK|placeholder" src --type tsx --type ts | grep -v "node_modules"

# Verify all endpoints are implemented
rg -n "apiClient\.(get|post|patch|put|delete)" src/features
```

---

## 10. Appendix: Response Wrapper Handling

### How FE Handles Backend Wrapper

**Backend Response Format:**
```json
{
  "success": true,
  "data": { /* actual payload */ },
  "message": "Operation successful",
  "timestamp": "2025-01-15T10:30:00.000Z"
}
```

**Frontend Unwrapping (src/shared/lib/api.ts:70-74):**
```typescript
this.instance.interceptors.response.use(
    (response) => {
        return response.data;  // Strips AxiosResponse, returns ApiResponse<T>
    },
    // error handler...
);
```

**API Method Return (example):**
```typescript
async get<T>(url: string, config?: AxiosRequestConfig): Promise<ApiResponse<T>> {
    return this.instance.get(url, config) as unknown as Promise<ApiResponse<T>>;
}
```

**Hook Usage:**
```typescript
const response = await apiClient.get<ExamsResponse>('/exams');
const exams = response.data;  // Access actual payload via .data
```

**Status: Correctly implemented throughout codebase.**

---

*Report generated by Senior Full-Stack Integration Auditor*
