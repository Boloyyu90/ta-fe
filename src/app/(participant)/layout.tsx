/**
 * PARTICIPANT LAYOUT
 *
 * PURPOSE:
 * - Wrapper for all participant pages
 * - Include navbar with user menu, logout
 * - Sidebar with navigation (optional)
 * - Protect routes (redirect unauthenticated users)
 *
 * AUTHENTICATION CHECK:
 * - Read auth state from auth store
 * - If not authenticated → redirect to /login
 * - If authenticated but role !== PARTICIPANT → redirect to /admin/dashboard
 *
 * NAVIGATION ITEMS:
 * - Dashboard
 * - Browse Exams
 * - My Sessions
 * - My Results
 * - Profile
 *
 * IMPLEMENTATION:
 * - Use shared/components/layout/Navbar.tsx
 * - Use shared/components/layout/Sidebar.tsx (optional)
 * - Display user name + role badge
 * - Logout button → Clear auth store + tokens + redirect to /login
 */