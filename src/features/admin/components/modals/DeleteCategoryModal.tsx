"use client";

import React, { useState } from "react";
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
import { categoryService } from "@/features/products";
import { showToast } from "@/lib/toast";
import { Category } from "@/types/category";
import { Trash2, AlertTriangle, AlertCircle, Loader2 } from "lucide-react";

interface DeleteCategoryModalProps {
  category: Category | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function DeleteCategoryModal({
  category,
  open,
  onOpenChange,
}: DeleteCategoryModalProps) {
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
    if (!category) return;
    setConflictError(null);
    setIsDeleting(true);

    try {
      await categoryService.deleteCategory(category.id);

      await Promise.all([
        queryClient.invalidateQueries({ queryKey: ["categories"] }),
        queryClient.invalidateQueries({ queryKey: ["admin-products"] }),
      ]);

      showToast.success(`Category "${category.name}" deleted successfully.`);
      onOpenChange(false);
    } catch (err: any) {
      const status = err?.status || err?.response?.status;
      const errorMessage =
        status === 409 || err?.message?.toLowerCase().includes("product")
          ? "Cannot delete category with linked products."
          : err?.message || "Failed to delete category.";

      setConflictError(errorMessage);
      showToast.error(errorMessage);
    } finally {
      setIsDeleting(false);
    }
  };

  if (!category) return null;

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
                Delete Category
              </DialogTitle>
              <DialogDescription className="text-xs text-neutral-500 mt-0.5">
                Are you sure you want to delete this category?
              </DialogDescription>
            </div>
          </div>
        </DialogHeader>

        {/* Conflict Alert (Linked Products) */}
        {conflictError && (
          <div className="p-3 bg-red-50 border border-red-200 rounded-xl flex items-start gap-2.5 text-xs text-red-800">
            <AlertCircle className="w-4 h-4 text-red-600 flex-shrink-0 mt-0.5" />
            <div className="flex-1 space-y-1">
              <p className="font-bold">Deletion Restricted</p>
              <p className="text-red-700 leading-relaxed">{conflictError}</p>
              <p className="text-[11px] text-red-600/80 pt-1">
                Tip: Reassign or remove all products belonging to this category before deleting it.
              </p>
            </div>
          </div>
        )}

        {/* Category Snapshot */}
        <div className="p-3.5 bg-neutral-50 border border-neutral-200 rounded-xl space-y-1">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-neutral-900">
              {category.name}
            </span>
            <span className="font-mono text-[10px] bg-neutral-200/70 text-neutral-600 px-1.5 py-0.5 rounded">
              ID: {category.id}
            </span>
          </div>
          <p className="text-xs text-neutral-500 line-clamp-2">
            {category.description || "No description provided."}
          </p>
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
                Delete Category
              </>
            )}
          </Button>
        </DialogFooter>
      </DialogPopup>
    </Dialog>
  );
}
