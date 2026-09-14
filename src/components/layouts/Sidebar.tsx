"use client";

import React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Package, Layers, ShoppingCart, ArrowLeft, LogOut } from "lucide-react";
import { useAuthStore } from "@/stores/useAuthStore";
import { Button } from "@/components/ui/button";
import { cn } from "@/utils";

const navigationItems = [
  {
    label: "Products",
    href: "/dashboard",
    icon: Package,
    exact: true,
  },
  {
    label: "Categories",
    href: "/dashboard/categories",
    icon: Layers,
    exact: false,
  },
  {
    label: "Orders",
    href: "/dashboard/orders",
    icon: ShoppingCart,
    exact: false,
  },
];


export function Sidebar() {
  const pathname = usePathname();
  const { user, logout } = useAuthStore();

  return (
    <aside className="w-64 flex-shrink-0 border-r border-neutral-200 bg-white flex flex-col justify-between h-screen sticky top-0">
      <div>
        {/* Admin Brand */}
        <div className="h-16 flex items-center gap-2 px-6 border-b border-neutral-200">
          <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-neutral-900 text-sm font-black text-white">
            RF
          </span>
          <div className="flex flex-col">
            <span className="font-extrabold text-sm tracking-tight text-neutral-900 leading-none">
              RevoFashion
            </span>
            <span className="text-[10px] uppercase font-bold text-neutral-400 tracking-wider mt-0.5">
              Admin Portal
            </span>
          </div>
        </div>

        {/* Navigation Links */}
        <nav className="p-4 space-y-1.5" aria-label="Admin Navigation">
          {navigationItems.map((item) => {
            const isActive = item.exact
              ? pathname === item.href
              : pathname.startsWith(item.href);

            const Icon = item.icon;

            return (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  "flex items-center gap-3 px-3.5 py-2.5 rounded-lg text-sm font-medium transition-colors",
                  isActive
                    ? "bg-neutral-900 text-white font-semibold shadow-sm"
                    : "text-neutral-600 hover:text-neutral-900 hover:bg-neutral-100"
                )}
              >
                <Icon className="h-4 w-4" />
                <span>{item.label}</span>
              </Link>
            );
          })}
        </nav>
      </div>

      {/* Footer / Account Actions */}
      <div className="p-4 border-t border-neutral-200 space-y-2">
        <Link href="/">
          <Button
            variant="ghost"
            size="sm"
            className="w-full justify-start gap-2.5 text-xs text-neutral-600 hover:text-neutral-900"
          >
            <ArrowLeft className="h-3.5 w-3.5" />
            Back to Storefront
          </Button>
        </Link>

        <div className="pt-2 border-t border-neutral-100 flex items-center justify-between px-1">
          <div className="flex flex-col min-w-0">
            <span className="text-xs font-semibold text-neutral-900 truncate">
              {user?.username || "Admin"}
            </span>
            <span className="text-[10px] text-neutral-400 capitalize truncate">
              {user?.role || "Staff"}
            </span>
          </div>
          <Button
            variant="ghost"
            size="icon"
            onClick={() => logout()}
            className="text-neutral-400 hover:text-red-600 h-7 w-7"
            title="Log Out"
          >
            <LogOut className="h-3.5 w-3.5" />
          </Button>
        </div>
      </div>
    </aside>
  );
}
