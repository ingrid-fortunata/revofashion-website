"use client";

import React from "react";
import dayjs from "dayjs";
import { User as UserIcon, Mail, Shield, Calendar, Hash, CheckCircle2, XCircle } from "lucide-react";
import { User } from "@/types/auth";
import { Badge } from "@/components/ui/badge";

interface ProfileSummaryCardProps {
  user: User;
}

export function ProfileSummaryCard({ user }: ProfileSummaryCardProps) {
  const initials = (user.username || "U")
    .substring(0, 2)
    .toUpperCase();

  const formattedDate = user.created_at
    ? dayjs(user.created_at).format("MMMM D, YYYY")
    : "Member";

  const isAdmin = user.role === "admin" || user.role === "superadmin";

  return (
    <div className="backdrop-blur-xl bg-white/95 border border-primary-100/90 shadow-xl shadow-primary-950/5 rounded-2xl p-6 sm:p-8 flex flex-col items-center text-center transition-all">
      {/* Avatar Circle with Gradient */}
      <div className="relative mb-4">
        <div className="h-24 w-24 rounded-full bg-gradient-to-tr from-primary-600 to-primary-500 text-white font-extrabold text-2xl flex items-center justify-center shadow-lg shadow-primary-300/50 ring-4 ring-primary-50">
          {initials}
        </div>
        {user.is_active && (
          <div
            className="absolute bottom-1 right-1 h-5 w-5 rounded-full bg-emerald-500 ring-2 ring-white flex items-center justify-center"
            title="Account is Active"
          >
            <CheckCircle2 className="h-3.5 w-3.5 text-white" />
          </div>
        )}
      </div>

      {/* User Basic Info */}
      <h2 className="text-xl font-bold tracking-tight text-neutral-900">
        {user.username}
      </h2>
      <p className="text-sm text-neutral-500 mt-0.5 flex items-center justify-center gap-1.5 break-all">
        <Mail className="h-3.5 w-3.5 text-primary-400 shrink-0" />
        <span>{user.email}</span>
      </p>

      {/* Role Badge */}
      <div className="mt-3 flex items-center gap-2">
        {isAdmin ? (
          <Badge variant="primary" className="font-semibold text-xs gap-1 py-0.5 px-3">
            <Shield className="h-3 w-3" />
            {user.role === "superadmin" ? "Super Admin" : "Administrator"}
          </Badge>
        ) : (
          <Badge variant="outline" className="text-neutral-700 bg-neutral-50 font-medium text-xs gap-1 py-0.5 px-3">
            <UserIcon className="h-3 w-3 text-neutral-500" />
            Customer
          </Badge>
        )}

        {user.is_active ? (
          <span className="inline-flex items-center text-[11px] font-medium text-emerald-700 bg-emerald-50 border border-emerald-200/60 px-2 py-0.5 rounded-full">
            Active
          </span>
        ) : (
          <span className="inline-flex items-center text-[11px] font-medium text-red-700 bg-red-50 border border-red-200/60 px-2 py-0.5 rounded-full">
            <XCircle className="h-3 w-3 mr-1" /> Deactivated
          </span>
        )}
      </div>

      {/* Account Details Divider */}
      <div className="w-full border-t border-neutral-100 my-6" />

      {/* Detailed Meta Items */}
      <div className="w-full space-y-3.5 text-left text-xs">
        <div className="flex items-center justify-between py-1.5 px-3 rounded-lg bg-neutral-50/80 border border-neutral-100/80">
          <span className="text-neutral-500 flex items-center gap-1.5 font-medium">
            <Hash className="h-3.5 w-3.5 text-neutral-400" />
            User ID
          </span>
          <span className="font-semibold text-neutral-800">#{user.id}</span>
        </div>

        <div className="flex items-center justify-between py-1.5 px-3 rounded-lg bg-neutral-50/80 border border-neutral-100/80">
          <span className="text-neutral-500 flex items-center gap-1.5 font-medium">
            <Calendar className="h-3.5 w-3.5 text-neutral-400" />
            Member Since
          </span>
          <span className="font-semibold text-neutral-800">{formattedDate}</span>
        </div>
      </div>
    </div>
  );
}
