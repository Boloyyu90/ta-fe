/**
 * ERROR CODES AND MESSAGES
 * Centralized error handling constants for the application
 */

// ============================================================================
// QUESTION SESSION ERROR CODES
// ============================================================================

export const QUESTION_ERRORS = {
    QUESTION_NOT_FOUND: 'QUESTION_001',
    QUESTION_INVALID_OPTIONS: 'QUESTION_002',
    QUESTION_INVALID_ANSWER: 'QUESTION_003',
    QUESTION_IN_USE: 'QUESTION_004',
} as const;

// ============================================================================
// EXAM SESSION ERROR CODES
// ============================================================================

export const EXAM_SESSION_ERRORS = {
    EXAM_SESSION_NOT_FOUND: 'EXAM_SESSION_001',
    EXAM_SESSION_ALREADY_STARTED: 'EXAM_SESSION_002',
    EXAM_SESSION_TIMEOUT: 'EXAM_SESSION_003',
    EXAM_SESSION_ALREADY_SUBMITTED: 'EXAM_SESSION_004',
    EXAM_SESSION_INVALID_QUESTION: 'EXAM_SESSION_005',
    EXAM_SESSION_ANSWER_SAVE_FAILED: 'EXAM_SESSION_006',
    EXAM_SESSION_SUBMIT_FAILED: 'EXAM_SESSION_007',
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
// AUTH ERROR CODES
// ============================================================================

export const AUTH_ERRORS = {
    AUTH_EMAIL_EXISTS: 'AUTH_001',
    AUTH_INVALID_CREDENTIALS: 'AUTH_002',
    AUTH_INVALID_TOKEN: 'AUTH_003',
    AUTH_TOKEN_EXPIRED: 'AUTH_004',
} as const;

// ============================================================================
// PROCTORING ERROR CODES
// ============================================================================

export const PROCTORING_ERRORS = {
    PROCTORING_WEBCAM_DENIED: 'PROCTORING_001',
    PROCTORING_WEBCAM_NOT_AVAILABLE: 'PROCTORING_002',
    PROCTORING_ML_SERVICE_ERROR: 'PROCTORING_003',
    PROCTORING_EVENT_LOG_FAILED: 'PROCTORING_004',
    PROCTORING_INVALID_SESSION: 'PROCTORING_005',
} as const;

// ============================================================================
// INDONESIAN ERROR MESSAGES
// ============================================================================

export const ERROR_MESSAGES_ID = {
    // Exam Session Errors (keyed by error code values)
    EXAM_SESSION_001: 'Sesi ujian tidak ditemukan',
    EXAM_SESSION_002: 'Anda sudah memulai ujian ini',
    EXAM_SESSION_003: 'Waktu ujian telah habis. Ujian diserahkan otomatis.',
    EXAM_SESSION_004: 'Ujian sudah diserahkan',
    EXAM_SESSION_005: 'Soal tidak valid untuk ujian ini',
    EXAM_SESSION_006: 'Gagal menyimpan jawaban. Silakan coba lagi.',
    EXAM_SESSION_007: 'Gagal menyerahkan ujian. Silakan coba lagi.',
    EXAM_SESSION_010: 'Ujian ini tidak mengizinkan pengulangan',
    EXAM_SESSION_011: 'Anda telah mencapai batas maksimal percobaan',

    // Exam Errors (keyed by error code values)
    EXAM_001: 'Ujian tidak ditemukan',
    EXAM_002: 'Ujian belum memiliki soal',
    EXAM_003: 'Durasi ujian belum diatur',

    // Question Errors (keyed by error code values)
    QUESTION_001: 'Soal tidak ditemukan',
    QUESTION_002: 'Format opsi tidak valid. Harus memiliki 5 pilihan: A, B, C, D, E',
    QUESTION_003: 'Jawaban benar tidak valid. Harus salah satu dari: A, B, C, D, E',
    QUESTION_004: 'Soal tidak dapat dihapus karena sedang digunakan dalam ujian',

    // Auth Errors (keyed by error code values)
    AUTH_001: 'Email sudah terdaftar',
    AUTH_002: 'Email atau password salah',
    AUTH_003: 'Token tidak valid atau telah kedaluwarsa',
    AUTH_004: 'Sesi Anda telah berakhir. Silakan login kembali',

    // Proctoring Errors (keyed by error code values)
    PROCTORING_001: 'Akses kamera ditolak. Izinkan akses kamera untuk melanjutkan ujian.',
    PROCTORING_002: 'Kamera tidak tersedia. Pastikan perangkat Anda memiliki webcam yang berfungsi.',
    PROCTORING_003: 'Layanan deteksi wajah tidak tersedia. Ujian tetap berlanjut tanpa proctoring.',
    PROCTORING_004: 'Gagal mencatat event proctoring. Silakan periksa koneksi internet Anda.',
    PROCTORING_005: 'Sesi ujian tidak valid untuk proctoring.',
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
