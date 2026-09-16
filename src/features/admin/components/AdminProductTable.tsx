"use client";

import React from "react";
import Image from "next/image";
import {
  Table,
  TableHeader,
  TableBody,
  TableHead,
  TableRow,
  TableCell,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Product } from "@/types/product";
import { Category } from "@/types/category";
import { Edit, Trash2, ChevronLeft, ChevronRight, PackageOpen } from "lucide-react";

interface AdminProductTableProps {
  products: Product[];
  categories: Category[];
  isLoading: boolean;
  currentPage: number;
  totalPages: number;
  totalProducts: number;
  pageSize: number;
  onPageChange: (page: number) => void;
  onEdit: (product: Product) => void;
  onDelete: (product: Product) => void;
}

export function AdminProductTable({
  products,
  categories,
  isLoading,
  currentPage,
  totalPages,
  totalProducts,
  pageSize,
  onPageChange,
  onEdit,
  onDelete,
}: AdminProductTableProps) {
  // Quick lookup for category name by category_id
  const categoryMap = React.useMemo(() => {
    const map = new Map<number, string>();
    categories.forEach((cat) => map.set(cat.id, cat.name));
    return map;
  }, [categories]);

  if (isLoading) {
    return (
      <div className="bg-white rounded-xl border border-primary-100/80 shadow-xs shadow-primary-100/20 overflow-hidden">
        <div className="p-4 space-y-3">
          {[...Array(6)].map((_, i) => (
            <div
              key={i}
              className="h-14 bg-neutral-100/70 rounded-lg animate-pulse"
            />
          ))}
        </div>
      </div>
    );
  }

  if (products.length === 0) {
    return (
      <div className="bg-white rounded-xl border border-primary-100/80 p-12 text-center shadow-xs shadow-primary-100/20">
        <div className="w-12 h-12 rounded-full bg-primary-50 flex items-center justify-center text-primary-400 mx-auto mb-3">
          <PackageOpen className="w-6 h-6" />
        </div>
        <h3 className="text-sm font-bold text-neutral-800">
          No Products Found
        </h3>
        <p className="text-xs text-neutral-500 mt-1 max-w-sm mx-auto">
          No products match your current search or filter criteria. Try adjusting the filters or add a new product.
        </p>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-xl border border-primary-100/80 shadow-xs shadow-primary-100/20 overflow-hidden">
      <div className="overflow-x-auto">
        <Table>
          <TableHeader className="bg-primary-50/40 border-b border-primary-100/80">
            <TableRow className="hover:bg-transparent">
              <TableHead className="w-[320px] text-xs font-bold text-neutral-600 uppercase tracking-wider">
                Product Details
              </TableHead>
              <TableHead className="text-xs font-bold text-neutral-600 uppercase tracking-wider">
                Category
              </TableHead>
              <TableHead className="text-xs font-bold text-neutral-600 uppercase tracking-wider">
                Price
              </TableHead>
              <TableHead className="text-xs font-bold text-neutral-600 uppercase tracking-wider">
                Inventory
              </TableHead>
              <TableHead className="text-xs font-bold text-neutral-600 uppercase tracking-wider">
                Specs
              </TableHead>
              <TableHead className="text-xs font-bold text-neutral-600 uppercase tracking-wider">
                Status
              </TableHead>
              <TableHead className="text-right text-xs font-bold text-neutral-600 uppercase tracking-wider pr-6">
                Actions
              </TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {products.map((product) => {
              const categoryName = product.category_id
                ? categoryMap.get(product.category_id) || "Uncategorized"
                : "Uncategorized";

              const primaryImg =
                product.primary_image ||
                (product.images && product.images.length > 0
                  ? product.images[0].image_base64
                  : "/images/no-photo.png");

              // Stock health determination
              let stockBadge = (
                <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md text-[11px] font-semibold bg-emerald-50 text-emerald-700 border border-emerald-200">
                  {product.stock} in stock
                </span>
              );
              if (product.stock === 0) {
                stockBadge = (
                  <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md text-[11px] font-semibold bg-red-50 text-red-700 border border-red-200">
                    Out of stock
                  </span>
                );
              } else if (product.stock <= 10) {
                stockBadge = (
                  <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md text-[11px] font-semibold bg-amber-50 text-amber-700 border border-amber-200">
                    {product.stock} low stock
                  </span>
                );
              }

              return (
                <TableRow
                  key={product.id}
                  className="hover:bg-primary-50/30 transition-colors"
                >
                  {/* Product Details (Thumbnail, Name, SKU, Color) */}
                  <TableCell className="py-3">
                    <div className="flex items-center gap-3">
                      <div className="relative h-12 w-12 flex-shrink-0 bg-neutral-50 border border-neutral-200 rounded-lg overflow-hidden flex items-center justify-center">
                        <img
                          src={primaryImg}
                          alt={product.name}
                          className="h-full w-full object-cover"
                          onError={(e) => {
                            (e.target as HTMLImageElement).src = "/images/no-photo.png";
                          }}
                        />
                      </div>
                      <div className="min-w-0 flex-1">
                        <p className="text-xs font-bold text-neutral-900 truncate">
                          {product.name}
                        </p>
                        <p className="text-[11px] text-neutral-400 font-mono">
                          {product.sku || "NO-SKU"}
                        </p>
                        {product.color && (
                          <span className="text-[10px] text-neutral-500 font-medium">
                            Color: {product.color}
                          </span>
                        )}
                      </div>
                    </div>
                  </TableCell>

                  {/* Category */}
                  <TableCell className="py-3">
                    <span className="inline-flex items-center px-2 py-0.5 rounded-md text-xs font-medium bg-neutral-100 text-neutral-700 border border-neutral-200">
                      {categoryName}
                    </span>
                  </TableCell>

                  {/* Price */}
                  <TableCell className="py-3">
                    <div className="text-xs font-bold text-neutral-900">
                      ${Number(product.price).toFixed(2)}
                    </div>
                  </TableCell>

                  {/* Inventory Status */}
                  <TableCell className="py-3">
                    {stockBadge}
                  </TableCell>

                  {/* Specs (Size, Gender) */}
                  <TableCell className="py-3">
                    <div className="flex flex-col gap-0.5 text-xs text-neutral-500">
                      <span>Size: <strong className="text-neutral-700">{product.size}</strong></span>
                      <span>Target: <strong className="text-neutral-700">{product.gender}</strong></span>
                    </div>
                  </TableCell>

                  {/* Operational Status (Active/Inactive) */}
                  <TableCell className="py-3">
                    {product.is_active ? (
                      <span className="inline-flex items-center gap-1 text-xs font-semibold text-emerald-700">
                        <span className="w-1.5 h-1.5 rounded-full bg-emerald-600" />
                        Active
                      </span>
                    ) : (
                      <span className="inline-flex items-center gap-1 text-xs font-semibold text-neutral-400">
                        <span className="w-1.5 h-1.5 rounded-full bg-neutral-300" />
                        Archived
                      </span>
                    )}
                  </TableCell>

                  {/* Actions (Edit, Delete) */}
                  <TableCell className="py-3 text-right pr-6">
                    <div className="inline-flex items-center gap-1">
                      <Button
                        type="button"
                        variant="ghost"
                        size="icon"
                        onClick={() => onEdit(product)}
                        data-testid={`edit-product-${product.id}`}
                        className="h-8 w-8 text-neutral-600 hover:text-primary-700 hover:bg-primary-50/80 rounded-lg"
                        title="Edit product"
                      >
                        <Edit className="w-3.5 h-3.5" />
                        <span className="sr-only">Edit {product.name}</span>
                      </Button>
                      <Button
                        type="button"
                        variant="ghost"
                        size="icon"
                        onClick={() => onDelete(product)}
                        data-testid={`delete-product-${product.id}`}
                        className="h-8 w-8 text-neutral-400 hover:text-red-600 hover:bg-red-50 rounded-lg"
                        title="Delete product"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                        <span className="sr-only">Delete {product.name}</span>
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              );
            })}
          </TableBody>
        </Table>
      </div>

      {/* Pagination Footer */}
      {totalPages > 1 && (
        <div className="px-6 py-3 border-t border-primary-100/80 bg-primary-50/20 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-neutral-600">
          <div>
            Showing{" "}
            <strong>
              {(currentPage - 1) * pageSize + 1}–
              {Math.min(currentPage * pageSize, totalProducts)}
            </strong>{" "}
            of <strong>{totalProducts}</strong> products
          </div>

          <div className="flex items-center gap-1">
            <Button
              type="button"
              variant="outline"
              size="sm"
              disabled={currentPage <= 1}
              onClick={() => onPageChange(currentPage - 1)}
              className="h-8 px-2.5 text-xs gap-1 border-primary-200/70 hover:bg-primary-50 hover:text-primary-700"
            >
              <ChevronLeft className="w-3.5 h-3.5" />
              Previous
            </Button>

            <div className="flex items-center gap-1 px-1">
              {[...Array(totalPages)].map((_, idx) => {
                const pageNum = idx + 1;
                // Show first, last, and pages adjacent to current
                if (
                  pageNum === 1 ||
                  pageNum === totalPages ||
                  Math.abs(pageNum - currentPage) <= 1
                ) {
                  return (
                    <Button
                      key={pageNum}
                      type="button"
                      variant={pageNum === currentPage ? "default" : "outline"}
                      size="sm"
                      onClick={() => onPageChange(pageNum)}
                      className={`h-8 w-8 p-0 text-xs font-semibold ${
                        pageNum === currentPage
                          ? "bg-primary-600 text-white shadow-sm shadow-primary-200/50 hover:bg-primary-700"
                          : "text-neutral-700 border-primary-200/70 hover:bg-primary-50 hover:text-primary-700"
                      }`}
                    >
                      {pageNum}
                    </Button>
                  );
                }
                if (
                  pageNum === 2 &&
                  currentPage > 3
                ) {
                  return (
                    <span key="dots-start" className="px-1 text-neutral-400">
                      ...
                    </span>
                  );
                }
                if (
                  pageNum === totalPages - 1 &&
                  currentPage < totalPages - 2
                ) {
                  return (
                    <span key="dots-end" className="px-1 text-neutral-400">
                      ...
                    </span>
                  );
                }
                return null;
              })}
            </div>

            <Button
              type="button"
              variant="outline"
              size="sm"
              disabled={currentPage >= totalPages}
              onClick={() => onPageChange(currentPage + 1)}
              className="h-8 px-2.5 text-xs gap-1 border-primary-200/70 hover:bg-primary-50 hover:text-primary-700"
            >
              Next
              <ChevronRight className="w-3.5 h-3.5" />
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}
