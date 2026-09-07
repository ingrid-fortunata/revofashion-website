import React from "react";
import { Header, Navbar, Footer } from "@/components/layouts";

export default function ShopLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex min-h-screen flex-col bg-white">
      <Header />
      <Navbar />
      <main className="flex-1">{children}</main>
      <Footer />
    </div>
  );
}
