import React from "react";
import { PublicOnlyRoute } from "@/components/routes";
import { RegisterForm } from "@/features/auth";

export const metadata = {
  title: "Create Account | RevoFashion",
  description: "Sign up for a new RevoFashion account",
};

export default function RegisterPage() {
  return (
    <PublicOnlyRoute>
      <RegisterForm />
    </PublicOnlyRoute>
  );
}
