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
    description: "Client-side stores with localStorage persistence for cart & auth.",
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

export default function Home() {
  return (
    <div className="flex min-h-screen flex-col">
      {/* Top Banner */}
      <header className="border-b border-zinc-200 bg-white">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-4">
          <div className="flex items-center gap-3">
            <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-zinc-950 text-white">
              <ShoppingBag className="h-5 w-5" />
            </div>
            <div>
              <span className="font-bold tracking-tight text-zinc-950 text-lg">
                RevoShop
              </span>
              <span className="ml-2 text-xs font-medium text-zinc-500">
                Fashion E-Commerce
              </span>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <Badge variant="success">Setup Completed</Badge>
            <Badge variant="outline">Next.js 16.3.4</Badge>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <main className="flex-1">
        <section className="bg-gradient-to-b from-white to-zinc-50 py-16 sm:py-24 border-b border-zinc-200">
          <div className="mx-auto max-w-5xl px-6 text-center">
            <Badge variant="secondary" className="mb-4 gap-1.5 px-3 py-1">
              <Sparkles className="h-3.5 w-3.5 text-amber-500" />
              Feature Plan 01: Project Initiation & Architecture
            </Badge>
            <h1 className="text-4xl font-extrabold tracking-tight text-zinc-950 sm:text-6xl">
              RevoShop Frontend
            </h1>
            <p className="mx-auto mt-6 max-w-2xl text-lg text-zinc-600 leading-relaxed">
              Engineered with modern frontend standards, atomic component
              architecture, and seamless integration with the RevoFashion REST
              API.
            </p>
            <div className="mt-8 flex flex-wrap justify-center gap-4">
              <Link href="/products">
                <Button size="lg" className="gap-2">
                  Browse Catalog
                  <ArrowRight className="h-4 w-4" />
                </Button>
              </Link>
              <Link href="/dashboard">
                <Button variant="outline" size="lg">
                  Admin Dashboard
                </Button>
              </Link>
            </div>
          </div>
        </section>

        {/* Tech Stack Grid */}
        <section className="mx-auto max-w-6xl px-6 py-16">
          <div className="mb-10 text-center">
            <h2 className="text-2xl font-bold tracking-tight text-zinc-950">
              Configured Tech Stack & Architecture
            </h2>
            <p className="mt-2 text-sm text-zinc-500">
              Verified libraries and tools ready for feature implementation.
            </p>
          </div>

          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {techStack.map((tech) => {
              const Icon = tech.icon;
              return (
                <Card key={tech.title} className="transition-all hover:shadow-md">
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-base font-semibold">
                      {tech.title}
                    </CardTitle>
                    <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-zinc-100 text-zinc-900">
                      <Icon className="h-4 w-4" />
                    </div>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm text-zinc-600 leading-normal">
                      {tech.description}
                    </p>
                    <div className="mt-4 flex items-center gap-1.5 text-xs font-medium text-emerald-600">
                      <CheckCircle2 className="h-3.5 w-3.5" />
                      <span>{tech.status}</span>
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </section>
      </main>

      {/* Semantic Footer */}
      <footer className="border-t border-zinc-200 bg-white py-8 text-center text-xs text-zinc-500">
        <p>© 2026 RevoShop / RevoFashion. Built with Next.js 16.3.4 & Base UI.</p>
      </footer>
    </div>
  );
}
