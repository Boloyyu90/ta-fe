/**
 * ERROR CODES AND MESSAGES
 * Centralized error handling constants for the application
 */

// ============================================================================
// EXAM SESSION ERROR CODES
// ============================================================================

export const EXAM_SESSION_ERRORS = {
    EXAM_SESSION_NOT_FOUND: 'EXAM_SESSION_001',
    EXAM_SESSION_ALREADY_STARTED: 'EXAM_SESSION_002',
    EXAM_SESSION_TIMEOUT: 'EXAM_SESSION_003',
    EXAM_SESSION_ALREADY_SUBMITTED: 'EXAM_SESSION_004',
    EXAM_SESSION_INVALID_QUESTION: 'EXAM_SESSION_005',
    EXAM_SESSION_RETAKE_DISABLED: 'EXAM_SESSION_010',
    EXAM_SESSION_MAX_ATTEMPTS: 'EXAM_SESSION_011',
} as const;

// ============================================================================
// EXAM ERROR CODES  
// ============================================================================

export const EXAM_ERRORS = {
    EXAM_NOT_FOUND: 'EXAM_001',
    EXAM_NO_QUESTIONS: 'EXAM_002',
    EXAM_NO_DURATION: 'EXAM_003',
} as const;

// ============================================================================
// INDONESIAN ERROR MESSAGES
// ============================================================================

export const ERROR_MESSAGES_ID = {
    // Exam Session Errors
    EXAM_SESSION_NOT_FOUND: 'Sesi ujian tidak ditemukan',
    EXAM_SESSION_ALREADY_STARTED: 'Anda sudah memulai ujian ini',
    EXAM_SESSION_TIMEOUT: 'Waktu ujian telah habis',
    EXAM_SESSION_ALREADY_SUBMITTED: 'Ujian sudah diserahkan',
    EXAM_SESSION_INVALID_QUESTION: 'Soal tidak valid untuk ujian ini',
    EXAM_SESSION_RETAKE_DISABLED: 'Ujian ini tidak mengizinkan pengulangan',
    EXAM_SESSION_MAX_ATTEMPTS: 'Anda telah mencapai batas maksimal percobaan',
    
    // Exam Errors
    EXAM_NOT_FOUND: 'Ujian tidak ditemukan',
    EXAM_NO_QUESTIONS: 'Ujian belum memiliki soal',
    EXAM_NO_DURATION: 'Durasi ujian belum diatur',
} as const;

// ============================================================================
// HELPER FUNCTIONS
// ============================================================================

/**
 * Get Indonesian error message for an error code
 */
export function getErrorMessage(errorCode: string): string {
    return ERROR_MESSAGES_ID[errorCode as keyof typeof ERROR_MESSAGES_ID] || 'Terjadi kesalahan';
}

/**
 * Check if error is a retake-related error
 */
export function isRetakeError(errorCode: string): boolean {
    return errorCode === EXAM_SESSION_ERRORS.EXAM_SESSION_RETAKE_DISABLED ||
           errorCode === EXAM_SESSION_ERRORS.EXAM_SESSION_MAX_ATTEMPTS;
}
