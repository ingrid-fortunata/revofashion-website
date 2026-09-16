import React, { Suspense } from "react";
import { Metadata } from "next";
import { ProtectedRoute } from "@/components/routes";
import { ProfileView } from "@/features/profile";

export const metadata: Metadata = {
  title: "My Profile | RevoFashion",
  description: "View and manage your RevoFashion account details and credentials",
};

export default function ProfilePage() {
  return (
    <ProtectedRoute>
      <Suspense
        fallback={
          <div className="flex min-h-[60vh] items-center justify-center">
            <div className="h-8 w-8 animate-spin rounded-full border-2 border-neutral-300 border-t-primary-600" />
          </div>
        }
      >
        <ProfileView />
      </Suspense>
    </ProtectedRoute>
  );
}
