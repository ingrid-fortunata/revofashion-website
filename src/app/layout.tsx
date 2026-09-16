import type { Metadata } from "next";
import "./globals.css";
import { AppProviders } from "@/components/providers/AppProviders";

export const metadata: Metadata = {
  title: {
    default: "RevoShop — Modern Fashion & Apparel",
    template: "%s | RevoShop",
  },
  description:
    "Explore premium fashion apparel, curated collections, and modern everyday wear at RevoShop.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="h-full antialiased font-sans">
      <body className="min-h-full flex flex-col bg-surface-subtle text-neutral-900 font-sans">
        <AppProviders>{children}</AppProviders>
      </body>
    </html>
  );
}
