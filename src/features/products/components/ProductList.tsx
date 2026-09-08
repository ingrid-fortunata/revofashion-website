"use client";

import React, { useCallback, useMemo } from "react";
import { useRouter, usePathname, useSearchParams } from "next/navigation";
import { X } from "lucide-react";
import { SearchBar } from "./SearchBar";
import { CategoryFilter } from "./CategoryFilter";
import { FashionFilters } from "./FashionFilters";
import { ProductGrid } from "./ProductGrid";
import { ProductPagination } from "./ProductPagination";
import { useProductsQuery } from "../hooks/useProductsQuery";
import { Product, ProductFilterParams, ProductListResponse } from "@/types/product";

interface ProductListProps {
  products: Product[];
  initialResponse?: ProductListResponse;
}

export function ProductList({
  products: initialProducts,
  initialResponse,
}: ProductListProps) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  // Extract filter parameters from useSearchParams
  const currentSearch = searchParams.get("search") || undefined;
  const currentCategoryId = searchParams.get("category_id")
    ? Number(searchParams.get("category_id"))
    : undefined;
  const currentGender = searchParams.get("gender") || undefined;
  const currentSize = searchParams.get("size") || undefined;
  const currentSortBy =
    (searchParams.get("sort_by") as ProductFilterParams["sort_by"]) || "newest";
  const currentPage = searchParams.get("page")
    ? Number(searchParams.get("page"))
    : 1;

  const hasActiveFilters = Boolean(
    currentSearch ||
      currentCategoryId !== undefined ||
      currentGender ||
      currentSize ||
      currentSortBy !== "newest" ||
      currentPage > 1
  );

  const queryParams: ProductFilterParams = useMemo(
    () => ({
      search: currentSearch,
      category_id: currentCategoryId,
      gender: currentGender,
      size: currentSize,
      sort_by: currentSortBy,
      page: currentPage,
      per_page: 12,
    }),
    [
      currentSearch,
      currentCategoryId,
      currentGender,
      currentSize,
      currentSortBy,
      currentPage,
    ]
  );

  // TanStack Query handles fetching, caching, and re-fetching on query change without useEffect
  const {
    data: productResponse,
    isLoading,
    isError,
    refetch,
  } = useProductsQuery(queryParams, {
    initialData:
      !hasActiveFilters && initialResponse
        ? initialResponse
        : !hasActiveFilters && initialProducts?.length
        ? {
            data: initialProducts,
            page: 1,
            per_page: 12,
            total: initialProducts.length,
            pages: Math.max(1, Math.ceil(initialProducts.length / 12)),
          }
        : undefined,
  });

  const products =
    productResponse?.data ??
    (hasActiveFilters ? [] : (initialResponse?.data ?? initialProducts));
  const totalPages =
    productResponse?.pages ?? initialResponse?.pages ?? 1;
  const totalProducts =
    productResponse?.total ?? initialResponse?.total ?? products.length;

  // Update query parameters in URL
  const updateFilters = useCallback(
    (newParams: Partial<ProductFilterParams>) => {
      const params = new URLSearchParams(searchParams.toString());

      Object.entries(newParams).forEach(([key, val]) => {
        if (val === undefined || val === null || val === "" || val === "All") {
          params.delete(key);
        } else {
          params.set(key, String(val));
        }
      });

      if (!("page" in newParams)) {
        params.delete("page");
      }

      const queryString = params.toString();
      router.push(queryString ? `${pathname}?${queryString}` : pathname, {
        scroll: false,
      });
    },
    [pathname, router, searchParams]
  );

  // Clear all filters
  const resetFilters = useCallback(() => {
    router.push(pathname, { scroll: false });
  }, [pathname, router]);

  // Active filter chip descriptors
  const activeChips = useMemo(() => {
    const chips: { key: string; label: string; onRemove: () => void }[] = [];

    if (currentSearch) {
      chips.push({
        key: "search",
        label: `Search: "${currentSearch}"`,
        onRemove: () => updateFilters({ search: undefined }),
      });
    }

    if (currentCategoryId !== undefined) {
      chips.push({
        key: "category",
        label: `Category ID: ${currentCategoryId}`,
        onRemove: () => updateFilters({ category_id: undefined }),
      });
    }

    if (currentGender && currentGender !== "All") {
      chips.push({
        key: "gender",
        label: `Gender: ${currentGender}`,
        onRemove: () => updateFilters({ gender: undefined }),
      });
    }

    if (currentSize && currentSize !== "All") {
      chips.push({
        key: "size",
        label: `Size: ${currentSize}`,
        onRemove: () => updateFilters({ size: undefined }),
      });
    }

    if (currentSortBy && currentSortBy !== "newest") {
      const sortLabels: Record<string, string> = {
        oldest: "Oldest First",
        price_asc: "Price: Low to High",
        price_desc: "Price: High to Low",
      };
      chips.push({
        key: "sort_by",
        label: `Sort: ${sortLabels[currentSortBy] || currentSortBy.replace("_", " ")}`,
        onRemove: () => updateFilters({ sort_by: "newest" }),
      });
    }

    return chips;
  }, [
    currentSearch,
    currentCategoryId,
    currentGender,
    currentSize,
    currentSortBy,
    updateFilters,
  ]);

  return (
    <div className="flex flex-col gap-6">
      {/* SearchBar navigates to /products?search=${query} on Enter */}
      <SearchBar />

      {/* CategoryFilter dropdown and pills */}
      <CategoryFilter
        selectedCategoryId={currentCategoryId}
        onSelectCategory={(catId) => updateFilters({ category_id: catId })}
      />

      {/* Fashion & Sorting Filter Toolbar */}
      <FashionFilters
        filters={{
          search: currentSearch,
          category_id: currentCategoryId,
          gender: currentGender,
          size: currentSize,
          sort_by: currentSortBy,
          page: currentPage,
        }}
        onChange={updateFilters}
        onReset={resetFilters}
        totalProducts={totalProducts}
      />

      {/* Active Filter Chips */}
      {activeChips.length > 0 && (
        <div className="flex flex-wrap items-center gap-2 pt-1">
          <span className="text-[11px] font-semibold uppercase tracking-wider text-neutral-400">
            Active:
          </span>
          {activeChips.map((chip) => (
            <span
              key={chip.key}
              className="inline-flex items-center gap-1.5 rounded-full border border-rose-200 bg-rose-50/70 px-3 py-1 text-xs font-medium text-rose-800 transition-all hover:bg-rose-100"
            >
              <span>{chip.label}</span>
              <button
                type="button"
                onClick={chip.onRemove}
                aria-label={`Remove filter ${chip.label}`}
                className="flex h-3.5 w-3.5 items-center justify-center rounded-full hover:bg-rose-200 text-rose-600 cursor-pointer"
              >
                <X className="h-2.5 w-2.5" />
              </button>
            </span>
          ))}
          <button
            type="button"
            onClick={resetFilters}
            className="text-xs font-semibold text-rose-600 hover:text-rose-700 underline underline-offset-2 ml-1 cursor-pointer"
          >
            Clear all
          </button>
        </div>
      )}

      {/* Error state */}
      {isError && (
        <div className="rounded-2xl border border-rose-200 bg-rose-50/50 p-6 text-center">
          <p className="text-sm font-medium text-rose-900">
            Unable to load products. Please check your connection and try again.
          </p>
          <button
            type="button"
            onClick={() => refetch()}
            className="mt-3 rounded-lg bg-rose-600 px-4 py-2 text-xs font-semibold text-white shadow-xs hover:bg-rose-700 cursor-pointer"
          >
            Retry
          </button>
        </div>
      )}

      {/* Products Grid */}
      <ProductGrid
        products={products}
        isLoading={isLoading}
        onResetFilters={activeChips.length > 0 ? resetFilters : undefined}
      />

      {/* Pagination Controls */}
      {!isLoading && totalPages > 1 && (
        <ProductPagination
          page={currentPage}
          pages={totalPages}
          onPageChange={(newPage) => updateFilters({ page: newPage })}
        />
      )}
    </div>
  );
}
