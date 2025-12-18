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
import { storageGet, storageSet, storageRemove } from '@/shared/lib/storage';

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

type StorageType = 'local' | 'session';

/**
 * Save auth data to storage
 * @param user - User object
 * @param tokens - Access and refresh tokens
 * @param storageType - 'local' for remember me, 'session' for current session only
 */
const saveToStorage = (user: User, tokens: TokensData, storageType: StorageType): void => {
    storageSet(STORAGE_KEYS.USER, JSON.stringify(user), storageType);
    storageSet(STORAGE_KEYS.ACCESS_TOKEN, tokens.accessToken, storageType);
    storageSet(STORAGE_KEYS.REFRESH_TOKEN, tokens.refreshToken, storageType);
};

/**
 * Load auth data from storage
 * Checks both localStorage and sessionStorage
 * Returns null if not found or invalid
 */
const loadFromStorage = (): {
    user: User;
    accessToken: string;
    refreshToken: string;
} | null => {
    try {
        // Try localStorage first (remember me), then sessionStorage
        let userStr = storageGet(STORAGE_KEYS.USER, 'local');
        let accessToken = storageGet(STORAGE_KEYS.ACCESS_TOKEN, 'local');
        let refreshToken = storageGet(STORAGE_KEYS.REFRESH_TOKEN, 'local');

        // If not in localStorage, check sessionStorage
        if (!userStr || !accessToken || !refreshToken) {
            userStr = storageGet(STORAGE_KEYS.USER, 'session');
            accessToken = storageGet(STORAGE_KEYS.ACCESS_TOKEN, 'session');
            refreshToken = storageGet(STORAGE_KEYS.REFRESH_TOKEN, 'session');
        }

        if (!userStr || !accessToken || !refreshToken) {
            return null;
        }

        const user = JSON.parse(userStr) as User;
        return { user, accessToken, refreshToken };
    } catch (error) {
        console.error('Failed to load auth data from storage:', error);
        return null;
    }
};

/**
 * Clear auth data from both localStorage and sessionStorage
 */
const clearStorage = (): void => {
    // Clear from both storages to ensure complete logout
    storageRemove(STORAGE_KEYS.USER, 'local');
    storageRemove(STORAGE_KEYS.ACCESS_TOKEN, 'local');
    storageRemove(STORAGE_KEYS.REFRESH_TOKEN, 'local');
    storageRemove(STORAGE_KEYS.USER, 'session');
    storageRemove(STORAGE_KEYS.ACCESS_TOKEN, 'session');
    storageRemove(STORAGE_KEYS.REFRESH_TOKEN, 'session');
};

// ============================================================================
// INITIAL STATE
// ============================================================================

/**
 * Initial auth state
 * Will be hydrated from storage if available
 * SSR guard is handled by the storage wrapper
 */
const getInitialState = () => {
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
     * @param rememberMe - If true, uses localStorage; if false, uses sessionStorage
     *
     * @example
     * setAuth(user, { accessToken: '...', refreshToken: '...' }, true);
     */
    setAuth: (user: User, tokens: TokensData, rememberMe = true) => {
        const storageType: StorageType = rememberMe ? 'local' : 'session';
        saveToStorage(user, tokens, storageType);
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
     * Updates user in whichever storage currently holds the session
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

            // Update in whichever storage is currently being used
            const inLocalStorage = storageGet(STORAGE_KEYS.USER, 'local');
            const inSessionStorage = storageGet(STORAGE_KEYS.USER, 'session');

            if (inLocalStorage) {
                storageSet(STORAGE_KEYS.USER, JSON.stringify(updatedUser), 'local');
            }
            if (inSessionStorage) {
                storageSet(STORAGE_KEYS.USER, JSON.stringify(updatedUser), 'session');
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