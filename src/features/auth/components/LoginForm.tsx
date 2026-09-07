"use client";

import React, { useState } from "react";
import Link from "next/link";
import { LogIn, Loader2, AlertCircle, Eye, EyeOff, KeyRound, UserCheck, ShieldCheck } from "lucide-react";
import { useLoginMutation } from "../hooks/useLoginMutation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { ApiError } from "@/types/api";

interface FieldErrors {
  identifier?: string;
  password?: string;
}

export function LoginForm() {
  const [identifier, setIdentifier] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [fieldErrors, setFieldErrors] = useState<FieldErrors>({});
  const [formError, setFormError] = useState<string | null>(null);

  const loginMutation = useLoginMutation({
    onError: (error) => {
      if (error instanceof ApiError) {
        if (error.errorCode === "USER_UNAUTHORIZED") {
          setFormError("Invalid email/username or password. Please check your credentials.");
        } else {
          setFormError(error.message);
        }
      } else {
        setFormError(error.message || "An unexpected error occurred. Please try again.");
      }
    },
  });

  // Client-side field validation
  const validateForm = (): boolean => {
    const errors: FieldErrors = {};
    const trimmedId = identifier.trim();

    if (!trimmedId) {
      errors.identifier = "Username or email is required.";
    } else if (trimmedId.includes("@")) {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(trimmedId)) {
        errors.identifier = "Please enter a valid email address.";
      }
    } else if (trimmedId.length < 3) {
      errors.identifier = "Username must be at least 3 characters.";
    }

    if (!password) {
      errors.password = "Password is required.";
    } else if (password.length < 6) {
      errors.password = "Password must be at least 6 characters.";
    }

    setFieldErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setFormError(null);

    if (!validateForm()) {
      return;
    }

    const trimmed = identifier.trim();
    const isEmail = trimmed.includes("@");
    const payload = isEmail
      ? { email: trimmed, password }
      : { username: trimmed, password };

    loginMutation.mutate(payload);
  };

  const handleQuickFill = (user: string, pass: string) => {
    setIdentifier(user);
    setPassword(pass);
    setFieldErrors({});
    setFormError(null);
  };

  return (
    <Card className="border-neutral-200/80 shadow-md">
      <CardHeader className="space-y-1 text-center">
        <CardTitle className="text-xl font-bold tracking-tight text-neutral-900">
          Sign In
        </CardTitle>
        <CardDescription className="text-xs text-neutral-500">
          Enter your credentials to access your account
        </CardDescription>
      </CardHeader>

      <form onSubmit={handleSubmit} noValidate>
        <CardContent className="space-y-4">
          {/* Top Form-level Error Banner */}
          {formError && (
            <div
              role="alert"
              className="flex items-start gap-2.5 rounded-lg bg-red-50 border border-red-200/80 p-3 text-xs text-red-700 font-medium"
            >
              <AlertCircle className="h-4 w-4 shrink-0 text-red-600 mt-0.5" />
              <div className="leading-snug">{formError}</div>
            </div>
          )}

          {/* Identifier Input */}
          <div className="space-y-1.5">
            <Label htmlFor="identifier" required className="text-xs font-semibold text-neutral-700">
              Username or Email
            </Label>
            <Input
              id="identifier"
              name="identifier"
              type="text"
              autoComplete="username"
              placeholder="e.g. alice_smith or alice@example.com"
              value={identifier}
              onChange={(e) => {
                setIdentifier(e.target.value);
                if (fieldErrors.identifier) {
                  setFieldErrors((prev) => ({ ...prev, identifier: undefined }));
                }
                if (formError) setFormError(null);
              }}
              error={Boolean(fieldErrors.identifier)}
              disabled={loginMutation.isPending}
              aria-invalid={Boolean(fieldErrors.identifier)}
              aria-describedby={fieldErrors.identifier ? "identifier-error" : undefined}
              autoFocus
            />
            {fieldErrors.identifier && (
              <p id="identifier-error" className="text-[11px] font-medium text-red-600">
                {fieldErrors.identifier}
              </p>
            )}
          </div>

          {/* Password Input */}
          <div className="space-y-1.5">
            <div className="flex items-center justify-between">
              <Label htmlFor="password" required className="text-xs font-semibold text-neutral-700">
                Password
              </Label>
            </div>
            <div className="relative">
              <Input
                id="password"
                name="password"
                type={showPassword ? "text" : "password"}
                autoComplete="current-password"
                placeholder="••••••••"
                value={password}
                onChange={(e) => {
                  setPassword(e.target.value);
                  if (fieldErrors.password) {
                    setFieldErrors((prev) => ({ ...prev, password: undefined }));
                  }
                  if (formError) setFormError(null);
                }}
                error={Boolean(fieldErrors.password)}
                disabled={loginMutation.isPending}
                aria-invalid={Boolean(fieldErrors.password)}
                aria-describedby={fieldErrors.password ? "password-error" : undefined}
                className="pr-10"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                tabIndex={-1}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-neutral-400 hover:text-neutral-600 transition-colors"
                aria-label={showPassword ? "Hide password" : "Show password"}
              >
                {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
              </button>
            </div>
            {fieldErrors.password && (
              <p id="password-error" className="text-[11px] font-medium text-red-600">
                {fieldErrors.password}
              </p>
            )}
          </div>

          {/* Quick Demo Fill Helper */}
          <div className="pt-2 border-t border-neutral-100">
            <span className="text-[10px] font-bold uppercase tracking-wider text-neutral-400 block mb-2">
              Quick Fill Demo Accounts:
            </span>
            <div className="flex flex-wrap gap-1.5">
              <button
                type="button"
                onClick={() => handleQuickFill("alice_smith", "alice_password")}
                className="inline-flex items-center gap-1 px-2.5 py-1 rounded-md text-[11px] bg-neutral-100 hover:bg-neutral-200 text-neutral-700 font-medium transition-colors"
              >
                <UserCheck className="h-3 w-3 text-neutral-500" />
                Customer (Alice)
              </button>
              <button
                type="button"
                onClick={() => handleQuickFill("admin_user", "admin_password")}
                className="inline-flex items-center gap-1 px-2.5 py-1 rounded-md text-[11px] bg-neutral-100 hover:bg-neutral-200 text-neutral-700 font-medium transition-colors"
              >
                <ShieldCheck className="h-3 w-3 text-neutral-500" />
                Admin
              </button>
              <button
                type="button"
                onClick={() => handleQuickFill("superadmin_user", "superadmin_password")}
                className="inline-flex items-center gap-1 px-2.5 py-1 rounded-md text-[11px] bg-neutral-100 hover:bg-neutral-200 text-neutral-700 font-medium transition-colors"
              >
                <KeyRound className="h-3 w-3 text-neutral-500" />
                Superadmin
              </button>
            </div>
          </div>
        </CardContent>

        <CardFooter className="flex flex-col gap-4">
          <Button
            type="submit"
            className="w-full font-semibold gap-2"
            disabled={loginMutation.isPending}
          >
            {loginMutation.isPending ? (
              <>
                <Loader2 className="h-4 w-4 animate-spin" />
                Signing in...
              </>
            ) : (
              <>
                <LogIn className="h-4 w-4" />
                Sign In
              </>
            )}
          </Button>

          <p className="text-center text-xs text-neutral-500">
            Don&apos;t have an account?{" "}
            <Link
              href="/register"
              className="font-semibold text-neutral-900 underline hover:text-neutral-700 transition-colors"
            >
              Create Account
            </Link>
          </p>
        </CardFooter>
      </form>
    </Card>
  );
}
