import React from "react";
import Link from "next/link";

export function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="border-t border-neutral-200 bg-neutral-50 text-neutral-600">
      <div className="container mx-auto px-4 py-12 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Brand Col */}
          <div className="md:col-span-2 space-y-3">
            <Link href="/" className="flex items-center gap-2">
              <span className="flex h-7 w-7 items-center justify-center rounded-lg bg-neutral-900 text-xs font-black text-white">
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
                <Link href="/products" className="hover:text-neutral-900 transition-colors">
                  All Collections
                </Link>
              </li>
              <li>
                <Link href="/cart" className="hover:text-neutral-900 transition-colors">
                  Shopping Cart
                </Link>
              </li>
              <li>
                <Link href="/orders" className="hover:text-neutral-900 transition-colors">
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

        <div className="mt-12 pt-6 border-t border-neutral-200/80 flex flex-col sm:flex-row items-center justify-between text-xs text-neutral-400 gap-4">
          <p>© {currentYear} RevoFashion. Built with Next.js 16 & Tailwind CSS.</p>
          <div className="flex gap-6">
            <span>Privacy Policy</span>
            <span>Terms of Service</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
