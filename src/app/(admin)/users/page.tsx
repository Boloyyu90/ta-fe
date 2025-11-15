/**
 * USERS MANAGEMENT PAGE
 *
 * PURPOSE:
 * - List all users (admin + participants)
 * - Search, filter by role, pagination
 * - CRUD operations
 *
 * BACKEND INTEGRATION:
 * - GET /api/v1/admin/users?page=1&limit=10&role=PARTICIPANT&search=keyword&sortBy=createdAt&sortOrder=desc
 *
 * RESPONSE:
 * {
 *   data: [
 *     {
 *       id, email, name, role, isEmailVerified,
 *       createdAt, updatedAt
 *     }
 *   ],
 *   pagination: {...}
 * }
 *
 * FEATURES:
 * - Search by name/email (debounced)
 * - Filter by role dropdown (ALL | ADMIN | PARTICIPANT)
 * - Sort by: createdAt, name, email, role
 * - Pagination
 * - Actions: Edit, Delete
 *
 * IMPLEMENTATION:
 * - Use features/admin/components/users/UsersTable.tsx
 * - Use shared/components/DataTable.tsx (generic reusable table)
 * - Use shared/hooks/usePagination.ts
 * - "Create User" button → /admin/users/create
 * - Row click or Edit icon → /admin/users/:id/edit
 * - Delete icon → Confirm dialog → DELETE /admin/users/:id
 */