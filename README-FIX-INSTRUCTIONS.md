# Fix: Exam Detail Page - Missing "Start Exam" Button

## Root Cause Analysis

The bug had **two issues**:

### Issue 1: Wrong API Usage
The page called `useUserExams({ examId })` to determine button state, but the backend `GET /api/v1/exam-sessions` does **NOT** filter by `examId` - it only accepts `page`, `limit`, and `status` params. So the hook returned ALL user sessions, causing `getExamButtonState` to see sessions from OTHER exams and incorrectly show "Lihat Hasil".

### Issue 2: Missing Data from Backend
The backend `GET /api/v1/exams/:id` **already returns attempts info** for participants:
- `attemptsCount`: number of completed attempts for THIS exam
- `firstAttempt`: first attempt info (if any)
- `latestAttempt`: latest attempt info (if any)

But the frontend `useExam` hook was discarding this by only returning `response.exam`.

## The Fix (4 Files to Update)

### 1. Add Types (`src/features/exams/types/exams.types.ts`)

Add these types after the existing `Exam` interface:

```typescript
/**
 * Attempt info as returned by GET /exams/:id for participants
 * Backend returns this for completed attempts (FINISHED, TIMEOUT, CANCELLED)
 */
export interface ExamAttemptInfo {
    id: number;
    attemptNumber: number;
    totalScore: number | null;
    status: 'FINISHED' | 'TIMEOUT' | 'CANCELLED';
    startedAt: string;
    submittedAt: string | null;
}

/**
 * GET /exams/:id (participant view with attempts info)
 * 
 * Backend returns attempts info for participants:
 * - attemptsCount: number of completed attempts
 * - firstAttempt: first attempt info (if any)
 * - latestAttempt: most recent attempt info (if any)
 * 
 * Source: backend exams.service.ts getExamById()
 */
export interface ExamDetailWithAttemptsResponse {
    exam: Exam;
    attemptsCount?: number;
    firstAttempt?: ExamAttemptInfo | null;
    latestAttempt?: ExamAttemptInfo | null;
}
```

### 2. Add API Function (`src/features/exams/api/exams.api.ts`)

Add this import at the top:
```typescript
import type { ExamDetailWithAttemptsResponse } from '../types/exams.types';
```

Add this function (after the existing `getExam` function):
```typescript
/**
 * Get exam by ID with attempts info (participant view)
 * GET /api/v1/exams/:id
 *
 * Returns the FULL response including attemptsCount, firstAttempt, latestAttempt
 * which the backend provides for participants.
 */
export const getExamWithAttempts = async (
    examId: number
): Promise<ExamDetailWithAttemptsResponse> => {
    const response = await apiClient.get<ExamDetailWithAttemptsResponse>(`/exams/${examId}`);
    return response.data;
};
```

### 3. Create New Hook (`src/features/exams/hooks/useExamWithAttempts.ts`)

Create this new file:
```typescript
// src/features/exams/hooks/useExamWithAttempts.ts

import { useQuery } from '@tanstack/react-query';
import { examsApi } from '../api/exams.api';
import type { ExamDetailWithAttemptsResponse } from '../types/exams.types';

export interface UseExamWithAttemptsOptions {
    enabled?: boolean;
}

export function useExamWithAttempts(
    examId: number | undefined,
    options: UseExamWithAttemptsOptions = {}
) {
    const { enabled = true } = options;

    return useQuery<ExamDetailWithAttemptsResponse, Error>({
        queryKey: ['exam-with-attempts', examId],
        queryFn: async (): Promise<ExamDetailWithAttemptsResponse> => {
            if (!examId) throw new Error('Exam ID is required');
            return examsApi.getExamWithAttempts(examId);
        },
        enabled: enabled && examId !== undefined && examId > 0,
        staleTime: 1000 * 60 * 5, // 5 minutes
    });
}

export default useExamWithAttempts;
```

### 4. Export Hook (`src/features/exams/hooks/index.ts`)

Add this export:
```typescript
export { useExamWithAttempts } from './useExamWithAttempts';
```

### 5. Replace Page (`src/app/(participant)/exams/[id]/page.tsx`)

Replace the entire file with the contents of `page.tsx` in this folder.

## Key Changes in the Page

1. **Removed** `useUserExams({ examId })` call (was returning wrong data)
2. **Added** `useExamWithAttempts(examId)` which returns full response with attempts
3. **Updated** `getExamButtonState()` to use `attemptsCount` and `latestAttempt` from API
4. **Added** result card showing latest attempt score
5. **Fixed** button states: start → retake → view-result → disabled

## Testing Checklist

After applying the fix, verify these scenarios:

| Scenario | Expected Button | Notes |
|----------|-----------------|-------|
| First time viewing exam (no attempts) | "Mulai Ujian" | Should show with Play icon |
| Has 1 completed attempt, retake=false | "Lihat Hasil" | Click navigates to result |
| Has 1 completed attempt, retake=true | "Mulai Lagi" | Confirmation dialog before start |
| maxAttempts=2, has 2 attempts | Disabled button | Shows "Batas Tercapai" |
| Exam schedule not started | Disabled | Button shows but can't click |
| Exam schedule ended | Disabled | Shows "Berakhir" status |

## Why This Fix Works

The backend `GET /api/v1/exams/:id` endpoint (in `exams.service.ts`) already does the work:

```typescript
// For participants, include attempts information
if (!includeQuestions && userId) {
    const attempts = await prisma.userExam.findMany({
        where: {
            userId,
            examId: id,  // ✅ Correctly filtered by this exam
            status: { in: ['FINISHED', 'TIMEOUT', 'CANCELLED'] },
        },
        ...
    });
    
    return {
        exam,
        attemptsCount,
        firstAttempt,
        latestAttempt,
    };
}
```

By using this data instead of a separate (buggy) call, we get accurate button states.
