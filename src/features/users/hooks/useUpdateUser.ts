/**
 * Hook to update a user (admin)
 *
 * Backend: PATCH /api/v1/admin/users/:id
 * Response: UpdateUserResponse = { user: User }
 */

import { useMutation, useQueryClient } from '@tanstack/react-query';
import { usersApi } from '../api/users.api';
import type { UpdateUserRequest, UpdateUserResponse } from '../types/users.types';

interface UpdateUserVariables {
    userId: number;
    data: UpdateUserRequest;
}

export function useUpdateUser() {
    const queryClient = useQueryClient();

    return useMutation<UpdateUserResponse, Error, UpdateUserVariables>({
        mutationFn: ({ userId, data }: UpdateUserVariables) =>
            usersApi.updateUser(userId, data),

        onSuccess: (_, variables) => {
            // Invalidate specific user and users list
            queryClient.invalidateQueries({ queryKey: ['user', variables.userId] });
            queryClient.invalidateQueries({ queryKey: ['users'] });
        },
    });
}

export default useUpdateUser;