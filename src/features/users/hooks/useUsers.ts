/**
 * GET /admin/users - Get paginated list of users (admin only)
 */

import { useQuery } from '@tanstack/react-query';
import { usersApi } from '../api/users.api';
import type { UsersListResponse, UsersQueryParams } from '../types/users.types';

export function useUsers(params: UsersQueryParams = {}) {
    return useQuery<UsersListResponse>({
        queryKey: ['users', params],
        queryFn: () => usersApi.getUsers(params),
        staleTime: 1000 * 60 * 5, // 5 minutes

        keepPreviousData: true, // Keep old data while fetching new page
    });
}

// Example usage in component:
// const { data, isLoading } = useUsers({ page: 1, limit: 10 });
// if (data) {
//   const users = data.data; // ✅ Access items via data.data
//   const currentPage = data.pagination.page; // ✅ NOT data.currentPage
//   const total = data.pagination.total; // ✅ NOT data.totalItems
// }