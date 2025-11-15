/**
 * PROCTORING EVENTS PAGE (Admin)
 *
 * PURPOSE:
 * - View all proctoring events for specific exam session
 * - Timeline of violations, face detection results
 *
 * BACKEND INTEGRATION:
 * - GET /api/v1/admin/proctoring/exam-sessions/:userExamId/events?page=1&limit=20
 *
 * RESPONSE:
 * {
 *   data: [
 *     {
 *       id, userExamId, eventType, timestamp, severity,
 *       metadata: { confidence, violations, ... }
 *     }
 *   ],
 *   pagination: {...}
 * }
 *
 * EVENT TYPES:
 * - FACE_DETECTED (normal)
 * - NO_FACE_DETECTED (violation)
 * - MULTIPLE_FACES (violation)
 * - LOOKING_AWAY (violation)
 *
 * SEVERITY:
 * - LOW (informational)
 * - MEDIUM (warning)
 * - HIGH (critical violation)
 *
 * DISPLAYED INFO:
 * - Timeline view of events (sorted by timestamp)
 * - Event type badge (color by severity)
 * - Timestamp (formatted)
 * - Confidence score (from metadata)
 * - Violation count summary at top
 *
 * IMPLEMENTATION:
 * - Use features/admin/components/monitoring/ProctoringEventsTable.tsx
 * - Timeline or table view
 * - Filter by event type, severity
 * - Highlight HIGH severity events
 * - Show total violation count: "3 HIGH, 5 MEDIUM, 2 LOW"
 */