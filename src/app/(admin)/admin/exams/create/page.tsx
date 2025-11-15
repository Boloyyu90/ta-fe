/**
 * CREATE EXAM PAGE
 *
 * PURPOSE:
 * - Form to create new exam
 * - Set title, description, duration, schedule (optional)
 *
 * BACKEND INTEGRATION:
 * - POST /api/v1/admin/exams
 *
 * REQUEST:
 * {
 *   title: string, // Min 3 chars, max 200, unique per creator
 *   description?: string, // Max 2000 chars
 *   startTime?: string, // ISO datetime, optional
 *   endTime?: string, // ISO datetime, optional, must be after startTime
 *   durationMinutes: number // Required, min 1, max 300 (5 hours)
 * }
 *
 * VALIDATION:
 * - Title: Min 3, max 200, must be unique for this admin
 * - Duration: 1-300 minutes
 * - If both startTime and endTime provided, endTime must be after startTime
 * - Dates in future (optional validation)
 *
 * ERROR HANDLING:
 * - 409 Conflict: Title already exists for this admin
 *
 * IMPLEMENTATION:
 * - Use features/admin/components/exams/ExamForm.tsx
 * - Title input (required)
 * - Description textarea (optional)
 * - Duration input (number, minutes)
 * - Start/End datetime pickers (optional)
 * - On success: Redirect to /admin/exams/:id (then add questions)
 * - Note: Exam created without questions (draft state)
 */