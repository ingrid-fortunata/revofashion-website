"use client";

import React, { useState, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Search, X } from "lucide-react";

interface SearchBarProps {
  placeholder?: string;
  className?: string;
}

export function SearchBar({
  placeholder = "Search products by name...",
  className = "",
}: SearchBarProps) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const currentSearch = searchParams.get("search") || "";

  const [query, setQuery] = useState(currentSearch);

  // Read search query parameter using useSearchParams to display current search value
  useEffect(() => {
    setQuery(searchParams.get("search") || "");
  }, [searchParams]);

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      e.preventDefault();
      router.push(`/products?search=${query}`);
    }
  };

  const handleClear = () => {
    setQuery("");
    router.push("/products");
  };

  return (
    <div className={`relative w-full ${className}`}>
      <div className="relative flex items-center">
        <Search className="pointer-events-none absolute left-3.5 h-4 w-4 text-neutral-400" />
        <input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder={placeholder}
          aria-label="Search products"
          className="h-11 w-full rounded-full border border-rose-100 bg-white/90 pl-10 pr-10 text-sm text-neutral-900 placeholder:text-neutral-400 shadow-xs backdrop-blur-xs transition-all duration-200 focus:border-rose-400 focus:bg-white focus:outline-none focus:ring-2 focus:ring-rose-200/60"
        />
        {query && (
          <button
            type="button"
            onClick={handleClear}
            aria-label="Clear search"
            className="absolute right-3 flex h-5 w-5 items-center justify-center rounded-full bg-neutral-200/80 text-neutral-600 transition-colors hover:bg-neutral-300 hover:text-neutral-900 cursor-pointer"
          >
            <X className="h-3 w-3" />
          </button>
        )}
      </div>
    </div>
  );
}
