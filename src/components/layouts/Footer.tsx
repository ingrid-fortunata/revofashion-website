import React from "react";
import Link from "next/link";

export function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="border-t border-rose-100/90 bg-gradient-to-b from-white via-rose-50/20 to-rose-50/40 text-neutral-600">
      <div className="container mx-auto px-4 py-12 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Brand Col */}
          <div className="md:col-span-2 space-y-3">
            <Link href="/" className="flex items-center gap-2">
              <span className="flex h-7 w-7 items-center justify-center rounded-lg bg-gradient-to-tr from-rose-600 via-rose-500 to-pink-500 text-xs font-black text-white shadow-sm shadow-rose-200/50">
                RF
              </span>
              <span className="text-lg font-bold text-neutral-900 tracking-tight">
                RevoFashion
              </span>
            </Link>
            <p className="text-sm text-neutral-500 max-w-sm">
              Contemporary minimalist fashion tailored for elegance, confidence, and modern everyday lifestyle.
            </p>
          </div>

          {/* Quick Links */}
          <div className="space-y-3">
            <h4 className="text-xs font-bold uppercase tracking-wider text-neutral-900">
              Shop
            </h4>
            <ul className="space-y-2 text-sm">
              <li>
                <Link href="/products" className="hover:text-rose-600 transition-colors">
                  All Collections
                </Link>
              </li>
              <li>
                <Link href="/categories" className="hover:text-rose-600 transition-colors">
                  Categories
                </Link>
              </li>
              <li>
                <Link href="/cart" className="hover:text-rose-600 transition-colors">
                  Shopping Cart
                </Link>
              </li>
              <li>
                <Link href="/orders" className="hover:text-rose-600 transition-colors">
                  Track Order
                </Link>
              </li>
            </ul>
          </div>

          {/* Company & Support */}
          <div className="space-y-3">
            <h4 className="text-xs font-bold uppercase tracking-wider text-neutral-900">
              Customer Care
            </h4>
            <ul className="space-y-2 text-sm">
              <li>
                <span className="text-neutral-500">support@revofashion.com</span>
              </li>
              <li>
                <span className="text-neutral-500">Jakarta, Indonesia</span>
              </li>
              <li>
                <span className="text-neutral-400 text-xs">Mon - Fri: 09:00 - 18:00 WIB</span>
              </li>
            </ul>
          </div>
        </div>

        <div className="mt-12 pt-6 border-t border-rose-100/70 flex flex-col sm:flex-row items-center justify-between text-xs text-neutral-400 gap-4">
          <p>© {currentYear} RevoFashion. Built with Next.js 16 & Tailwind CSS.</p>
          <div className="flex gap-6">
            <span className="hover:text-rose-600 cursor-pointer transition-colors">Privacy Policy</span>
            <span className="hover:text-rose-600 cursor-pointer transition-colors">Terms of Service</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
