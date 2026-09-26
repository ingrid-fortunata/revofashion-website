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

export interface UserFilterParams {
  role?: UserRole;
  is_active?: boolean;
  search?: string;
  page?: number;
  per_page?: number;
}

export interface CreateUserPayload {
  username: string;
  email: string;
  password: string;
  role?: UserRole;
  is_active?: boolean;
}

export interface UpdateUserPayload {
  username?: string;
  email?: string;
  role?: UserRole;
  is_active?: boolean;
}

export interface UserListResponse {
  data: User[];
  total?: number;
  page?: number;
  per_page?: number;
  pages?: number;
  message?: string;
}

