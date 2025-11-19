// src/features/users/hooks/useProfile.ts
import { useQuery } from '@tanstack/react-query';
import { usersApi } from '../api/users.api';
import type { ProfileResponse } from '../types/users.types';

export function useProfile() {
    return useQuery<ProfileResponse>({
        queryKey: ['profile'],
        queryFn: () => usersApi.getProfile(),
        staleTime: 1000 * 60 * 10, // 10 minutes (profile doesn't change often)
        retry: 1, // Only retry once for profile fetches
    });
}