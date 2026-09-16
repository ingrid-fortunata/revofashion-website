"use client";

import React, { useState, useEffect } from "react";
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
import { Product, ProductGender, ProductSize } from "@/types/product";
import { Edit3, Loader2, AlertCircle } from "lucide-react";

interface EditProductModalProps {
  product: Product | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

const SIZES: ProductSize[] = ["XS", "S", "M", "L", "XL", "XXL", "FREE", "Free Size"];
const GENDERS: ProductGender[] = ["Men", "Women", "Unisex", "Kids"];

export function EditProductModal({
  product,
  open,
  onOpenChange,
}: EditProductModalProps) {
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
  const [isActive, setIsActive] = useState(true);

  const [errors, setErrors] = useState<Record<string, string>>({});
  const [generalError, setGeneralError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Sync state whenever selected product changes
  useEffect(() => {
    if (product) {
      setName(product.name || "");
      setCategoryId(product.category_id ? product.category_id.toString() : "");
      setPrice(product.price ? product.price.toString() : "");
      setStock(product.stock !== undefined ? product.stock.toString() : "0");
      setSize(product.size || "Free Size");
      setGender(product.gender || "Unisex");
      setColor(product.color || "");
      setMaterial(product.material || "");
      setSku(product.sku || "");
      setDescription(product.description || "");
      setImageUrl(
        product.primary_image ||
          (product.images && product.images.length > 0 ? product.images[0].image_base64 : "")
      );
      setIsActive(product.is_active !== undefined ? product.is_active : true);
      setErrors({});
      setGeneralError(null);
    }
  }, [product]);

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
    if (!product) return;
    setGeneralError(null);

    if (!validate()) return;

    setIsSubmitting(true);
    try {
      const payload = {
        name: name.trim(),
        price: parseFloat(price),
        stock: parseInt(stock, 10),
        color: color.trim(),
        category_id: categoryId ? parseInt(categoryId, 10) : null,
        size,
        gender,
        material: material.trim() || undefined,
        sku: sku.trim() || product.sku,
        description: description.trim() || null,
        is_active: isActive,
        images: imageUrl
          ? [
              {
                image_base64: imageUrl,
                is_primary: true,
              },
            ]
          : [],
      };

      await productService.updateProduct(product.id, payload);

      // Invalidate queries to refresh data
      await Promise.all([
        queryClient.invalidateQueries({ queryKey: ["admin-products"] }),
        queryClient.invalidateQueries({ queryKey: ["products"] }),
        queryClient.invalidateQueries({ queryKey: ["product", product.id] }),
      ]);

      showToast.success(`Product "${name}" updated successfully!`);
      onOpenChange(false);
    } catch (err: any) {
      const msg = err?.message || "Failed to update product. Please check your inputs.";
      setGeneralError(msg);
      showToast.error(msg);
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!product) return null;

  return (
    <Dialog
      open={open}
      onOpenChange={(next) => {
        if (!isSubmitting) {
          onOpenChange(next);
        }
      }}
    >
      <DialogPopup className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2 text-xl font-bold text-neutral-900">
            <Edit3 className="w-5 h-5 text-primary-600" />
            Edit Product
          </DialogTitle>
          <DialogDescription className="text-xs text-neutral-500">
            Updating inventory item <span className="font-mono font-semibold text-neutral-700">#{product.id}</span> ({product.sku})
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
                disabled={isSubmitting}
                className="w-full px-3 py-2 text-xs border border-neutral-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500/20 focus:border-primary-500 bg-white"
              />
              {errors.price && (
                <p className="text-[11px] text-red-600 font-medium">{errors.price}</p>
              )}
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-neutral-700">
                Current Stock <span className="text-primary-500">*</span>
              </label>
              <input
                type="number"
                min="0"
                step="1"
                value={stock}
                onChange={(e) => setStock(e.target.value)}
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
                SKU
              </label>
              <input
                type="text"
                value={sku}
                onChange={(e) => setSku(e.target.value)}
                disabled={isSubmitting}
                className="w-full px-3 py-2 text-xs border border-neutral-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500/20 focus:border-primary-500 bg-white font-mono"
              />
            </div>
          </div>

          {/* Active Status Toggle */}
          <div className="flex items-center gap-2 pt-1">
            <input
              type="checkbox"
              id="isActiveToggle"
              checked={isActive}
              onChange={(e) => setIsActive(e.target.checked)}
              disabled={isSubmitting}
              className="rounded border-neutral-300 text-primary-600 focus:ring-primary-500 h-4 w-4 cursor-pointer"
            />
            <label htmlFor="isActiveToggle" className="text-xs font-semibold text-neutral-700 cursor-pointer">
              Active in storefront catalog
            </label>
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
              Save Changes
            </Button>
          </DialogFooter>
        </form>
      </DialogPopup>
    </Dialog>
  );
}
