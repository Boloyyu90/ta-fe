"use client";

/**
 * AUTH HOOKS (FIXED FOR REACT QUERY V5)
 *
 * React Query hooks for authentication operations
 * ✅ Updated for @tanstack/react-query v5.x syntax
 * ✅ Removed deprecated onSuccess/onSettled callbacks
 * ✅ Added proper error handling
 */

import { useMutation, useQuery } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { useAuthStore } from "./store";
import { authApi } from "./api";
import type { LoginCredentials, RegisterCredentials } from "@/features/auth/types";
import { toast } from "sonner";

/**
 * Hook to handle user registration
 * ✅ FIXED: Removed onSuccess/onError callbacks (React Query v5)
 */
export const useRegister = () => {
    const router = useRouter();
    const setAuth = useAuthStore((state) => state.setAuth);

    const mutation = useMutation({
        mutationFn: (credentials: RegisterCredentials) => authApi.register(credentials),
    });

    // ✅ Handle side effects in useEffect instead of onSuccess
    useEffect(() => {
        if (mutation.isSuccess && mutation.data) {
            // Store tokens and user data
            setAuth(mutation.data.data.user, mutation.data.data.tokens);

            toast.success("Account created successfully!", {
                description: `Welcome, ${mutation.data.data.user.name}!`,
            });

            // Redirect based on role
            const redirectPath =
                mutation.data.data.user.role === "ADMIN" ? "/admin/dashboard" : "/dashboard";
            router.push(redirectPath);
        }
    }, [mutation.isSuccess, mutation.data, setAuth, router]);

    // ✅ Handle errors in useEffect
    useEffect(() => {
        if (mutation.isError) {
            const error: any = mutation.error;
            const errorMessage =
                error.response?.data?.message ||
                error.message ||
                "Registration failed. Please try again.";

            toast.error("Registration Failed", {
                description: errorMessage,
            });
        }
    }, [mutation.isError, mutation.error]);

    return mutation;
};

/**
 * Hook to handle user login
 * ✅ FIXED: Removed onSuccess/onError callbacks (React Query v5)
 */
export const useLogin = () => {
    const router = useRouter();
    const setAuth = useAuthStore((state) => state.setAuth);

    const mutation = useMutation({
        mutationFn: (credentials: LoginCredentials) => authApi.login(credentials),
    });

    // ✅ Handle side effects in useEffect instead of onSuccess
    useEffect(() => {
        if (mutation.isSuccess && mutation.data) {
            // Store tokens and user data
            setAuth(mutation.data.data.user, mutation.data.data.tokens);

            toast.success("Login successful!", {
                description: `Welcome back, ${mutation.data.data.user.name}!`,
            });

            // Redirect based on role
            const redirectPath =
                mutation.data.data.user.role === "ADMIN" ? "/admin/dashboard" : "/dashboard";
            router.push(redirectPath);
        }
    }, [mutation.isSuccess, mutation.data, setAuth, router]);

    // ✅ Handle errors in useEffect
    useEffect(() => {
        if (mutation.isError) {
            const error: any = mutation.error;
            const errorMessage =
                error.response?.data?.message ||
                error.message ||
                "Invalid email or password.";

            toast.error("Login Failed", {
                description: errorMessage,
            });
        }
    }, [mutation.isError, mutation.error]);

    return mutation;
};

/**
 * Hook to handle user logout
 * ✅ Already correct - useMutation doesn't need changes for v5
 */
export const useLogout = () => {
    const router = useRouter();
    const { clearAuth, refreshToken } = useAuthStore();

    const mutation = useMutation({
        mutationFn: async () => {
            if (refreshToken) {
                await authApi.logout(refreshToken);
            }
        },
    });

    // Handle success in useEffect
    useEffect(() => {
        if (mutation.isSuccess) {
            clearAuth();
            toast.success("Logged out successfully");
            router.push("/login");
        }
    }, [mutation.isSuccess, clearAuth, router]);

    // Handle errors in useEffect
    useEffect(() => {
        if (mutation.isError) {
            // Clear auth even if API call fails
            clearAuth();
            router.push("/login");
            console.error("Logout error:", mutation.error);
        }
    }, [mutation.isError, mutation.error, clearAuth, router]);

    return mutation;
};

/**
 * Hook to get current user profile
 * ✅ FIXED: Removed onSuccess/onSettled callbacks (React Query v5)
 */
export const useCurrentUser = () => {
    const { isAuthenticated, user, setAuth, setLoading } = useAuthStore();

    const query = useQuery({
        queryKey: ["currentUser"],
        queryFn: async () => {
            const response = await authApi.getCurrentUser();
            return response.data.user;
        },
        enabled: isAuthenticated && !user,
        retry: 1,
        staleTime: 1000 * 60 * 5, // 5 minutes
    });

    // ✅ Handle success in useEffect instead of onSuccess callback
    useEffect(() => {
        if (query.isSuccess && query.data) {
            const tokens = {
                accessToken: useAuthStore.getState().accessToken!,
                refreshToken: useAuthStore.getState().refreshToken!,
            };
            setAuth(query.data, tokens);
        }
    }, [query.isSuccess, query.data, setAuth]);

    // ✅ Handle settled state in useEffect instead of onSettled callback
    useEffect(() => {
        if (!query.isLoading) {
            setLoading(false);
        }
    }, [query.isLoading, setLoading]);

    return query;
};

/**
 * Hook to get auth state
 * Returns current user, authentication status, and loading state
 * ✅ NO CHANGES NEEDED - This was already correct
 */
export const useAuth = () => {
    const { user, isAuthenticated, isLoading } = useAuthStore();

    return {
        user,
        isAuthenticated,
        isLoading,
    };
};

/**
 * Hook to initialize auth on app load
 * ✅ FIXED: Removed onSuccess/onSettled callbacks (React Query v5)
 * ✅ CRITICAL: This hook must be called in a client component at the root level
 */
export const useInitAuth = () => {
    const { accessToken, setLoading, clearAuth, setAuth } = useAuthStore();

    const query = useQuery({
        queryKey: ["initAuth"],
        queryFn: async () => {
            if (!accessToken) {
                return null;
            }

            try {
                const response = await authApi.getCurrentUser();
                return response.data.user;
            } catch (error) {
                throw error;
            }
        },
        enabled: !!accessToken, // Only run if we have a token
        retry: false, // Don't retry on failure
        staleTime: Infinity, // Don't refetch automatically
    });

    // ✅ Handle success in useEffect instead of onSuccess callback
    useEffect(() => {
        if (query.isSuccess && query.data) {
            const tokens = {
                accessToken: useAuthStore.getState().accessToken!,
                refreshToken: useAuthStore.getState().refreshToken!,
            };
            setAuth(query.data, tokens);
        }
    }, [query.isSuccess, query.data, setAuth]);

    // ✅ Handle errors in useEffect
    useEffect(() => {
        if (query.isError) {
            clearAuth();
        }
    }, [query.isError, clearAuth]);

    // ✅ Handle settled state in useEffect instead of onSettled callback
    useEffect(() => {
        if (!query.isLoading) {
            setLoading(false);
        }
    }, [query.isLoading, setLoading]);

    // ✅ Set loading to false if no token exists
    useEffect(() => {
        if (!accessToken) {
            setLoading(false);
        }
    }, [accessToken, setLoading]);

    return query;
};