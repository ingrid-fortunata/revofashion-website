"use client";

import React, { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuthStore } from "@/stores/useAuthStore";

interface PublicOnlyRouteProps {
  children: React.ReactNode;
  fallback?: React.ReactNode;
}

/**
 * Prevents authenticated users from accessing guest-only routes like /login or /register.
 * Redirects admin users to /dashboard and customers to /.
 */
export function PublicOnlyRoute({ children, fallback }: PublicOnlyRouteProps) {
  const router = useRouter();
  const { user, isLoggedIn, isHydrated } = useAuthStore();

  const isAdmin = user?.role === "admin" || user?.role === "superadmin";

  useEffect(() => {
    if (!isHydrated) return;

    if (isLoggedIn) {
      if (isAdmin) {
        router.replace("/dashboard");
      } else {
        router.replace("/");
      }
    }
  }, [isHydrated, isLoggedIn, isAdmin, router]);

  if (!isHydrated || isLoggedIn) {
    return (
      fallback || (
        <div className="flex min-h-[60vh] items-center justify-center">
          <div className="h-8 w-8 animate-spin rounded-full border-2 border-neutral-300 border-t-neutral-900" />
        </div>
      )
    );
  }

  return <>{children}</>;
}
