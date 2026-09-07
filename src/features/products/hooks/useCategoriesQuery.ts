"use client";

import { useQuery } from "@tanstack/react-query";
import { categoryService } from "../services/category.service";

export function useCategoriesQuery() {
  return useQuery({
    queryKey: ["categories"],
    queryFn: () => categoryService.getCategories(),
    staleTime: 1000 * 60 * 10, // 10 minutes
  });
}
