"use client";

import React from "react";
import {
  Dialog,
  DialogPopup,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { AlertTriangle, AlertCircle, Loader2 } from "lucide-react";
import { cn } from "@/lib/utils";

export interface ConfirmDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  title: string;
  description?: string;
  icon?: React.ElementType;
  variant?: "danger" | "warning" | "primary";
  conflictError?: string | null;
  conflictTip?: string;
  confirmLabel?: string;
  cancelLabel?: string;
  isSubmitting?: boolean;
  onConfirm: () => void | Promise<void>;
  children?: React.ReactNode;
  className?: string;
  confirmTestId?: string;
}

/**
 * Reusable Confirmation / Destructive Action Dialog.
 * Standardizes alert icons, conflict error alerts, child previews, and loading states.
 */
export function ConfirmDialog({
  open,
  onOpenChange,
  title,
  description,
  icon: Icon = AlertTriangle,
  variant = "danger",
  conflictError,
  conflictTip,
  confirmLabel = "Confirm",
  cancelLabel = "Cancel",
  isSubmitting = false,
  onConfirm,
  children,
  className,
  confirmTestId,
}: ConfirmDialogProps) {
  const handleOpenChange = (nextOpen: boolean) => {
    if (!isSubmitting) {
      onOpenChange(nextOpen);
    }
  };

  const iconBgClasses = {
    danger: "bg-red-100 text-red-600",
    warning: "bg-amber-100 text-amber-600",
    primary: "bg-primary-100 text-primary-600",
  }[variant];

  const confirmBtnClasses = {
    danger: "bg-red-600 hover:bg-red-700 text-white",
    warning: "bg-amber-600 hover:bg-amber-700 text-white",
    primary: "bg-primary-600 hover:bg-primary-700 text-white",
  }[variant];

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogPopup className={cn("max-w-md", className)}>
        <DialogHeader>
          <div className="flex items-center gap-3">
            <div
              className={cn(
                "w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0 shadow-2xs",
                iconBgClasses
              )}
            >
              <Icon className="w-5 h-5" />
            </div>
            <div>
              <DialogTitle className="text-base font-bold text-neutral-900">
                {title}
              </DialogTitle>
              {description && (
                <DialogDescription className="text-xs text-neutral-500 mt-0.5 leading-relaxed">
                  {description}
                </DialogDescription>
              )}
            </div>
          </div>
        </DialogHeader>

        {/* Conflict / Restriction Error Alert */}
        {conflictError && (
          <div className="p-3 bg-red-50 border border-red-200 rounded-xl flex items-start gap-2.5 text-xs text-red-800 animate-in fade-in-50">
            <AlertCircle className="w-4 h-4 text-red-600 flex-shrink-0 mt-0.5" />
            <div className="flex-1 space-y-1">
              <p className="font-bold">Action Restricted</p>
              <p className="text-red-700 leading-relaxed">{conflictError}</p>
              {conflictTip && (
                <p className="text-[11px] text-red-600/80 pt-1 leading-normal">
                  {conflictTip}
                </p>
              )}
            </div>
          </div>
        )}

        {/* Custom preview/content slot */}
        {children && <div className="space-y-3">{children}</div>}

        <DialogFooter className="pt-2 border-t border-neutral-100 flex items-center justify-end gap-2">
          <Button
            type="button"
            variant="outline"
            size="sm"
            disabled={isSubmitting}
            onClick={() => handleOpenChange(false)}
            className="text-xs font-semibold h-9 px-4"
          >
            {cancelLabel}
          </Button>
          <Button
            type="button"
            size="sm"
            disabled={isSubmitting}
            onClick={onConfirm}
            data-testid={confirmTestId}
            className={cn("text-xs font-semibold h-9 px-4 gap-1.5", confirmBtnClasses)}
          >
            {isSubmitting ? (
              <>
                <Loader2 className="w-3.5 h-3.5 animate-spin" />
                <span>Processing...</span>
              </>
            ) : (
              <span>{confirmLabel}</span>
            )}
          </Button>
        </DialogFooter>
      </DialogPopup>
    </Dialog>
  );
}

export default ConfirmDialog;
