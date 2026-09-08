"use client";

import React, { useState, useSyncExternalStore } from "react";
import Link from "next/link";
import { useRouter, usePathname } from "next/navigation";
import { ShoppingBag, User, LogIn, LogOut, LayoutDashboard, Menu, X } from "lucide-react";
import { useAuthStore } from "@/stores/useAuthStore";
import { useCartStore } from "@/stores/useCartStore";
import { showToast } from "@/lib/toast";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { UserDropdown } from "./UserDropdown";

export function Navbar() {
  const router = useRouter();
  const pathname = usePathname();
  const { user, isLoggedIn, logout } = useAuthStore();
  const items = useCartStore((state) => state.items);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const handleLogout = () => {
    logout();
    showToast.success("Logged out", "You have been signed out successfully.");
    router.replace("/login");
  };

  // Hydration-safe client check without cascading render effects
  const mounted = useSyncExternalStore(
    () => () => {},
    () => true,
    () => false
  );

  const totalCartCount = mounted
    ? items.reduce((total, item) => total + item.quantity, 0)
    : 0;

  const isAdmin = user?.role === "admin" || user?.role === "superadmin";

  return (
    <nav className="sticky top-0 z-40 w-full border-b border-rose-100/90 bg-white/95 backdrop-blur-md transition-all">
      <div className="container mx-auto flex h-16 items-center justify-between px-4 sm:px-6 lg:px-8">
        {/* Brand Logo */}
        <div className="flex items-center gap-8">
          <Link
            href="/"
            className="flex items-center gap-2 text-xl font-bold tracking-tight text-neutral-900 transition-opacity hover:opacity-85"
          >
            <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-gradient-to-tr from-rose-600 via-rose-500 to-pink-500 text-sm font-black text-white shadow-sm shadow-rose-200/60">
              RF
            </span>
            <span className="font-extrabold tracking-tight">RevoFashion</span>
          </Link>

          {/* Desktop Nav Links */}
          <div className="hidden md:flex md:items-center md:gap-6">
            <Link
              href="/"
              className={`text-sm transition-colors ${
                pathname === "/"
                  ? "font-semibold text-rose-600"
                  : "font-medium text-neutral-600 hover:text-rose-600"
              }`}
            >
              Home
            </Link>
            <Link
              href="/products"
              className={`text-sm transition-colors ${
                pathname.startsWith("/products")
                  ? "font-semibold text-rose-600"
                  : "font-medium text-neutral-600 hover:text-rose-600"
              }`}
            >
              Products
            </Link>
            <Link
              href="/categories"
              className={`text-sm transition-colors ${
                pathname.startsWith("/categories")
                  ? "font-semibold text-rose-600"
                  : "font-medium text-neutral-600 hover:text-rose-600"
              }`}
            >
              Categories
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
              className="relative text-neutral-700 hover:text-rose-700 hover:bg-rose-50/80"
              aria-label="Shopping Cart"
            >
              <ShoppingBag className="h-5 w-5" />
              {totalCartCount > 0 && (
                <span className="absolute -right-1 -top-1 flex h-5 min-w-[20px] items-center justify-center rounded-full bg-rose-600 text-white px-1 text-[10px] font-bold shadow-sm shadow-rose-200/50">
                  {totalCartCount}
                </span>
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
          {mounted && isLoggedIn && user ? (
            <UserDropdown user={user} onLogout={handleLogout} />
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
                <span className="absolute -right-1 -top-1 flex h-4 min-w-[16px] items-center justify-center rounded-full bg-rose-600 text-white px-1 text-[9px] font-bold">
                  {totalCartCount}
                </span>
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
        <div className="border-b border-rose-100 bg-white px-4 py-4 md:hidden">
          <div className="flex flex-col gap-3">
            <Link
              href="/"
              onClick={() => setMobileMenuOpen(false)}
              className={`text-sm py-1 transition-colors ${
                pathname === "/"
                  ? "font-semibold text-rose-600"
                  : "font-medium text-neutral-700 hover:text-rose-600"
              }`}
            >
              Home
            </Link>
            <Link
              href="/products"
              onClick={() => setMobileMenuOpen(false)}
              className={`text-sm py-1 transition-colors ${
                pathname.startsWith("/products")
                  ? "font-semibold text-rose-600"
                  : "font-medium text-neutral-700 hover:text-rose-600"
              }`}
            >
              Products
            </Link>
            <Link
              href="/categories"
              onClick={() => setMobileMenuOpen(false)}
              className={`text-sm py-1 transition-colors ${
                pathname.startsWith("/categories")
                  ? "font-semibold text-rose-600"
                  : "font-medium text-neutral-700 hover:text-rose-600"
              }`}
            >
              Categories
            </Link>
            <Link
              href="/cart"
              onClick={() => setMobileMenuOpen(false)}
              className="text-sm font-medium text-neutral-700 hover:text-rose-600 py-1 flex items-center justify-between"
            >
              <span>Shopping Cart</span>
              {totalCartCount > 0 && (
                <Badge variant="rose">{totalCartCount}</Badge>
              )}
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
              {mounted && isLoggedIn && user ? (
                <div className="flex flex-col gap-2">
                  <div className="flex items-center gap-2.5 pb-2 border-b border-neutral-100">
                    <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-gradient-to-tr from-rose-600 to-pink-500 text-xs font-bold text-white shadow-sm shadow-rose-200">
                      {(user.username || "U").substring(0, 2).toUpperCase()}
                    </span>
                    <div className="flex flex-col min-w-0">
                      <span className="text-sm font-bold text-neutral-900 truncate">
                        {user.username}
                      </span>
                      <span className="text-[11px] text-neutral-500 truncate">
                        {user.email}
                      </span>
                    </div>
                  </div>

                  <Link
                    href="/profile"
                    onClick={() => setMobileMenuOpen(false)}
                    className="text-sm font-medium text-neutral-700 hover:text-rose-600 py-1.5 flex items-center gap-2"
                  >
                    <User className="h-4 w-4 text-rose-500" />
                    <span>My Profile</span>
                  </Link>

                  <Link
                    href="/orders"
                    onClick={() => setMobileMenuOpen(false)}
                    className="text-sm font-medium text-neutral-700 hover:text-rose-600 py-1.5 flex items-center gap-2"
                  >
                    <ShoppingBag className="h-4 w-4 text-neutral-500" />
                    <span>My Orders</span>
                  </Link>

                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => {
                      setMobileMenuOpen(false);
                      handleLogout();
                    }}
                    className="w-full text-xs text-red-600 hover:text-red-700 hover:bg-red-50 mt-1 gap-1.5"
                  >
                    <LogOut className="h-3.5 w-3.5" />
                    Sign Out
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
