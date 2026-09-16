"use client";

import React, { useState } from "react";
import Link from "next/link";
import { Menu, Store } from "lucide-react";
import { Sidebar } from "./Sidebar";
import { Button } from "@/components/ui/button";

interface AdminShellProps {
  children: React.ReactNode;
}

export function AdminShell({ children }: AdminShellProps) {
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [isMobileOpen, setIsMobileOpen] = useState(false);

  return (
    <div className="flex min-h-screen bg-surface-subtle">
      {/* Responsive Sidebar (Desktop Collapsible & Mobile Slide-Over) */}
      <Sidebar
        isCollapsed={isCollapsed}
        onToggleCollapse={() => setIsCollapsed((prev) => !prev)}
        isMobileOpen={isMobileOpen}
        onCloseMobile={() => setIsMobileOpen(false)}
      />

      {/* Main Container Area */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Mobile Top Navbar Header (Visible strictly on mobile < md) */}
        <header className="md:hidden sticky top-0 z-30 bg-white/95 backdrop-blur-xs border-b border-primary-100/90 px-4 h-14 flex items-center justify-between shadow-xs">
          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={() => setIsMobileOpen(true)}
              className="p-1.5 -ml-1 text-neutral-600 hover:text-primary-600 hover:bg-primary-50/80 rounded-lg cursor-pointer transition-colors"
              aria-label="Open navigation menu"
            >
              <Menu className="w-5 h-5" />
            </button>
            <div className="flex items-center gap-2">
              <span className="flex h-7 w-7 items-center justify-center rounded-lg bg-gradient-to-tr from-primary-600 via-primary-500 to-primary-400 text-xs font-black text-white shadow-sm shadow-primary-200/60">
                RF
              </span>
              <span className="font-extrabold text-xs tracking-tight text-neutral-900">
                Admin Portal
              </span>
            </div>
          </div>

          <Link href="/">
            <Button
              variant="ghost"
              size="sm"
              className="h-8 px-2.5 text-xs text-neutral-600 hover:text-primary-700 hover:bg-primary-50/80 gap-1.5"
              title="Return to Storefront"
            >
              <Store className="w-3.5 h-3.5" />
              <span className="hidden xs:inline">Storefront</span>
            </Button>
          </Link>
        </header>

        {/* Content Body */}
        <main className="flex-1 p-4 sm:p-6 md:p-8 overflow-y-auto">
          {children}
        </main>
      </div>
    </div>
  );
}
