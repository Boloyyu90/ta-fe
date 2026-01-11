"use client";

import { useMutation } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import { useAuthStore } from "@/features/auth/store/auth.store";
import { authApi } from "@/features/auth/api/auth.api";
import { toast } from "sonner";

/**
 * Hook to refresh access token using refresh token
 *
 * @returns Mutation object with refreshToken function
 *
 * @example
 * const { mutate: refreshToken } = useRefreshToken();
 * refreshToken();
 */
export const useRefreshToken = () => {
    const router = useRouter();
    const { refreshToken, setAuth, clearAuth } = useAuthStore();

    return useMutation({
        mutationFn: async () => {
            if (!refreshToken) {
                throw new Error("No refresh token available");
            }
            return authApi.refreshToken(refreshToken);
        },
        onSuccess: (payload) => {
            // payload is RefreshTokenPayload = { tokens: { accessToken, refreshToken } }
            const { tokens } = payload;

            // Get current user from store (user doesn't change during token refresh)
            const currentUser = useAuthStore.getState().user;

            if (!currentUser) {
                // This shouldn't happen, but if it does, logout
                clearAuth();
                router.push("/login");
                return;
            }

            // Update tokens in store and storage
            // Use same storage type as current session (localStorage or sessionStorage)
            // We detect this by checking which storage has the data
            const inLocalStorage = typeof window !== 'undefined' &&
                window.localStorage.getItem('refreshToken');
            const rememberMe = !!inLocalStorage;

            setAuth(currentUser, tokens, rememberMe);
        },
        onError: (error: any) => {
            // Token refresh failed - likely refresh token expired or invalid
            // Log user out
            clearAuth();

            // Session expired toast
            toast.error("Sesi Anda Telah Berakhir", {
                description: "Silakan login kembali untuk melanjutkan.",
                duration: 5000,
            });

            // Redirect to login
            router.push("/login");

            console.error("Token refresh failed:", error);
        },
    });
};

export default useRefreshToken;