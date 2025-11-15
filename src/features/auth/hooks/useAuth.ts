"use client";

import { useAuthStore } from "@/features/auth/store/auth.store";

/**
 * Hook to get current auth state
 * Returns user, authentication status, and loading state
 */
export const useAuth = () => {
    const { user, isAuthenticated, isLoading } = useAuthStore();

    return {
        user,
        isAuthenticated,
        isLoading,
    };
};