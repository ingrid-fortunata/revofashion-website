import React from "react";
import Link from "next/link";

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-neutral-50 px-4 py-12 sm:px-6 lg:px-8">
      {/* Brand Header */}
      <div className="mb-8 text-center">
        <Link
          href="/"
          className="inline-flex items-center gap-2 text-2xl font-bold tracking-tight text-neutral-900 transition-opacity hover:opacity-80"
        >
          <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-neutral-900 text-sm font-black text-white">
            RF
          </span>
          <span className="font-extrabold tracking-tight">RevoFashion</span>
        </Link>
      </div>

      {/* Main Auth Card Container */}
      <div className="w-full max-w-md">{children}</div>

      {/* Footer copyright */}
      <div className="mt-8 text-center text-xs text-neutral-400">
        © {new Date().getFullYear()} RevoFashion. Secure Authentication.
      </div>
    </div>
  );
}
