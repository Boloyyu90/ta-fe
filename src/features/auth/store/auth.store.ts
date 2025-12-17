// src/features/auth/store/auth.store.refactored.ts

/**
 * AUTH STORE - REFACTORED
 *
 * ✅ Uses refactored types
 * ✅ Proper localStorage sync
 * ✅ Type-safe actions
 * ✅ Hydration from localStorage on init
 *
 * This is a Zustand store that manages authentication state
 */

import { create } from 'zustand';
import type { User, TokensData, AuthStore } from '@/features/auth/types/auth.types';

// ============================================================================
// CONSTANTS
// ============================================================================

const STORAGE_KEYS = {
    USER: 'user',
    ACCESS_TOKEN: 'accessToken',
    REFRESH_TOKEN: 'refreshToken',
} as const;

// ============================================================================
// STORAGE HELPERS
// ============================================================================

/**
 * Save auth data to localStorage
 */
const saveToStorage = (user: User, tokens: TokensData): void => {
    try {
        localStorage.setItem(STORAGE_KEYS.USER, JSON.stringify(user));
        localStorage.setItem(STORAGE_KEYS.ACCESS_TOKEN, tokens.accessToken);
        localStorage.setItem(STORAGE_KEYS.REFRESH_TOKEN, tokens.refreshToken);
    } catch (error) {
        console.error('Failed to save auth data to localStorage:', error);
    }
};

/**
 * Load auth data from localStorage
 * Returns null if not found or invalid
 */
const loadFromStorage = (): {
    user: User;
    accessToken: string;
    refreshToken: string;
} | null => {
    try {
        const userStr = localStorage.getItem(STORAGE_KEYS.USER);
        const accessToken = localStorage.getItem(STORAGE_KEYS.ACCESS_TOKEN);
        const refreshToken = localStorage.getItem(STORAGE_KEYS.REFRESH_TOKEN);

        if (!userStr || !accessToken || !refreshToken) {
            return null;
        }

        const user = JSON.parse(userStr) as User;
        return { user, accessToken, refreshToken };
    } catch (error) {
        console.error('Failed to load auth data from localStorage:', error);
        return null;
    }
};

/**
 * Clear auth data from localStorage
 */
const clearStorage = (): void => {
    try {
        localStorage.removeItem(STORAGE_KEYS.USER);
        localStorage.removeItem(STORAGE_KEYS.ACCESS_TOKEN);
        localStorage.removeItem(STORAGE_KEYS.REFRESH_TOKEN);
    } catch (error) {
        console.error('Failed to clear auth data from localStorage:', error);
    }
};

// ============================================================================
// INITIAL STATE
// ============================================================================

/**
 * Initial auth state
 * Will be hydrated from localStorage if available
 */
const getInitialState = () => {
    // Guard against SSR - localStorage only exists in browser
    if (typeof window === 'undefined') {
        return {
            user: null,
            accessToken: null,
            refreshToken: null,
            isAuthenticated: false,
            isLoading: false,
        };
    }

    const stored = loadFromStorage();

    return {
        user: stored?.user || null,
        accessToken: stored?.accessToken || null,
        refreshToken: stored?.refreshToken || null,
        isAuthenticated: !!stored,
        isLoading: false,
    };
};

// ============================================================================
// ZUSTAND STORE
// ============================================================================

/**
 * Auth store
 * Manages authentication state and provides actions to modify it
 *
 * @example
 * // In a component
 * import { useAuthStore } from '@/features/auth/store/auth.store';
 *
 * const user = useAuthStore((state) => state.user);
 * const setAuth = useAuthStore((state) => state.setAuth);
 * const clearAuth = useAuthStore((state) => state.clearAuth);
 */
export const useAuthStore = create<AuthStore>((set) => ({
    // State
    ...getInitialState(),

    // Actions
    /**
     * Set authentication data
     * Called after successful login/register
     *
     * @param user - User object from backend
     * @param tokens - Access and refresh tokens
     *
     * @example
     * setAuth(user, { accessToken: '...', refreshToken: '...' });
     */
    setAuth: (user: User, tokens: TokensData) => {
        saveToStorage(user, tokens);
        set({
            user,
            accessToken: tokens.accessToken,
            refreshToken: tokens.refreshToken,
            isAuthenticated: true,
            isLoading: false,
        });
    },

    /**
     * Update user data
     * Called when user updates their profile
     *
     * @param updates - Partial user object with fields to update
     *
     * @example
     * updateUser({ name: 'New Name', email: 'new@email.com' });
     */
    updateUser: (updates: Partial<User>) => {
        set((state) => {
            if (!state.user) return state;

            const updatedUser = { ...state.user, ...updates };

            // Update localStorage
            try {
                localStorage.setItem(STORAGE_KEYS.USER, JSON.stringify(updatedUser));
            } catch (error) {
                console.error('Failed to update user in localStorage:', error);
            }

            return { user: updatedUser };
        });
    },

    /**
     * Clear authentication data
     * Called on logout or when token expires
     *
     * @example
     * clearAuth();
     */
    clearAuth: () => {
        clearStorage();
        set({
            user: null,
            accessToken: null,
            refreshToken: null,
            isAuthenticated: false,
            isLoading: false,
        });
    },

    /**
     * Set loading state
     * Used during auth initialization or token refresh
     *
     * @param loading - Loading state
     *
     * @example
     * setLoading(true);
     */
    setLoading: (loading: boolean) => {
        set({ isLoading: loading });
    },
}));

// ============================================================================
// SELECTOR HOOKS (for convenience)
// ============================================================================

/**
 * Hook to get current user
 * Returns null if not authenticated
 *
 * @example
 * const user = useCurrentUser();
 * if (user) {
 *   console.log(user.name);
 * }
 */
export const useCurrentUser = () => useAuthStore((state) => state.user);

/**
 * Hook to check if user is authenticated
 *
 * @example
 * const isAuthenticated = useIsAuthenticated();
 * if (!isAuthenticated) {
 *   router.push('/login');
 * }
 */
export const useIsAuthenticated = () =>
    useAuthStore((state) => state.isAuthenticated);

/**
 * Hook to get access token
 * Returns null if not authenticated
 *
 * @example
 * const accessToken = useAccessToken();
 */
export const useAccessToken = () => useAuthStore((state) => state.accessToken);

/**
 * Hook to get refresh token
 * Returns null if not authenticated
 *
 * @example
 * const refreshToken = useRefreshToken();
 */
export const useRefreshToken = () => useAuthStore((state) => state.refreshToken);

/**
 * Hook to get auth loading state
 *
 * @example
 * const isLoading = useAuthLoading();
 * if (isLoading) return <Spinner />;
 */
export const useAuthLoading = () => useAuthStore((state) => state.isLoading);

/**
 * Hook to check if user is admin
 *
 * @example
 * const isAdmin = useIsAdmin();
 * if (!isAdmin) return <AccessDenied />;
 */
export const useIsAdmin = () =>
    useAuthStore((state) => state.user?.role === 'ADMIN');

/**
 * Hook to check if user is participant
 *
 * @example
 * const isParticipant = useIsParticipant();
 */
export const useIsParticipant = () =>
    useAuthStore((state) => state.user?.role === 'PARTICIPANT');