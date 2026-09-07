export type UserRole = "customer" | "admin" | "superadmin";

export interface User {
  id: number;
  username: string;
  email: string;
  role: UserRole;
  is_active: boolean;
  created_at?: string;
}

export interface LoginResponseData {
  token: string;
  user: User;
}

export interface RegisterFormData {
  username: string;
  email: string;
  password: string;
  confirmPassword: string;
}

export interface LoginFormData {
  usernameOrEmail: string;
  password: string;
}

export interface UpdateProfilePayload {
  username?: string;
  email?: string;
}

export interface ProfileFormData {
  username: string;
  email: string;
}

