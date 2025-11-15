/**
 * EXAM REVIEW PAGE (After Submission)
 *
 * PURPOSE:
 * - Show all questions with correct answers
 * - Display user's selected answers
 * - Highlight correct/incorrect answers
 * - Show score breakdown by question type
 *
 * BACKEND INTEGRATION:
 * - GET /api/v1/exam-sessions/:id/answers
 *
 * RESPONSE:
 * [
 *   {
 *     examQuestionId, questionContent, questionType,
 *     options: { A, B, C, D, E },
 *     selectedOption, correctAnswer, isCorrect, score
 *   }
 * ]
 *
 * AUTHORIZATION:
 * - Only available AFTER exam submission (submittedAt !== null)
 * - Returns 400 error if exam not yet submitted
 *
 * DISPLAYED INFO:
 * - Total score (e.g., "85/100")
 * - Score by type (TWK: 25/35, TIU: 30/35, TKP: 30/30)
 * - Question list with:
 *   - Question content
 *   - User's answer (highlighted red if wrong, green if correct)
 *   - Correct answer (always shown)
 *   - Score earned
 *
 * IMPLEMENTATION:
 * - Use features/exam-sessions/components/AnswerReview.tsx
 * - Color code: Green = correct, Red = incorrect, Gray = not answered
 * - Group questions by type (tabs or sections)
 * - "Back to Results" button → /results/:id
 */