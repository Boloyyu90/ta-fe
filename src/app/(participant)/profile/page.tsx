/**
 * USER PROFILE PAGE
 *
 * PURPOSE:
 * - View and edit current user's profile
 * - Change name and password only (not email/role)
 *
 * BACKEND INTEGRATION:
 * - GET /api/v1/me (fetch current user profile)
 * - PATCH /api/v1/me (update name/password)
 *
 * CONTRACT DETAILS:
 * GET Response: { user: UserPublicData }
 * PATCH Request: { name?: string, password?: string } (at least one required)
 * PATCH Response: { user: UserPublicData }
 *
 * RESTRICTIONS:
 * - Cannot change email (admin-only)
 * - Cannot change role (admin-only)
 * - Cannot change isEmailVerified
 *
 * IMPLEMENTATION:
 * - Use features/profile/components/ProfileForm.tsx
 * - Use features/profile/hooks (useProfile, useUpdateProfile)
 * - Display current user data from auth store or fetch from /me
 * - Show success toast after update
 * - Require current password when changing password (optional UX enhancement)
 */