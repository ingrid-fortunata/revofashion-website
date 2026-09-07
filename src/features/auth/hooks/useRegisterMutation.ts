"use client";

import { useMutation } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import { authService, RegisterPayload } from "../services/auth.service";
import { showToast } from "@/lib/toast";

export function useRegisterMutation() {
  const router = useRouter();

  return useMutation({
    mutationFn: (payload: RegisterPayload) => authService.register(payload),
    onSuccess: () => {
      // 1. Show success toast notification
      showToast.success(
        "Registration successful!",
        "Please sign in with your new credentials."
      );

      // 2. Redirect to /login
      router.replace("/login");
    },
    // Note: API errors automatically trigger translated Sonner toasts via defaultErrorInterceptor
  });
}
