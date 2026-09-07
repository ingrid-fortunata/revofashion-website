"use client";

import { useMutation } from "@tanstack/react-query";
import { useRouter, useSearchParams } from "next/navigation";
import { authService, LoginPayload } from "../services/auth.service";
import { useAuthStore } from "@/stores/useAuthStore";
import { showToast } from "@/lib/toast";
import { ApiError } from "@/types/api";

interface UseLoginMutationOptions {
  onError?: (error: ApiError | Error) => void;
}

export function useLoginMutation(options?: UseLoginMutationOptions) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const login = useAuthStore((state) => state.login);

  return useMutation({
    mutationFn: (payload: LoginPayload) => authService.login(payload),
    onSuccess: (response) => {
      const { user, token } = response.data;

      // 1. Store token in Cookie and user in Zustand store
      login(user, token);

      // 2. Show success toast notification
      showToast.success("Welcome back!", `Logged in as ${user.username}`);

      // 3. Permission-based redirection
      const redirectParam = searchParams.get("redirect");
      const isAdmin = user.role === "admin" || user.role === "superadmin";

      if (isAdmin) {
        // Admin redirect logic
        const target = redirectParam?.startsWith("/dashboard")
          ? redirectParam
          : "/dashboard";
        router.replace(target);
      } else {
        // Customer redirect logic (avoid redirecting customers into admin dashboard)
        const target =
          redirectParam && !redirectParam.startsWith("/dashboard")
            ? redirectParam
            : "/";
        router.replace(target);
      }
    },
    onError: (error: unknown) => {
      if (options?.onError) {
        options.onError(
          error instanceof ApiError ? error : new Error((error as Error)?.message || "Login failed")
        );
      }
    },
  });
}
