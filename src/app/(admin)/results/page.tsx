/**
 * RESULTS MONITORING PAGE (Admin)
 *
 * PURPOSE:
 * - View all exam results across all users
 * - Filter by exam, user, status
 * - Export results (future feature)
 *
 * BACKEND INTEGRATION:
 * - GET /api/v1/admin/results?page=1&limit=10&examId=X&userId=Y&status=FINISHED
 *
 * RESPONSE:
 * {
 *   data: [
 *     {
 *       id, exam: { id, title, description },
 *       user: { id, name, email },
 *       startedAt, submittedAt, totalScore, status,
 *       duration, answeredQuestions, totalQuestions
 *     }
 *   ],
 *   pagination: {...}
 * }
 *
 * FILTERS:
 * - Exam: Dropdown
 * - User: Search by name/email
 * - Status: FINISHED | TIMEOUT | CANCELLED
 * - Date range: Start date - End date
 *
 * DISPLAYED INFO:
 * - User name
 * - Exam title
 * - Score
 * - Status
 * - Submission date
 * - Duration
 * - Actions: View Details
 *
 * IMPLEMENTATION:
 * - Use features/admin/components/monitoring/ResultsMonitor.tsx
 * - Sortable table
 * - Export to CSV button (future)
 * - Click row → /admin/sessions/:id (detail view)
 */