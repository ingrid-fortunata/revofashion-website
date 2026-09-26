"use client";

import React, { useState } from "react";
import {
  Dialog,
  DialogPopup,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { useUpdateUserMutation } from "@/features/admin/hooks/useUsersQuery";
import { User, UserRole } from "@/types/auth";
import { Edit2, Loader2, AlertCircle, AlertTriangle, ShieldCheck } from "lucide-react";
import { useAuthStore } from "@/stores/useAuthStore";

interface EditUserModalProps {
  user: User | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

interface FormErrors {
  username?: string;
  email?: string;
}

interface EditUserFormProps {
  user: User;
  onClose: () => void;
}

function EditUserForm({ user, onClose }: EditUserFormProps) {
  const { user: currentUser } = useAuthStore();
  const updateUserMutation = useUpdateUserMutation();

  const [username, setUsername] = useState(user.username || "");
  const [email, setEmail] = useState(user.email || "");
  const [role, setRole] = useState<UserRole>(user.role || "customer");
  const [isActive, setIsActive] = useState(user.is_active ?? true);

  const [errors, setErrors] = useState<FormErrors>({});
  const [generalError, setGeneralError] = useState<string | null>(null);

  const isSelf = currentUser?.id === user.id;

  const validate = (): boolean => {
    const errs: FormErrors = {};
    const trimmedUsername = username.trim();
    const trimmedEmail = email.trim();

    if (!trimmedUsername) {
      errs.username = "Username cannot be empty.";
    } else if (trimmedUsername.length < 3) {
      errs.username = "Username must be at least 3 characters long.";
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!trimmedEmail) {
      errs.email = "Email cannot be empty.";
    } else if (!emailRegex.test(trimmedEmail)) {
      errs.email = "Please enter a valid email address.";
    }

    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setGeneralError(null);

    if (!validate()) return;

    try {
      await updateUserMutation.mutateAsync({
        id: user.id,
        payload: {
          username: username.trim(),
          email: email.trim().toLowerCase(),
          role,
          is_active: isSelf ? true : isActive,
        },
      });

      onClose();
    } catch (err: unknown) {
      const errorObj = err as { status?: number; errorCode?: string; error_code?: string; message?: string };
      const status = errorObj?.status;
      const errorCode = errorObj?.errorCode || errorObj?.error_code;
      if (status === 409 || errorCode === "USER_EMAIL_CONFLICT") {
        setGeneralError("An account with this email address already exists.");
      } else if (errorCode === "USER_NAME_CONFLICT") {
        setGeneralError("This username is already taken. Please choose another.");
      } else {
        setGeneralError(
          errorObj?.message || "Failed to update user account. Please check your inputs."
        );
      }
    }
  };

  const isSubmitting = updateUserMutation.isPending;

  return (
    <DialogPopup className="max-w-lg">
      <DialogHeader>
        <DialogTitle className="flex items-center gap-2 text-lg font-bold text-neutral-900">
          <Edit2 className="w-5 h-5 text-primary-600" />
          Edit User #{user.id}
        </DialogTitle>
        <DialogDescription className="text-xs text-neutral-500">
          Update account information, role authorization, and active status.
        </DialogDescription>
      </DialogHeader>

      {generalError && (
        <div className="flex items-start gap-2 p-3 bg-red-50 border border-red-200 rounded-xl text-xs text-red-700">
          <AlertCircle className="w-4 h-4 text-red-600 flex-shrink-0 mt-0.5" />
          <div className="flex-1 font-medium">{generalError}</div>
        </div>
      )}

      {isSelf && (
        <div className="flex items-start gap-2 p-3 bg-amber-50 border border-amber-200 rounded-xl text-xs text-amber-800">
          <AlertTriangle className="w-4 h-4 text-amber-600 flex-shrink-0 mt-0.5" />
          <div>
            <strong>Current User Session:</strong> You are editing your own user profile. Modifying your role or status cannot be undone from this active session.
          </div>
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-3.5 py-1">
        {/* Username & Email Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <div className="space-y-1">
            <label className="text-xs font-semibold text-neutral-700">
              Username <span className="text-primary-500">*</span>
            </label>
            <input
              type="text"
              value={username}
              onChange={(e) => {
                setUsername(e.target.value);
                if (errors.username) setErrors((prev) => ({ ...prev, username: undefined }));
              }}
              disabled={isSubmitting}
              className="w-full px-3 py-2 text-xs border border-neutral-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500/20 focus:border-primary-500 bg-white"
            />
            {errors.username && (
              <p className="text-[11px] text-red-600 font-medium">{errors.username}</p>
            )}
          </div>

          <div className="space-y-1">
            <label className="text-xs font-semibold text-neutral-700">
              Email Address <span className="text-primary-500">*</span>
            </label>
            <input
              type="email"
              value={email}
              onChange={(e) => {
                setEmail(e.target.value);
                if (errors.email) setErrors((prev) => ({ ...prev, email: undefined }));
              }}
              disabled={isSubmitting}
              className="w-full px-3 py-2 text-xs border border-neutral-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500/20 focus:border-primary-500 bg-white"
            />
            {errors.email && (
              <p className="text-[11px] text-red-600 font-medium">{errors.email}</p>
            )}
          </div>
        </div>

        {/* Role and Permissions */}
        <div className="space-y-1.5 pt-1">
          <label className="text-xs font-semibold text-neutral-700 flex items-center gap-1.5">
            <ShieldCheck className="w-3.5 h-3.5 text-primary-600" />
            Assigned Role
          </label>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
            {[
              {
                value: "customer",
                title: "Customer",
                desc: "Shop & place orders",
              },
              {
                value: "admin",
                title: "Admin",
                desc: "Catalog & orders",
              },
              {
                value: "superadmin",
                title: "Superadmin",
                desc: "Full system & RBAC",
              },
            ].map((opt) => (
              <label
                key={opt.value}
                className={`flex flex-col p-2.5 rounded-lg border cursor-pointer transition-all ${
                  role === opt.value
                    ? "border-primary-600 bg-primary-50/60 ring-1 ring-primary-500/30"
                    : "border-neutral-200 hover:border-neutral-300 bg-white"
                }`}
              >
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-neutral-900">{opt.title}</span>
                  <input
                    type="radio"
                    name="editRole"
                    value={opt.value}
                    checked={role === opt.value}
                    onChange={() => setRole(opt.value as UserRole)}
                    className="text-primary-600 focus:ring-primary-500 h-3.5 w-3.5"
                  />
                </div>
                <span className="text-[10px] text-neutral-500 mt-0.5">{opt.desc}</span>
              </label>
            ))}
          </div>
        </div>

        {/* Account Status Toggle */}
        <div className="flex items-center justify-between pt-2 border-t border-neutral-100">
          <div className="flex items-center gap-2">
            <input
              type="checkbox"
              id="editUserActiveToggle"
              checked={isActive}
              disabled={isSelf || isSubmitting}
              onChange={(e) => setIsActive(e.target.checked)}
              className="rounded border-neutral-300 text-primary-600 focus:ring-primary-500 h-4 w-4 cursor-pointer disabled:cursor-not-allowed"
            />
            <label
              htmlFor="editUserActiveToggle"
              className={`text-xs font-semibold ${
                isSelf ? "text-neutral-400 cursor-not-allowed" : "text-neutral-700 cursor-pointer"
              }`}
            >
              Active Account Status
            </label>
          </div>
          {isSelf && (
            <span className="text-[11px] text-neutral-400">
              (Cannot disable current session)
            </span>
          )}
        </div>

        <DialogFooter className="pt-3 border-t border-neutral-100 flex items-center justify-end gap-2">
          <Button
            type="button"
            variant="outline"
            size="sm"
            disabled={isSubmitting}
            onClick={onClose}
            className="text-xs font-semibold h-9 px-4"
          >
            Cancel
          </Button>
          <Button
            type="submit"
            size="sm"
            disabled={isSubmitting}
            className="bg-primary-600 hover:bg-primary-700 text-white text-xs font-semibold h-9 px-4 gap-1.5 shadow-sm shadow-primary-200/50"
          >
            {isSubmitting && <Loader2 className="w-3.5 h-3.5 animate-spin" />}
            Save Changes
          </Button>
        </DialogFooter>
      </form>
    </DialogPopup>
  );
}

export function EditUserModal({
  user,
  open,
  onOpenChange,
}: EditUserModalProps) {
  if (!user) return null;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <EditUserForm key={user.id} user={user} onClose={() => onOpenChange(false)} />
    </Dialog>
  );
}
