/**
 * EDIT EXAM PAGE
 *
 * PURPOSE:
 * - Update exam details
 * - Change title, description, duration, schedule
 *
 * BACKEND INTEGRATION:
 * - GET /api/v1/admin/exams/:id (fetch current data)
 * - PATCH /api/v1/admin/exams/:id (update)
 *
 * PATCH REQUEST (all optional, at least one required):
 * {
 *   title?: string,
 *   description?: string | null,
 *   startTime?: string | null,
 *   endTime?: string | null,
 *   durationMinutes?: number
 * }
 *
 * AUTHORIZATION:
 * - Only exam creator can edit
 * - Returns 403 if not creator
 *
 * DURATION UPDATE CONSTRAINT:
 * - Cannot update duration if exam has active sessions
 * - Returns 400: "Cannot update duration while exam sessions are active"
 *
 * IMPLEMENTATION:
 * - Reuse features/admin/components/exams/ExamForm.tsx (isEdit mode)
 * - Pre-populate form with current exam data
 * - Disable duration field if active sessions exist (check userExams count)
 * - On success: Redirect to /admin/exams/:id
 */