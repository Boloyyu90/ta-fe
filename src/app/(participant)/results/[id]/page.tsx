/**
 * DETAILED RESULT VIEW
 *
 * PURPOSE:
 * - Show comprehensive exam result with breakdown
 * - Display score by question type (TWK, TIU, TKP)
 * - Link to answer review page
 *
 * BACKEND INTEGRATION:
 * - Uses same GET /api/v1/exam-sessions/:id endpoint
 * - Reuses exam session data structure
 *
 * DISPLAYED INFO:
 * - Exam title, description
 * - Total score (large, prominent)
 * - Score breakdown by type (chart or cards)
 * - Time taken (duration)
 * - Submission date/time
 * - "Review Answers" button → /exam-sessions/:id/review
 *
 * IMPLEMENTATION:
 * - Reuse features/exam-sessions/hooks (useExamSession)
 * - Display score chart (e.g., radial progress or bar chart)
 * - Calculate percentage: (totalScore / maxScore) * 100
 */