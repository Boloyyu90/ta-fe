"use client";

/**
 * LOGIN HOOK - MODERN BEST PRACTICE
 *
 * ✅ Uses typed API client
 * ✅ Proper error handling
 * ✅ Clean side effects
 */

import { useMutation } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { useAuthStore } from "@/features/auth/store/auth.store";
import { authApi } from "@/features/auth/api/auth.api";
import type { LoginCredentials } from "@/features/auth/types/auth.types";
import { toast } from "sonner";

/**
 * Hook to handle user login
 *
 * @example
 * const { mutate: login, isPending } = useLogin();
 * login({ email: "test@test.com", password: "password" });
 */
export const useLogin = () => {
    const router = useRouter();
    const setAuth = useAuthStore((state) => state.setAuth);

    const mutation = useMutation({
        mutationFn: (credentials: LoginCredentials) => authApi.login(credentials),
    });

    // Handle success
    useEffect(() => {
        if (mutation.isSuccess && mutation.data) {
            // mutation.data is typed as AuthResponse
            // Structure: { success, message, data: { user, tokens }, timestamp }

            const { user, tokens } = mutation.data.data;

            // Store auth state
            setAuth(user, tokens);

            // Show success message
            toast.success("Login successful!", {
                description: `Welcome back, ${user.name}!`,
            });

            // Redirect based on role
            const redirectPath = user.role === "ADMIN" ? "/admin/dashboard" : "/dashboard";
            router.push(redirectPath);
        }
    }, [mutation.isSuccess, mutation.data, setAuth, router]);

    // Handle errors
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