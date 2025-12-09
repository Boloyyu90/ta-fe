// src/features/exam-sessions/types/exam-sessions.types.ts

/**
 * EXAM SESSIONS TYPES - BACKEND-ALIGNED
 *
 * ✅ REFACTORED: All types match backend Prisma schema and API responses EXACTLY
 *
 * KEY FIXES:
 * - Uses shared UserExamStatus enum (removed local definitions)
 * - Uses shared QuestionType enum
 * - Fixed pagination field names to match backend
 * - Separated DB fields from computed fields
 * - Removed non-existent fields (imageUrl from Question)
 * - All dates as ISO strings, not Date objects
 *
 * Backend Source: backend/src/features/exam-sessions/
 */

import type { UserExamStatus, QuestionType } from '@/shared/types/enum.types';
import type { PaginatedResponse } from '@/shared/types/api.types';
import type { BaseEntity, MinimalUser, MinimalExam } from '@/shared/types/common.types';

// ============================================================================
// QUESTION TYPES (from QuestionBank model)
// ============================================================================

/**
 * Question options structure
 * Stored as JSON in backend: { A: string, B: string, C: string, D: string, E: string }
 */
export interface QuestionOptions {
    A: string;
    B: string;
    C: string;
    D: string;
    E: string;
}

/**
 * Question from question bank (backend Prisma QuestionBank model)
 *
 * ⚠️ NOTE: imageUrl field does NOT exist in backend Prisma schema!
 * Backend fields: id, content, options, correctAnswer, defaultScore, questionType, createdAt, updatedAt
 */
export interface Question extends BaseEntity {
    content: string;
    options: QuestionOptions;
    correctAnswer: 'A' | 'B' | 'C' | 'D' | 'E';
    questionType: QuestionType;
    defaultScore: number;
    // ❌ imageUrl does NOT exist in backend - removed
}

/**
 * ExamQuestion (from exam_questions join table)
 * This is what participants see during exam - without correct answer
 */
export interface ExamQuestion {
    id: number; // examQuestion.id (join table ID)
    examQuestionId: number; // Same as id above (for consistency)
    content: string; // question.content
    options: QuestionOptions; // question.options
    questionType: QuestionType; // question.questionType
    orderNumber: number; // examQuestion.orderNumber
    // ❌ imageUrl removed - not in backend
    // ❌ correctAnswer hidden from participants
}

// ============================================================================
// USER EXAM (EXAM SESSION) TYPES
// ============================================================================

/**
 * UserExam model from backend Prisma
 *
 * ⚠️ IMPORTANT: This contains ONLY database fields, NO computed fields
 * Backend Prisma fields: id, userId, examId, startedAt, totalScore, status, createdAt, submittedAt
 *
 * Computed fields like remainingTimeMs, durationMinutes, answeredQuestions are calculated
 * by backend services and added to responses, but are NOT in the model itself.
 */
export interface UserExamBase extends BaseEntity {
    userId: number;
    examId: number;
    startedAt: string | null; // ISO datetime
    totalScore: number | null;
    status: UserExamStatus; // ✅ Uses shared enum (IN_PROGRESS, FINISHED, CANCELLED, TIMEOUT)
    submittedAt: string | null; // ISO datetime
}

/**
 * UserExam with minimal relations (for list views)
 * Backend returns this from getUserExams endpoint
 */
export interface UserExamListItem extends UserExamBase {
    exam: MinimalExam;
    // Computed fields added by backend service:
    remainingTimeMs: number | null; // Calculated from startedAt + durationMinutes
    durationMinutes: number | null; // From exam.durationMinutes
    answeredQuestions: number; // Count of answers with selectedOption !== null
    totalQuestions: number; // Count of exam.examQuestions
}

/**
 * Full UserExam with exam details (for detail view)
 * Backend returns this from getUserExam endpoint (/:id)
 */
export interface UserExam extends UserExamBase {
    exam: {
        id: number;
        title: string;
        description: string | null;
        durationMinutes: number;
    };
    // Computed fields:
    remainingTimeMs: number | null;
    answeredQuestions: number;
    totalQuestions: number;
}

// ============================================================================
// ANSWER TYPES
// ============================================================================

/**
 * Answer model from backend Prisma
 * Backend fields: id, userExamId, examQuestionId, selectedOption, isCorrect, answeredAt
 *
 * ✅ Backend uses 'selectedOption' not 'selectedAnswer'!
 */
