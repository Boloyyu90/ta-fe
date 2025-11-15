/**
 * MY EXAM SESSIONS LIST
 *
 * PURPOSE:
 * - Display all exam sessions for current user
 * - Show status (IN_PROGRESS, FINISHED, TIMEOUT, CANCELLED)
 * - Navigate to active sessions or view results
 *
 * BACKEND INTEGRATION:
 * - GET /api/v1/exam-sessions?page=1&limit=10
 *
 * RESPONSE:
 * {
 *   data: [
 *     {
 *       id, exam: { id, title, description },
 *       status, startedAt, submittedAt, totalScore,
 *       remainingTimeMs, durationMinutes
 *     }
 *   ],
 *   pagination: {...}
 * }
 *
 * DISPLAYED INFO:
 * - Exam title
 * - Status badge (color-coded)
 * - Started date/time
 * - Duration / Time remaining (for IN_PROGRESS)
 * - Score (for FINISHED)
 * - Action buttons:
 *   - IN_PROGRESS → "Continue Exam" (→ /exam-sessions/:id/take)
 *   - FINISHED → "View Results" (→ /exam-sessions/:id/review)
 *   - TIMEOUT/CANCELLED → "View Details"
 *
 * IMPLEMENTATION:
 * - Use features/exam-sessions/components/SessionsList.tsx
 * - Sort by newest first (already sorted by backend)
 * - Show timer countdown for IN_PROGRESS sessions (remainingTimeMs)
 * - Auto-refresh every 10 seconds for active sessions
 */