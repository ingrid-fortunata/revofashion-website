"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import { profileService } from "../services/profile.service";
import { useAuthStore } from "@/stores/useAuthStore";
import { showToast } from "@/lib/toast";
import { UpdateProfilePayload } from "@/types/auth";

export function useUpdateProfileMutation(userId: number | undefined) {
  const queryClient = useQueryClient();
  const updateUser = useAuthStore((state) => state.updateUser);

  return useMutation({
    mutationFn: (payload: UpdateProfilePayload) => {
      if (!userId) {
        throw new Error("User ID is required to update profile");
      }
      return profileService.updateProfile(userId, payload);
    },
    onSuccess: (response) => {
      const updatedUser = response.data;
      // 1. Synchronize user in Zustand store & localStorage
      updateUser(updatedUser);

      // 2. Invalidate profile query so cache stays fresh
      queryClient.invalidateQueries({ queryKey: ["user-profile", userId] });

      // 3. Display success toast notification
      showToast.success(
        "Profile Updated",
        "Your profile details have been saved successfully."
      );
    },
    // Note: Errors (409 conflict, 403 forbidden, etc.) are handled centrally by defaultErrorInterceptor
  });
}
