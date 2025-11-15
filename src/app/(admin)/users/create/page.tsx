/**
 * CREATE USER PAGE (Admin)
 *
 * PURPOSE:
 * - Form to create new user manually
 * - Admin can set role (ADMIN or PARTICIPANT)
 *
 * BACKEND INTEGRATION:
 * - POST /api/v1/admin/users
 *
 * REQUEST:
 * {
 *   email: string,
 *   password: string, // Must meet validation: min 8 chars, 1 upper, 1 lower, 1 number
 *   name: string,
 *   role: "ADMIN" | "PARTICIPANT" // Optional, defaults to PARTICIPANT
 * }
 *
 * RESPONSE:
 * { user: UserPublicData }
 *
 * VALIDATION RULES (Same as register):
 * - Email: Valid format, unique
 * - Password: Min 8 chars, 1 uppercase, 1 lowercase, 1 number
 * - Name: Min 2 chars, max 100
 *
 * ERROR HANDLING:
 * - 409 Conflict: Email already exists
 * - 400 Validation: Show field errors
 *
 * IMPLEMENTATION:
 * - Use features/admin/components/users/UserForm.tsx
 * - Reuse features/auth/schemas.ts for validation
 * - Role selector (radio or dropdown)
 * - On success: Redirect to /admin/users
 * - Cancel button → /admin/users
 */