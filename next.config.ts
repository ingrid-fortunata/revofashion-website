import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "**.supabase.co",
      },
      {
        protocol: "https",
        hostname: "images.unsplash.com",
      },
      {
        protocol: "https",
        hostname: "revofashion-shop.onrender.com",
      },
      {
        protocol: "https",
        hostname: "placehold.co",
      },
    ],
  },
  // Disable automatic generation of AGENTS.md and CLAUDE.md
  agentRules: false,
};

export default nextConfig;
