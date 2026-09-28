"use client";

import React, { useState, useEffect, useRef } from "react";
import { Search, X } from "lucide-react";
import { cn } from "@/lib/utils";

export interface SearchInputProps
  extends Omit<React.InputHTMLAttributes<HTMLInputElement>, "onChange" | "size"> {
  value: string;
  onChange: (value: string) => void;
  debounceMs?: number;
  onClear?: () => void;
  size?: "sm" | "md" | "lg";
  containerClassName?: string;
}

/**
 * Reusable controlled SearchInput with optional debounce, clear button,
 * and adaptive sizing for toolbars, search headers, and sidebars.
 */
export function SearchInput({
  value,
  onChange,
  debounceMs = 0,
  onClear,
  placeholder = "Search...",
  size = "md",
  className,
  containerClassName,
  disabled,
  ...restProps
}: SearchInputProps) {
  const [internalValue, setInternalValue] = useState(value);
  const [prevValue, setPrevValue] = useState(value);
  const isFirstMount = useRef(true);

  // Sync internal state with external value changes during render (React 19 pattern)
  if (prevValue !== value) {
    setPrevValue(value);
    setInternalValue(value);
  }

  // Handle debounce if specified
  useEffect(() => {
    if (debounceMs <= 0) return;
    if (isFirstMount.current) {
      isFirstMount.current = false;
      return;
    }

    const handler = setTimeout(() => {
      if (internalValue !== value) {
        onChange(internalValue);
      }
    }, debounceMs);

    return () => clearTimeout(handler);
  }, [internalValue, debounceMs, onChange, value]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const nextVal = e.target.value;
    setInternalValue(nextVal);
    if (debounceMs <= 0) {
      onChange(nextVal);
    }
  };

  const handleClear = () => {
    setInternalValue("");
    onChange("");
    onClear?.();
  };

  const sizeClasses = {
    sm: "py-1.5 pl-8 pr-7 text-xs rounded-lg",
    md: "py-2 pl-9 pr-9 text-xs rounded-lg",
    lg: "h-11 pl-10 pr-10 text-sm rounded-full",
  }[size];

  const iconSizes = {
    sm: "left-2.5 h-3.5 w-3.5",
    md: "left-3 h-4 w-4",
    lg: "left-3.5 h-4 w-4",
  }[size];

  return (
    <div className={cn("relative w-full", containerClassName)}>
      <div className="relative flex items-center">
        <Search
          className={cn(
            "pointer-events-none absolute top-1/2 -translate-y-1/2 text-neutral-400",
            iconSizes
          )}
        />
        <input
          type="text"
          value={internalValue}
          onChange={handleChange}
          disabled={disabled}
          placeholder={placeholder}
          aria-label={restProps["aria-label"] || placeholder}
          className={cn(
            "w-full border border-neutral-300 bg-white placeholder:text-neutral-400 text-neutral-900 transition-colors focus:outline-none focus:ring-2 focus:ring-primary-500/20 focus:border-primary-500 disabled:bg-neutral-100 disabled:cursor-not-allowed",
            sizeClasses,
            className
          )}
          {...restProps}
        />
        {internalValue && !disabled && (
          <button
            type="button"
            onClick={handleClear}
            aria-label="Clear search"
            className="absolute right-2.5 top-1/2 -translate-y-1/2 flex h-5 w-5 items-center justify-center rounded-full text-neutral-400 hover:text-neutral-700 hover:bg-neutral-100 transition-colors cursor-pointer"
          >
            <X className="h-3.5 w-3.5" />
          </button>
        )}
      </div>
    </div>
  );
}

export default SearchInput;
