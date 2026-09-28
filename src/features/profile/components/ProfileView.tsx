"use client";

import React from "react";
import Link from "next/link";
import { RefreshCw, AlertCircle } from "lucide-react";
import { Breadcrumb } from "@/components/common";
import { useAuthStore } from "@/stores/useAuthStore";
import { useProfileQuery } from "../hooks/useProfileQuery";
import { ProfileSummaryCard } from "./ProfileSummaryCard";
import { ProfileEditForm } from "./ProfileEditForm";
import { Skeleton } from "@/components/ui/skeleton";
import { Button } from "@/components/ui/button";

export function ProfileView() {
  const sessionUser = useAuthStore((state) => state.user);
  const {
    data: profileResponse,
    isLoading,
    isError,
    refetch,
  } = useProfileQuery(sessionUser?.id);

  // Fallback to session user if query hasn't resolved yet
  const user = profileResponse?.data || sessionUser;

  return (
    <main className="container mx-auto px-4 py-8 sm:py-12 max-w-5xl">
      {/* Page Header with Breadcrumb & Semantic Header */}
      <header className="mb-8 space-y-2">
        <Breadcrumb
          items={[
            { label: "Home", href: "/" },
            { label: "My Profile", active: true },
          ]}
          className="mb-2 text-neutral-400"
        />

        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-neutral-900 mt-1">
              Personal Profile
            </h1>
            <p className="text-sm text-neutral-500 mt-1">
              Manage your personal credentials, contact email, and account
              status.
            </p>
          </div>

          {isLoading && (
            <div className="flex items-center gap-2 text-xs text-neutral-400">
              <RefreshCw className="h-3.5 w-3.5 animate-spin text-primary-500" />
              <span>Updating profile data...</span>
            </div>
          )}
        </div>
      </header>

      {/* Loading Skeleton View */}
      {isLoading && !user ? (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-1 rounded-2xl border border-primary-100/80 bg-white p-6 space-y-4">
            <div className="flex flex-col items-center space-y-3">
              <Skeleton className="h-24 w-24 rounded-full" />
              <Skeleton className="h-6 w-32" />
              <Skeleton className="h-4 w-44" />
              <Skeleton className="h-5 w-20 rounded-full" />
            </div>
            <div className="space-y-2 pt-4 border-t border-neutral-100">
              <Skeleton className="h-8 w-full rounded-lg" />
              <Skeleton className="h-8 w-full rounded-lg" />
            </div>
          </div>

          <div className="lg:col-span-2 rounded-2xl border border-primary-100/80 bg-white p-6 space-y-6">
            <div className="space-y-2">
              <Skeleton className="h-6 w-48" />
              <Skeleton className="h-4 w-72" />
            </div>
            <div className="space-y-4 pt-4 border-t border-neutral-100">
              <Skeleton className="h-10 w-full rounded-lg" />
              <Skeleton className="h-10 w-full rounded-lg" />
            </div>
            <div className="flex justify-end gap-3 pt-4 border-t border-neutral-100">
              <Skeleton className="h-9 w-28 rounded-lg" />
              <Skeleton className="h-9 w-32 rounded-lg" />
            </div>
          </div>
        </div>
      ) : isError && !user ? (
        /* Error State */
        <div className="rounded-2xl border border-red-200 bg-red-50/60 p-8 text-center max-w-lg mx-auto">
          <AlertCircle className="h-10 w-10 text-red-500 mx-auto mb-3" />
          <h2 className="text-lg font-bold text-red-900">
            Failed to Load Profile
          </h2>
          <p className="text-xs text-red-700 mt-1 mb-4">
            Could not retrieve profile information. Please verify your
            connection or try again.
          </p>
          <Button
            size="sm"
            onClick={() => refetch()}
            className="gap-2 bg-red-600 hover:bg-red-700 text-white text-xs"
          >
            <RefreshCw className="h-3.5 w-3.5" />
            Retry
          </Button>
        </div>
      ) : user ? (
        /* 2-Dimensional CSS Grid Layout */
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
          {/* Section 1: Profile Summary Card */}
          <section
            aria-labelledby="profile-summary-heading"
            className="lg:col-span-1"
          >
            <h2 id="profile-summary-heading" className="sr-only">
              Profile Summary
            </h2>
            <ProfileSummaryCard user={user} />
          </section>

          {/* Section 2: Account Settings & Edit Form */}
          <section
            aria-labelledby="account-settings-heading"
            className="lg:col-span-2"
          >
            <h2 id="account-settings-heading" className="sr-only">
              Account Settings
            </h2>
            <ProfileEditForm
              key={`${user.id}-${user.username}-${user.email}`}
              user={user}
            />
          </section>
        </div>
      ) : null}
    </main>
  );
}
