import { client } from "@/lib/api/client";
import { ApiResponse } from "@/types/api";
import { User, LoginResponseData } from "@/types/auth";

export interface LoginPayload {
  username?: string;
  email?: string;
  password: string;
}

export interface RegisterPayload {
  username: string;
  email: string;
  password: string;
}

export const authService = {
  /**
   * Authenticate customer or admin with username/email and password.
   */
  async login(payload: LoginPayload): Promise<ApiResponse<LoginResponseData>> {
    return client.post<ApiResponse<LoginResponseData>>("/auth/login", payload);
  },

  /**
   * Register a new customer account.
   */
  async register(payload: RegisterPayload): Promise<ApiResponse<User>> {
    return client.post<ApiResponse<User>>("/users", payload);
  },

  /**
   * Retrieve user profile by user ID.
   */
  async getProfile(userId: number): Promise<ApiResponse<User>> {
    return client.get<ApiResponse<User>>(`/users/${userId}`);
  },
};
