/**
 * EDIT QUESTION PAGE
 *
 * PURPOSE:
 * - Update existing question
 * - Modify content, options, correct answer, type, score
 *
 * BACKEND INTEGRATION:
 * - GET /api/v1/admin/questions/:id (fetch current data)
 * - PATCH /api/v1/admin/questions/:id (update)
 *
 * PATCH REQUEST (all fields optional, at least one required):
 * {
 *   content?: string,
 *   options?: { A, B, C, D, E },
 *   correctAnswer?: string,
 *   questionType?: "TIU" | "TWK" | "TKP",
 *   defaultScore?: number
 * }
 *
 * VALIDATION:
 * - If updating correctAnswer, must match option keys
 * - If updating options, must maintain A-E structure
 *
 * IMPLEMENTATION:
 * - Reuse features/admin/components/questions/QuestionForm.tsx (isEdit mode)
 * - Pre-populate with current question data
 * - Validation on client before submit
 * - On success: Redirect to /admin/questions/:id
 */