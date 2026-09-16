import React from "react";
import Link from "next/link";

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="relative min-h-screen flex flex-col items-center justify-center overflow-hidden bg-gradient-to-br from-primary-50 via-surface-subtle to-primary-100/50 px-4 py-12 sm:px-6 lg:px-8">
      {/* Radiant Aurora Mesh Glows */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -top-28 -left-28 h-96 w-96 rounded-full bg-gradient-to-br from-primary-300/45 via-primary-400/35 to-primary-200/20 blur-3xl"
      />
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -top-16 -right-20 h-80 w-80 rounded-full bg-gradient-to-bl from-amber-200/40 via-orange-100/30 to-primary-200/30 blur-3xl"
      />
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -bottom-28 -right-28 h-96 w-96 rounded-full bg-gradient-to-tl from-primary-400/40 via-primary-300/30 to-purple-200/20 blur-3xl"
      />
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -bottom-16 -left-16 h-80 w-80 rounded-full bg-gradient-to-tr from-primary-200/50 to-primary-100/40 blur-2xl"
      />
      <div
        aria-hidden="true"
        className="pointer-events-none absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 h-[460px] w-[460px] rounded-full bg-primary-200/30 blur-3xl"
      />

      {/* Brand Header */}
      <div className="relative z-10 mb-8 text-center">
        <Link
          href="/"
          className="inline-flex items-center gap-2.5 text-2xl font-bold tracking-tight text-neutral-900 transition-transform hover:scale-[1.02]"
        >
          <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-tr from-primary-600 to-primary-500 text-sm font-black text-white shadow-md shadow-primary-300/60">
            RF
          </span>
          <span className="font-extrabold tracking-tight">RevoFashion</span>
        </Link>
      </div>

      {/* Main Auth Card Container */}
      <div className="relative z-10 w-full max-w-md">{children}</div>

      {/* Footer copyright */}
      <div className="relative z-10 mt-8 text-center text-xs font-medium text-primary-900/50">
        © {new Date().getFullYear()} RevoFashion. Contemporary Minimalist Fashion.
      </div>
    </div>
  );
}
