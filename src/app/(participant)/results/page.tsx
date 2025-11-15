/**
 * MY RESULTS PAGE
 *
 * PURPOSE:
 * - List all finished exam results for current user
 * - Paginated table with scores, dates, status
 *
 * BACKEND INTEGRATION:
 * - GET /api/v1/results?page=1&limit=10
 *
 * RESPONSE:
 * {
 *   data: [
 *     {
 *       id, exam: { id, title, description },
 *       user: { id, name, email },
 *       startedAt, submittedAt, totalScore, status,
 *       duration, answeredQuestions, totalQuestions,
 *       scoresByType: []
 *     }
 *   ],
 *   pagination: {...}
 * }
 *
 * DISPLAYED INFO:
 * - Exam title
 * - Date taken (submittedAt)
 * - Score (e.g., "85/100")
 * - Status badge
 * - Duration (formatted)
 * - "View Details" button → /results/:id
 *
 * IMPLEMENTATION:
 * - Use features/exam-sessions/components/ResultsTable.tsx
 * - Sort by newest first (default from backend)
 * - Pagination component
 * - Show empty state if no results
 */