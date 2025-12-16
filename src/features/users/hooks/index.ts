/**
 * Users Hooks - Centralized exports
 *
 * Participant hooks:
 * - useProfile: Get current user profile (GET /me)
 *
 * Admin hooks:
 * - useUsers: Get paginated users list (GET /admin/users)
 * - useUser: Get single user detail (GET /admin/users/:id)
 * - useCreateUser: Create user (POST /admin/users)
 * - useUpdateUser: Update user (PATCH /admin/users/:id)
 * - useDeleteUser: Delete user (DELETE /admin/users/:id)
 */

// Participant
export { useProfile } from './useProfile';

// Admin
export { useUsers } from './useUsers';
export { useUser } from './useUser';
export { useCreateUser } from './useCreateUser';
export { useUpdateUser } from './useUpdateUser';
export { useDeleteUser } from './useDeleteUser';