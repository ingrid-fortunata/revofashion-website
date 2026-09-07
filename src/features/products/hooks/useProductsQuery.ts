"use client";

import { useQuery } from "@tanstack/react-query";
import { productService } from "../services/product.service";
import { ProductFilterParams, ProductListResponse } from "@/types/product";

export function useProductsQuery(
  params?: ProductFilterParams,
  options?: { initialData?: ProductListResponse }
) {
  return useQuery({
    queryKey: ["products", params],
    queryFn: () => productService.getProducts(params),
    staleTime: 1000 * 60 * 2, // 2 minutes
    ...options,
  });
}
