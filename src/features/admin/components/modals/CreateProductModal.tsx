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
import { ProductImageUploader } from "./ProductImageUploader";
import { useCategoriesQuery } from "@/features/products";
import { productService } from "@/features/products";
import { showToast } from "@/lib/toast";
import { ProductGender, ProductSize } from "@/types/product";
import { ApiError } from "@/types/api";
import { Plus, Loader2, AlertCircle } from "lucide-react";

interface CreateProductModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  trigger?: React.ReactNode;
}

const SIZES: ProductSize[] = ["XS", "S", "M", "L", "XL", "XXL", "FREE", "Free Size"];
const GENDERS: ProductGender[] = ["Men", "Women", "Unisex", "Kids"];

export function CreateProductModal({
  open,
  onOpenChange,
  trigger,
}: CreateProductModalProps) {
  const queryClient = useQueryClient();
  const { data: categories = [], isLoading: categoriesLoading } = useCategoriesQuery();

  const [name, setName] = useState("");
  const [categoryId, setCategoryId] = useState<string>("");
  const [price, setPrice] = useState<string>("");
  const [stock, setStock] = useState<string>("");
  const [size, setSize] = useState<ProductSize>("Free Size");
  const [gender, setGender] = useState<ProductGender>("Unisex");
  const [color, setColor] = useState("");
  const [material, setMaterial] = useState("");
  const [sku, setSku] = useState("");
  const [description, setDescription] = useState("");
  const [imageUrl, setImageUrl] = useState("");

  const [errors, setErrors] = useState<Record<string, string>>({});
  const [generalError, setGeneralError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const resetForm = () => {
    setName("");
    setCategoryId("");
    setPrice("");
    setStock("");
    setSize("Free Size");
    setGender("Unisex");
    setColor("");
    setMaterial("");
    setSku("");
    setDescription("");
    setImageUrl("");
    setErrors({});
    setGeneralError(null);
  };

  const validate = (): boolean => {
    const errs: Record<string, string> = {};
    if (!name.trim()) errs.name = "Product name is required.";
    const numPrice = parseFloat(price);
    if (!price || isNaN(numPrice) || numPrice <= 0) {
      errs.price = "Valid price greater than 0 is required.";
    }
    const numStock = parseInt(stock, 10);
    if (stock === "" || isNaN(numStock) || numStock < 0) {
      errs.stock = "Valid non-negative stock count is required.";
    }
    if (!color.trim()) errs.color = "Color is required.";

    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setGeneralError(null);

    if (!validate()) return;

    setIsSubmitting(true);
    try {
      // Auto-generate SKU if not provided
      const finalSku =
        sku.trim() ||
        `RF-${name.slice(0, 3).toUpperCase()}-${Date.now().toString(36).toUpperCase()}`;

      const payload = {
        name: name.trim(),
        price: parseFloat(price),
        stock: parseInt(stock, 10),
        color: color.trim(),
        category_id: categoryId ? parseInt(categoryId, 10) : null,
        size,
        gender,
        material: material.trim() || undefined,
        sku: finalSku,
        description: description.trim() || null,
        images: imageUrl
          ? [
              {
                image_base64: imageUrl,
                is_primary: true,
              },
            ]
          : [],
      };

      await productService.createProduct(payload);

      // Invalidate queries to auto-refresh table
      await Promise.all([
        queryClient.invalidateQueries({ queryKey: ["admin-products"] }),
        queryClient.invalidateQueries({ queryKey: ["products"] }),
      ]);

      showToast.success(`Product "${name}" created successfully!`);
      resetForm();
      onOpenChange(false);
    } catch (err: unknown) {
      let msg = "Failed to create product. Please check your inputs.";
      if (err instanceof ApiError) {
        msg = err.message;
      } else if (err instanceof Error) {
        msg = err.message;
      }
      setGeneralError(msg);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Dialog
      open={open}
      onOpenChange={(next) => {
        if (!isSubmitting) {
          onOpenChange(next);
          if (!next) resetForm();
        }
      }}
    >
      {trigger}
      <DialogPopup className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2 text-xl font-bold text-neutral-900">
            <Plus className="w-5 h-5 text-primary-600" />
            Add New Product
          </DialogTitle>
          <DialogDescription className="text-xs text-neutral-500">
            Create a new apparel item in the inventory catalog.
          </DialogDescription>
        </DialogHeader>

        {generalError && (
          <div className="flex items-start gap-2 p-3 bg-red-50 border border-red-200 rounded-xl text-xs text-red-700">
            <AlertCircle className="w-4 h-4 text-red-600 flex-shrink-0 mt-0.5" />
            <div className="flex-1 font-medium">{generalError}</div>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4 py-2">
          {/* Dual Mode Image Uploader */}
          <ProductImageUploader
            value={imageUrl}
            onChange={setImageUrl}
            disabled={isSubmitting}
          />

          {/* Product Name & Category */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-neutral-700">
                Product Name <span className="text-primary-500">*</span>
              </label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="e.g. Linen Blend Relaxed Shirt"
                disabled={isSubmitting}
                className="w-full px-3 py-2 text-xs border border-neutral-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500/20 focus:border-primary-500 bg-white"
              />
              {errors.name && (
                <p className="text-[11px] text-red-600 font-medium">{errors.name}</p>
              )}
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-neutral-700">
                Category
              </label>
              <select
                value={categoryId}
                onChange={(e) => setCategoryId(e.target.value)}
                disabled={isSubmitting || categoriesLoading}
                className="w-full px-3 py-2 text-xs border border-neutral-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500/20 focus:border-primary-500 bg-white"
              >
                <option value="">Select a category (Optional)</option>
                {categories.map((c) => (
                  <option key={c.id} value={c.id}>
                    {c.name}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Price & Stock */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-neutral-700">
                Price ($) <span className="text-primary-500">*</span>
              </label>
              <input
                type="number"
                step="0.01"
                min="0"
                value={price}
                onChange={(e) => setPrice(e.target.value)}
                placeholder="29.90"
                disabled={isSubmitting}
                className="w-full px-3 py-2 text-xs border border-neutral-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500/20 focus:border-primary-500 bg-white"
              />
              {errors.price && (
                <p className="text-[11px] text-red-600 font-medium">{errors.price}</p>
              )}
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-neutral-700">
                Initial Stock <span className="text-primary-500">*</span>
              </label>
              <input
                type="number"
                min="0"
                step="1"
                value={stock}
                onChange={(e) => setStock(e.target.value)}
                placeholder="50"
                disabled={isSubmitting}
                className="w-full px-3 py-2 text-xs border border-neutral-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500/20 focus:border-primary-500 bg-white"
              />
              {errors.stock && (
                <p className="text-[11px] text-red-600 font-medium">{errors.stock}</p>
              )}
            </div>
          </div>

          {/* Color & Material */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-neutral-700">
                Color <span className="text-primary-500">*</span>
              </label>
              <input
                type="text"
                value={color}
                onChange={(e) => setColor(e.target.value)}
                placeholder="e.g. Navy Blue"
                disabled={isSubmitting}
                className="w-full px-3 py-2 text-xs border border-neutral-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500/20 focus:border-primary-500 bg-white"
              />
              {errors.color && (
                <p className="text-[11px] text-red-600 font-medium">{errors.color}</p>
              )}
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-neutral-700">
                Material
              </label>
              <input
                type="text"
                value={material}
                onChange={(e) => setMaterial(e.target.value)}
                placeholder="e.g. 100% Organic Cotton"
                disabled={isSubmitting}
                className="w-full px-3 py-2 text-xs border border-neutral-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500/20 focus:border-primary-500 bg-white"
              />
            </div>
          </div>

          {/* Size, Gender, and SKU */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-neutral-700">Size</label>
              <select
                value={size}
                onChange={(e) => setSize(e.target.value as ProductSize)}
                disabled={isSubmitting}
                className="w-full px-3 py-2 text-xs border border-neutral-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500/20 focus:border-primary-500 bg-white"
              >
                {SIZES.map((s) => (
                  <option key={s} value={s}>
                    {s}
                  </option>
                ))}
              </select>
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-neutral-700">Gender</label>
              <select
                value={gender}
                onChange={(e) => setGender(e.target.value as ProductGender)}
                disabled={isSubmitting}
                className="w-full px-3 py-2 text-xs border border-neutral-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500/20 focus:border-primary-500 bg-white"
              >
                {GENDERS.map((g) => (
                  <option key={g} value={g}>
                    {g}
                  </option>
                ))}
              </select>
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-neutral-700">
                SKU (Optional)
              </label>
              <input
                type="text"
                value={sku}
                onChange={(e) => setSku(e.target.value)}
                placeholder="Leave blank to auto-generate"
                disabled={isSubmitting}
                className="w-full px-3 py-2 text-xs border border-neutral-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500/20 focus:border-primary-500 bg-white font-mono"
              />
            </div>
          </div>

          {/* Description */}
          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-neutral-700">
              Description
            </label>
            <textarea
              rows={3}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Describe the product cut, fabric weight, and styling tips..."
              disabled={isSubmitting}
              className="w-full px-3 py-2 text-xs border border-neutral-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500/20 focus:border-primary-500 bg-white resize-none"
            />
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
              Create Product
            </Button>
          </DialogFooter>
        </form>
      </DialogPopup>
    </Dialog>
  );
}
