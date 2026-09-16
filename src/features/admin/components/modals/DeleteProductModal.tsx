"use client";

import React, { useState } from "react";
import Image from "next/image";
import { useQueryClient } from "@tanstack/react-query";
import {
  Dialog,
  DialogPopup,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { productService } from "@/features/products";
import { showToast } from "@/lib/toast";
import { Product } from "@/types/product";
import { Trash2, AlertTriangle, AlertCircle, Loader2 } from "lucide-react";

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
    } catch (err: any) {
      // Catch active order conflict (409/400) or general errors
      const errorMessage =
        err?.message ||
        err?.response?.data?.message ||
        "Cannot delete product with active orders or associated data.";

      setConflictError(errorMessage);
      showToast.error(errorMessage);
    } finally {
      setIsDeleting(false);
    }
  };

  if (!product) return null;

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogPopup className="max-w-md">
        <DialogHeader>
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-red-100 flex items-center justify-center text-red-600 flex-shrink-0">
              <AlertTriangle className="w-5 h-5" />
            </div>
            <div>
              <DialogTitle className="text-base font-bold text-neutral-900">
                Delete Product
              </DialogTitle>
              <DialogDescription className="text-xs text-neutral-500 mt-0.5">
                Are you sure you want to permanently delete this product?
              </DialogDescription>
            </div>
          </div>
        </DialogHeader>

        {/* Conflict / Active Order Error Alert */}
        {conflictError && (
          <div className="p-3 bg-red-50 border border-red-200 rounded-xl flex items-start gap-2.5 text-xs text-red-800">
            <AlertCircle className="w-4 h-4 text-red-600 flex-shrink-0 mt-0.5" />
            <div className="flex-1 space-y-1">
              <p className="font-bold">Deletion Restricted</p>
              <p className="text-red-700 leading-relaxed">{conflictError}</p>
              <p className="text-[11px] text-red-600/80 pt-1">
                Tip: If this product has active or ongoing customer orders, it cannot be deleted until those orders are fulfilled or cancelled.
              </p>
            </div>
          </div>
        )}

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

        <DialogFooter className="pt-2 border-t border-neutral-100 flex items-center justify-end gap-2">
          <Button
            type="button"
            variant="outline"
            size="sm"
            disabled={isDeleting}
            onClick={() => handleOpenChange(false)}
            className="text-xs font-semibold h-9 px-4"
          >
            Cancel
          </Button>
          <Button
            type="button"
            size="sm"
            disabled={isDeleting}
            onClick={handleConfirmDelete}
            className="bg-red-600 hover:bg-red-700 text-white text-xs font-semibold h-9 px-4 gap-1.5"
          >
            {isDeleting ? (
              <>
                <Loader2 className="w-3.5 h-3.5 animate-spin" />
                Deleting...
              </>
            ) : (
              <>
                <Trash2 className="w-3.5 h-3.5" />
                Delete Product
              </>
            )}
          </Button>
        </DialogFooter>
      </DialogPopup>
    </Dialog>
  );
}
