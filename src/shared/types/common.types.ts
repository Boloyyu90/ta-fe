// src/shared/types/common.types.ts

/**
 * COMMON UTILITY TYPES
 *
 * Reusable base types used across features
 */

// ============================================================================
// BASE ENTITY TYPES
// ============================================================================

/**
 * Base entity with standard timestamps
 * Matches Prisma models' createdAt/updatedAt pattern
 */
export interface BaseEntity {
    id: number;
    createdAt: string; // ISO datetime string
    updatedAt: string; // ISO datetime string
}

/**
 * Timestamps only (for types that don't need id)
 */
export interface Timestamps {
    createdAt: string; // ISO datetime string
    updatedAt: string; // ISO datetime string
}

// ============================================================================
// MINIMAL/REFERENCE TYPES (for nested relations)
// ============================================================================

/**
 * Minimal user reference (for relations)
 */
export interface MinimalUser {
    id: number;
    name: string;
    email: string;
}

/**
 * Minimal exam reference (for relations)
 */
export interface MinimalExam {
    id: number;
    title: string;
    description: string | null;
}

/**
 * Minimal question reference (for relations)
 */
export interface MinimalQuestion {
    id: number;
    content: string;
    questionType: string;
}

// ============================================================================
// UTILITY TYPES
// ============================================================================

/**
 * Make all properties optional (shallow)
 */
export type Optional<T> = {
    [P in keyof T]?: T[P];
};

/**
 * Make all properties required (shallow)
 */
export type Required<T> = {
    [P in keyof T]-?: T[P];
};

/**
 * Pick properties that are nullable
 */
export type NullableKeys<T> = {
    [K in keyof T]: null extends T[K] ? K : never;
}[keyof T];

/**
 * Pick properties that are required (not nullable/undefined)
 */
export type RequiredKeys<T> = {
    [K in keyof T]: null extends T[K] ? never : K;
}[keyof T];