/**
 * Hook to fetch single user detail (admin)
 *
 * Backend: GET /api/v1/admin/users/:id
 * Response: UserDetailResponse = { user: UserWithCounts }
 */

import { useQuery } from '@tanstack/react-query';
import { usersApi } from '../api/users.api';
import type { UserDetailResponse } from '../types/users.types';

export interface UseUserOptions {
    enabled?: boolean;
}

export function useUser(userId: number | undefined, options: UseUserOptions = {}) {
    const { enabled = true } = options;

    return useQuery<UserDetailResponse, Error>({
        queryKey: ['user', userId],
        queryFn: async () => {
            if (!userId) throw new Error('User ID is required');
            return usersApi.getUser(userId);
        },
        enabled: enabled && userId !== undefined && userId > 0,
        staleTime: 60 * 1000, // 1 minute
    });
}

export default useUser;