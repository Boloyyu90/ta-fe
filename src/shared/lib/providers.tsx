"use client";

/**
 * PROVIDERS WITH AUTH INITIALIZATION
 * Works with v3 unwrapped API client
 */

import { QueryClientProvider } from "@tanstack/react-query";
import { useQuery } from "@tanstack/react-query";
import { queryClient } from "./queryClient";
import { ReactNode, useEffect } from "react";
import { useAuthStore } from "@/features/auth/store/auth.store";
import { authApi } from "@/features/auth/api/auth.api";

interface ProvidersProps {
    children: ReactNode;
}

function AuthInit() {
    const { accessToken, setLoading, clearAuth, setAuth } = useAuthStore();

    const query = useQuery({
        queryKey: ["initAuth"],
        queryFn: async () => {
            if (!accessToken) {
                setLoading(false);
                return null;
            }

            try {
                // ✅ With v3: TypeScript knows response is MeResponse
                // No type assertion needed!
                const response = await authApi.getCurrentUser();

                // Response structure (unwrapped by interceptor):
                // {
                //   success: true,
                //   message: "User retrieved successfully",
                //   data: { user: {...} },
                //   timestamp: "2024-11-16T..."
                // }

                // ✅ Access user via response.data.user
                return response.data.user;
            } catch (error) {
                throw error;
            }
        },
        enabled: !!accessToken,
        retry: false,
        staleTime: Infinity,
    });

    // Success handler
    useEffect(() => {
        if (query.isSuccess && query.data) {
            const tokens = {
                accessToken: useAuthStore.getState().accessToken!,
                refreshToken: useAuthStore.getState().refreshToken!,
            };
            setAuth(query.data, tokens);
        }
    }, [query.isSuccess, query.data, setAuth]);

    // Error handler
    useEffect(() => {
        if (query.isError) {
            clearAuth();
        }
    }, [query.isError, clearAuth]);

    // Loading handler
    useEffect(() => {
        if (!query.isLoading) {
            setLoading(false);
        }
    }, [query.isLoading, setLoading]);

    // No token handler
    useEffect(() => {
        if (!accessToken) {
            setLoading(false);
        }
    }, [accessToken, setLoading]);

    return null;
}

export function Providers({ children }: ProvidersProps) {
    return (
        <QueryClientProvider client={queryClient}>
            <AuthInit />
            {children}
        </QueryClientProvider>
    );
}