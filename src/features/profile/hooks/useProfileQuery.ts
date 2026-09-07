"use client";

import { useQuery } from "@tanstack/react-query";
import { profileService } from "../services/profile.service";

export function useProfileQuery(userId: number | undefined) {
  return useQuery({
    queryKey: ["user-profile", userId],
    queryFn: () => profileService.getProfile(userId!),
    enabled: Boolean(userId),
  });
}
