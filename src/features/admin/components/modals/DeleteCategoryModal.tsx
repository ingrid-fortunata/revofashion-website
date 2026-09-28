"use client";

import React, { useState } from "react";
import { useQueryClient } from "@tanstack/react-query";
import { ConfirmDialog } from "@/components/common";
import { categoryService } from "@/features/products";
import { showToast } from "@/lib/toast";
import { Category } from "@/types/category";
import { ApiError } from "@/types/api";

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
    } catch (err: unknown) {
      // Extract backend error message directly as per docs/guideline/error_codes.md
      let errorMessage = "Cannot delete category with linked products.";

      if (err instanceof ApiError) {
        // Backend returns: { "error_code": "CATEGORY_CONFLICT", "message": "..." }
        errorMessage = err.message;
      } else if (err instanceof Error) {
        errorMessage = err.message;
      }

      setConflictError(errorMessage);
    } finally {
      setIsDeleting(false);
    }
  };

  if (!category) return null;

  return (
    <ConfirmDialog
      open={open}
      onOpenChange={handleOpenChange}
      title="Delete Category"
      description="Are you sure you want to delete this category?"
      variant="danger"
      confirmLabel="Delete Category"
      isSubmitting={isDeleting}
      onConfirm={handleConfirmDelete}
      conflictError={conflictError}
      conflictTip="Tip: Reassign or remove all products belonging to this category before deleting it."
    >
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
    </ConfirmDialog>
  );
}

export default DeleteCategoryModal;
