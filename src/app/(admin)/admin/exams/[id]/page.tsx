/**
 * EXAM DETAIL PAGE (Admin)
 *
 * PURPOSE:
 * - View full exam details
 * - See question count, participant attempts
 * - Quick access to edit and manage questions
 *
 * BACKEND INTEGRATION:
 * - GET /api/v1/admin/exams/:id
 *
 * RESPONSE:
 * {
 *   exam: {
 *     id, title, description,
 *     startTime, endTime, durationMinutes,
 *     createdAt, updatedAt, createdBy,
 *     creator: { id, name, email },
 *     _count: { examQuestions, userExams }
 *   }
 * }
 *
 * AUTHORIZATION:
 * - Only exam creator can view/edit
 * - Returns 403 if not creator
 *
 * DISPLAYED INFO:
 * - Exam title, description
 * - Duration (e.g., "120 minutes")
 * - Schedule (start/end times if set)
 * - Question count
 * - Participant attempts count
 * - Creator info
 * - Status: "Draft" or "Ready"
 *
 * ACTIONS:
 * - "Edit Exam" → /admin/exams/:id/edit
 * - "Manage Questions" → /admin/exams/:id/questions
 * - "Delete Exam" → Confirm + DELETE /admin/exams/:id
 *
 * IMPLEMENTATION:
 * - Display exam info in card/section layout
 * - Show warning if no questions: "This exam has no questions yet"
 * - Show warning if attempts exist: "Cannot delete - has attempts"
 */