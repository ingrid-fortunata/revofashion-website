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
import { ApiError } from "@/types/api";
import { Edit3, Loader2, AlertCircle } from "lucide-react";

interface EditCategoryModalProps {
  category: Category | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function EditCategoryModal({
  category,
  open,
  onOpenChange,
}: EditCategoryModalProps) {
  const queryClient = useQueryClient();
  const [prevCategory, setPrevCategory] = useState(category);
  const [name, setName] = useState(category?.name || "");
  const [description, setDescription] = useState(category?.description || "");
  const [isActive, setIsActive] = useState(
    category?.is_active !== undefined ? category.is_active : true
  );

  const [nameError, setNameError] = useState<string | null>(null);
  const [generalError, setGeneralError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Sync state during render when selected category changes (React 19 pattern)
  if (prevCategory !== category) {
    setPrevCategory(category);
    setName(category?.name || "");
    setDescription(category?.description || "");
    setIsActive(category?.is_active !== undefined ? category.is_active : true);
    setNameError(null);
    setGeneralError(null);
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!category) return;
    setNameError(null);
    setGeneralError(null);

    const trimmedName = name.trim();
    if (!trimmedName) {
      setNameError("Category name is required.");
      return;
    }

    setIsSubmitting(true);
    try {
      await categoryService.updateCategory(category.id, {
        name: trimmedName,
        description: description.trim() || undefined,
        is_active: isActive,
      });

      await queryClient.invalidateQueries({ queryKey: ["categories"] });
      showToast.success(`Category "${trimmedName}" updated successfully!`);
      onOpenChange(false);
    } catch (err: unknown) {
      let message = "Failed to update category. Please check your inputs.";
      if (err instanceof ApiError) {
        message = err.message;
      } else if (err instanceof Error) {
        message = err.message;
      }

      setGeneralError(message);
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!category) return null;

  return (
    <Dialog
      open={open}
      onOpenChange={(next) => {
        if (!isSubmitting) {
          onOpenChange(next);
        }
      }}
    >
      <DialogPopup className="max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2 text-lg font-bold text-neutral-900">
            <Edit3 className="w-5 h-5 text-primary-600" />
            Edit Category
          </DialogTitle>
          <DialogDescription className="text-xs text-neutral-500">
            Modifying category <span className="font-semibold text-neutral-800">#{category.id}</span>
          </DialogDescription>
        </DialogHeader>

        {generalError && (
          <div className="flex items-start gap-2 p-3 bg-red-50 border border-red-200 rounded-xl text-xs text-red-700">
            <AlertCircle className="w-4 h-4 text-red-600 flex-shrink-0 mt-0.5" />
            <div className="flex-1 font-medium">{generalError}</div>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4 py-2">
          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-neutral-700">
              Category Name <span className="text-primary-500">*</span>
            </label>
            <input
              type="text"
              value={name}
              onChange={(e) => {
                setName(e.target.value);
                if (nameError) setNameError(null);
              }}
              disabled={isSubmitting}
              className="w-full px-3 py-2 text-xs border border-neutral-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500/20 focus:border-primary-500 bg-white"
            />
            {nameError && (
              <p className="text-[11px] text-red-600 font-medium">{nameError}</p>
            )}
          </div>

          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-neutral-700">
              Description
            </label>
            <textarea
              rows={3}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              disabled={isSubmitting}
              className="w-full px-3 py-2 text-xs border border-neutral-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500/20 focus:border-primary-500 bg-white resize-none"
            />
          </div>

          <div className="flex items-center gap-2 pt-1">
            <input
              type="checkbox"
              id="editCategoryActiveToggle"
              checked={isActive}
              onChange={(e) => setIsActive(e.target.checked)}
              disabled={isSubmitting}
              className="rounded border-neutral-300 text-primary-600 focus:ring-primary-500 h-4 w-4 cursor-pointer"
            />
            <label
              htmlFor="editCategoryActiveToggle"
              className="text-xs font-semibold text-neutral-700 cursor-pointer"
            >
              Visible in Storefront Catalog
            </label>
          </div>

          <DialogFooter className="pt-3 border-t border-neutral-100 flex items-center justify-end gap-2">
            <Button
              type="button"
              variant="outline"
              size="sm"
              disabled={isSubmitting}
              onClick={() => onOpenChange(false)}
              className="text-xs font-semibold h-9 px-4"
            >
              Cancel
            </Button>
            <Button
              type="submit"
              size="sm"
              disabled={isSubmitting}
              className="bg-primary-600 hover:bg-primary-700 text-white text-xs font-semibold h-9 px-4 gap-1.5 shadow-sm shadow-primary-200/50"
            >
              {isSubmitting && <Loader2 className="w-3.5 h-3.5 animate-spin" />}
              Save Changes
            </Button>
          </DialogFooter>
        </form>
      </DialogPopup>
    </Dialog>
  );
}
