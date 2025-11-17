import axios, {
    AxiosInstance,
    AxiosRequestConfig,
    AxiosError,
    InternalAxiosRequestConfig,
    AxiosResponse,
} from "axios";
import { useAuthStore } from "@/features/auth/store/auth.store";

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3000/api/v1";

// Interceptor unwraps AxiosResponse<T> → T
type UnwrappedPromise<T> = Promise<T>;

class TypedApiClient {
    private instance: AxiosInstance;

    constructor() {
        this.instance = axios.create({
            baseURL: API_BASE_URL,
            headers: { "Content-Type": "application/json" },
            withCredentials: true,
        });

        this.setupInterceptors();
    }

    private setupInterceptors() {
        this.instance.interceptors.request.use(
            (config: InternalAxiosRequestConfig) => {
                const token = useAuthStore.getState().accessToken;
                if (token && config.headers) config.headers.Authorization = `Bearer ${token}`;
                return config;
            },
            (error) => Promise.reject(error)
        );

        this.instance.interceptors.response.use(
            <T>(response: AxiosResponse<T>): T => response.data, // unwrap
            async (error: AxiosError) => {
                const original = error.config as InternalAxiosRequestConfig & { _retry?: boolean };

                if (error.response?.status === 401 && !original._retry) {
                    original._retry = true;
                    try {
                        const refreshToken = useAuthStore.getState().refreshToken;
                        if (!refreshToken) throw new Error("Missing refresh token");

                        const res = await axios.post(
                            `${API_BASE_URL}/auth/refresh`,
                            { refreshToken },
                            { headers: { "Content-Type": "application/json" } }
                        );

                        const { tokens } = res.data.data;
                        const user = useAuthStore.getState().user;
                        if (user) useAuthStore.getState().setAuth(user, tokens);

                        if (original.headers) {
                            original.headers.Authorization = `Bearer ${tokens.accessToken}`;
                        }

                        return this.instance(original);
                    } catch {
                        useAuthStore.getState().clearAuth();
                        if (typeof window !== "undefined") window.location.href = "/login";
                        return Promise.reject(error);
                    }
                }

                return Promise.reject(error);
            }
        );
    }

    async get<T = any>(url: string, config?: AxiosRequestConfig): UnwrappedPromise<T> {
        return this.instance.get<T>(url, config) as UnwrappedPromise<T>;
    }

    async post<T = any>(url: string, data?: any, config?: AxiosRequestConfig): UnwrappedPromise<T> {
        return this.instance.post<T>(url, data, config) as UnwrappedPromise<T>;
    }

    async patch<T = any>(url: string, data?: any, config?: AxiosRequestConfig): UnwrappedPromise<T> {
        return this.instance.patch<T>(url, data, config) as UnwrappedPromise<T>;
    }

    async put<T = any>(url: string, data?: any, config?: AxiosRequestConfig): UnwrappedPromise<T> {
        return this.instance.put<T>(url, data, config) as UnwrappedPromise<T>;
    }

    async delete<T = any>(url: string, config?: AxiosRequestConfig): UnwrappedPromise<T> {
        return this.instance.delete<T>(url, config) as UnwrappedPromise<T>;
    }
}

export const apiClient = new TypedApiClient();
