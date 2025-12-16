/**
 * Hook to create a new user (admin)
 *
 * Backend: POST /api/v1/admin/users
 * Response: CreateUserResponse = { user: User }
 */

import { useMutation, useQueryClient } from '@tanstack/react-query';
import { usersApi } from '../api/users.api';
import type { CreateUserRequest, CreateUserResponse } from '../types/users.types';

export function useCreateUser() {
    const queryClient = useQueryClient();

    return useMutation<CreateUserResponse, Error, CreateUserRequest>({
        mutationFn: (data: CreateUserRequest) => usersApi.createUser(data),

        onSuccess: () => {
            // Invalidate users list to refetch
            queryClient.invalidateQueries({ queryKey: ['users'] });
        },
    });
}

export default useCreateUser;