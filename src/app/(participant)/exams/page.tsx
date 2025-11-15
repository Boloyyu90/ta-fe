/**
 * BROWSE EXAMS PAGE (Participant)
 *
 * PURPOSE:
 * - List all available exams for participants
 * - Filter by title/description (search)
 * - Paginated list with exam details
 *
 * BACKEND INTEGRATION:
 * - GET /api/v1/exams?page=1&limit=10&search=keyword&sortBy=createdAt&sortOrder=desc
 *
 * RESPONSE DATA:
 * {
 *   data: [
 *     {
 *       id, title, description,
 *       startTime, endTime, durationMinutes,
 *       createdAt, createdBy,
 *       _count: { examQuestions: number }
 *     }
 *   ],
 *   pagination: { page, limit, total, totalPages, hasNext, hasPrev }
 * }
 *
 * DISPLAYED INFO:
 * - Exam title, description
 * - Duration (e.g., "120 minutes")
 * - Number of questions
 * - "Start Exam" button (redirects to /exams/:id)
 *
 * IMPLEMENTATION:
 * - Use features/exams/components/participant/ExamCard.tsx
 * - Implement search with useDebounce hook
 * - Use shared/hooks/usePagination.ts for pagination logic
 * - Show empty state if no exams available
 */