export interface Answer extends BaseEntity {
    userExamId: number;
    examQuestionId: number;
    selectedOption: 'A' | 'B' | 'C' | 'D' | 'E' | null; // ✅ Correct field name
    isCorrect: boolean | null; // null until exam is submitted
    answeredAt: string; // ISO datetime (from createdAt)
}

/**
 * Answer with question details (for review page after submit)
 * Backend returns this from getExamAnswers endpoint
 */
export interface AnswerWithQuestion extends Answer {
    examQuestion: ExamQuestion & {
        question: {
            correctAnswer: 'A' | 'B' | 'C' | 'D' | 'E'; // Revealed after submit
        };
    };
}

// ============================================================================
// SCORE BREAKDOWN (for results)
// ============================================================================

/**
 * Score breakdown by question type
 * Backend calculates this in submitExam service
 */
export interface ScoreByType {
    type: QuestionType; // 'TIU' | 'TWK' | 'TKP'
    score: number;
    maxScore: number;
    correctAnswers: number;
    totalQuestions: number;
}

/**
 * Exam result with score breakdown
 * Backend returns this from getMyResults and submitExam endpoints
 */
export interface ExamResult {
    id: number;
    exam: MinimalExam;
    user: MinimalUser;
    startedAt: string; // ISO datetime
    submittedAt: string | null; // ISO datetime
    totalScore: number | null;
    status: UserExamStatus;
    duration: number | null; // Milliseconds between startedAt and submittedAt
    answeredQuestions: number;
    totalQuestions: number;
    scoresByType: ScoreByType[];
}

// ============================================================================
// API REQUEST TYPES
// ============================================================================

/**
 * Submit answer request
 * POST /exam-sessions/:id/answers
 *
 * ✅ Uses 'selectedOption' not 'selectedAnswer'
 */
export interface SubmitAnswerRequest {
    examQuestionId: number;
    selectedOption: 'A' | 'B' | 'C' | 'D' | 'E' | null;
}

/**
 * Query params for getUserExams
 * GET /exam-sessions?page=1&limit=10
 */
export interface GetUserExamsParams {
    status?: UserExamStatus; // ✅ Uses shared enum
    page?: number;
    limit?: number;
}

// ============================================================================
// API RESPONSE TYPES (what backend actually returns in 'data' field)
// ============================================================================

/**
 * GET /exam-sessions/:id response
 * Returns: { success: true, data: { userExam: {...} }, ... }
 */
export interface ExamSessionDetailResponse {
    userExam: UserExam;
}

/**
 * GET /exam-sessions/:id/questions response
 * Returns: { success: true, data: { questions: [...], total: N }, ... }
 */
export interface ExamQuestionsResponse {
    questions: ExamQuestion[];
    total: number;
}

/**
 * POST /exam-sessions/:id/answers response
 * Returns: { success: true, data: { answer: {...}, progress: {...} }, ... }
 */
export interface SubmitAnswerResponse {
    answer: Answer;
    progress: {
        answered: number;
        total: number;
        percentage: number;
    };
}

/**
 * POST /exam-sessions/:id/submit response
 * Returns: { success: true, data: { result: {...} }, ... }
 */
export interface SubmitExamResponse {
    result: ExamResult; // ✅ Includes scoresByType
}

/**
 * GET /exam-sessions/:id/answers response (after submit)
 * Returns: { success: true, data: { answers: [...], total: N }, ... }
 */
export interface ExamAnswersResponse {
    answers: AnswerWithQuestion[];
    total: number;
}

/**
 * GET /exam-sessions response (user's sessions list)
 * Returns: { success: true, data: { data: [...], pagination: {...} }, ... }
 *
 * ✅ FIXED: Pagination field names now match backend exactly
 */
export type UserExamsListResponse = PaginatedResponse<UserExamListItem>;

/**
 * GET /results response (user's results list)
 * Returns: { success: true, data: { data: [...], pagination: {...} }, ... }
 *
 * ✅ FIXED: Uses PaginatedResponse from shared types
 */
export type MyResultsResponse = PaginatedResponse<ExamResult>;

// ============================================================================
// LEGACY TYPE ALIASES (for gradual migration)
// ============================================================================

/**
 * @deprecated Use ExamQuestion instead
 * Keeping for backward compatibility during migration
 */
export type ParticipantQuestion = ExamQuestion;