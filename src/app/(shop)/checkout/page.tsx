"use client";

import React, { useState, useEffect, useSyncExternalStore } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { ChevronRight, AlertCircle, ShoppingBag } from "lucide-react";
import { ProtectedRoute } from "@/components/routes";
import {
  ShippingAddressForm,
  validateShippingForm,
  ShippingFormData,
  ShippingFormErrors,
  CheckoutOrderReview,
  ConfirmOrderButton,
} from "@/features/checkout";
import { useAuthStore } from "@/stores/useAuthStore";
import { useCartStore } from "@/stores/useCartStore";
import { createOrder } from "@/features/orders";
import { showToast } from "@/lib/toast";
import { ApiError } from "@/types/api";
import { CreateOrderItemPayload } from "@/types/order";

export default function CheckoutPage() {
  return (
    <ProtectedRoute>
      <CheckoutContent />
    </ProtectedRoute>
  );
}

function CheckoutContent() {
  const router = useRouter();
  const user = useAuthStore((state) => state.user);
  const { items, clearCart, getSubtotal } = useCartStore();

  // Hydration check to prevent SSR mismatch
  const mounted = useSyncExternalStore(
    () => () => {},
    () => true,
    () => false
  );

  const [formData, setFormData] = useState<ShippingFormData>(() => ({
    recipient_name: user?.username || "",
    recipient_phone: "",
    shipping_address: "",
  }));

  const [formErrors, setFormErrors] = useState<ShippingFormErrors>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [stockErrorMessage, setStockErrorMessage] = useState<string | null>(null);
  const [isOrderPlaced, setIsOrderPlaced] = useState(false);

  // Precondition: If cart is empty after hydration, redirect to /cart
  useEffect(() => {
    if (mounted && items.length === 0 && !isOrderPlaced) {
      router.replace("/cart");
    }
  }, [mounted, items.length, router, isOrderPlaced]);

  const subtotal = mounted ? getSubtotal() : 0;
  const grandTotal = subtotal; // Complimentary delivery

  const handleFieldChange = (field: keyof ShippingFormData, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    // Clear error for field once user starts typing
    if (formErrors[field]) {
      setFormErrors((prev) => ({ ...prev, [field]: undefined }));
    }
    // Clear stock error on input change
    if (stockErrorMessage) {
      setStockErrorMessage(null);
    }
  };

  const handleConfirmOrder = async () => {
    // 1. Validate Form Fields
    const errors = validateShippingForm(formData);
    if (Object.keys(errors).length > 0) {
      setFormErrors(errors);
      showToast.error(
        "Invalid Shipping Details",
        "Please check the required fields and ensure all inputs are valid."
      );
      return;
    }

    if (items.length === 0) {
      showToast.error("Cart is Empty", "Please add items to your cart before checking out.");
      router.replace("/cart");
      return;
    }

    // 2. Format Order Items Payload
    const orderItems: CreateOrderItemPayload[] = items.map((item) => ({
      product_id: item.productId,
      quantity: item.quantity,
      size: item.size,
      color: item.color,
    }));

    setIsSubmitting(true);
    setStockErrorMessage(null);

    try {
      // 3. Dispatch POST /orders (Token automatically attached via cookie client)
      await createOrder({
        recipient_name: formData.recipient_name.trim(),
        recipient_phone: formData.recipient_phone.trim(),
        shipping_address: formData.shipping_address.trim(),
        items: orderItems,
      });

      // 4. On Success: Mark order placed, clear cart, show success toast, and redirect to /orders
      setIsOrderPlaced(true);
      clearCart();
      showToast.success(
        "Order placed successfully!",
        "Thank you! Your order has been placed and is being prepared."
      );
      router.push("/orders");
    } catch (error: unknown) {
      setIsSubmitting(false);

      if (error instanceof ApiError) {
        if (error.errorCode === "PRODUCT_STOCK_VALIDATION_ERROR") {
          const description =
            error.message ||
            "One or more items in your cart do not have enough stock available.";
          setStockErrorMessage(description);
          return;
        }

        if (error.errorCode === "VALIDATION_ERROR" && error.details?.json) {
          const jsonErrors = error.details.json as Record<string, string[]>;
          const newErrors: ShippingFormErrors = {};
          if (jsonErrors.recipient_name) newErrors.recipient_name = jsonErrors.recipient_name[0];
          if (jsonErrors.recipient_phone) newErrors.recipient_phone = jsonErrors.recipient_phone[0];
          if (jsonErrors.shipping_address) newErrors.shipping_address = jsonErrors.shipping_address[0];
          setFormErrors(newErrors);
        }
      }
      // Note: General errors automatically trigger translated toast via defaultErrorInterceptor
    }
  };

  // Prevent flicker before hydration
  if (!mounted || items.length === 0) {
    return (
      <div className="container mx-auto flex min-h-[60vh] flex-col items-center justify-center px-4 py-12">
        <div className="h-8 w-8 animate-spin rounded-full border-2 border-primary-300 border-t-primary-600" />
        <p className="mt-4 text-xs font-medium text-neutral-500">
          Loading checkout review...
        </p>
      </div>
    );
  }

  return (
    <div className="min-h-[80vh] bg-neutral-50/50 pb-16 pt-6">
      <div className="container mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
        {/* Breadcrumb */}
        <nav aria-label="Breadcrumb" className="mb-6 flex items-center gap-2 text-xs text-neutral-500">
          <Link href="/" className="hover:text-primary-600 transition-colors">
            Home
          </Link>
          <ChevronRight className="h-3 w-3 text-neutral-400" />
          <Link href="/cart" className="hover:text-primary-600 transition-colors">
            Shopping Cart
          </Link>
          <ChevronRight className="h-3 w-3 text-neutral-400" />
          <span className="font-semibold text-primary-600">Checkout</span>
        </nav>

        {/* Page Title */}
        <div className="mb-8">
          <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-neutral-900">
            Order Checkout
          </h1>
          <p className="mt-1 text-sm text-neutral-600">
            Please confirm your shipping recipient details and review your selected items.
          </p>
        </div>

        {/* Stock Validation Error Banner */}
        {stockErrorMessage && (
          <div
            role="alert"
            className="mb-6 flex items-start gap-3 rounded-xl border border-red-200 bg-red-50/90 p-4 text-sm text-red-900 shadow-xs animate-in fade-in-50 duration-200"
          >
            <AlertCircle className="h-5 w-5 text-red-600 shrink-0 mt-0.5" />
            <div className="flex-1">
              <h2 className="text-sm font-bold text-red-900">
                Insufficient Product Stock
              </h2>
              <p className="mt-1 text-xs text-red-700 leading-relaxed">
                {stockErrorMessage}
              </p>
              <div className="mt-3">
                <Link
                  href="/cart"
                  className="inline-flex items-center gap-1.5 text-xs font-bold text-red-800 hover:text-red-950 underline underline-offset-2"
                >
                  <ShoppingBag className="h-3.5 w-3.5" />
                  Return to cart to adjust quantities
                </Link>
              </div>
            </div>
          </div>
        )}

        {/* Two-Column Checkout Layout */}
        <div className="grid grid-cols-1 gap-8 lg:grid-cols-12">
          {/* Left Column: Shipping Details Form */}
          <div className="lg:col-span-7 space-y-6">
            <ShippingAddressForm
              formData={formData}
              errors={formErrors}
              onChange={handleFieldChange}
              disabled={isSubmitting}
            />
          </div>

          {/* Right Column: Order Review & Confirmation */}
          <div className="lg:col-span-5 space-y-6">
            <CheckoutOrderReview items={items} subtotal={subtotal} />

            <ConfirmOrderButton
              isLoading={isSubmitting}
              totalAmount={grandTotal}
              onClick={handleConfirmOrder}
              disabled={isSubmitting}
            />
          </div>
        </div>
      </div>
    </div>
  );
}
