// src/features/auth/hooks/useLogin.ts

/**
 * USE LOGIN HOOK - FIXED
 *
 * ✅ Works with unwrapped API responses (just payload)
 * ✅ Proper error handling
 * ✅ Role-based navigation
 */

'use client';

import { useMutation } from '@tanstack/react-query';
import { useRouter } from 'next/navigation';
import { toast } from 'sonner';
import { useAuthStore } from '@/features/auth/store/auth.store';
import { authApi } from '@/features/auth/api/auth.api';
import type { LoginRequest } from '@/features/auth/types/auth.types';

/**
 * Extract error message from various error types
 */
const extractErrorMessage = (error: any): string => {
    // Axios error with backend response
    if (error.response?.data?.message) {
        return error.response.data.message;
    }

    // Axios error without backend response
    if (error.request) {
        return 'Network error. Please check your connection.';
    }

    // Generic error
    if (error.message) {
        return error.message;
    }

    return 'An unexpected error occurred.';
};

/**
 * Hook to handle user login
 *
 * @returns Mutation object with login function and states
 *
 * @example
 * const { mutate: login, isPending } = useLogin();
 * login({ email: 'user@example.com', password: 'Password123' });
 */
export const useLogin = () => {
    const router = useRouter();
    const setAuth = useAuthStore((state) => state.setAuth);

    return useMutation({
        mutationFn: (credentials: LoginRequest) => authApi.login(credentials),

        onSuccess: (payload) => {
            // payload is AuthPayload = { user, tokens }
            const { user, tokens } = payload;

            // Store auth state in Zustand + localStorage
            setAuth(user, tokens);

            // Show success toast
            toast.success('Login successful!', {
                description: `Welcome back, ${user.name}!`,
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

            // Show error toast
            toast.error('Login Failed', {
                description: message,
                duration: 5000,
            });

            console.error('Login error:', error);
        },
    });
};