
/**
 * Hook to fetch all proctoring events (admin view)
 *
 * Backend: GET /api/v1/admin/proctoring/events
 * Response: AdminProctoringEventsResponse = { data: ProctoringEventWithSession[], pagination }
 */

import { useQuery, keepPreviousData } from '@tanstack/react-query';
import { proctoringApi } from '../api/proctoring.api';
import type {
    AdminProctoringEventsQueryParams,
    AdminProctoringEventsResponse,
} from '../types/proctoring.types';

export function useAdminProctoringEvents(params?: AdminProctoringEventsQueryParams) {
    return useQuery<AdminProctoringEventsResponse, Error>({
        queryKey: ['admin-proctoring-events', params],
        queryFn: () => proctoringApi.getAdminEvents(params),
        placeholderData: keepPreviousData,
        staleTime: 30 * 1000, // 30 seconds - refresh often for monitoring
    });
}

export default useAdminProctoringEvents;