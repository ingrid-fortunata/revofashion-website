"use client";

import React, { useState } from "react";
import Image from "next/image";
import { useQueryClient } from "@tanstack/react-query";
import { ConfirmDialog } from "@/components/common";
import { productService } from "@/features/products";
import { showToast } from "@/lib/toast";
import { Product } from "@/types/product";
import { ApiError } from "@/types/api";

interface DeleteProductModalProps {
  product: Product | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function DeleteProductModal({
  product,
  open,
  onOpenChange,
}: DeleteProductModalProps) {
  const queryClient = useQueryClient();
  const [isDeleting, setIsDeleting] = useState(false);
  const [conflictError, setConflictError] = useState<string | null>(null);

  const handleOpenChange = (nextOpen: boolean) => {
    if (!isDeleting) {
      onOpenChange(nextOpen);
      if (!nextOpen) {
        setConflictError(null);
      }
    }
  };

  const handleConfirmDelete = async () => {
    if (!product) return;
    setConflictError(null);
    setIsDeleting(true);

    try {
      await productService.deleteProduct(product.id);

      // Invalidate queries to refresh list
      await Promise.all([
        queryClient.invalidateQueries({ queryKey: ["admin-products"] }),
        queryClient.invalidateQueries({ queryKey: ["products"] }),
      ]);

      showToast.success(`Product "${product.name}" deleted successfully.`);
      onOpenChange(false);
    } catch (err: unknown) {
      // Extract backend error message directly as per docs/guideline/error_codes.md
      let errorMessage = "Cannot delete product with active orders or associated data.";

      if (err instanceof ApiError) {
        // Backend returns: { "error_code": "PRODUCT_CONFLICT", "message": "..." }
        errorMessage = err.message;
      } else if (err instanceof Error) {
        errorMessage = err.message;
      }

      setConflictError(errorMessage);
    } finally {
      setIsDeleting(false);
    }
  };

  if (!product) return null;

  return (
    <ConfirmDialog
      open={open}
      onOpenChange={handleOpenChange}
      title="Delete Product"
      description="Are you sure you want to permanently delete this product?"
      variant="danger"
      confirmLabel="Delete Product"
      isSubmitting={isDeleting}
      onConfirm={handleConfirmDelete}
      conflictError={conflictError}
      conflictTip="Tip: If this product has active or ongoing customer orders, it cannot be deleted until those orders are fulfilled or cancelled."
    >
      {/* Product Snapshot Card */}
      <div className="flex items-center gap-3 p-3 bg-neutral-50 border border-neutral-200 rounded-xl">
        <div className="relative h-14 w-14 flex-shrink-0 bg-white rounded-lg overflow-hidden border border-neutral-200 flex items-center justify-center">
          <Image
            src={product.primary_image || "/images/no-photo.png"}
            alt={product.name}
            fill
            unoptimized
            className="object-contain p-1"
            onError={(e) => {
              (e.target as HTMLImageElement).src = "/images/no-photo.png";
            }}
          />
        </div>
        <div className="flex-1 min-w-0">
          <h4 className="text-xs font-bold text-neutral-900 truncate">
            {product.name}
          </h4>
          <div className="flex items-center gap-2 mt-1">
            <span className="font-mono text-[11px] font-semibold text-neutral-500 bg-neutral-100 px-1.5 py-0.5 rounded">
              {product.sku}
            </span>
            <span className="text-[11px] font-semibold text-neutral-900">
              ${Number(product.price).toFixed(2)}
            </span>
            <span className="text-[11px] text-neutral-500">
              Stock: {product.stock}
            </span>
          </div>
        </div>
      </div>
    </ConfirmDialog>
  );
}

export default DeleteProductModal;
