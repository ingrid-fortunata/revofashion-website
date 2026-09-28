"use client";

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
  getUsers,
  createUser,
  updateUser,
  toggleUserStatus,
} from "@/lib/api/users";
import {
  UserFilterParams,
  CreateUserPayload,
  UpdateUserPayload,
} from "@/types/auth";
import { showToast } from "@/lib/toast";

export const USER_QUERY_KEY = "admin-users";

/**
 * Hook to fetch users with filters and pagination.
 */
export function useUsersQuery(params?: UserFilterParams, enabled: boolean = true) {
  return useQuery({
    queryKey: [USER_QUERY_KEY, params],
    queryFn: () => getUsers(params),
    enabled,
    staleTime: 30 * 1000,
  });
}

/**
 * Hook to create a new user account.
 */
export function useCreateUserMutation() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (payload: CreateUserPayload) => createUser(payload),
    onSuccess: (res) => {
      queryClient.invalidateQueries({ queryKey: [USER_QUERY_KEY] });
      showToast.success(`User "${res.data.username}" created successfully!`);
    },
  });
}

/**
 * Hook to update an existing user's details, role, or status.
 */
export function useUpdateUserMutation() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, payload }: { id: number; payload: UpdateUserPayload }) =>
      updateUser(id, payload),
    onSuccess: (res) => {
      queryClient.invalidateQueries({ queryKey: [USER_QUERY_KEY] });
      showToast.success(`User "${res.data.username}" updated successfully!`);
    },
  });
}

/**
 * Hook to toggle user active status.
 */
export function useToggleUserStatusMutation() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, isActive }: { id: number; isActive: boolean; username: string }) =>
      toggleUserStatus(id, isActive),
    onSuccess: (_, vars) => {
      queryClient.invalidateQueries({ queryKey: [USER_QUERY_KEY] });
      const action = vars.isActive ? "activated" : "deactivated";
      showToast.success(`User "${vars.username}" has been ${action}.`);
    },
  });
}
