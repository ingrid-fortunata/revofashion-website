"use client";

import React from "react";
import dayjs from "dayjs";
import {
  Table,
  TableHeader,
  TableBody,
  TableHead,
  TableRow,
  TableCell,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { User } from "@/types/auth";
import {
  Edit,
  UserCheck,
  UserX,
  Users,
  ShieldCheck,
  Shield,
  User as UserIcon,
} from "lucide-react";
import { EmptyState, TableSkeleton, Pagination } from "@/components/common";
import { useAuthStore } from "@/stores/useAuthStore";

interface AdminUserTableProps {
  users: User[];
  isLoading: boolean;
  currentPage: number;
  totalPages: number;
  totalUsers: number;
  pageSize: number;
  onPageChange: (page: number) => void;
  onEdit: (user: User) => void;
  onToggleStatus: (user: User) => void;
}

export function AdminUserTable({
  users,
  isLoading,
  currentPage,
  totalPages,
  totalUsers,
  pageSize,
  onPageChange,
  onEdit,
  onToggleStatus,
}: AdminUserTableProps) {
  const { user: currentUser } = useAuthStore();

  if (isLoading) {
    return <TableSkeleton rows={6} />;
  }

  if (users.length === 0) {
    return (
      <EmptyState
        icon={Users}
        title="No Users Found"
        description="No user accounts match your search or filter criteria. Try adjusting the query or role filter."
      />
    );
  }

  return (
    <div className="bg-white rounded-xl border border-primary-100/80 shadow-xs shadow-primary-100/20 overflow-hidden">
      <div className="overflow-x-auto">
        <Table>
          <TableHeader className="bg-primary-50/40 border-b border-primary-100/80">
            <TableRow className="hover:bg-transparent">
              <TableHead className="w-[300px] text-xs font-bold text-neutral-600 uppercase tracking-wider">
                User Account
              </TableHead>
              <TableHead className="text-xs font-bold text-neutral-600 uppercase tracking-wider">
                Role & Privileges
              </TableHead>
              <TableHead className="text-xs font-bold text-neutral-600 uppercase tracking-wider">
                Account Status
              </TableHead>
              <TableHead className="text-xs font-bold text-neutral-600 uppercase tracking-wider">
                Registered Date
              </TableHead>
              <TableHead className="text-right text-xs font-bold text-neutral-600 uppercase tracking-wider">
                Actions
              </TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {users.map((u) => {
              const isSelf = currentUser?.id === u.id;
              const initials = (u.username || "U").substring(0, 2).toUpperCase();

              return (
                <TableRow
                  key={u.id}
                  className="hover:bg-primary-50/20 transition-colors"
                >
                  {/* User Details */}
                  <TableCell className="py-3">
                    <div className="flex items-center gap-3">
                      <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-gradient-to-tr from-primary-600 via-primary-500 to-primary-400 text-xs font-bold text-white shadow-xs shadow-primary-200">
                        {initials}
                      </div>
                      <div className="flex flex-col min-w-0">
                        <div className="flex items-center gap-1.5">
                          <span className="font-bold text-xs text-neutral-900 truncate">
                            {u.username}
                          </span>
                          {isSelf && (
                            <span className="text-[10px] font-bold px-1.5 py-0.2 rounded-full bg-primary-100 text-primary-800 border border-primary-200">
                              You
                            </span>
                          )}
                        </div>
                        <span className="text-[11px] text-neutral-400 truncate">
                          {u.email}
                        </span>
                        <span className="text-[10px] text-neutral-400 mt-0.5">
                          ID: #{u.id}
                        </span>
                      </div>
                    </div>
                  </TableCell>

                  {/* Role */}
                  <TableCell className="py-3">
                    {u.role === "superadmin" ? (
                      <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold bg-purple-50 text-purple-700 border border-purple-200/80 shadow-xs">
                        <ShieldCheck className="w-3.5 h-3.5 text-purple-600" />
                        Superadmin
                      </span>
                    ) : u.role === "admin" ? (
                      <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold bg-blue-50 text-blue-700 border border-blue-200/80 shadow-xs">
                        <Shield className="w-3.5 h-3.5 text-blue-600" />
                        Admin
                      </span>
                    ) : (
                      <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium bg-neutral-100 text-neutral-700 border border-neutral-200">
                        <UserIcon className="w-3.5 h-3.5 text-neutral-500" />
                        Customer
                      </span>
                    )}
                  </TableCell>

                  {/* Account Status */}
                  <TableCell className="py-3">
                    {u.is_active ? (
                      <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold bg-emerald-50 text-emerald-700 border border-emerald-200/80">
                        <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                        Active
                      </span>
                    ) : (
                      <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold bg-rose-50 text-rose-700 border border-rose-200/80">
                        <span className="w-1.5 h-1.5 rounded-full bg-rose-500" />
                        Deactivated
                      </span>
                    )}
                  </TableCell>

                  {/* Created Date */}
                  <TableCell className="py-3 text-xs text-neutral-500">
                    {u.created_at ? (
                      <span title={u.created_at}>
                        {dayjs(u.created_at).format("MMM D, YYYY")}
                        <span className="block text-[10px] text-neutral-400">
                          {dayjs(u.created_at).format("HH:mm:ss")}
                        </span>
                      </span>
                    ) : (
                      <span className="text-neutral-400">—</span>
                    )}
                  </TableCell>

                  {/* Action Buttons */}
                  <TableCell className="py-3 text-right">
                    <div className="flex items-center justify-end gap-1.5">
                      <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        onClick={() => onEdit(u)}
                        data-testid={`edit-user-${u.id}`}
                        className="h-8 px-2.5 text-xs text-neutral-600 hover:text-primary-700 hover:bg-primary-50 gap-1 rounded-lg"
                        title="Edit user details and role"
                      >
                        <Edit className="w-3.5 h-3.5" />
                        <span className="hidden sm:inline">Edit</span>
                      </Button>

                      <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        disabled={isSelf}
                        onClick={() => onToggleStatus(u)}
                        data-testid={`toggle-status-user-${u.id}`}
                        className={`h-8 px-2.5 text-xs gap-1 rounded-lg ${
                          u.is_active
                            ? "text-rose-600 hover:text-rose-700 hover:bg-rose-50"
                            : "text-emerald-700 hover:text-emerald-800 hover:bg-emerald-50"
                        } ${isSelf ? "opacity-40 cursor-not-allowed" : ""}`}
                        title={
                          isSelf
                            ? "Cannot deactivate your own active session"
                            : u.is_active
                            ? "Deactivate user account"
                            : "Activate user account"
                        }
                      >
                        {u.is_active ? (
                          <>
                            <UserX className="w-3.5 h-3.5" />
                            <span className="hidden sm:inline">Deactivate</span>
                          </>
                        ) : (
                          <>
                            <UserCheck className="w-3.5 h-3.5" />
                            <span className="hidden sm:inline">Activate</span>
                          </>
                        )}
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              );
            })}
          </TableBody>
        </Table>
      </div>

      {/* Pagination Controls */}
      <Pagination
        page={currentPage}
        pages={totalPages}
        onPageChange={onPageChange}
        totalCount={totalUsers}
        pageSize={pageSize}
        itemName="users"
        variant="table"
      />
    </div>
  );
}
