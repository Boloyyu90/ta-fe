"use client";

import { useMutation } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { useAuthStore } from "@/features/auth/store/auth.store";
import { authApi } from "@/features/auth/api/auth.api";
import type { LoginCredentials } from "@/features/auth/types/auth.types";
import { toast } from "sonner";

/**
 * Hook to handle user login
 * Authenticates user and redirects based on role
 */
export const useLogin = () => {
    const router = useRouter();
    const setAuth = useAuthStore((state) => state.setAuth);

    const mutation = useMutation({
        mutationFn: (credentials: LoginCredentials) => authApi.login(credentials),
    });

    // Handle success in useEffect
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

    // Handle errors in useEffect
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