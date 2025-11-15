/**
 * AUTH STATE STORE (Zustand)
 *
 * PURPOSE:
 * - Global state for authentication
 * - Persist tokens and user data
 * - Sync with localStorage
 *
 * STATE STRUCTURE:
 * {
 *   user: UserPublicData | null,
 *   accessToken: string | null,
 *   refreshToken: string | null,
 *   isAuthenticated: boolean,
 *   isLoading: boolean
 * }
 *
 * ACTIONS:
 * - setAuth(user, tokens) - Store user + tokens after login/register
 * - clearAuth() - Clear all auth data on logout
 * - updateUser(user) - Update user data after profile edit
 * - setLoading(boolean) - Manage loading state
 *
 * PERSISTENCE:
 * - Sync with localStorage for tokens
 * - Rehydrate state on app load
 * - Clear on logout or token expiry
 *
 * IMPLEMENTATION:
 *
 * import create from 'zustand';
 * import { persist } from 'zustand/middleware';
 *
 * interface AuthState {
 *   user: UserPublicData | null;
 *   accessToken: string | null;
 *   refreshToken: string | null;
 *   isAuthenticated: boolean;
 *   setAuth: (user: UserPublicData, tokens: TokensData) => void;
 *   clearAuth: () => void;
 *   updateUser: (user: UserPublicData) => void;
 * }
 *
 * export const useAuthStore = create<AuthState>()(
 *   persist(
 *     (set) => ({
 *       user: null,
 *       accessToken: null,
 *       refreshToken: null,
 *       isAuthenticated: false,
 *       setAuth: (user, tokens) => set({
 *         user,
 *         accessToken: tokens.accessToken,
 *         refreshToken: tokens.refreshToken,
 *         isAuthenticated: true
 *       }),
 *       clearAuth: () => set({
 *         user: null,
 *         accessToken: null,
 *         refreshToken: null,
 *         isAuthenticated: false
 *       }),
 *       updateUser: (user) => set({ user })
 *     }),
 *     { name: 'auth-storage' }
 *   )
 * );
 */