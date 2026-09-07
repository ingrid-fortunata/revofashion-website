"use client";

import React, { useState, useRef, useEffect } from "react";
import Link from "next/link";
import {
  User as UserIcon,
  ShoppingBag,
  LayoutDashboard,
  LogOut,
  ChevronDown,
  Shield,
} from "lucide-react";
import { User } from "@/types/auth";
import { Badge } from "@/components/ui/badge";

interface UserDropdownProps {
  user: User;
  onLogout: () => void;
}

export function UserDropdown({ user, onLogout }: UserDropdownProps) {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Close dropdown on click outside or escape key
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false);
      }
    }

    function handleKeyDown(event: KeyboardEvent) {
      if (event.key === "Escape") {
        setIsOpen(false);
      }
    }

    if (isOpen) {
      document.addEventListener("mousedown", handleClickOutside);
      document.addEventListener("keydown", handleKeyDown);
    }
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, [isOpen]);

  const initials = (user.username || "U").substring(0, 2).toUpperCase();
  const isAdmin = user.role === "admin" || user.role === "superadmin";

  return (
    <div className="relative inline-block text-left" ref={dropdownRef}>
      {/* Trigger Button */}
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        aria-expanded={isOpen}
        aria-haspopup="menu"
        className="flex items-center gap-2 py-1.5 px-2.5 rounded-full border border-rose-200/70 bg-rose-50/40 hover:bg-rose-50/90 transition-all text-neutral-800 text-xs font-semibold focus:outline-none focus-visible:ring-2 focus-visible:ring-rose-400 cursor-pointer"
      >
        <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-gradient-to-tr from-rose-600 via-rose-500 to-pink-500 text-[10px] font-bold text-white shadow-sm shadow-rose-200">
          {initials}
        </span>
        <span className="max-w-[110px] truncate">{user.username}</span>
        <ChevronDown
          className={`h-3.5 w-3.5 text-neutral-500 transition-transform duration-200 ${
            isOpen ? "rotate-180 text-rose-600" : ""
          }`}
        />
      </button>

      {/* Dropdown Menu */}
      {isOpen && (
        <div
          role="menu"
          aria-orientation="vertical"
          className="absolute right-0 top-full mt-2 w-60 origin-top-right rounded-2xl border border-rose-100/90 bg-white/95 backdrop-blur-xl shadow-2xl shadow-rose-950/10 p-1.5 z-50 animate-in fade-in zoom-in-95 duration-150"
        >
          {/* Header Info */}
          <div className="px-3 py-2.5 border-b border-neutral-100">
            <p className="text-xs font-bold text-neutral-900 truncate">
              {user.username}
            </p>
            <p className="text-[11px] text-neutral-500 truncate mt-0.5">
              {user.email}
            </p>
            <div className="mt-2">
              {isAdmin ? (
                <Badge
                  variant="rose"
                  className="text-[10px] py-0 px-2 gap-1 font-semibold"
                >
                  <Shield className="h-2.5 w-2.5" />
                  {user.role === "superadmin" ? "Superadmin" : "Admin"}
                </Badge>
              ) : (
                <Badge
                  variant="outline"
                  className="text-[10px] py-0 px-2 font-medium text-neutral-600"
                >
                  Customer
                </Badge>
              )}
            </div>
          </div>

          {/* Menu Items */}
          <div className="py-1">
            <Link
              href="/profile"
              role="menuitem"
              onClick={() => setIsOpen(false)}
              className="flex items-center gap-2.5 px-3 py-2 text-xs font-medium text-neutral-700 hover:text-rose-700 hover:bg-rose-50/70 rounded-lg transition-colors"
            >
              <UserIcon className="h-3.5 w-3.5 text-rose-500" />
              <span>My Profile</span>
            </Link>

            <Link
              href="/orders"
              role="menuitem"
              onClick={() => setIsOpen(false)}
              className="flex items-center gap-2.5 px-3 py-2 text-xs font-medium text-neutral-700 hover:text-rose-700 hover:bg-rose-50/70 rounded-lg transition-colors"
            >
              <ShoppingBag className="h-3.5 w-3.5 text-neutral-500" />
              <span>My Orders</span>
            </Link>

            {isAdmin && (
              <Link
                href="/dashboard"
                role="menuitem"
                onClick={() => setIsOpen(false)}
                className="flex items-center gap-2.5 px-3 py-2 text-xs font-semibold text-neutral-900 hover:text-rose-700 hover:bg-rose-50/70 rounded-lg transition-colors"
              >
                <LayoutDashboard className="h-3.5 w-3.5 text-rose-600" />
                <span>Admin Dashboard</span>
              </Link>
            )}
          </div>

          {/* Logout Action */}
          <div className="border-t border-neutral-100 pt-1 mt-0.5">
            <button
              type="button"
              role="menuitem"
              onClick={() => {
                setIsOpen(false);
                onLogout();
              }}
              className="w-full flex items-center gap-2.5 px-3 py-2 text-xs font-medium text-red-600 hover:bg-red-50/80 rounded-lg transition-colors text-left cursor-pointer"
            >
              <LogOut className="h-3.5 w-3.5 text-red-500" />
              <span>Sign Out</span>
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
