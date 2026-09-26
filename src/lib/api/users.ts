import { client } from "./client";
import { FetchOptions } from "@/types/api";
import {
  User,
  UserFilterParams,
  UserListResponse,
  CreateUserPayload,
  UpdateUserPayload,
} from "@/types/auth";

/**
 * Retrieves the users list (Superadmin only) via GET /users.
 * Supports filtering by role, is_active, search query, page, and per_page.
 */
export async function getUsers(
  params?: UserFilterParams,
  options?: FetchOptions
): Promise<UserListResponse> {
  const cleanedParams: Record<string, string | number | boolean | undefined> = {};

  if (params) {
    if (params.role) cleanedParams.role = params.role;
    if (params.is_active !== undefined) cleanedParams.is_active = params.is_active;
    if (params.search?.trim()) cleanedParams.search = params.search.trim();
    if (params.page !== undefined) cleanedParams.page = params.page;
    if (params.per_page !== undefined) cleanedParams.per_page = params.per_page;
  }

  return client.get<UserListResponse>("/users", {
    ...options,
    params: {
      ...cleanedParams,
      ...(options?.params || {}),
    },
  });
}

/**
 * Retrieves a single user by ID via GET /users/:id.
 */
export async function getUserById(
  id: number,
  options?: FetchOptions
): Promise<{ data: User }> {
  return client.get<{ data: User }>(`/users/${id}`, options);
}

/**
 * Creates a new user via POST /users and optionally updates role & active status via PUT /users/:id.
 */
export async function createUser(
  payload: CreateUserPayload,
  options?: FetchOptions
): Promise<{ data: User }> {
  // Step 1: Create user with base credentials
  const initialRes = await client.post<{ data: User }>("/users", {
    username: payload.username.trim(),
    email: payload.email.trim().toLowerCase(),
    password: payload.password,
  }, options);

  const newUser = initialRes.data;

  // Step 2: If role is elevated (admin/superadmin) or account is explicitly set inactive, update it
  const needsRoleUpdate = payload.role && payload.role !== "customer";
  const needsStatusUpdate = payload.is_active !== undefined && payload.is_active === false;

  if (newUser?.id && (needsRoleUpdate || needsStatusUpdate)) {
    const updatePayload: UpdateUserPayload = {};
    if (needsRoleUpdate) updatePayload.role = payload.role;
    if (needsStatusUpdate) updatePayload.is_active = payload.is_active;

    const updatedRes = await client.put<{ data: User }>(
      `/users/${newUser.id}`,
      updatePayload,
      options
    );
    return updatedRes;
  }

  return initialRes;
}

/**
 * Updates a user account (username, email, role, is_active) via PUT /users/:id.
 */
export async function updateUser(
  id: number,
  payload: UpdateUserPayload,
  options?: FetchOptions
): Promise<{ data: User }> {
  return client.put<{ data: User }>(`/users/${id}`, payload, options);
}

/**
 * Toggles a user's active/deactivated state via PUT /users/:id.
 */
export async function toggleUserStatus(
  id: number,
  isActive: boolean,
  options?: FetchOptions
): Promise<{ data: User }> {
  return client.put<{ data: User }>(`/users/${id}`, { is_active: isActive }, options);
}

export const userService = {
  getUsers,
  getUserById,
  createUser,
  updateUser,
  toggleUserStatus,
};

export default userService;
