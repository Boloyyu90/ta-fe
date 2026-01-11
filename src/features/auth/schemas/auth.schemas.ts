import { z } from 'zod';

// ============================================================================
// REUSABLE FIELD SCHEMAS
// ============================================================================

/**
 * Password validation rules
 * Requirements:
 * - Minimum 8 characters
 * - At least one uppercase letter (A-Z)
 * - At least one lowercase letter (a-z)
 * - At least one number (0-9)
 */
const passwordSchema = z
    .string()
    .min(1, 'Password wajib diisi')
    .min(8, 'Password minimal 8 karakter')
    .regex(
        /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/,
        'Password harus mengandung huruf besar, huruf kecil, dan angka'
    );

/**
 * Email validation rules
 * Requirements:
 * - Valid email format
 * - Automatically converted to lowercase
 * - Automatically trimmed
 */
const emailSchema = z
    .string()
    .min(1, 'Email wajib diisi')
    .email('Format email tidak valid')
    .toLowerCase()
    .trim();

/**
 * Name validation rules
 * Requirements:
 * - Minimum 2 characters
 * - Maximum 100 characters
 * - Automatically trimmed
 */
const nameSchema = z
    .string()
    .min(1, 'Nama lengkap wajib diisi')
    .min(2, 'Nama minimal 2 karakter')
    .max(100, 'Nama maksimal 100 karakter')
    .trim();

// ============================================================================
// LOGIN SCHEMA
// ============================================================================

/**
 * Login validation schema
 * POST /api/v1/auth/login
 */
export const loginSchema = z.object({
    email: emailSchema,
    password: z.string().min(1, 'Password wajib diisi'),
});

export type LoginFormData = z.infer<typeof loginSchema>;

// ============================================================================
// REGISTER SCHEMA
// ============================================================================

/**
 * Register validation schema
 * POST /api/v1/auth/register
 */
export const registerSchema = z.object({
    name: nameSchema,
    email: emailSchema,
    password: passwordSchema,
    role: z.enum(['ADMIN', 'PARTICIPANT']).optional(),
});

export type RegisterFormData = z.infer<typeof registerSchema>;

/**
 * Register form schema with password confirmation
 * This is FRONTEND ONLY - backend doesn't receive confirmPassword
 */
export const registerFormSchema = registerSchema
    .extend({
        confirmPassword: z.string().min(1, 'Konfirmasi password wajib diisi'),
    })
    .refine((data) => data.password === data.confirmPassword, {
        message: 'Password tidak cocok',
        path: ['confirmPassword'],
    });

export type RegisterFormWithConfirmData = z.infer<typeof registerFormSchema>;

// ============================================================================
// REFRESH TOKEN SCHEMA
// ============================================================================

/**
 * Refresh token validation schema
 * POST /api/v1/auth/refresh
 */
export const refreshTokenSchema = z.object({
    refreshToken: z.string().min(1, 'Refresh token wajib diisi'),
});

export type RefreshTokenFormData = z.infer<typeof refreshTokenSchema>;

// ============================================================================
// LOGOUT SCHEMA
// ============================================================================

/**
 * Logout validation schema
 * POST /api/v1/auth/logout
 */
export const logoutSchema = z.object({
    refreshToken: z.string().min(1, 'Refresh token wajib diisi'),
});

export type LogoutFormData = z.infer<typeof logoutSchema>;

// ============================================================================
// PASSWORD STRENGTH HELPER
// ============================================================================

/**
 * Check password strength for real-time feedback
 * Returns array of failed requirements
 */
export const checkPasswordStrength = (password: string): string[] => {
    const issues: string[] = [];

    if (password.length < 8) {
        issues.push('Minimal 8 karakter');
    }

    if (!/[A-Z]/.test(password)) {
        issues.push('Satu huruf besar');
    }

    if (!/[a-z]/.test(password)) {
        issues.push('Satu huruf kecil');
    }

    if (!/\d/.test(password)) {
        issues.push('Satu angka');
    }

    return issues;
};

/**
 * Check if password meets all requirements
 */
export const isPasswordStrong = (password: string): boolean => {
    return checkPasswordStrength(password).length === 0;
};