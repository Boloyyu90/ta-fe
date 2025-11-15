/**
 * EXAM SESSION DETAIL PAGE (Admin)
 *
 * PURPOSE:
 * - View detailed exam session for any user
 * - Monitor progress, answers, proctoring events
 *
 * BACKEND INTEGRATION:
 * - GET /api/v1/admin/exam-sessions/:id
 *
 * RESPONSE:
 * {
 *   userExam: {
 *     id, examId, userId, startedAt, submittedAt,
 *     totalScore, status, createdAt,
 *     exam: { id, title, description, durationMinutes, _count: { examQuestions } },
 *     user: { id, name, email },
 *     _count: { answers }
 *   }
 * }
 *
 * DISPLAYED INFO:
 * - User info (name, email)
 * - Exam info (title, duration)
 * - Session status, started time, submitted time
 * - Progress: "25/30 questions answered"
 * - Score (if finished)
 * - Time taken (duration)
 *
 * TABS/SECTIONS:
 * 1. Overview (status, progress, score)
 * 2. Answers (if finished) → GET /admin/exam-sessions/:id/answers
 * 3. Proctoring Events → Link to /admin/sessions/:id/proctoring
 *
 * IMPLEMENTATION:
 * - Tabbed layout for different data views
 * - Admin can view even if not finished (monitoring)
 * - Link to user profile, exam details
 */