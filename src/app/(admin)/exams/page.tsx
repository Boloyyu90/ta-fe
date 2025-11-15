/**
 * EXAM MANAGEMENT PAGE (Admin)
 *
 * PURPOSE:
 * - List all exams (including drafts without questions)
 * - Search, filter, pagination
 * - CRUD operations
 *
 * BACKEND INTEGRATION:
 * - GET /api/v1/admin/exams?page=1&limit=10&search=keyword&sortBy=createdAt&sortOrder=desc&createdBy=userId
 *
 * RESPONSE:
 * {
 *   data: [
 *     {
 *       id, title, description,
 *       startTime, endTime, durationMinutes,
 *       createdAt, updatedAt, createdBy,
 *       _count: { examQuestions }
 *     }
 *   ],
 *   pagination: {...}
 * }
 *
 * DISPLAYED INFO:
 * - Exam title, description (truncated)
 * - Duration (minutes)
 * - Question count
 * - Status: "Draft" if no questions, "Ready" if has questions
 * - Created date
 * - Actions: Edit, Delete, Manage Questions
 *
 * DELETE CONSTRAINT:
 * - Cannot delete exam with participant attempts
 * - Show error: "Cannot delete exam with attempts"
 *
 * IMPLEMENTATION:
 * - Use features/admin/components/exams/ExamTable.tsx
 * - Search by title/description (debounced)
 * - Filter by creator (optional)
 * - "Create Exam" button → /admin/exams/create
 * - Row actions: Edit, Manage Questions, Delete
 */