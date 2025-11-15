/**
 * EXAM SESSION STATUS PAGE
 *
 * PURPOSE:
 * - Display exam session details and current status
 * - Show progress (questions answered, time elapsed)
 * - Entry point to continue exam or view results
 *
 * BACKEND INTEGRATION:
 * - GET /api/v1/exam-sessions/:id
 *
 * RESPONSE:
 * {
 *   userExam: {
 *     id, examId, userId, startedAt, submittedAt,
 *     totalScore, status, createdAt,
 *     exam: { id, title, description, durationMinutes, _count: { examQuestions } },
 *     user: { id, name, email },
 *     _count: { answers }
 *   }
 * }
 *
 * AUTHORIZATION:
 * - Only session owner can access (userId must match req.user.id)
 * - Returns 403 if unauthorized
 *
 * DISPLAYED INFO:
 * - Exam title, description
 * - Session status badge
 * - Progress: "15/30 questions answered"
 * - Time: Started at, Submitted at, Duration
 * - Score (if finished)
 *
 * ACTIONS:
 * - IN_PROGRESS → "Continue Exam" button (→ /exam-sessions/:id/take)
 * - FINISHED → "Review Answers" button (→ /exam-sessions/:id/review)
 *
 * IMPLEMENTATION:
 * - Use features/exam-sessions/hooks (useExamSession)
 * - Display loading state while fetching
 */