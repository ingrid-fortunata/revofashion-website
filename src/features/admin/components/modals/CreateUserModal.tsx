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
import { useCreateUserMutation } from "@/features/admin/hooks/useUsersQuery";
import { UserRole } from "@/types/auth";
import { UserPlus, Loader2, AlertCircle, Eye, EyeOff, ShieldCheck } from "lucide-react";

interface CreateUserModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  trigger?: React.ReactNode;
}

interface FormErrors {
  username?: string;
  email?: string;
  password?: string;
  confirmPassword?: string;
}

export function CreateUserModal({
  open,
  onOpenChange,
  trigger,
}: CreateUserModalProps) {
  const createUserMutation = useCreateUserMutation();

  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [role, setRole] = useState<UserRole>("customer");
  const [isActive, setIsActive] = useState(true);

  const [showPassword, setShowPassword] = useState(false);
  const [errors, setErrors] = useState<FormErrors>({});
  const [generalError, setGeneralError] = useState<string | null>(null);

  const resetForm = () => {
    setUsername("");
    setEmail("");
    setPassword("");
    setConfirmPassword("");
    setRole("customer");
    setIsActive(true);
    setErrors({});
    setGeneralError(null);
  };

  const validate = (): boolean => {
    const errs: FormErrors = {};
    const trimmedUsername = username.trim();
    const trimmedEmail = email.trim();

    if (!trimmedUsername) {
      errs.username = "Username is required.";
    } else if (trimmedUsername.length < 3) {
      errs.username = "Username must be at least 3 characters long.";
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!trimmedEmail) {
      errs.email = "Email address is required.";
    } else if (!emailRegex.test(trimmedEmail)) {
      errs.email = "Please enter a valid email address.";
    }

    if (!password) {
      errs.password = "Password is required.";
    } else if (password.length < 8) {
      errs.password = "Password must be at least 8 characters long.";
    }

    if (password !== confirmPassword) {
      errs.confirmPassword = "Passwords do not match.";
    }

    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setGeneralError(null);

    if (!validate()) return;

    try {
      await createUserMutation.mutateAsync({
        username: username.trim(),
        email: email.trim().toLowerCase(),
        password,
        role,
        is_active: isActive,
      });

      resetForm();
      onOpenChange(false);
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
          errorObj?.message || "Failed to create user. Please check the form inputs."
        );
      }
    }
  };

  const isSubmitting = createUserMutation.isPending;

  return (
    <Dialog
      open={open}
      onOpenChange={(next) => {
        if (!isSubmitting) {
          onOpenChange(next);
          if (!next) resetForm();
        }
      }}
    >
      {trigger}
      <DialogPopup className="max-w-lg">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2 text-lg font-bold text-neutral-900">
            <UserPlus className="w-5 h-5 text-primary-600" />
            Add User Account
          </DialogTitle>
          <DialogDescription className="text-xs text-neutral-500">
            Create a new user account with assigned system role and permission privileges.
          </DialogDescription>
        </DialogHeader>

        {generalError && (
          <div className="flex items-start gap-2 p-3 bg-red-50 border border-red-200 rounded-xl text-xs text-red-700">
            <AlertCircle className="w-4 h-4 text-red-600 flex-shrink-0 mt-0.5" />
            <div className="flex-1 font-medium">{generalError}</div>
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
                placeholder="e.g. john_doe"
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
                placeholder="e.g. john@example.com"
                disabled={isSubmitting}
                className="w-full px-3 py-2 text-xs border border-neutral-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500/20 focus:border-primary-500 bg-white"
              />
              {errors.email && (
                <p className="text-[11px] text-red-600 font-medium">{errors.email}</p>
              )}
            </div>
          </div>

          {/* Password & Confirm Password Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div className="space-y-1">
              <label className="text-xs font-semibold text-neutral-700">
                Password <span className="text-primary-500">*</span>
              </label>
              <div className="relative">
                <input
                  type={showPassword ? "text" : "password"}
                  value={password}
                  onChange={(e) => {
                    setPassword(e.target.value);
                    if (errors.password) setErrors((prev) => ({ ...prev, password: undefined }));
                  }}
                  placeholder="Min 8 characters"
                  disabled={isSubmitting}
                  className="w-full pl-3 pr-9 py-2 text-xs border border-neutral-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500/20 focus:border-primary-500 bg-white"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-2.5 top-1/2 -translate-y-1/2 text-neutral-400 hover:text-neutral-700 cursor-pointer"
                  tabIndex={-1}
                >
                  {showPassword ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
                </button>
              </div>
              {errors.password && (
                <p className="text-[11px] text-red-600 font-medium">{errors.password}</p>
              )}
            </div>

            <div className="space-y-1">
              <label className="text-xs font-semibold text-neutral-700">
                Confirm Password <span className="text-primary-500">*</span>
              </label>
              <input
                type={showPassword ? "text" : "password"}
                value={confirmPassword}
                onChange={(e) => {
                  setConfirmPassword(e.target.value);
                  if (errors.confirmPassword)
                    setErrors((prev) => ({ ...prev, confirmPassword: undefined }));
                }}
                placeholder="Repeat password"
                disabled={isSubmitting}
                className="w-full px-3 py-2 text-xs border border-neutral-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500/20 focus:border-primary-500 bg-white"
              />
              {errors.confirmPassword && (
                <p className="text-[11px] text-red-600 font-medium">{errors.confirmPassword}</p>
              )}
            </div>
          </div>

          {/* Role and Permissions */}
          <div className="space-y-1.5 pt-1">
            <label className="text-xs font-semibold text-neutral-700 flex items-center gap-1.5">
              <ShieldCheck className="w-3.5 h-3.5 text-primary-600" />
              Role & Permissions
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
                      name="role"
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
          <div className="flex items-center gap-2 pt-2 border-t border-neutral-100">
            <input
              type="checkbox"
              id="createUserActiveToggle"
              checked={isActive}
              onChange={(e) => setIsActive(e.target.checked)}
              disabled={isSubmitting}
              className="rounded border-neutral-300 text-primary-600 focus:ring-primary-500 h-4 w-4 cursor-pointer"
            />
            <label
              htmlFor="createUserActiveToggle"
              className="text-xs font-semibold text-neutral-700 cursor-pointer"
            >
              Account is Active (User can immediately log in)
            </label>
          </div>

          <DialogFooter className="pt-3 border-t border-neutral-100 flex items-center justify-end gap-2">
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
              type="submit"
              size="sm"
              disabled={isSubmitting}
              className="bg-primary-600 hover:bg-primary-700 text-white text-xs font-semibold h-9 px-4 gap-1.5 shadow-sm shadow-primary-200/50"
            >
              {isSubmitting && <Loader2 className="w-3.5 h-3.5 animate-spin" />}
              Create User
            </Button>
          </DialogFooter>
        </form>
      </DialogPopup>
    </Dialog>
  );
}
