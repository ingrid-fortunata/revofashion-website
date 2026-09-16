"use client";

import React, { useState } from "react";
import { User, Mail, Save, RotateCcw, Loader2, Edit3 } from "lucide-react";
import { User as UserType } from "@/types/auth";
import { useUpdateProfileMutation } from "../hooks/useUpdateProfileMutation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

interface ProfileEditFormProps {
  user: UserType;
}

interface FieldErrors {
  username?: string;
  email?: string;
}

export function ProfileEditForm({ user }: ProfileEditFormProps) {
  const [username, setUsername] = useState(user.username);
  const [email, setEmail] = useState(user.email);
  const [fieldErrors, setFieldErrors] = useState<FieldErrors>({});

  const updateMutation = useUpdateProfileMutation(user.id);


  const isDirty =
    username.trim() !== user.username || email.trim() !== user.email;

  const validateForm = (): boolean => {
    const errors: FieldErrors = {};
    const trimmedUsername = username.trim();
    const trimmedEmail = email.trim();

    // 1. Username validation
    if (!trimmedUsername) {
      errors.username = "Username is required.";
    } else if (/\s/.test(trimmedUsername)) {
      errors.username = "Username cannot contain spaces.";
    } else if (trimmedUsername.length < 3 || trimmedUsername.length > 50) {
      errors.username = "Username must be between 3 and 50 characters.";
    }

    // 2. Email validation
    if (!trimmedEmail) {
      errors.email = "Email is required.";
    } else {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(trimmedEmail)) {
        errors.email = "Please enter a valid email address.";
      }
    }

    setFieldErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleReset = () => {
    setUsername(user.username);
    setEmail(user.email);
    setFieldErrors({});
  };

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    const payload: { username?: string; email?: string } = {};
    const trimmedUsername = username.trim();
    const trimmedEmail = email.trim();

    if (trimmedUsername !== user.username) {
      payload.username = trimmedUsername;
    }
    if (trimmedEmail !== user.email) {
      payload.email = trimmedEmail;
    }

    if (Object.keys(payload).length > 0) {
      updateMutation.mutate(payload);
    }
  };

  return (
    <Card className="backdrop-blur-xl bg-white/95 border border-primary-100/90 shadow-xl shadow-primary-950/5 rounded-2xl">
      <CardHeader className="border-b border-neutral-100 pb-5">
        <div className="flex items-center gap-2 text-primary-600 font-semibold text-xs tracking-wider uppercase">
          <Edit3 className="h-3.5 w-3.5" />
          <span>Account Settings</span>
        </div>
        <CardTitle className="text-xl font-bold tracking-tight text-neutral-900 mt-1">
          Edit Profile Details
        </CardTitle>
        <CardDescription className="text-sm text-neutral-500">
          Update your account username and primary email address.
        </CardDescription>
      </CardHeader>

      <form onSubmit={handleSubmit} noValidate>
        <CardContent className="space-y-6 pt-6">
          {/* Username Field */}
          <div className="space-y-2">
            <Label
              htmlFor="username"
              className="text-xs font-semibold text-neutral-700 flex items-center gap-1.5"
            >
              <User className="h-3.5 w-3.5 text-primary-500" />
              Username
            </Label>
            <div className="relative">
              <Input
                id="username"
                name="username"
                type="text"
                value={username}
                onChange={(e) => {
                  setUsername(e.target.value);
                  if (fieldErrors.username) {
                    setFieldErrors((prev) => ({ ...prev, username: undefined }));
                  }
                }}
                placeholder="Your username"
                aria-invalid={Boolean(fieldErrors.username)}
                aria-describedby={fieldErrors.username ? "username-error" : undefined}
                className={`bg-neutral-50/60 focus:bg-white text-sm transition-all ${
                  fieldErrors.username
                    ? "border-red-500 focus-visible:ring-red-400"
                    : "border-neutral-200 focus-visible:ring-primary-400"
                }`}
              />
            </div>
            {fieldErrors.username && (
              <p
                id="username-error"
                className="text-[11px] font-medium text-red-600 animate-in fade-in"
              >
                {fieldErrors.username}
              </p>
            )}
            <p className="text-[11px] text-neutral-400">
              Unique handle between 3 and 50 characters. No spaces allowed.
            </p>
          </div>

          {/* Email Field */}
          <div className="space-y-2">
            <Label
              htmlFor="email"
              className="text-xs font-semibold text-neutral-700 flex items-center gap-1.5"
            >
              <Mail className="h-3.5 w-3.5 text-primary-500" />
              Email Address
            </Label>
            <div className="relative">
              <Input
                id="email"
                name="email"
                type="email"
                value={email}
                onChange={(e) => {
                  setEmail(e.target.value);
                  if (fieldErrors.email) {
                    setFieldErrors((prev) => ({ ...prev, email: undefined }));
                  }
                }}
                placeholder="name@example.com"
                aria-invalid={Boolean(fieldErrors.email)}
                aria-describedby={fieldErrors.email ? "email-error" : undefined}
                className={`bg-neutral-50/60 focus:bg-white text-sm transition-all ${
                  fieldErrors.email
                    ? "border-red-500 focus-visible:ring-red-400"
                    : "border-neutral-200 focus-visible:ring-primary-400"
                }`}
              />
            </div>
            {fieldErrors.email && (
              <p
                id="email-error"
                className="text-[11px] font-medium text-red-600 animate-in fade-in"
              >
                {fieldErrors.email}
              </p>
            )}
            <p className="text-[11px] text-neutral-400">
              Used for account notifications and order receipts.
            </p>
          </div>
        </CardContent>

        <CardFooter className="flex flex-col sm:flex-row items-center justify-between gap-3 border-t border-neutral-100 bg-neutral-50/40 px-6 py-4 rounded-b-2xl">
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={handleReset}
            disabled={!isDirty || updateMutation.isPending}
            className="w-full sm:w-auto text-xs font-medium text-neutral-600 gap-1.5 order-2 sm:order-1"
          >
            <RotateCcw className="h-3.5 w-3.5 text-neutral-400" />
            Reset Changes
          </Button>

          <Button
            type="submit"
            size="sm"
            disabled={!isDirty || updateMutation.isPending}
            className="w-full sm:w-auto bg-primary-600 hover:bg-primary-700 text-white shadow-md shadow-primary-300/40 text-xs font-semibold gap-1.5 order-1 sm:order-2 transition-all"
          >
            {updateMutation.isPending ? (
              <>
                <Loader2 className="h-3.5 w-3.5 animate-spin" />
                Saving Changes...
              </>
            ) : (
              <>
                <Save className="h-3.5 w-3.5" />
                Save Changes
              </>
            )}
          </Button>
        </CardFooter>
      </form>
    </Card>
  );
}
