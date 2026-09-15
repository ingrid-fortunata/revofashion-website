"use client";

import React from "react";
import {
  Table,
  TableHeader,
  TableBody,
  TableHead,
  TableRow,
  TableCell,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Category } from "@/types/category";
import { Edit, Trash2, Layers, FolderOpen } from "lucide-react";

interface AdminCategoryTableProps {
  categories: Category[];
  isLoading: boolean;
  onEdit: (category: Category) => void;
  onDelete: (category: Category) => void;
}

export function AdminCategoryTable({
  categories,
  isLoading,
  onEdit,
  onDelete,
}: AdminCategoryTableProps) {
  if (isLoading) {
    return (
      <div className="bg-white rounded-xl border border-rose-100/80 shadow-xs shadow-rose-100/20 overflow-hidden p-4 space-y-3">
        {[...Array(5)].map((_, i) => (
          <div
            key={i}
            className="h-12 bg-neutral-100/70 rounded-lg animate-pulse"
          />
        ))}
      </div>
    );
  }

  if (categories.length === 0) {
    return (
      <div className="bg-white rounded-xl border border-rose-100/80 p-12 text-center shadow-xs shadow-rose-100/20">
        <div className="w-12 h-12 rounded-full bg-rose-50 flex items-center justify-center text-rose-400 mx-auto mb-3">
          <FolderOpen className="w-6 h-6" />
        </div>
        <h3 className="text-sm font-bold text-neutral-800">No Categories Found</h3>
        <p className="text-xs text-neutral-500 mt-1 max-w-sm mx-auto">
          No categories match your criteria. Create a new category using the button above.
        </p>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-xl border border-rose-100/80 shadow-xs shadow-rose-100/20 overflow-hidden">
      <div className="overflow-x-auto">
        <Table>
          <TableHeader className="bg-rose-50/40 border-b border-rose-100/80">
            <TableRow className="hover:bg-transparent">
              <TableHead className="w-20 text-xs font-bold text-neutral-600 uppercase tracking-wider">
                ID
              </TableHead>
              <TableHead className="w-[240px] text-xs font-bold text-neutral-600 uppercase tracking-wider">
                Category Name
              </TableHead>
              <TableHead className="text-xs font-bold text-neutral-600 uppercase tracking-wider">
                Description
              </TableHead>
              <TableHead className="w-32 text-xs font-bold text-neutral-600 uppercase tracking-wider">
                Status
              </TableHead>
              <TableHead className="text-right text-xs font-bold text-neutral-600 uppercase tracking-wider pr-6">
                Actions
              </TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {categories.map((category) => (
              <TableRow
                key={category.id}
                className="hover:bg-rose-50/30 transition-colors"
              >
                {/* ID */}
                <TableCell className="py-3 font-mono text-xs font-semibold text-neutral-500">
                  #{category.id}
                </TableCell>

                {/* Name */}
                <TableCell className="py-3">
                  <div className="flex items-center gap-2">
                    <div className="w-7 h-7 rounded-md bg-rose-50 border border-rose-100 flex items-center justify-center text-rose-600 flex-shrink-0">
                      <Layers className="w-3.5 h-3.5" />
                    </div>
                    <span className="text-xs font-bold text-neutral-900">
                      {category.name}
                    </span>
                  </div>
                </TableCell>

                {/* Description */}
                <TableCell className="py-3 text-xs text-neutral-500 max-w-md">
                  {category.description ? (
                    <span className="line-clamp-2">{category.description}</span>
                  ) : (
                    <span className="text-neutral-400 italic">No description</span>
                  )}
                </TableCell>

                {/* Status */}
                <TableCell className="py-3">
                  {category.is_active ? (
                    <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[11px] font-semibold bg-emerald-50 text-emerald-700 border border-emerald-200">
                      <span className="h-1.5 w-1.5 rounded-full bg-emerald-500" />
                      Active
                    </span>
                  ) : (
                    <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[11px] font-semibold bg-neutral-100 text-neutral-500 border border-neutral-200">
                      <span className="h-1.5 w-1.5 rounded-full bg-neutral-400" />
                      Hidden
                    </span>
                  )}
                </TableCell>

                {/* Actions */}
                <TableCell className="py-3 text-right pr-6">
                  <div className="inline-flex items-center gap-1">
                    <Button
                      type="button"
                      variant="ghost"
                      size="icon"
                      onClick={() => onEdit(category)}
                      data-testid={`edit-category-${category.id}`}
                      className="h-8 w-8 text-neutral-600 hover:text-rose-700 hover:bg-rose-50/80 rounded-lg"
                      title="Edit Category"
                    >
                      <Edit className="w-3.5 h-3.5" />
                      <span className="sr-only">Edit {category.name}</span>
                    </Button>
                    <Button
                      type="button"
                      variant="ghost"
                      size="icon"
                      onClick={() => onDelete(category)}
                      data-testid={`delete-category-${category.id}`}
                      className="h-8 w-8 text-neutral-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg"
                      title="Delete Category"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                      <span className="sr-only">Delete {category.name}</span>
                    </Button>
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
