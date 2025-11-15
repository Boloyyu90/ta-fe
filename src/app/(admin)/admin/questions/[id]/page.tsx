/**
 * QUESTION DETAIL PAGE
 *
 * PURPOSE:
 * - View full question details with correct answer
 * - See which exams use this question (future)
 *
 * BACKEND INTEGRATION:
 * - GET /api/v1/admin/questions/:id
 *
 * RESPONSE:
 * {
 *   question: {
 *     id, content, options, correctAnswer,
 *     questionType, defaultScore,
 *     createdAt, updatedAt
 *   }
 * }
 *
 * DISPLAYED INFO:
 * - Question content (full text)
 * - All 5 options (A-E)
 * - Correct answer (highlighted green)
 * - Question type badge
 * - Default score
 * - Created/updated dates
 * - "Edit" and "Delete" buttons
 *
 * IMPLEMENTATION:
 * - Display options list with correct answer marked
 * - "Edit" button → /admin/questions/:id/edit
 * - "Delete" button → Check if used in exams first
 */