"use client";

import React from "react";
import { Loader2, Lock, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";

interface ConfirmOrderButtonProps {
  isLoading: boolean;
  totalAmount: number;
  onClick?: () => void;
  disabled?: boolean;
}

export function ConfirmOrderButton({
  isLoading,
  totalAmount,
  onClick,
  disabled = false,
}: ConfirmOrderButtonProps) {
  return (
    <div className="space-y-2">
      <Button
        type="button"
        variant="default"
        size="lg"
        onClick={onClick}
        disabled={disabled || isLoading}
        className="w-full h-12 bg-rose-600 hover:bg-rose-700 text-white font-bold text-sm shadow-md shadow-rose-200 transition-all flex items-center justify-center gap-2 cursor-pointer disabled:cursor-not-allowed disabled:opacity-60"
      >
        {isLoading ? (
          <>
            <Loader2 className="h-4 w-4 animate-spin text-white" />
            <span>Processing Order...</span>
          </>
        ) : (
          <>
            <Lock className="h-4 w-4" />
            <span>Confirm Order • ${totalAmount.toFixed(2)}</span>
            <ArrowRight className="h-4 w-4" />
          </>
        )}
      </Button>

      <div className="flex items-center justify-center gap-2 text-[11px] text-neutral-400">
        <Lock className="h-3 w-3 text-neutral-400" />
        <span>256-Bit SSL Encrypted & Secure Checkout</span>
      </div>
    </div>
  );
}

export default ConfirmOrderButton;
