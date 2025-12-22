// src/features/auth/hooks/useLogin.ts

/**
 * USE LOGIN HOOK - FIXED
 *
 * ✅ Works with unwrapped API responses (just payload)
 * ✅ Proper error handling with Indonesian messages
 * ✅ Role-based navigation
 */

'use client';

import { useMutation } from '@tanstack/react-query';
import { useRouter } from 'next/navigation';
import { toast } from 'sonner';
import { useAuthStore } from '@/features/auth/store/auth.store';
import { authApi } from '@/features/auth/api/auth.api';
import { AUTH_ERRORS, getErrorMessage } from '@/shared/lib/errors';
import type { LoginRequest } from '@/features/auth/types/auth.types';

type LoginWithRememberMe = LoginRequest & { rememberMe: boolean };

/**
 * Extract error message from various error types
 * Returns Indonesian error messages
 */
const extractErrorMessage = (error: any): string => {
    // Check for error code first (backend sends errorCode field)
    const errorCode = error.response?.data?.errorCode;
    if (errorCode) {
        return getErrorMessage(errorCode);
    }

    // Try to map common backend messages to error codes
    const backendMessage = error.response?.data?.message;
    if (backendMessage) {
        // Check for invalid credentials
        if (backendMessage.toLowerCase().includes('invalid credentials') ||
            backendMessage.toLowerCase().includes('incorrect')) {
            return getErrorMessage(AUTH_ERRORS.AUTH_INVALID_CREDENTIALS);
        }
        // Return backend message as fallback
        return backendMessage;
    }

    // Network error (no response from server)
    if (error.request) {
        return 'Gagal terhubung ke server. Periksa koneksi internet Anda.';
    }

    // Generic error
    if (error.message) {
        return error.message;
    }

    return 'Terjadi kesalahan. Silakan coba lagi.';
};

/**
 * Hook to handle user login
 *
 * @returns Mutation object with login function and states
 *
 * @example
 * const { mutate: login, isPending } = useLogin();
 * login({ email: 'user@example.com', password: 'Password123', rememberMe: true });
 */
export const useLogin = () => {
    const router = useRouter();
    const setAuth = useAuthStore((state) => state.setAuth);

    return useMutation({
        mutationFn: ({ email, password }: LoginWithRememberMe) =>
            authApi.login({ email, password }),

        onSuccess: (payload, variables) => {
            // payload is AuthPayload = { user, tokens }
            const { user, tokens } = payload;
            const { rememberMe } = variables;

            // Store auth state in Zustand + storage (localStorage or sessionStorage based on rememberMe)
            setAuth(user, tokens, rememberMe);

            // Show success toast in Indonesian
            toast.success('Login Berhasil!', {
                description: `Selamat datang kembali, ${user.name}!`,
            });

            // Navigate based on role
            const redirectPath = user.role === 'ADMIN'
                ? '/admin/dashboard'
                : '/dashboard';

            router.push(redirectPath);
        },

        onError: (error: any) => {
            // Extract user-friendly error message
            const message = extractErrorMessage(error);

            // Show error toast in Indonesian
            toast.error('Login Gagal', {
                description: message,
                duration: 5000,
            });

            // Better error logging for debugging
            console.error('Login error:', {
                message: error.message || 'Unknown error',
                status: error.status || error.response?.status,
                errorCode: error.errorCode || error.response?.data?.errorCode,
                data: error.response?.data,
                url: error.config?.url,
            });
        },
    });
};