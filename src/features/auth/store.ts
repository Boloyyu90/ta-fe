/**
 * AUTH STATE STORE (Zustand)
 *
 * Global authentication state management
 * Persists tokens and user data to localStorage
 */

import { create } from "zustand";
import { persist } from "zustand/middleware";
import type { User, TokensData } from "@/features/auth/types";

interface AuthState {
    user: User | null;
    accessToken: string | null;
    refreshToken: string | null;
    isAuthenticated: boolean;
    isLoading: boolean;

    // Actions
    setAuth: (user: User, tokens: TokensData) => void;
    clearAuth: () => void;
    updateUser: (user: User) => void;
    setLoading: (loading: boolean) => void;
}

export const useAuthStore = create<AuthState>()(
    persist(
        (set) => ({
            user: null,
            accessToken: null,
            refreshToken: null,
            isAuthenticated: false,
            isLoading: true,

            setAuth: (user, tokens) =>
                set({
                    user,
                    accessToken: tokens.accessToken,
                    refreshToken: tokens.refreshToken,
                    isAuthenticated: true,
                    isLoading: false,
                }),

            clearAuth: () =>
                set({
                    user: null,
                    accessToken: null,
                    refreshToken: null,
                    isAuthenticated: false,
                    isLoading: false,
                }),

            updateUser: (user) =>
                set({
                    user,
                }),

            setLoading: (loading) =>
                set({
                    isLoading: loading,
                }),
        }),
        {
            name: "auth-storage",
            partialize: (state) => ({
                user: state.user,
                accessToken: state.accessToken,
                refreshToken: state.refreshToken,
                isAuthenticated: state.isAuthenticated,
            }),
        }
    )
);