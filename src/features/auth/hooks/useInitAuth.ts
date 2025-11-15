"use client";

import { useQuery } from "@tanstack/react-query";
import { useEffect } from "react";
import { useAuthStore } from "@/features/auth/store/auth.store";
import { authApi } from "@/features/auth/api/auth.api";

/**
 * Hook to initialize auth on app load
 * Validates stored tokens and fetches current user
 */
export const useInitAuth = () => {
    const { accessToken, setLoading, clearAuth, setAuth } = useAuthStore();

    const query = useQuery({
        queryKey: ["initAuth"],
        queryFn: async () => {
            // Skip API call if no token
            if (!accessToken) {
                setLoading(false);
                return null;
            }

            try {
                const response = await authApi.getCurrentUser();
                return response.data.user;
            } catch (error) {
                throw error;
            }
        },
        enabled: !!accessToken,
        retry: false,
        staleTime: Infinity,
    });

    // Handle success
    useEffect(() => {
        if (query.isSuccess && query.data) {
            const tokens = {
                accessToken: useAuthStore.getState().accessToken!,
                refreshToken: useAuthStore.getState().refreshToken!,
            };
            setAuth(query.data, tokens);
        }
    }, [query.isSuccess, query.data, setAuth]);

    // Handle errors
    useEffect(() => {
        if (query.isError) {
            clearAuth();
        }
    }, [query.isError, clearAuth]);

    // Handle loading state
    useEffect(() => {
        if (!query.isLoading) {
            setLoading(false);
        }
    }, [query.isLoading, setLoading]);

    // Immediately set loading false if no token
    useEffect(() => {
        if (!accessToken) {
            setLoading(false);
        }
    }, [accessToken, setLoading]);

    return query;
};