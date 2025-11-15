/**
 * EXAM DETAIL & START PAGE
 *
 * PURPOSE:
 * - Show detailed exam information before starting
 * - Display exam rules, duration, question count
 * - "Start Exam" button to create exam session
 *
 * BACKEND INTEGRATION:
 * - GET /api/v1/exams/:id (exam details - no correct answers shown)
 * - POST /api/v1/exams/:id/start (start exam session)
 *
 * GET Response:
 * {
 *   exam: {
 *     id, title, description, durationMinutes,
 *     _count: { examQuestions, userExams }
 *   }
 * }
 *
 * POST Response:
 * {
 *   userExam: { id, examId, startedAt, status, remainingTimeMs, totalQuestions, answeredQuestions },
 *   questions: [...], // without correctAnswer
 *   answers: [...]
 * }
 *
 * FLOW:
 * 1. Display exam overview (title, description, duration, question count)
 * 2. Show instructions/rules (stay in full screen, camera required, etc)
 * 3. "Start Exam" button → POST /exams/:id/start
 * 4. On success, redirect to /exam-sessions/:userExamId/take
 *
 * ERROR HANDLING:
 * - 400: EXAM_ALREADY_STARTED → Show message "You already started this exam" + link to session
 * - 400: EXAM_NO_QUESTIONS → "This exam has no questions yet"
 * - 404: Exam not found
 *
 * IMPLEMENTATION:
 * - Use features/exams/hooks (useExam, useStartExam)
 * - features/exams/components/participant/ExamDetails.tsx
 */