'use client';

import { useMutation } from '@tanstack/react-query';
import { useRouter } from 'next/navigation';
import { toast } from 'sonner';
import { useAuthStore } from '@/features/auth/store/auth.store';
import { authApi } from '@/features/auth/api/auth.api';
import { AUTH_ERRORS, getErrorMessage } from '@/shared/lib/errors';
import type { RegisterRequest } from '@/features/auth/types/auth.types';

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
        // Check for duplicate email
        if (backendMessage.toLowerCase().includes('email already exists') ||
            backendMessage.toLowerCase().includes('already registered')) {
            return getErrorMessage(AUTH_ERRORS.AUTH_EMAIL_EXISTS);
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
 * Hook to handle user registration
 *
 * @returns Mutation object with register function and states
 *
 * @example
 * const { mutate: register, isPending } = useRegister();
 * register({
 *   name: 'John Doe',
 *   email: 'john@example.com',
 *   password: 'Password123',
 * });
 */
export const useRegister = () => {
    const router = useRouter();
    const setAuth = useAuthStore((state) => state.setAuth);

    return useMutation({
        mutationFn: (credentials: RegisterRequest) => authApi.register(credentials),

        onSuccess: (payload) => {
            // payload is AuthPayload = { user, tokens }
            const { user, tokens } = payload;

            // Store auth state in Zustand + localStorage (auto-login)
            setAuth(user, tokens);

            // Enhanced success toast
            toast.success('Akun Berhasil Dibuat!', {
                description: `Selamat datang di Prestige Tryout, ${user.name}!`,
                duration: 4000,
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

            // Enhanced error toast
            toast.error('Pendaftaran Gagal', {
                description: message,
                duration: 5000,
            });

            console.error('Registration error:', error);
        },
    });
};