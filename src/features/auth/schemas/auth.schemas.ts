// src/features/auth/schemas/auth.schemas.ts

/**
 * AUTH VALIDATION SCHEMAS - FIXED
 *
 * ✅ Corrected Zod syntax for all schemas
 * ✅ Matches backend validation rules EXACTLY
 * ✅ Compatible with Zod v3.x
 */

import { z } from 'zod';

// ============================================================================
// REUSABLE FIELD SCHEMAS (matching backend exactly)
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
    .min(1, 'Password is required')
    .min(8, 'Password must be at least 8 characters')
    .regex(
        /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/,
        'Password must contain at least one uppercase letter, one lowercase letter, and one number'
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
    .min(1, 'Email is required')
    .email('Invalid email format')
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
    .min(1, 'Name is required')
    .min(2, 'Name must be at least 2 characters')
    .max(100, 'Name must not exceed 100 characters')
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
    password: z.string().min(1, 'Password is required'),
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
        confirmPassword: z.string().min(1, 'Please confirm your password'),
    })
    .refine((data) => data.password === data.confirmPassword, {
        message: "Passwords don't match",
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
    refreshToken: z.string().min(1, 'Refresh token is required'),
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
    refreshToken: z.string().min(1, 'Refresh token is required'),
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
        issues.push('At least 8 characters');
    }

    if (!/[A-Z]/.test(password)) {
        issues.push('One uppercase letter');
    }

    if (!/[a-z]/.test(password)) {
        issues.push('One lowercase letter');
    }

    if (!/\d/.test(password)) {
        issues.push('One number');
    }

    return issues;
};

/**
 * Check if password meets all requirements
 */
export const isPasswordStrong = (password: string): boolean => {
    return checkPasswordStrength(password).length === 0;
};