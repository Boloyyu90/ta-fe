/**
 * CREATE QUESTION PAGE
 *
 * PURPOSE:
 * - Form to create new question for question bank
 * - Input content, 5 options, select correct answer
 *
 * BACKEND INTEGRATION:
 * - POST /api/v1/admin/questions
 *
 * REQUEST:
 * {
 *   content: string, // Min 10 chars, max 5000
 *   options: {
 *     A: string, // Cannot be empty
 *     B: string,
 *     C: string,
 *     D: string,
 *     E: string
 *   },
 *   correctAnswer: "A" | "B" | "C" | "D" | "E",
 *   questionType: "TIU" | "TWK" | "TKP",
 *   defaultScore: number // Optional, default 1, min 1, max 100
 * }
 *
 * VALIDATION:
 * - Content: Min 10 chars, max 5000 (long question support)
 * - Options: Must have exactly 5 keys (A-E), all non-empty
 * - Correct answer: Must be one of A, B, C, D, E
 * - Score: Integer, positive, 1-100
 *
 * IMPLEMENTATION:
 * - Use features/admin/components/questions/QuestionForm.tsx
 * - Rich text editor for content (optional, or textarea)
 * - 5 input fields for options (A-E)
 * - Radio buttons to select correct answer
 * - Question type selector (dropdown or radio)
 * - Score input (number field, default 5)
 * - On success: Redirect to /admin/questions
 */