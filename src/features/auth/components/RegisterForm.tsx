"use client";

import React, { useState } from "react";
import Link from "next/link";
import { UserPlus, Loader2, Eye, EyeOff } from "lucide-react";
import { useRegisterMutation } from "../hooks/useRegisterMutation";
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

interface FieldErrors {
  username?: string;
  email?: string;
  password?: string;
  confirmPassword?: string;
}

export function RegisterForm() {
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [fieldErrors, setFieldErrors] = useState<FieldErrors>({});

  // Error notifications (toasts) are automatically handled by the API client interceptor
  const registerMutation = useRegisterMutation();

  // Client-side field validation before sending request
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

    // 3. Password validation (min 8 characters)
    if (!password) {
      errors.password = "Password is required.";
    } else if (password.length < 8) {
      errors.password = "Password must be at least 8 characters.";
    }

    // 4. Confirm Password validation
    if (!confirmPassword) {
      errors.confirmPassword = "Please confirm your password.";
    } else if (confirmPassword !== password) {
      errors.confirmPassword = "Passwords do not match.";
    }

    setFieldErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    registerMutation.mutate({
      username: username.trim(),
      email: email.trim(),
      password,
    });
  };

  return (
    <Card className="backdrop-blur-xl bg-white/95 border border-white/90 shadow-2xl shadow-primary-950/10 rounded-2xl">
      <CardHeader className="space-y-1 text-center">
        <CardTitle className="text-xl font-bold tracking-tight text-neutral-900">
          Create an Account
        </CardTitle>
        <CardDescription className="text-xs text-neutral-500">
          Sign up to begin ordering your fashion pieces
        </CardDescription>
      </CardHeader>

      <form onSubmit={handleSubmit} noValidate>
        <CardContent className="space-y-4">
          {/* Username Input */}
          <div className="space-y-1.5">
            <Label
              htmlFor="username"
              required
              className="text-xs font-semibold text-neutral-700"
            >
              Username
            </Label>
            <Input
              id="username"
              name="username"
              type="text"
              autoComplete="username"
              placeholder="e.g. alice_smith"
              value={username}
              onChange={(e) => {
                setUsername(e.target.value);
                if (fieldErrors.username) {
                  setFieldErrors((prev) => ({
                    ...prev,
                    username: undefined,
                  }));
                }
              }}
              error={Boolean(fieldErrors.username)}
              disabled={registerMutation.isPending}
              aria-invalid={Boolean(fieldErrors.username)}
              aria-describedby={
                fieldErrors.username ? "username-error" : undefined
              }
              autoFocus
            />
            {fieldErrors.username && (
              <p
                id="username-error"
                className="text-[11px] font-medium text-red-600"
              >
                {fieldErrors.username}
              </p>
            )}
          </div>

          {/* Email Input */}
          <div className="space-y-1.5">
            <Label
              htmlFor="email"
              required
              className="text-xs font-semibold text-neutral-700"
            >
              Email Address
            </Label>
            <Input
              id="email"
              name="email"
              type="email"
              autoComplete="email"
              placeholder="e.g. alice@example.com"
              value={email}
              onChange={(e) => {
                setEmail(e.target.value);
                if (fieldErrors.email) {
                  setFieldErrors((prev) => ({
                    ...prev,
                    email: undefined,
                  }));
                }
              }}
              error={Boolean(fieldErrors.email)}
              disabled={registerMutation.isPending}
              aria-invalid={Boolean(fieldErrors.email)}
              aria-describedby={fieldErrors.email ? "email-error" : undefined}
            />
            {fieldErrors.email && (
              <p
                id="email-error"
                className="text-[11px] font-medium text-red-600"
              >
                {fieldErrors.email}
              </p>
            )}
          </div>

          {/* Password Input */}
          <div className="space-y-1.5">
            <Label
              htmlFor="password"
              required
              className="text-xs font-semibold text-neutral-700"
            >
              Password
            </Label>
            <div className="relative">
              <Input
                id="password"
                name="password"
                type={showPassword ? "text" : "password"}
                autoComplete="new-password"
                placeholder="At least 8 characters"
                value={password}
                onChange={(e) => {
                  setPassword(e.target.value);
                  if (fieldErrors.password) {
                    setFieldErrors((prev) => ({
                      ...prev,
                      password: undefined,
                    }));
                  }
                }}
                error={Boolean(fieldErrors.password)}
                disabled={registerMutation.isPending}
                aria-invalid={Boolean(fieldErrors.password)}
                aria-describedby={
                  fieldErrors.password ? "password-error" : undefined
                }
                className="pr-10"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                tabIndex={-1}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-neutral-400 hover:text-neutral-600 transition-colors"
                aria-label={showPassword ? "Hide password" : "Show password"}
              >
                {showPassword ? (
                  <EyeOff className="h-4 w-4" />
                ) : (
                  <Eye className="h-4 w-4" />
                )}
              </button>
            </div>
            {fieldErrors.password && (
              <p
                id="password-error"
                className="text-[11px] font-medium text-red-600"
              >
                {fieldErrors.password}
              </p>
            )}
          </div>

          {/* Confirm Password Input */}
          <div className="space-y-1.5">
            <Label
              htmlFor="confirmPassword"
              required
              className="text-xs font-semibold text-neutral-700"
            >
              Confirm Password
            </Label>
            <div className="relative">
              <Input
                id="confirmPassword"
                name="confirmPassword"
                type={showConfirmPassword ? "text" : "password"}
                autoComplete="new-password"
                placeholder="Re-enter your password"
                value={confirmPassword}
                onChange={(e) => {
                  setConfirmPassword(e.target.value);
                  if (fieldErrors.confirmPassword) {
                    setFieldErrors((prev) => ({
                      ...prev,
                      confirmPassword: undefined,
                    }));
                  }
                }}
                error={Boolean(fieldErrors.confirmPassword)}
                disabled={registerMutation.isPending}
                aria-invalid={Boolean(fieldErrors.confirmPassword)}
                aria-describedby={
                  fieldErrors.confirmPassword
                    ? "confirmPassword-error"
                    : undefined
                }
                className="pr-10"
              />
              <button
                type="button"
                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                tabIndex={-1}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-neutral-400 hover:text-neutral-600 transition-colors"
                aria-label={
                  showConfirmPassword
                    ? "Hide confirm password"
                    : "Show confirm password"
                }
              >
                {showConfirmPassword ? (
                  <EyeOff className="h-4 w-4" />
                ) : (
                  <Eye className="h-4 w-4" />
                )}
              </button>
            </div>
            {fieldErrors.confirmPassword && (
              <p
                id="confirmPassword-error"
                className="text-[11px] font-medium text-red-600"
              >
                {fieldErrors.confirmPassword}
              </p>
            )}
          </div>
        </CardContent>

        <CardFooter className="flex flex-col gap-4">
          <Button
            type="submit"
            className="w-full font-semibold gap-2 bg-primary-600 hover:bg-primary-700 text-white shadow-md shadow-primary-300/40 transition-all hover:scale-[1.01]"
            disabled={registerMutation.isPending}
          >
            {registerMutation.isPending ? (
              <>
                <Loader2 className="h-4 w-4 animate-spin" />
                Creating account...
              </>
            ) : (
              <>
                <UserPlus className="h-4 w-4" />
                Create Account
              </>
            )}
          </Button>

          <p className="text-center text-xs text-neutral-500">
            Already have an account?{" "}
            <Link
              href="/login"
              className="font-semibold text-primary-700 underline hover:text-primary-800 transition-colors"
            >
              Sign In
            </Link>
          </p>
        </CardFooter>
      </form>
    </Card>
  );
}
