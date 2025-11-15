/**
 * EDIT USER PAGE (Admin)
 *
 * PURPOSE:
 * - Update user information (admin privileges)
 * - Change email, role, name, password, email verification status
 *
 * BACKEND INTEGRATION:
 * - GET /api/v1/admin/users/:id (fetch current data)
 * - PATCH /api/v1/admin/users/:id (update)
 *
 * PATCH REQUEST (all fields optional, at least one required):
 * {
 *   email?: string,
 *   password?: string,
 *   name?: string,
 *   role?: "ADMIN" | "PARTICIPANT",
 *   isEmailVerified?: boolean
 * }
 *
 * ADMIN PRIVILEGES:
 * - Can change email (unlike participants)
 * - Can change role
 * - Can toggle email verification status
 *
 * ERROR HANDLING:
 * - 409 Conflict: Email already taken
 * - 404 Not Found: User doesn't exist
 *
 * IMPLEMENTATION:
 * - Reuse features/admin/components/users/UserForm.tsx (with isEdit mode)
 * - Pre-populate form with current user data
 * - Password field optional (only show if changing)
 * - On success: Redirect to /admin/users/:id
 * - Cancel → /admin/users/:id
 */