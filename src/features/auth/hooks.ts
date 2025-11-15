"use client";

/**
 * AUTH HOOKS
 *
 * React Query hooks for authentication operations
 * Manages loading, error, and success states
 */

import { useMutation, useQuery } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import { useAuthStore } from "./store";
import { authApi } from "./api";
import type { LoginCredentials, RegisterCredentials } from "@/features/auth/types";
import { toast } from "sonner";

/**
 * Hook to handle user registration
 */
export const useRegister = () => {
    const router = useRouter();
    const setAuth = useAuthStore((state) => state.setAuth);

    return useMutation({
        mutationFn: (credentials: RegisterCredentials) => authApi.register(credentials),
        onSuccess: (data) => {
            // Store tokens and user data
            setAuth(data.data.user, data.data.tokens);

            toast.success("Account created successfully!", {
                description: `Welcome, ${data.data.user.name}!`,
            });

            // Redirect based on role
            const redirectPath =
                data.data.user.role === "ADMIN" ? "/admin/dashboard" : "/dashboard";
            router.push(redirectPath);
        },
        onError: (error: any) => {
            const errorMessage =
                error.response?.data?.message ||
                error.message ||
                "Registration failed. Please try again.";

            toast.error("Registration Failed", {
                description: errorMessage,
            });
        },
    });
};

/**
 * Hook to handle user login
 */
export const useLogin = () => {
    const router = useRouter();
    const setAuth = useAuthStore((state) => state.setAuth);

    return useMutation({
        mutationFn: (credentials: LoginCredentials) => authApi.login(credentials),
        onSuccess: (data) => {
            // Store tokens and user data
            setAuth(data.data.user, data.data.tokens);

            toast.success("Login successful!", {
                description: `Welcome back, ${data.data.user.name}!`,
            });

            // Redirect based on role
            const redirectPath =
                data.data.user.role === "ADMIN" ? "/admin/dashboard" : "/dashboard";
            router.push(redirectPath);
        },
        onError: (error: any) => {
            const errorMessage =
                error.response?.data?.message ||
                error.message ||
                "Invalid email or password.";

            toast.error("Login Failed", {
                description: errorMessage,
            });
        },
    });
};

/**
 * Hook to handle user logout
 */
export const useLogout = () => {
    const router = useRouter();
    const { clearAuth, refreshToken } = useAuthStore();

    return useMutation({
        mutationFn: async () => {
            if (refreshToken) {
                await authApi.logout(refreshToken);
            }
        },
        onSuccess: () => {
            clearAuth();
            toast.success("Logged out successfully");
            router.push("/login");
        },
        onError: (error: any) => {
            // Clear auth even if API call fails
            clearAuth();
            router.push("/login");

            console.error("Logout error:", error);
        },
    });
};

/**
 * Hook to get current user profile
 */
export const useCurrentUser = () => {
    const { isAuthenticated, user, setAuth, setLoading } = useAuthStore();

    return useQuery({
        queryKey: ["currentUser"],
        queryFn: async () => {
            const response = await authApi.getCurrentUser();
            return response.data.user;
        },
        enabled: isAuthenticated && !user,
        onSuccess: (userData) => {
            const tokens = {
                accessToken: useAuthStore.getState().accessToken!,
                refreshToken: useAuthStore.getState().refreshToken!,
            };
            setAuth(userData, tokens);
        },
        onSettled: () => {
            setLoading(false);
        },
    });
};

/**
 * Hook to get auth state
 * Returns current user, authentication status, and loading state
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
 * Checks if tokens exist and fetches current user
 */
export const useInitAuth = () => {
    const { accessToken, setLoading, clearAuth } = useAuthStore();

    useQuery({
        queryKey: ["initAuth"],
        queryFn: async () => {
            if (!accessToken) {
                setLoading(false);
                return null;
            }

            try {
                const response = await authApi.getCurrentUser();
                return response.data.user;
            } catch (error) {
                clearAuth();
                return null;
            }
        },
        onSuccess: (userData) => {
            if (userData) {
                const tokens = {
                    accessToken: useAuthStore.getState().accessToken!,
                    refreshToken: useAuthStore.getState().refreshToken!,
                };
                useAuthStore.getState().setAuth(userData, tokens);
            }
        },
        onSettled: () => {
            setLoading(false);
        },
    });
};