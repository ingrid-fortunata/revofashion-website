"use client";

import React, { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuthStore } from "@/stores/useAuthStore";

interface AdminRouteProps {
  children: React.ReactNode;
  fallback?: React.ReactNode;
}

/**
 * Ensures user has admin role ('admin' or 'superadmin').
 * Redirects unauthenticated users to /login and non-admin customers to /.
 */
export function AdminRoute({ children, fallback }: AdminRouteProps) {
  const router = useRouter();
  const { user, isLoggedIn, isHydrated } = useAuthStore();

  const isAdmin = user?.role === "admin" || user?.role === "superadmin";

  useEffect(() => {
    if (!isHydrated) return;

    if (!isLoggedIn) {
      router.replace("/login");
    } else if (!isAdmin) {
      router.replace("/");
    }
  }, [isHydrated, isLoggedIn, isAdmin, router]);

  if (!isHydrated || !isLoggedIn || !isAdmin) {
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
