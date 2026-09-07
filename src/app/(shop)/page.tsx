import Link from "next/link";
import {
  ShoppingBag,
  Sparkles,
  Layers,
  Database,
  ShieldCheck,
  Zap,
  CheckCircle2,
  ArrowRight,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

const techStack = [
  {
    title: "Next.js 16.3.4",
    description: "App Router, Server Components, and optimized routing engine.",
    icon: Zap,
    status: "Active",
  },
  {
    title: "TypeScript",
    description: "End-to-end type safety modeling products, orders, and auth.",
    icon: Layers,
    status: "Configured",
  },
  {
    title: "Tailwind CSS v4",
    description: "Utility-first modern styling with custom fashion themes.",
    icon: Sparkles,
    status: "Ready",
  },
  {
    title: "Base UI (ShadCN style)",
    description: "Accessible headless UI primitives without Radix or Aria.",
    icon: ShoppingBag,
    status: "Installed",
  },
  {
    title: "Zustand State",
    description: "Client-side stores with cookie-only auth & localStorage cart.",
    icon: ShieldCheck,
    status: "Integrated",
  },
  {
    title: "TanStack Query v5",
    description: "Server state caching, data fetching, and query invalidation.",
    icon: Database,
    status: "Configured",
  },
];

export const metadata = {
  title: "RevoFashion — Contemporary Minimalist Fashion",
  description: "Engineered with modern frontend standards and atomic component architecture.",
};

export default function HomePage() {
  return (
    <div>
      {/* Hero Section */}
      <section className="relative overflow-hidden bg-gradient-to-b from-rose-50/80 via-[#fff9fa] to-white py-16 sm:py-24 border-b border-rose-100/80">
        {/* Ambient Glows */}
        <div
          aria-hidden="true"
          className="pointer-events-none absolute -top-24 left-1/4 h-80 w-80 rounded-full bg-rose-200/40 blur-3xl"
        />
        <div
          aria-hidden="true"
          className="pointer-events-none absolute -top-16 right-1/4 h-72 w-72 rounded-full bg-amber-100/50 blur-3xl"
        />
        <div
          aria-hidden="true"
          className="pointer-events-none absolute bottom-0 left-1/3 h-64 w-64 rounded-full bg-pink-200/30 blur-2xl"
        />

        <div className="relative z-10 container mx-auto max-w-5xl px-4 sm:px-6 lg:px-8 text-center">
          <Badge variant="rose" className="mb-4 gap-1.5 px-3.5 py-1 font-medium shadow-xs">
            <Sparkles className="h-3.5 w-3.5 text-rose-600" />
            Unisex Contemporary Fashion Collection
          </Badge>
          <h1 className="text-4xl font-extrabold tracking-tight text-neutral-900 sm:text-6xl">
            RevoFashion Storefront
          </h1>
          <p className="mx-auto mt-6 max-w-2xl text-lg text-neutral-600 leading-relaxed">
            Contemporary minimalist fashion tailored for elegance, confidence, and modern everyday lifestyle.
          </p>
          <div className="mt-8 flex flex-wrap justify-center gap-4">
            <Link href="/products">
              <Button size="lg" className="gap-2 font-semibold shadow-md shadow-rose-200/50">
                Browse Catalog
                <ArrowRight className="h-4 w-4" />
              </Button>
            </Link>
            <Link href="/dashboard">
              <Button variant="outline" size="lg" className="border-rose-200 hover:bg-rose-50/80">
                Admin Portal
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Tech Stack Grid */}
      <section className="container mx-auto max-w-6xl px-4 sm:px-6 lg:px-8 py-16">
        <div className="mb-10 text-center">
          <h2 className="text-2xl font-bold tracking-tight text-neutral-900">
            Configured Tech Stack & Architecture
          </h2>
          <p className="mt-2 text-sm text-neutral-500">
            Verified modular layers, layout components, and route protection ready for feature implementation.
          </p>
        </div>

        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {techStack.map((tech) => {
            const Icon = tech.icon;
            return (
              <Card key={tech.title} className="transition-all hover:shadow-md border-rose-100/80 hover:border-rose-200">
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-base font-semibold">
                    {tech.title}
                  </CardTitle>
                  <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-rose-50 text-rose-600 border border-rose-100/80">
                    <Icon className="h-4 w-4" />
                  </div>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-neutral-600 leading-normal">
                    {tech.description}
                  </p>
                  <div className="mt-4 flex items-center gap-1.5 text-xs font-medium text-rose-700">
                    <CheckCircle2 className="h-3.5 w-3.5 text-rose-600" />
                    <span>{tech.status}</span>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>
      </section>
    </div>
  );
}
