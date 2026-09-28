"use client";

import React from "react";
import { Pagination, type PaginationProps } from "@/components/common/Pagination";

export type ProductPaginationProps = Pick<
  PaginationProps,
  "page" | "pages" | "onPageChange" | "className"
>;

export function ProductPagination(props: ProductPaginationProps) {
  return <Pagination variant="catalog" {...props} />;
}

export default ProductPagination;
