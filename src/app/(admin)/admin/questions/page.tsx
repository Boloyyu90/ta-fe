/**
 * QUESTION BANK MANAGEMENT PAGE
 *
 * PURPOSE:
 * - List all questions with filters
 * - Search, filter by type, pagination
 * - CRUD operations on questions
 *
 * BACKEND INTEGRATION:
 * - GET /api/v1/admin/questions?page=1&limit=10&type=TIU&search=keyword&sortBy=createdAt&sortOrder=desc
 *
 * RESPONSE:
 * {
 *   data: [
 *     {
 *       id, content, options: { A, B, C, D, E },
 *       correctAnswer, questionType, defaultScore,
 *       createdAt, updatedAt
 *     }
 *   ],
 *   pagination: {...}
 * }
 *
 * FEATURES:
 * - Search by content (debounced)
 * - Filter by type: ALL | TIU | TWK | TKP
 * - Sort by: createdAt, questionType, defaultScore
 * - Display: content preview (truncated), type badge, score
 * - Actions: Edit, Delete, View
 *
 * DELETE CONSTRAINT:
 * - Cannot delete question used in exams (400 error)
 * - Show warning: "Question is used in X exams"
 *
 * IMPLEMENTATION:
 * - Use features/admin/components/questions/QuestionsTable.tsx
 * - "Create Question" button → /admin/questions/create
 * - Row actions: Edit, Delete, View Details
 * - Delete with confirmation dialog
 */