"use client";

import { useMutation } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import { authService, RegisterPayload } from "../services/auth.service";
import { useAuthStore } from "@/stores/useAuthStore";
import { showToast } from "@/lib/toast";

export function useRegisterMutation() {
  const router = useRouter();
  const login = useAuthStore((state) => state.login);

  return useMutation({
    mutationFn: async (payload: RegisterPayload) => {
      // 1. Create the user account via POST /users
      const registerRes = await authService.register(payload);

      // 2. Automatically sign in with the new credentials to acquire session & token
      try {
        const loginRes = await authService.login({
          username: payload.username,
          password: payload.password,
        });
        return {
          user: loginRes.data.user,
          token: loginRes.data.token,
          autoLoggedIn: true,
        };
      } catch (loginErr) {
        console.warn("Auto-login after registration encountered an issue:", loginErr);
        return {
          user: registerRes.data,
          token: null,
          autoLoggedIn: false,
        };
      }
    },
    onSuccess: ({ user, token, autoLoggedIn }) => {
      if (autoLoggedIn && token) {
        // Store user in Zustand (persisted to localStorage) and token in Cookies
        login(user, token);

        showToast.success(
          "Registration successful!",
          `Welcome to RevoFashion, ${user.username}!`
        );

        // Redirect to / per requirements rubric (line 177)
        router.push("/");
      } else {
        showToast.success(
          "Registration successful!",
          "Please sign in with your new credentials."
        );
        router.push("/login");
      }
    },
    // Note: API errors automatically trigger translated Sonner toasts via defaultErrorInterceptor
  });
}
