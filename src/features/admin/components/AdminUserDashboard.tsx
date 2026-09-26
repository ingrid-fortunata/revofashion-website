"use client";

import React, { useState, useMemo } from "react";
import { useAuthStore } from "@/stores/useAuthStore";
import { User, UserRole } from "@/types/auth";
import {
  AdminUserMetrics,
  AdminUserToolbar,
  AdminUserTable,
  CreateUserModal,
  EditUserModal,
  ToggleUserStatusModal,
} from "@/features/admin";
import { useUsersQuery } from "@/features/admin/hooks/useUsersQuery";
import { ShieldCheck, ShieldAlert, KeyRound, LogOut } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";

export function AdminUserDashboard() {
  const router = useRouter();
  const { user: currentUser, logout } = useAuthStore();
  const isSuperadmin = currentUser?.role === "superadmin";

  const [page, setPage] = useState(1);
  const pageSize = 10;
  const [search, setSearch] = useState("");
  const [role, setRole] = useState<string>("");
  const [status, setStatus] = useState<string>("");

  // Modals state
  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [editingUser, setEditingUser] = useState<User | null>(null);
  const [togglingUser, setTogglingUser] = useState<User | null>(null);

  // Fetch users via React Query if superadmin
  const {
    data: userData,
    isLoading,
  } = useUsersQuery(
    {
      page,
      per_page: pageSize,
      role: (role as UserRole) || undefined,
      is_active: status === "active" ? true : status === "inactive" ? false : undefined,
      search: search.trim() || undefined,
    },
    isSuperadmin
  );

  const rawUsers = userData?.data || [];

  // Client-side filtering fallback for maximum responsiveness
  const filteredUsers = useMemo(() => {
    let result = rawUsers;
    if (search.trim()) {
      const q = search.toLowerCase().trim();
      result = result.filter(
        (u) =>
          u.username.toLowerCase().includes(q) ||
          u.email.toLowerCase().includes(q)
      );
    }
    if (role) {
      result = result.filter((u) => u.role === role);
    }
    if (status === "active") {
      result = result.filter((u) => u.is_active);
    } else if (status === "inactive") {
      result = result.filter((u) => !u.is_active);
    }
    return result;
  }, [rawUsers, search, role, status]);

  // Pagination calculation
  const totalUsers = userData?.total ?? filteredUsers.length;
  const totalPages = Math.max(1, Math.ceil(totalUsers / pageSize));
  const paginatedUsers = useMemo(() => {
    // If backend already paginated, use filteredUsers directly
    if (userData?.total !== undefined && userData.total > pageSize) {
      return filteredUsers;
    }
    // Otherwise slice client-side
    const start = (page - 1) * pageSize;
    return filteredUsers.slice(start, start + pageSize);
  }, [filteredUsers, page, pageSize, userData?.total]);

  // Handlers
  const handleSearchChange = (val: string) => {
    setSearch(val);
    setPage(1);
  };

  const handleRoleChange = (val: string) => {
    setRole(val);
    setPage(1);
  };

  const handleStatusChange = (val: string) => {
    setStatus(val);
    setPage(1);
  };

  const handleResetFilters = () => {
    setSearch("");
    setRole("");
    setStatus("");
    setPage(1);
  };

  const hasActiveFilters = Boolean(search || role || status);

  // If user is Admin but not Superadmin, display clear Superadmin Privilege Required state
  if (!isSuperadmin) {
    return (
      <div className="space-y-6">
        <div>
          <h1 className="text-2xl font-black tracking-tight text-neutral-900">
            User Management & RBAC
          </h1>
          <p className="text-xs text-neutral-500 mt-1">
            Role-Based Access Control and user administration.
          </p>
        </div>

        <div className="bg-white rounded-2xl border border-primary-100/90 shadow-xs p-8 max-w-2xl mx-auto text-center space-y-5">
          <div className="w-16 h-16 rounded-2xl bg-purple-50 border border-purple-100 flex items-center justify-center text-purple-600 mx-auto shadow-sm">
            <ShieldAlert className="w-8 h-8" />
          </div>

          <div className="space-y-2">
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-purple-100 text-purple-800 border border-purple-200">
              <KeyRound className="w-3.5 h-3.5" />
              Superadmin Privilege Required
            </span>
            <h2 className="text-lg font-black text-neutral-900">
              Access Restricted to Superadministrators
            </h2>
            <p className="text-xs text-neutral-600 max-w-md mx-auto leading-relaxed">
              You are currently signed in as <strong>{currentUser?.username || "Admin"}</strong> ({currentUser?.role}).
              Per RevoFashion security architecture, managing user accounts, modifying RBAC roles, and altering account activation states require <strong>Superadmin</strong> privileges.
            </p>
          </div>

          <div className="p-4 bg-neutral-50 rounded-xl border border-neutral-200/80 text-left text-xs space-y-1.5 max-w-md mx-auto">
            <p className="font-bold text-neutral-800 flex items-center gap-1.5">
              <ShieldCheck className="w-4 h-4 text-primary-600" />
              Pre-Configured Seed Credentials:
            </p>
            <div className="text-[11px] text-neutral-600 space-y-1 pt-1 font-mono">
              <p>Email: <span className="text-primary-700 font-semibold">superadmin@revofashion.com</span></p>
              <p>Password: <span className="text-primary-700 font-semibold">superadmin_password</span></p>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-2">
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={() => router.push("/dashboard")}
              className="text-xs font-semibold h-9 px-4"
            >
              Back to Catalog
            </Button>
            <Button
              type="button"
              size="sm"
              onClick={() => {
                logout();
                router.push("/login");
              }}
              className="bg-primary-600 hover:bg-primary-700 text-white text-xs font-semibold h-9 px-4 gap-1.5 shadow-sm shadow-primary-200/50"
            >
              <LogOut className="w-3.5 h-3.5" />
              Switch Account (Login as Superadmin)
            </Button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-2xl font-black tracking-tight text-neutral-900">
              User Management & RBAC
            </h1>
            <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-purple-50 text-purple-700 border border-purple-200">
              <ShieldCheck className="w-3.5 h-3.5 text-purple-600" />
              Superadmin Portal
            </span>
          </div>
          <p className="text-xs text-neutral-500 mt-1">
            Oversee user accounts, assign system roles (Superadmin, Admin, Customer), and manage account activation states.
          </p>
        </div>
      </div>

      {/* KPI Metrics Summary */}
      <AdminUserMetrics
        users={rawUsers}
        totalCount={totalUsers}
      />

      {/* Filter and Action Toolbar */}
      <AdminUserToolbar
        search={search}
        onSearchChange={handleSearchChange}
        role={role}
        onRoleChange={handleRoleChange}
        status={status}
        onStatusChange={handleStatusChange}
        onAddClick={() => setIsCreateOpen(true)}
        onResetFilters={handleResetFilters}
        hasActiveFilters={hasActiveFilters}
        totalResults={filteredUsers.length}
      />

      {/* Users Data Table */}
      <AdminUserTable
        users={paginatedUsers}
        isLoading={isLoading}
        currentPage={page}
        totalPages={totalPages}
        totalUsers={filteredUsers.length}
        pageSize={pageSize}
        onPageChange={setPage}
        onEdit={(u) => setEditingUser(u)}
        onToggleStatus={(u) => setTogglingUser(u)}
      />

      {/* Modals */}
      <CreateUserModal
        open={isCreateOpen}
        onOpenChange={setIsCreateOpen}
      />

      <EditUserModal
        user={editingUser}
        open={Boolean(editingUser)}
        onOpenChange={(open) => {
          if (!open) setEditingUser(null);
        }}
      />

      <ToggleUserStatusModal
        user={togglingUser}
        open={Boolean(togglingUser)}
        onOpenChange={(open) => {
          if (!open) setTogglingUser(null);
        }}
      />
    </div>
  );
}
