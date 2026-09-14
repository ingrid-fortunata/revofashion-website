"use client";

import React, { useState, useRef } from "react";
import Image from "next/image";
import { Upload, Link as LinkIcon, X, Image as ImageIcon, AlertCircle } from "lucide-react";
import { Button } from "@/components/ui/button";

interface ProductImageUploaderProps {
  value?: string;
  onChange: (value: string) => void;
  disabled?: boolean;
}

export function ProductImageUploader({
  value = "",
  onChange,
  disabled = false,
}: ProductImageUploaderProps) {
  const [activeTab, setActiveTab] = useState<"upload" | "url">("upload");
  const [urlInput, setUrlInput] = useState("");
  const [error, setError] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setError(null);
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith("image/")) {
      setError("Please select a valid image file (JPG, PNG, WebP).");
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      setError("Image file size must be less than 5MB.");
      return;
    }

    const reader = new FileReader();
    reader.onload = () => {
      if (typeof reader.result === "string") {
        onChange(reader.result);
      }
    };
    reader.onerror = () => {
      setError("Failed to read image file. Please try another image.");
    };
    reader.readAsDataURL(file);
  };

  const handleApplyUrl = (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    const trimmed = urlInput.trim();
    if (!trimmed) {
      setError("Please enter a valid image URL.");
      return;
    }
    onChange(trimmed);
    setUrlInput("");
  };

  const handleClearImage = () => {
    onChange("");
    setError(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <label className="text-xs font-semibold uppercase tracking-wider text-neutral-600">
          Product Image
        </label>
        {value && (
          <button
            type="button"
            onClick={handleClearImage}
            disabled={disabled}
            className="text-xs text-rose-600 hover:text-rose-700 font-medium flex items-center gap-1 cursor-pointer transition-colors"
          >
            <X className="w-3.5 h-3.5" />
            Remove image
          </button>
        )}
      </div>

      {/* If an image is selected/set, display the preview card */}
      {value ? (
        <div className="relative group flex items-center gap-4 p-3 bg-neutral-50 border border-neutral-200 rounded-xl">
          <div className="relative h-20 w-20 flex-shrink-0 bg-neutral-100 rounded-lg overflow-hidden border border-neutral-200 flex items-center justify-center">
            <Image
              src={value}
              alt="Product preview"
              fill
              unoptimized
              className="object-contain p-1"
              onError={(e) => {
                // Fallback to cute placeholder on error
                (e.target as HTMLImageElement).src = "/images/no-photo.png";
              }}
            />
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-xs font-semibold text-neutral-800 truncate">
              Image attached
            </p>
            <p className="text-[11px] text-neutral-500 truncate mt-0.5">
              {value.startsWith("data:") ? "Local file encoded (Base64)" : value}
            </p>
            <div className="mt-2 flex gap-2">
              <Button
                type="button"
                variant="outline"
                size="sm"
                disabled={disabled}
                onClick={handleClearImage}
                className="h-7 text-xs px-2.5 text-neutral-700 hover:text-rose-600"
              >
                Replace Image
              </Button>
            </div>
          </div>
        </div>
      ) : (
        /* Image Input Tabs & Form */
        <div className="border border-neutral-200 rounded-xl overflow-hidden bg-neutral-50/50">
          {/* Tabs */}
          <div className="flex border-b border-neutral-200 bg-neutral-100/70 p-1 gap-1">
            <button
              type="button"
              disabled={disabled}
              onClick={() => {
                setActiveTab("upload");
                setError(null);
              }}
              className={`flex-1 py-1.5 px-3 rounded-lg text-xs font-semibold flex items-center justify-center gap-1.5 transition-all ${
                activeTab === "upload"
                  ? "bg-white text-neutral-900 shadow-xs"
                  : "text-neutral-500 hover:text-neutral-900"
              }`}
            >
              <Upload className="w-3.5 h-3.5" />
              Upload File
            </button>
            <button
              type="button"
              disabled={disabled}
              onClick={() => {
                setActiveTab("url");
                setError(null);
              }}
              className={`flex-1 py-1.5 px-3 rounded-lg text-xs font-semibold flex items-center justify-center gap-1.5 transition-all ${
                activeTab === "url"
                  ? "bg-white text-neutral-900 shadow-xs"
                  : "text-neutral-500 hover:text-neutral-900"
              }`}
            >
              <LinkIcon className="w-3.5 h-3.5" />
              Direct URL
            </button>
          </div>

          <div className="p-4">
            {activeTab === "upload" ? (
              <div
                onClick={() => !disabled && fileInputRef.current?.click()}
                className={`border-2 border-dashed border-neutral-300 hover:border-neutral-400 bg-white rounded-xl p-5 text-center cursor-pointer transition-colors ${
                  disabled ? "opacity-50 cursor-not-allowed" : ""
                }`}
              >
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/png, image/jpeg, image/webp, image/gif"
                  onChange={handleFileChange}
                  disabled={disabled}
                  className="hidden"
                />
                <div className="flex flex-col items-center justify-center gap-1.5">
                  <div className="w-10 h-10 rounded-full bg-neutral-100 flex items-center justify-center text-neutral-600">
                    <ImageIcon className="w-5 h-5" />
                  </div>
                  <span className="text-xs font-semibold text-neutral-800">
                    Click to browse or drag & drop
                  </span>
                  <span className="text-[11px] text-neutral-400">
                    PNG, JPG, WebP up to 5MB
                  </span>
                </div>
              </div>
            ) : (
              <div className="space-y-2">
                <div className="flex gap-2">
                  <input
                    type="url"
                    placeholder="https://images.example.com/product.jpg"
                    value={urlInput}
                    disabled={disabled}
                    onChange={(e) => setUrlInput(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === "Enter") {
                        e.preventDefault();
                        handleApplyUrl(e);
                      }
                    }}
                    className="flex-1 px-3 py-2 text-xs rounded-lg border border-neutral-300 bg-white text-neutral-900 placeholder:text-neutral-400 focus:outline-none focus:ring-2 focus:ring-neutral-900"
                  />
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    disabled={disabled || !urlInput.trim()}
                    onClick={handleApplyUrl}
                    className="text-xs font-semibold h-9 px-3"
                  >
                    Apply
                  </Button>
                </div>
                <p className="text-[11px] text-neutral-400">
                  Paste a direct CDN or image link with HTTPS.
                </p>
              </div>
            )}

            {error && (
              <div className="mt-2 flex items-center gap-1.5 text-xs text-rose-600 bg-rose-50 p-2 rounded-lg border border-rose-200">
                <AlertCircle className="w-3.5 h-3.5 flex-shrink-0" />
                <span>{error}</span>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
