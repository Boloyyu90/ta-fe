/**
 * MANAGE EXAM QUESTIONS PAGE
 *
 * PURPOSE:
 * - Attach questions from question bank to exam
 * - Detach questions from exam
 * - Reorder questions (optional)
 *
 * BACKEND INTEGRATION:
 * 1. GET /api/v1/admin/exams/:id/questions (current exam questions)
 * 2. GET /api/v1/admin/questions (available questions to attach)
 * 3. POST /api/v1/admin/exams/:id/questions (attach questions)
 * 4. DELETE /api/v1/admin/exams/:id/questions (detach questions)
 *
 * ATTACH REQUEST:
 * {
 *   questionIds: number[] // Array of question IDs to attach
 * }
 * RESPONSE:
 * { attached: number, alreadyAttached: number }
 *
 * DETACH REQUEST:
 * {
 *   questionIds: number[] // Array of question IDs to remove
 * }
 * RESPONSE:
 * { detached: number }
 *
 * EXAM QUESTIONS RESPONSE:
 * [
 *   {
 *     id, orderNumber,
 *     question: {
 *       id, content, questionType, defaultScore,
 *       options, correctAnswer
 *     }
 *   }
 * ]
 *
 * UI FLOW:
 * - Left panel: Current exam questions (ordered, with correct answers shown)
 * - Right panel: Question bank browser (search, filter by type)
 * - Drag & drop or click to add questions
 * - Remove button for each attached question
 * - Auto-assign orderNumber (backend handles this)
 *
 * IMPLEMENTATION:
 * - Use features/admin/components/exams/ExamQuestionManager.tsx
 * - Display current questions with orderNumber
 * - Question bank browser (reuse QuestionsTable but in selection mode)
 * - Multi-select checkboxes for bulk attach
 * - "Attach Selected" button
 * - Detach confirmation dialog
 * - Show question type badges (TIU, TWK, TKP) for balance
 */