/**
 * 🔴 EXAM TAKING INTERFACE (CORE FEATURE)
 *
 * PURPOSE:
 * - Main exam interface with proctoring
 * - Display questions, capture answers, real-time timer
 * - Webcam monitoring with ML face detection
 *
 * BACKEND INTEGRATION:
 * 1. GET /api/v1/exam-sessions/:id (session details + remaining time)
 * 2. GET /api/v1/exam-sessions/:id/questions (fetch questions without answers)
 * 3. POST /api/v1/exam-sessions/:id/answers (submit/update answers - auto-save)
 * 4. POST /api/v1/exam-sessions/:id/submit (finalize exam)
 * 5. POST /api/v1/proctoring/exam-sessions/:id/analyze-face (face analysis every 5-10s)
 *
 * PROCTORING INTEGRATION (features/proctoring/):
 * - Capture webcam frame every 5-10 seconds
 * - Convert to base64 → POST to /analyze-face endpoint
 * - Backend returns violations: NO_FACE_DETECTED, MULTIPLE_FACES, LOOKING_AWAY
 * - Display real-time alerts for violations
 * - Track violation count (stored in features/proctoring/store.ts)
 * - Auto-cancel exam if violations exceed threshold (3 HIGH severity)
 *
 * QUESTION DISPLAY:
 * - Show one question at a time OR question list (user preference)
 * - Display question content, 5 options (A, B, C, D, E)
 * - Highlight selected answer
 * - Auto-save on answer selection (debounced)
 *
 * TIMER:
 * - Display countdown timer (from remainingTimeMs)
 * - Update every second
 * - Warning at 5 minutes remaining
 * - Auto-submit when time expires
 *
 * ANSWER SUBMISSION:
 * - POST /exam-sessions/:id/answers for each answer (auto-save)
 * - Request: { examQuestionId: number, selectedOption: "A"|"B"|"C"|"D"|"E"|null }
 * - Response: { answer: {...}, progress: { answered, total, percentage } }
 *
 * EXAM FINALIZATION:
 * - "Submit Exam" button (requires confirmation)
 * - POST /exam-sessions/:id/submit
 * - Calculates score, marks as FINISHED
 * - Redirect to /exam-sessions/:id/review
 *
 * IMPLEMENTATION:
 * - Use features/exam-sessions/components/ExamInterface.tsx (main container)
 * - Use features/exam-sessions/components/ExamHeader.tsx (timer + progress)
 * - Use features/exam-sessions/components/QuestionDisplay.tsx
 * - Use features/exam-sessions/components/AnswerOptions.tsx
 * - Use features/proctoring/components/ProctoringMonitor.tsx (webcam + alerts)
 * - Use features/exam-sessions/store.ts (manage exam state)
 * - Use features/proctoring/store.ts (track violations)
 * - Use features/exam-sessions/utils.ts (timer helpers)
 *
 * STATE MANAGEMENT:
 * - Current question index
 * - All answers (map: questionId → selectedOption)
 * - Timer (remainingMs, update every 1s)
 * - Proctoring status (violations count, last alert)
 *
 * ERROR HANDLING:
 * - EXAM_TIMEOUT → Auto-submit and redirect
 * - EXAM_ALREADY_SUBMITTED → Redirect to review page
 * - Network error on answer save → Show retry button, queue offline
 */