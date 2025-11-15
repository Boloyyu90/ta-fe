/**
 * USER DETAIL PAGE (Admin View)
 *
 * PURPOSE:
 * - View detailed user information
 * - Show user's exam history and statistics
 *
 * BACKEND INTEGRATION:
 * - GET /api/v1/admin/users/:id
 *
 * RESPONSE:
 * {
 *   user: {
 *     id, email, name, role, isEmailVerified,
 *     createdAt, updatedAt,
 *     _count: { createdExams, userExams }
 *   }
 * }
 *
 * DISPLAYED INFO:
 * - User details (name, email, role)
 * - Account status (email verified, created date)
 * - Statistics:
 *   - Exams created (if admin)
 *   - Exam sessions taken
 * - Action buttons: Edit, Delete, Reset Password (future)
 *
 * IMPLEMENTATION:
 * - Display user info in card layout
 * - "Edit" button → /admin/users/:id/edit
 * - "Delete" button → Confirm dialog → DELETE /admin/users/:id
 * - Handle delete constraints:
 *   - Cannot delete user with exam attempts (400 error)
 *   - Cannot delete user who created exams (400 error)
 */