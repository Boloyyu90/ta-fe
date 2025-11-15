/**
 * AUTH TYPES
 *
 * TypeScript types matching backend API contracts
 * Based on backend response structures
 */

export type UserRole = "PARTICIPANT" | "ADMIN";

export interface User {
    id: number;
    email: string;
    name: string;
    role: UserRole;
    isEmailVerified: boolean;
    createdAt: string;
    updatedAt: string;
}

export interface TokensData {
    accessToken: string;
    refreshToken: string;
}

export interface AuthResponse {
    success: boolean;
    message: string;
    data: {
        user: User;
        tokens: TokensData;
    };
    timestamp: string;
}

export interface LoginCredentials {
    email: string;
    password: string;
}

export interface RegisterCredentials {
    name: string;
    email: string;
    password: string;
    role?: UserRole;
}

export interface RefreshTokenResponse {
    success: boolean;
    message: string;
    data: {
        tokens: TokensData;
    };
    timestamp: string;
}

export interface MeResponse {
    success: boolean;
    message: string;
    data: {
        user: User;
    };
    timestamp: string;
}