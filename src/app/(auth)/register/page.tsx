/**
 * REGISTRATION PAGE
 *
 * PURPOSE:
 * - Public page for new user registration
 * - Displays RegisterForm component
 * - Auto-login after successful registration
 *
 * BACKEND INTEGRATION:
 * - Maps to: POST /api/v1/auth/register
 * - Creates account with PARTICIPANT role by default
 * - Returns tokens immediately (no email verification required in MVP)
 *
 * CONTRACT DETAILS:
 * Request: {
 *   email: string (valid email, lowercase),
 *   password: string (min 8 chars, 1 uppercase, 1 lowercase, 1 number),
 *   name: string (min 2 chars, max 100)
 * }
 * Response: { user: UserPublicData, tokens: TokensData }
 *
 * VALIDATION RULES (from backend):
 * - Email: Valid format, unique, auto-lowercased
 * - Password: Min 8 chars, must contain uppercase, lowercase, number
 * - Name: Min 2 chars, max 100 chars
 *
 * IMPLEMENTATION:
 * - Use RegisterForm component
 * - Reuse backend Zod schemas if possible (features/auth/schemas.ts)
 * - Handle 409 Conflict error (email already exists)
 * - Auto-store tokens and redirect to /dashboard on success
 */