// src/features/users/hooks/useUsers.ts

/**
 * Hook to fetch paginated users list (admin)
 *
 * ✅ AUDIT FIX v3:
 * - Removed deprecated `keepPreviousData` (React Query v5)
 * - Use `placeholderData: keepPreviousData` function instead
 *
 * Backend: GET /api/v1/admin/users
 */

import { useQuery, keepPreviousData } from '@tanstack/react-query';
import { usersApi } from '../api/users.api';
import type { UsersListResponse, UsersQueryParams } from '../types/users.types';

export const useUsers = (params?: UsersQueryParams) => {
    return useQuery<UsersListResponse, Error>({
        queryKey: ['users', params],
        queryFn: () => usersApi.getUsers(params),
        // ✅ FIX: Use placeholderData with keepPreviousData function (React Query v5)
        placeholderData: keepPreviousData,
    });
};

export default useUsers;