import { client } from "@/lib/api/client";
import { ApiResponse } from "@/types/api";
import { User, UpdateProfilePayload } from "@/types/auth";

export const profileService = {
  /**
   * Retrieve user profile details by user ID.
   */
  async getProfile(userId: number): Promise<ApiResponse<User>> {
    return client.get<ApiResponse<User>>(`/users/${userId}`);
  },

  /**
   * Update profile fields (username, email) for a user.
   */
  async updateProfile(
    userId: number,
    payload: UpdateProfilePayload
  ): Promise<ApiResponse<User>> {
    return client.put<ApiResponse<User>>(`/users/${userId}`, payload);
  },
};
