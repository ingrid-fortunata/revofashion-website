"use client";

import { useMutation } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import { authService, LoginPayload } from "../services/auth.service";
import { useAuthStore } from "@/stores/useAuthStore";
import { showToast } from "@/lib/toast";

export function useLoginMutation() {
  const router = useRouter();
  const login = useAuthStore((state) => state.login);

  return useMutation({
    mutationFn: (payload: LoginPayload) => authService.login(payload),
    onSuccess: (response) => {
      const { user, token } = response.data;

      // Store in cookie and Zustand store
      login(user, token);

      showToast.success("Welcome back!", `Logged in as ${user.username}`);

      // Role-based redirection
      if (user.role === "admin" || user.role === "superadmin") {
        router.replace("/dashboard");
      } else {
        router.replace("/");
      }
    },
    onError: (error) => {
      showToast.error(error);
    },
  });
}
