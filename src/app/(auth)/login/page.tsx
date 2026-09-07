import React from "react";
import { PublicOnlyRoute } from "@/components/routes";
import { LoginForm } from "@/features/auth";

export const metadata = {
  title: "Sign In | RevoFashion",
  description: "Sign in to your RevoFashion account",
};

export default function LoginPage() {
  return (
    <PublicOnlyRoute>
      <LoginForm />
    </PublicOnlyRoute>
  );
}
