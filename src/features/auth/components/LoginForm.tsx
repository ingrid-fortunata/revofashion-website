"use client";

import React, { useState } from "react";
import Link from "next/link";
import { LogIn, Loader2 } from "lucide-react";
import { useLoginMutation } from "../hooks/useLoginMutation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";

export function LoginForm() {
  const [identifier, setIdentifier] = useState("");
  const [password, setPassword] = useState("");
  const [formError, setFormError] = useState<string | null>(null);

  const loginMutation = useLoginMutation();

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setFormError(null);

    const trimmedIdentifier = identifier.trim();
    if (!trimmedIdentifier) {
      setFormError("Please enter your username or email address.");
      return;
    }

    if (!password) {
      setFormError("Please enter your password.");
      return;
    }

    const isEmail = trimmedIdentifier.includes("@");
    const payload = isEmail
      ? { email: trimmedIdentifier, password }
      : { username: trimmedIdentifier, password };

    loginMutation.mutate(payload);
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

      <form onSubmit={handleSubmit}>
        <CardContent className="space-y-4">
          {formError && (
            <div className="rounded-lg bg-red-50 border border-red-200 p-3 text-xs text-red-700 font-medium">
              {formError}
            </div>
          )}

          {/* Identifier Input */}
          <div className="space-y-1.5">
            <Label htmlFor="identifier" className="text-xs font-semibold text-neutral-700">
              Username or Email
            </Label>
            <Input
              id="identifier"
              type="text"
              placeholder="e.g. alice_smith or alice@example.com"
              value={identifier}
              onChange={(e) => setIdentifier(e.target.value)}
              disabled={loginMutation.isPending}
              required
              autoFocus
            />
          </div>

          {/* Password Input */}
          <div className="space-y-1.5">
            <div className="flex items-center justify-between">
              <Label htmlFor="password" className="text-xs font-semibold text-neutral-700">
                Password
              </Label>
            </div>
            <Input
              id="password"
              type="password"
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              disabled={loginMutation.isPending}
              required
            />
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
