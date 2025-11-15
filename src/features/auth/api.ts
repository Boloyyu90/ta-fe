/**
 * AUTH API CLIENT
 *
 * PURPOSE:
 * - Centralize all auth-related API calls
 * - Type-safe functions for auth endpoints
 *
 * BACKEND ENDPOINTS MAPPED:
 * 1. POST /api/v1/auth/register
 * 2. POST /api/v1/auth/login
 * 3. POST /api/v1/auth/refresh
 * 4. POST /api/v1/auth/logout
 *
 * IMPLEMENTATION:
 *
 * export const authApi = {
 *   register: async (data: RegisterInput) => {
 *     const response = await apiClient.post('/auth/register', data);
 *     return response.data;
 *   },
 *
 *   login: async (data: LoginInput) => {
 *     const response = await apiClient.post('/auth/login', data);
 *     return response.data;
 *   },
 *
 *   refreshToken: async (refreshToken: string) => {
 *     const response = await apiClient.post('/auth/refresh', { refreshToken });
 *     return response.data;
 *   },
 *
 *   logout: async (refreshToken: string) => {
 *     await apiClient.post('/auth/logout', { refreshToken });
 *   }
 * };
 *
 * NOTES:
 * - Use shared/lib/api.ts for axios instance
 * - Response data already unwrapped by interceptor
 * - Errors handled by global error interceptor
 */