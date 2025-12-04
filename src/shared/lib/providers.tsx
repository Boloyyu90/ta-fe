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
                console.log("AuthInit: No token found, skipping verification");
                setLoading(false);
                return null;
            }

            console.log("AuthInit: Verifying token...");
            try {
                const response = await authApi.getCurrentUser();
                console.log("AuthInit: Token valid, user verified");
                return response.data.user;
            } catch (error) {
                console.error("AuthInit: Token verification failed", error);
                throw error;
            }
        },
        enabled: !!accessToken,
        retry: false,
        staleTime: Infinity,
    });

    // ✅ Success: Set auth state (isAuthenticated = true)
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

    // ✅ Error: Clear invalid auth state
    useEffect(() => {
        if (query.isError) {
            console.log("AuthInit: Clearing invalid auth state");
            clearAuth();
        }
    }, [query.isError, clearAuth]);

    // ✅ Loading complete: Allow UI to render
    useEffect(() => {
        if (!query.isLoading) {
            console.log("AuthInit: Verification complete, loading = false");
            setLoading(false);
        }
    }, [query.isLoading, setLoading]);

    // ✅ No token: Set loading false immediately
    useEffect(() => {
        if (!accessToken) {
            console.log("AuthInit: No token, loading = false immediately");
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