"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { ShoppingBag, User, LogIn, LogOut, LayoutDashboard, Menu, X } from "lucide-react";
import { useAuthStore } from "@/stores/useAuthStore";
import { useCartStore } from "@/stores/useCartStore";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

export function Navbar() {
  const { user, isLoggedIn, logout } = useAuthStore();
  const items = useCartStore((state) => state.items);
  const [mounted, setMounted] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const totalCartCount = mounted
    ? items.reduce((total, item) => total + item.quantity, 0)
    : 0;

  const isAdmin = user?.role === "admin" || user?.role === "superadmin";

  return (
    <nav className="sticky top-0 z-40 w-full border-b border-neutral-200/80 bg-white/95 backdrop-blur-md transition-all">
      <div className="container mx-auto flex h-16 items-center justify-between px-4 sm:px-6 lg:px-8">
        {/* Brand Logo */}
        <div className="flex items-center gap-8">
          <Link
            href="/"
            className="flex items-center gap-2 text-xl font-bold tracking-tight text-neutral-900 transition-opacity hover:opacity-80"
          >
            <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-neutral-900 text-sm font-black text-white">
              RF
            </span>
            <span className="font-extrabold">RevoFashion</span>
          </Link>

          {/* Desktop Nav Links */}
          <div className="hidden md:flex md:items-center md:gap-6">
            <Link
              href="/"
              className="text-sm font-medium text-neutral-600 transition-colors hover:text-neutral-900"
            >
              Home
            </Link>
            <Link
              href="/products"
              className="text-sm font-medium text-neutral-600 transition-colors hover:text-neutral-900"
            >
              Products
            </Link>
          </div>
        </div>

        {/* Desktop Action Icons */}
        <div className="hidden md:flex md:items-center md:gap-3">
          {/* Cart Icon & Badge */}
          <Link href="/cart" className="relative">
            <Button
              variant="ghost"
              size="icon"
              className="relative text-neutral-700 hover:text-neutral-950"
              aria-label="Shopping Cart"
            >
              <ShoppingBag className="h-5 w-5" />
              {totalCartCount > 0 && (
                <Badge
                  variant="destructive"
                  className="absolute -right-1 -top-1 flex h-5 min-w-[20px] items-center justify-center rounded-full px-1 text-[10px] font-bold"
                >
                  {totalCartCount}
                </Badge>
              )}
            </Button>
          </Link>

          {/* Admin Dashboard Link (if admin) */}
          {mounted && isLoggedIn && isAdmin && (
            <Link href="/dashboard">
              <Button variant="outline" size="sm" className="gap-1.5 text-xs font-semibold">
                <LayoutDashboard className="h-3.5 w-3.5" />
                Admin
              </Button>
            </Link>
          )}

          {/* User Account / Login */}
          {mounted && isLoggedIn ? (
            <div className="flex items-center gap-2">
              <Link href="/orders">
                <Button variant="ghost" size="sm" className="gap-1.5 text-xs">
                  <User className="h-3.5 w-3.5" />
                  <span className="max-w-[120px] truncate">{user?.username}</span>
                </Button>
              </Link>
              <Button
                variant="ghost"
                size="icon"
                onClick={() => logout()}
                title="Log Out"
                className="text-neutral-500 hover:text-red-600"
              >
                <LogOut className="h-4 w-4" />
              </Button>
            </div>
          ) : (
            <Link href="/login">
              <Button size="sm" className="gap-1.5 text-xs font-semibold">
                <LogIn className="h-3.5 w-3.5" />
                Sign In
              </Button>
            </Link>
          )}
        </div>

        {/* Mobile Hamburger Toggle */}
        <div className="flex md:hidden items-center gap-2">
          <Link href="/cart" className="relative mr-1">
            <Button variant="ghost" size="icon" aria-label="Shopping Cart">
              <ShoppingBag className="h-5 w-5" />
              {totalCartCount > 0 && (
                <Badge
                  variant="destructive"
                  className="absolute -right-1 -top-1 flex h-4 min-w-[16px] items-center justify-center rounded-full px-1 text-[9px]"
                >
                  {totalCartCount}
                </Badge>
              )}
            </Button>
          </Link>

          <Button
            variant="ghost"
            size="icon"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            aria-label="Toggle Menu"
          >
            {mobileMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </Button>
        </div>
      </div>

      {/* Mobile Drawer Menu */}
      {mobileMenuOpen && (
        <div className="border-b border-neutral-200 bg-white px-4 py-4 md:hidden">
          <div className="flex flex-col gap-3">
            <Link
              href="/"
              onClick={() => setMobileMenuOpen(false)}
              className="text-sm font-medium text-neutral-700 py-1"
            >
              Home
            </Link>
            <Link
              href="/products"
              onClick={() => setMobileMenuOpen(false)}
              className="text-sm font-medium text-neutral-700 py-1"
            >
              Products
            </Link>
            <Link
              href="/cart"
              onClick={() => setMobileMenuOpen(false)}
              className="text-sm font-medium text-neutral-700 py-1 flex items-center justify-between"
            >
              <span>Shopping Cart</span>
              {totalCartCount > 0 && <Badge variant="secondary">{totalCartCount}</Badge>}
            </Link>

            {mounted && isLoggedIn && isAdmin && (
              <Link
                href="/dashboard"
                onClick={() => setMobileMenuOpen(false)}
                className="text-sm font-semibold text-neutral-900 py-1 flex items-center gap-1.5"
              >
                <LayoutDashboard className="h-4 w-4" />
                Admin Dashboard
              </Link>
            )}

            <div className="border-t border-neutral-100 pt-3 mt-1">
              {mounted && isLoggedIn ? (
                <div className="flex items-center justify-between">
                  <span className="text-sm text-neutral-600 font-medium">
                    Signed in as <strong className="text-neutral-900">{user?.username}</strong>
                  </span>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => {
                      logout();
                      setMobileMenuOpen(false);
                    }}
                    className="text-xs text-red-600 hover:text-red-700"
                  >
                    Logout
                  </Button>
                </div>
              ) : (
                <Link href="/login" onClick={() => setMobileMenuOpen(false)}>
                  <Button className="w-full text-xs font-semibold gap-1.5">
                    <LogIn className="h-4 w-4" />
                    Sign In
                  </Button>
                </Link>
              )}
            </div>
          </div>
        </div>
      )}
    </nav>
  );
}
