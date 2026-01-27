/**
 * Hook to update current user's profile
 *
 * Backend: PATCH /api/v1/me
 * Response: UpdateProfileResponse = { user: User }
 *
 * Features:
 * - Updates profile via API
 * - Invalidates ['profile'] query cache
 * - Syncs changes to auth store (for navbar immediate update)
 * - Supports onSuccess/onError callbacks
 */

import { useMutation, useQueryClient } from '@tanstack/react-query';
import { usersApi } from '../api/users.api';
import { useAuthStore } from '@/features/auth/store/auth.store';
import type { UpdateProfileRequest, UpdateProfileResponse } from '../types/users.types';

interface UseUpdateProfileOptions {
    onSuccess?: (data: UpdateProfileResponse) => void;
    onError?: (error: Error) => void;
}

export function useUpdateProfile(options?: UseUpdateProfileOptions) {
    const queryClient = useQueryClient();
    const updateAuthUser = useAuthStore((state) => state.updateUser);

    const mutation = useMutation<UpdateProfileResponse, Error, UpdateProfileRequest>({
        mutationFn: (data: UpdateProfileRequest) => usersApi.updateProfile(data),

        onSuccess: (data) => {
            // Invalidate profile query to refetch fresh data
            queryClient.invalidateQueries({ queryKey: ['profile'] });

            // Sync to auth store for immediate navbar update
            // Only sync fields that were updated (name)
            // Note: password changes don't need store sync
            if (data.user.name) {
                updateAuthUser({ name: data.user.name });
            }

            options?.onSuccess?.(data);
        },

        onError: (error) => {
            options?.onError?.(error);
        },
    });

    return {
        updateProfile: mutation.mutate,
        updateProfileAsync: mutation.mutateAsync,
        isPending: mutation.isPending,
        isError: mutation.isError,
        error: mutation.error,
        data: mutation.data,
    };
}

export default useUpdateProfile;
