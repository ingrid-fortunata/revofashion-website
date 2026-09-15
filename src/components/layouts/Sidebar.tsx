"use client";

import React, { useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  Package,
  Layers,
  ShoppingCart,
  ArrowLeft,
  LogOut,
  ChevronLeft,
  ChevronRight,
  X,
} from "lucide-react";
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

interface SidebarProps {
  isCollapsed?: boolean;
  onToggleCollapse?: () => void;
  isMobileOpen?: boolean;
  onCloseMobile?: () => void;
}

export function Sidebar({
  isCollapsed = false,
  onToggleCollapse,
  isMobileOpen = false,
  onCloseMobile,
}: SidebarProps) {
  const pathname = usePathname();
  const { user, logout } = useAuthStore();

  // Close mobile sidebar on Escape key
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape" && isMobileOpen && onCloseMobile) {
        onCloseMobile();
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isMobileOpen, onCloseMobile]);

  // Sidebar content renderer
  const renderSidebarContent = (isMobileDrawer = false) => {
    const showCompact = !isMobileDrawer && isCollapsed;

    return (
      <div className="flex flex-col justify-between h-full">
        <div>
          {/* Header */}
          <div
            className={cn(
              "h-16 flex items-center border-b border-rose-100/90 transition-all",
              showCompact ? "justify-center px-2" : "justify-between px-5"
            )}
          >
            <div className="flex items-center gap-2.5 min-w-0">
              <span className="flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-lg bg-gradient-to-tr from-rose-600 via-rose-500 to-pink-500 text-sm font-black text-white shadow-sm shadow-rose-200/60">
                RF
              </span>
              {!showCompact && (
                <div className="flex flex-col min-w-0">
                  <span className="font-extrabold text-sm tracking-tight text-neutral-900 leading-none truncate">
                    RevoFashion
                  </span>
                  <span className="text-[10px] uppercase font-bold text-neutral-400 tracking-wider mt-0.5 truncate">
                    Admin Portal
                  </span>
                </div>
              )}
            </div>

            {/* Desktop Collapse Toggle Button */}
            {!isMobileDrawer && onToggleCollapse && (
              <Button
                type="button"
                variant="ghost"
                size="icon"
                onClick={onToggleCollapse}
                className={cn(
                  "h-7 w-7 text-neutral-500 hover:text-rose-700 hover:bg-rose-50/80 rounded-lg",
                  showCompact && "mt-1"
                )}
                title={isCollapsed ? "Expand sidebar" : "Collapse sidebar"}
                aria-label={isCollapsed ? "Expand sidebar" : "Collapse sidebar"}
              >
                {isCollapsed ? (
                  <ChevronRight className="h-4 w-4" />
                ) : (
                  <ChevronLeft className="h-4 w-4" />
                )}
              </Button>
            )}

            {/* Mobile Close Button */}
            {isMobileDrawer && onCloseMobile && (
              <Button
                type="button"
                variant="ghost"
                size="icon"
                onClick={onCloseMobile}
                className="h-8 w-8 text-neutral-500 hover:text-rose-700 hover:bg-rose-50/80 rounded-lg"
                title="Close menu"
                aria-label="Close menu"
              >
                <X className="h-4 w-4" />
              </Button>
            )}
          </div>

          {/* Navigation Links */}
          <nav className="p-3 space-y-1.5" aria-label="Admin Navigation">
            {navigationItems.map((item) => {
              const isActive = item.exact
                ? pathname === item.href
                : pathname.startsWith(item.href);

              const Icon = item.icon;

              return (
                <Link
                  key={item.href}
                  href={item.href}
                  onClick={() => isMobileDrawer && onCloseMobile && onCloseMobile()}
                  title={showCompact ? item.label : undefined}
                  className={cn(
                    "flex items-center rounded-lg text-sm font-medium transition-all group relative",
                    showCompact
                      ? "justify-center py-2.5 px-0"
                      : "gap-3 px-3.5 py-2.5",
                    isActive
                      ? "bg-rose-600 text-white font-semibold shadow-sm shadow-rose-200/50"
                      : "text-neutral-600 hover:text-rose-700 hover:bg-rose-50/80"
                  )}
                >
                  <Icon className="h-4 w-4 flex-shrink-0" />
                  {!showCompact && <span>{item.label}</span>}

                  {/* Compact tooltip hint on hover */}
                  {showCompact && (
                    <span className="absolute left-full ml-2.5 px-2 py-1 bg-neutral-900 text-white text-xs font-semibold rounded-md shadow-md opacity-0 pointer-events-none group-hover:opacity-100 transition-opacity z-50 whitespace-nowrap">
                      {item.label}
                    </span>
                  )}
                </Link>
              );
            })}
          </nav>
        </div>

        {/* Footer / Account Actions */}
        <div className={cn("border-t border-rose-100/80", showCompact ? "p-2" : "p-4")}>
          <Link href="/" onClick={() => isMobileDrawer && onCloseMobile && onCloseMobile()}>
            <Button
              variant="ghost"
              size="sm"
              className={cn(
                "w-full text-xs text-neutral-600 hover:text-rose-700 hover:bg-rose-50/80",
                showCompact ? "justify-center px-0 h-9" : "justify-start gap-2.5"
              )}
              title={showCompact ? "Back to Storefront" : undefined}
            >
              <ArrowLeft className="h-3.5 w-3.5 flex-shrink-0" />
              {!showCompact && <span>Back to Storefront</span>}
            </Button>
          </Link>

          <div
            className={cn(
              "pt-2.5 mt-2 border-t border-rose-100/60 flex items-center",
              showCompact ? "justify-center" : "justify-between px-1"
            )}
          >
            {!showCompact && (
              <div className="flex flex-col min-w-0 pr-2">
                <span className="text-xs font-semibold text-neutral-900 truncate">
                  {user?.username || "Admin"}
                </span>
                <span className="text-[10px] text-neutral-400 capitalize truncate">
                  {user?.role || "Staff"}
                </span>
              </div>
            )}
            <Button
              variant="ghost"
              size="icon"
              onClick={() => logout()}
              className="text-neutral-400 hover:text-rose-600 hover:bg-rose-50/80 h-8 w-8 rounded-lg"
              title="Log Out"
              aria-label="Log out"
            >
              <LogOut className="h-3.5 w-3.5" />
            </Button>
          </div>
        </div>
      </div>
    );
  };

  return (
    <>
      {/* 1. Desktop Collapsible Sidebar (Hidden on Mobile) */}
      <aside
        className={cn(
          "hidden md:flex flex-col flex-shrink-0 border-r border-rose-100/90 bg-white h-screen sticky top-0 z-30 transition-[width] duration-300 ease-in-out",
          isCollapsed ? "w-20" : "w-64"
        )}
      >
        {renderSidebarContent(false)}
      </aside>

      {/* 2. Mobile Backdrop Overlay */}
      {isMobileOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-40 backdrop-blur-xs md:hidden transition-opacity duration-300"
          onClick={onCloseMobile}
          aria-hidden="true"
        />
      )}

      {/* 3. Mobile Slide-Over Drawer */}
      <aside
        className={cn(
          "fixed top-0 bottom-0 left-0 z-50 w-72 bg-white flex flex-col justify-between md:hidden shadow-2xl transition-transform duration-300 ease-in-out",
          isMobileOpen ? "translate-x-0" : "-translate-x-full"
        )}
        aria-label="Mobile Navigation"
      >
        {renderSidebarContent(true)}
      </aside>
    </>
  );
}
