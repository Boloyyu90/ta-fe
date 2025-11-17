"use client";

/**
 * REGISTER HOOK - MODERN BEST PRACTICE
 *
 * ✅ Uses typed API client
 * ✅ Auto-login after registration
 * ✅ Proper error handling
 */

import { useMutation } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { useAuthStore } from "@/features/auth/store/auth.store";
import { authApi } from "@/features/auth/api/auth.api";
import type { RegisterCredentials } from "@/features/auth/types/auth.types";
import { toast } from "sonner";

/**
 * Hook to handle user registration
 *
 * @example
 * const { mutate: register, isPending } = useRegister();
 * register({ name: "John", email: "test@test.com", password: "password" });
 */
export const useRegister = () => {
    const router = useRouter();
    const setAuth = useAuthStore((state) => state.setAuth);

    const mutation = useMutation({
        mutationFn: (credentials: RegisterCredentials) => authApi.register(credentials),
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
            toast.success("Account created successfully!", {
                description: `Welcome, ${user.name}!`,
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
                "Registration failed. Please try again.";

            toast.error("Registration Failed", {
                description: errorMessage,
            });
        }
    }, [mutation.isError, mutation.error]);

    return mutation;
};