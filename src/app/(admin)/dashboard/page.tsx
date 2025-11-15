/**
 * ADMIN DASHBOARD
 *
 * PURPOSE:
 * - Overview of system statistics
 * - Monitor active exam sessions
 * - Quick access to management functions
 *
 * BACKEND INTEGRATION (Multiple Endpoints):
 * - GET /api/v1/admin/users (count)
 * - GET /api/v1/admin/exams (count)
 * - GET /api/v1/admin/exam-sessions?status=IN_PROGRESS (active sessions)
 * - GET /api/v1/admin/results (recent results)
 *
 * DATA AGGREGATION:
 * - Fetch data from multiple endpoints concurrently
 * - Use React Query's useQueries hook
 *
 * DISPLAYED STATS:
 * - Total users (ADMIN + PARTICIPANT)
 * - Total exams created
 * - Active sessions count
 * - Total questions in bank
 * - Recent results (last 5)
 * - Active sessions with real-time status
 *
 * IMPLEMENTATION:
 * - Use features/admin/components/dashboard/StatsCards.tsx
 * - Use features/admin/components/dashboard/ActiveSessionsWidget.tsx
 * - Use features/admin/components/dashboard/RecentResultsWidget.tsx
 * - Use features/admin/api/dashboard.ts (aggregate data)
 * - Auto-refresh active sessions every 10 seconds
 */