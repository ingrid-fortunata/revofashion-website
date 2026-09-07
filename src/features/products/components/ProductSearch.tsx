"use client";

import React, { useState, useEffect } from "react";
import { Search, X } from "lucide-react";
import { useDebounce } from "../hooks/useDebounce";

interface ProductSearchProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  className?: string;
}

export function ProductSearch({
  value,
  onChange,
  placeholder = "Search garments, fabrics, colors...",
  className = "",
}: ProductSearchProps) {
  const [prevValue, setPrevValue] = useState(value);
  const [internalValue, setInternalValue] = useState(value);
  const debouncedValue = useDebounce(internalValue, 350);

  // Synchronize state when prop changes without triggering cascading effect renders
  if (value !== prevValue) {
    setPrevValue(value);
    setInternalValue(value);
  }

  // Propagate debounced changes
  useEffect(() => {
    if (debouncedValue !== value) {
      onChange(debouncedValue);
    }
  }, [debouncedValue, onChange, value]);

  const handleClear = () => {
    setInternalValue("");
    onChange("");
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onChange(internalValue);
  };

  return (
    <form onSubmit={handleSubmit} className={`relative w-full ${className}`}>
      <div className="relative flex items-center">
        <Search className="pointer-events-none absolute left-3.5 h-4 w-4 text-neutral-400" />
        <input
          type="text"
          value={internalValue}
          onChange={(e) => setInternalValue(e.target.value)}
          placeholder={placeholder}
          className="h-11 w-full rounded-full border border-rose-100 bg-white/90 pl-10 pr-10 text-sm text-neutral-900 placeholder:text-neutral-400 shadow-xs backdrop-blur-xs transition-all duration-200 focus:border-rose-400 focus:bg-white focus:outline-none focus:ring-2 focus:ring-rose-200/60"
        />
        {internalValue && (
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
    </form>
  );
}
