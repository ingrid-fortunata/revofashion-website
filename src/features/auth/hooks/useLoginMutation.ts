"use client";

import { useMutation } from "@tanstack/react-query";
import { useRouter, useSearchParams } from "next/navigation";
import { authService, LoginPayload } from "../services/auth.service";
import { useAuthStore } from "@/stores/useAuthStore";
import { showToast } from "@/lib/toast";

export function useLoginMutation() {
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
        const target = redirectParam?.startsWith("/dashboard")
          ? redirectParam
          : "/dashboard";
        router.replace(target);
      } else {
        const target =
          redirectParam && !redirectParam.startsWith("/dashboard")
            ? redirectParam
            : "/";
        router.replace(target);
      }
    },
    // Note: API errors automatically trigger translated Sonner toasts via defaultErrorInterceptor
  });
}
