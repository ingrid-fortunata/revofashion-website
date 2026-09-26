"use client";

import React from "react";
import {
  Dialog,
  DialogPopup,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { useToggleUserStatusMutation } from "@/features/admin/hooks/useUsersQuery";
import { User } from "@/types/auth";
import { UserX, UserCheck, Loader2, AlertTriangle } from "lucide-react";

interface ToggleUserStatusModalProps {
  user: User | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function ToggleUserStatusModal({
  user,
  open,
  onOpenChange,
}: ToggleUserStatusModalProps) {
  const toggleMutation = useToggleUserStatusMutation();

  if (!user) return null;

  const nextActive = !user.is_active;
  const isDeactivating = user.is_active;

  const handleConfirm = async () => {
    try {
      await toggleMutation.mutateAsync({
        id: user.id,
        isActive: nextActive,
        username: user.username,
      });
      onOpenChange(false);
    } catch {
      // Handled in mutation onError
    }
  };

  const isSubmitting = toggleMutation.isPending;

  return (
    <Dialog
      open={open}
      onOpenChange={(next) => {
        if (!isSubmitting) {
          onOpenChange(next);
        }
      }}
    >
      <DialogPopup className="max-w-md">
        <DialogHeader>
          <div
            className={`w-11 h-11 rounded-full flex items-center justify-center mb-1.5 ${
              isDeactivating ? "bg-rose-50 text-rose-600" : "bg-emerald-50 text-emerald-600"
            }`}
          >
            {isDeactivating ? (
              <UserX className="w-5 h-5" />
            ) : (
              <UserCheck className="w-5 h-5" />
            )}
          </div>
          <DialogTitle className="text-base font-bold text-neutral-900">
            {isDeactivating ? "Deactivate User Account" : "Activate User Account"}
          </DialogTitle>
          <DialogDescription className="text-xs text-neutral-500">
            {isDeactivating
              ? `Are you sure you want to deactivate ${user.username}'s account?`
              : `Are you sure you want to reactivate ${user.username}'s account?`}
          </DialogDescription>
        </DialogHeader>

        <div className="p-3.5 bg-neutral-50 border border-neutral-200/80 rounded-xl space-y-2 text-xs">
          <div className="flex justify-between items-center text-neutral-600">
            <span>Username:</span>
            <strong className="text-neutral-900">{user.username}</strong>
          </div>
          <div className="flex justify-between items-center text-neutral-600">
            <span>Email:</span>
            <strong className="text-neutral-900">{user.email}</strong>
          </div>
          <div className="flex justify-between items-center text-neutral-600">
            <span>Assigned Role:</span>
            <strong className="text-neutral-900 capitalize">{user.role}</strong>
          </div>
        </div>

        {isDeactivating ? (
          <div className="flex items-start gap-2 p-3 bg-amber-50 border border-amber-200 rounded-xl text-xs text-amber-800">
            <AlertTriangle className="w-4 h-4 text-amber-600 flex-shrink-0 mt-0.5" />
            <div>
              <strong>Consequences:</strong> The user will be immediately blocked from logging in, accessing protected customer pages, and placing new orders. Existing order history will remain preserved.
            </div>
          </div>
        ) : (
          <div className="flex items-start gap-2 p-3 bg-emerald-50 border border-emerald-200 rounded-xl text-xs text-emerald-800">
            <UserCheck className="w-4 h-4 text-emerald-600 flex-shrink-0 mt-0.5" />
            <div>
              <strong>Reactivation:</strong> The user will regain immediate access to log in with their current credentials and browse/shop.
            </div>
          </div>
        )}

        <DialogFooter className="pt-2 border-t border-neutral-100 flex items-center justify-end gap-2">
          <Button
            type="button"
            variant="outline"
            size="sm"
            disabled={isSubmitting}
            onClick={() => onOpenChange(false)}
            className="text-xs font-semibold h-9 px-4"
          >
            Cancel
          </Button>
          <Button
            type="button"
            size="sm"
            disabled={isSubmitting}
            onClick={handleConfirm}
            className={`text-white text-xs font-semibold h-9 px-4 gap-1.5 shadow-sm ${
              isDeactivating
                ? "bg-rose-600 hover:bg-rose-700 shadow-rose-200/50"
                : "bg-emerald-600 hover:bg-emerald-700 shadow-emerald-200/50"
            }`}
          >
            {isSubmitting && <Loader2 className="w-3.5 h-3.5 animate-spin" />}
            {isDeactivating ? "Deactivate Account" : "Activate Account"}
          </Button>
        </DialogFooter>
      </DialogPopup>
    </Dialog>
  );
}
