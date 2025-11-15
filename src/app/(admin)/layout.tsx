/**
 * ADMIN LAYOUT
 *
 * PURPOSE:
 * - Wrapper for all admin pages
 * - Include admin navbar, sidebar
 * - Protect routes (admin-only access)
 *
 * AUTHENTICATION CHECK:
 * - Read auth state from auth store
 * - If not authenticated → redirect to /login
 * - If authenticated but role !== ADMIN → redirect to /dashboard (403)
 *
 * NAVIGATION ITEMS:
 * - Dashboard
 * - Users Management
 * - Questions Bank
 * - Exams Management
 * - Sessions Monitoring
 * - Results
 * - Profile
 *
 * IMPLEMENTATION:
 * - Use shared/components/layout/Navbar.tsx (admin variant)
 * - Use shared/components/layout/Sidebar.tsx with admin menu
 * - Display "ADMIN" badge in navbar
 * - Logout button
 */