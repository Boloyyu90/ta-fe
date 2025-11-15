/**
 * LOGIN PAGE
 *
 * PURPOSE:
 * - Public page for user authentication
 * - Displays LoginForm component
 * - Redirects authenticated users to dashboard
 *
 * BACKEND INTEGRATION:
 * - Maps to: POST /api/v1/auth/login
 * - On success: Store tokens + redirect to /dashboard or /admin/dashboard based on role
 * - On error: Display validation errors from backend
 *
 * CONTRACT DETAILS:
 * Request: { email: string, password: string }
 * Response: { user: UserPublicData, tokens: { accessToken, refreshToken } }
 *
 * IMPLEMENTATION:
 * - Use LoginForm component from features/auth/components
 * - Handle authentication with useLogin hook
 * - Store tokens in auth store (Zustand)
 * - Redirect based on user.role (ADMIN → /admin/dashboard, PARTICIPANT → /dashboard)
 */