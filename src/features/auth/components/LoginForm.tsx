"use client";

import React, { useState } from "react";
import Link from "next/link";
import { LogIn, Loader2, Eye, EyeOff } from "lucide-react";
import { useLoginMutation } from "../hooks/useLoginMutation";
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
  identifier?: string;
  password?: string;
}

export function LoginForm() {
  const [identifier, setIdentifier] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [fieldErrors, setFieldErrors] = useState<FieldErrors>({});

  // Error notifications (toasts) are automatically caught and translated by the API client interceptor
  const loginMutation = useLoginMutation();

  // Client-side field validation before sending request
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

  return (
    <Card className="backdrop-blur-xl bg-white/95 border border-white/90 shadow-2xl shadow-primary-950/10 rounded-2xl">
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
          {/* Identifier Input */}
          <div className="space-y-1.5">
            <Label
              htmlFor="identifier"
              required
              className="text-xs font-semibold text-neutral-700"
            >
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
                  setFieldErrors((prev) => ({
                    ...prev,
                    identifier: undefined,
                  }));
                }
              }}
              error={Boolean(fieldErrors.identifier)}
              disabled={loginMutation.isPending}
              aria-invalid={Boolean(fieldErrors.identifier)}
              aria-describedby={
                fieldErrors.identifier ? "identifier-error" : undefined
              }
              autoFocus
            />
            {fieldErrors.identifier && (
              <p
                id="identifier-error"
                className="text-[11px] font-medium text-red-600"
              >
                {fieldErrors.identifier}
              </p>
            )}
          </div>

          {/* Password Input */}
          <div className="space-y-1.5">
            <div className="flex items-center justify-between">
              <Label
                htmlFor="password"
                required
                className="text-xs font-semibold text-neutral-700"
              >
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
                    setFieldErrors((prev) => ({
                      ...prev,
                      password: undefined,
                    }));
                  }
                }}
                error={Boolean(fieldErrors.password)}
                disabled={loginMutation.isPending}
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


        </CardContent>

        <CardFooter className="flex flex-col gap-4">
          <Button
            type="submit"
            className="w-full font-semibold gap-2 bg-primary-600 hover:bg-primary-700 text-white shadow-md shadow-primary-300/40 transition-all hover:scale-[1.01]"
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
              className="font-semibold text-primary-700 underline hover:text-primary-800 transition-colors"
            >
              Create Account
            </Link>
          </p>
        </CardFooter>
      </form>
    </Card>
  );
}
