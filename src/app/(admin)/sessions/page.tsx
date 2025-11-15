/**
 * EXAM SESSIONS MONITORING PAGE (Admin)
 *
 * PURPOSE:
 * - Monitor all exam sessions across all users
 * - Filter by status, exam, user
 * - Real-time status updates
 *
 * BACKEND INTEGRATION:
 * - GET /api/v1/admin/exam-sessions?page=1&limit=10&examId=X&userId=Y&status=IN_PROGRESS
 *
 * RESPONSE:
 * {
 *   data: [
 *     {
 *       id, exam: { id, title },
 *       user: { id, name, email },
 *       startedAt, submittedAt, totalScore, status,
 *       duration, answeredQuestions, totalQuestions
 *     }
 *   ],
 *   pagination: {...}
 * }
 *
 * FILTERS:
 * - Status: ALL | IN_PROGRESS | FINISHED | TIMEOUT | CANCELLED
 * - Exam: Dropdown of all exams
 * - User: Search by name/email
 *
 * DISPLAYED INFO:
 * - User name, email
 * - Exam title
 * - Status badge (color-coded)
 * - Started time
 * - Progress (for IN_PROGRESS)
 * - Score (for FINISHED)
 * - Actions: View Details, View Proctoring Events
 *
 * REAL-TIME:
 * - Auto-refresh every 10 seconds for IN_PROGRESS sessions
 * - Show live timer countdown
 *
 * IMPLEMENTATION:
 * - Use features/admin/components/monitoring/SessionsMonitor.tsx
 * - Status filter tabs or dropdown
 * - Click row → /admin/sessions/:id
 * - "Proctoring" icon → /admin/sessions/:id/proctoring
 */