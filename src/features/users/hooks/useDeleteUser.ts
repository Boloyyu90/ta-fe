/**
 * Hook to delete a user (admin)
 *
 * Backend: DELETE /api/v1/admin/users/:id
 * Response: DeleteUserResponse = { success: boolean, message: string }
 *
 * Error codes:
 * - 409: USER_HAS_EXAM_ATTEMPTS or USER_HAS_CREATED_EXAMS
 */

import { useMutation, useQueryClient } from '@tanstack/react-query';
import { usersApi } from '../api/users.api';
import type { DeleteUserResponse } from '../types/users.types';

export function useDeleteUser() {
    const queryClient = useQueryClient();

    return useMutation<DeleteUserResponse, Error, number>({
        mutationFn: (userId: number) => usersApi.deleteUser(userId),

        onSuccess: (_, userId) => {
            // Invalidate users list
            queryClient.invalidateQueries({ queryKey: ['users'] });
            // Remove specific user from cache
            queryClient.removeQueries({ queryKey: ['user', userId] });
        },
    });
}

export default useDeleteUser;