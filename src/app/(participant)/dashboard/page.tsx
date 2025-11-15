/**
 * PARTICIPANT DASHBOARD
 *
 * PURPOSE:
 * - Landing page after participant login
 * - Shows overview of available exams, recent sessions, results
 *
 * BACKEND INTEGRATION:
 * - GET /api/v1/exams (available exams list)
 * - GET /api/v1/exam-sessions?page=1&limit=5 (recent sessions)
 * - GET /api/v1/results?page=1&limit=3 (recent results)
 *
 * DATA DISPLAYED:
 * - Available exams count
 * - In-progress exam sessions (with timer)
 * - Recent exam results summary
 * - Quick action buttons (Browse Exams, View Results)
 *
 * IMPLEMENTATION:
 * - Use React Query to fetch data from multiple endpoints
 * - Display loading states with skeletons
 * - Show exam cards with "Start Exam" CTA
 * - Use features/exams/components/participant/ExamCard.tsx
 */