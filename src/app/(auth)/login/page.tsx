import React, { Suspense } from "react";
import { PublicOnlyRoute } from "@/components/routes";
import { LoginForm } from "@/features/auth";

export const metadata = {
  title: "Sign In | RevoFashion",
  description: "Sign in to your RevoFashion account",
};

export default function LoginPage() {
  return (
    <PublicOnlyRoute>
      <Suspense
        fallback={
          <div className="flex min-h-[350px] items-center justify-center">
            <div className="h-8 w-8 animate-spin rounded-full border-2 border-neutral-300 border-t-neutral-900" />
          </div>
        }
      >
        <LoginForm />
      </Suspense>
    </PublicOnlyRoute>
  );
}
