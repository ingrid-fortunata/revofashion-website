"use client";

import React from "react";
import { SearchInput } from "@/components/common/SearchInput";

export interface ProductSearchProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  className?: string;
}

/**
 * ProductSearch component wrapping the common SearchInput with catalog styling.
 */
export function ProductSearch({
  value,
  onChange,
  placeholder = "Search products by name...",
  className = "",
}: ProductSearchProps) {
  return (
    <SearchInput
      value={value}
      onChange={onChange}
      debounceMs={350}
      placeholder={placeholder}
      size="lg"
      className="border-primary-100 bg-white/90 shadow-xs backdrop-blur-xs focus:border-primary-400 focus:bg-white focus:ring-primary-200/60"
      containerClassName={className}
    />
  );
}

export default ProductSearch;
