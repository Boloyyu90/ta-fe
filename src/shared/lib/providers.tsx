"use client";

/**
 * APP PROVIDERS
 *
 * Wraps app with:
 * - React Query provider
 * - Auth initialization (verifies token on mount)
 */

import { QueryClientProvider } from "@tanstack/react-query";
import { useQuery } from "@tanstack/react-query";
import { queryClient } from "./queryClient";
import { ReactNode, useEffect } from "react";
import { useAuthStore } from "@/features/auth/store/auth.store";
import { authApi } from "@/features/auth/api/auth.api";
// import { extractErrorMessage } from "@/shared/types/api.types";

interface ProvidersProps {
    children: ReactNode;
}

/**
 * Auth initialization component
 * Verifies stored access token on app mount
 */
function AuthInit() {
    const { accessToken, setLoading, clearAuth, setAuth } = useAuthStore();

    const query = useQuery({
        queryKey: ["initAuth"],
        queryFn: async () => {
            if (!accessToken) {
                console.log("AuthInit: No token found, skipping verification");
                setLoading(false);
                return null;
            }

            console.log("AuthInit: Verifying token...");
            try {
                const response = await authApi.getCurrentUser();
                console.log("AuthInit: Token valid, user verified");
                return response.user;
            } catch (error) {
                console.error("AuthInit: Token verification failed", error);
                throw error;
            }
        },
        enabled: !!accessToken,
        retry: false,
        staleTime: Infinity,
    });

    useEffect(() => {
        if (query.isSuccess && query.data) {
            const tokens = {
                accessToken: useAuthStore.getState().accessToken!,
                refreshToken: useAuthStore.getState().refreshToken!,
            };
            console.log("AuthInit: Setting authenticated state");
            setAuth(query.data, tokens);
        }
    }, [query.isSuccess, query.data, setAuth]);

    useEffect(() => {
        if (query.isError) {
            console.log("AuthInit: Clearing invalid auth state");
            clearAuth();
        }
    }, [query.isError, clearAuth]);

    useEffect(() => {
        if (!query.isLoading) {
            console.log("AuthInit: Verification complete, loading = false");
            setLoading(false);
        }
    }, [query.isLoading, setLoading]);

    useEffect(() => {
        if (!accessToken) {
            console.log("AuthInit: No token, loading = false immediately");
            setLoading(false);
        }
    }, [accessToken, setLoading]);

    return null;
}

/**
 * App-level providers wrapper
 */
export function Providers({ children }: ProvidersProps) {
    return (
        <QueryClientProvider client={queryClient}>
            <AuthInit />
            {children}
        </QueryClientProvider>
    );
}