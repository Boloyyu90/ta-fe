/**
 * AUTH HOOKS
 *
 * PURPOSE:
 * - React Query hooks for auth operations
 * - Manage loading, error, success states
 * - Handle token storage and auth state updates
 *
 * HOOKS TO IMPLEMENT:
 *
 * 1. useRegister()
 *    - Mutation for POST /auth/register
 *    - On success: Store tokens, update auth state, redirect
 *
 * 2. useLogin()
 *    - Mutation for POST /auth/login
 *    - On success: Store tokens, update auth state, redirect
 *
 * 3. useLogout()
 *    - Mutation for POST /auth/logout
 *    - On success: Clear tokens, clear auth state, redirect to /login
 *
 * 4. useRefreshToken()
 *    - Mutation for POST /auth/refresh
 *    - On success: Update tokens in storage
 *    - Called automatically by axios interceptor on 401
 *
 * 5. useAuth()
 *    - Returns current auth state from store
 *    - { user, isAuthenticated, isLoading }
 *
 * EXAMPLE:
 *
 * export const useLogin = () => {
 *   const router = useRouter();
 *   const { setAuth } = useAuthStore();
 *
 *   return useMutation({
 *     mutationFn: authApi.login,
 *     onSuccess: (data) => {
 *       // Store tokens
 *       localStorage.setItem('accessToken', data.tokens.accessToken);
 *       localStorage.setItem('refreshToken', data.tokens.refreshToken);
 *
 *       // Update auth state
 *       setAuth(data.user, data.tokens);
 *
 *       // Redirect based on role
 *       if (data.user.role === 'ADMIN') {
 *         router.push('/admin/dashboard');
 *       } else {
 *         router.push('/dashboard');
 *       }
 *     }
 *   });
 * };
 */