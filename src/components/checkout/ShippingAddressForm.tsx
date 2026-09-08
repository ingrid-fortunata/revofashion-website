"use client";

import React from "react";
import { User, Phone, MapPin } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";

export interface ShippingFormData {
  recipient_name: string;
  recipient_phone: string;
  shipping_address: string;
}

export interface ShippingFormErrors {
  recipient_name?: string;
  recipient_phone?: string;
  shipping_address?: string;
}

interface ShippingAddressFormProps {
  formData: ShippingFormData;
  errors: ShippingFormErrors;
  onChange: (field: keyof ShippingFormData, value: string) => void;
  disabled?: boolean;
}

/**
 * Validates individual fields according to backend requirements:
 * - recipient_name: Required, non-blank string
 * - recipient_phone: 7-20 characters, digits/dashes/spaces/plus
 * - shipping_address: Minimum 5 characters, non-blank
 */
export function validateShippingForm(data: ShippingFormData): ShippingFormErrors {
  const errors: ShippingFormErrors = {};

  if (!data.recipient_name || !data.recipient_name.trim()) {
    errors.recipient_name = "Recipient name is required.";
  }

  const phoneTrimmed = data.recipient_phone ? data.recipient_phone.trim() : "";
  const phoneDigitsCount = (phoneTrimmed.match(/\d/g) || []).length;
  const phonePattern = /^[0-9+\s\-()]{7,20}$/;

  if (!phoneTrimmed) {
    errors.recipient_phone = "Contact phone number is required.";
  } else if (!phonePattern.test(phoneTrimmed) || phoneDigitsCount < 7) {
    errors.recipient_phone =
      "Please enter a valid phone number (7–20 digits/symbols, e.g. +62 812-3456-7890).";
  }

  const addressTrimmed = data.shipping_address ? data.shipping_address.trim() : "";
  if (!addressTrimmed) {
    errors.shipping_address = "Shipping address is required.";
  } else if (addressTrimmed.length < 5) {
    errors.shipping_address = "Shipping address must be at least 5 characters.";
  }

  return errors;
}

export function ShippingAddressForm({
  formData,
  errors,
  onChange,
  disabled = false,
}: ShippingAddressFormProps) {
  return (
    <Card className="border-rose-100/80 shadow-sm">
      <CardHeader className="pb-4">
        <div className="flex items-center gap-2">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-rose-100/70 text-rose-600">
            <MapPin className="h-4 w-4" />
          </div>
          <div>
            <CardTitle className="text-lg font-bold text-neutral-900">
              Shipping Information
            </CardTitle>
            <CardDescription className="text-xs text-neutral-500">
              Where should we deliver your order?
            </CardDescription>
          </div>
        </div>
      </CardHeader>

      <CardContent className="space-y-4">
        {/* Recipient Name Field */}
        <div className="space-y-1.5">
          <Label htmlFor="recipient_name" required className="text-xs font-semibold text-neutral-700">
            Recipient Full Name
          </Label>
          <div className="relative">
            <Input
              id="recipient_name"
              name="recipient_name"
              type="text"
              placeholder="e.g. Alice Smith"
              value={formData.recipient_name}
              onChange={(e) => onChange("recipient_name", e.target.value)}
              disabled={disabled}
              error={!!errors.recipient_name}
              className="pl-9 text-sm"
              autoComplete="name"
            />
            <User className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-neutral-400" />
          </div>
          {errors.recipient_name && (
            <p className="text-xs font-medium text-red-600 animate-in fade-in-50 duration-150">
              {errors.recipient_name}
            </p>
          )}
        </div>

        {/* Contact Phone Number Field */}
        <div className="space-y-1.5">
          <Label htmlFor="recipient_phone" required className="text-xs font-semibold text-neutral-700">
            Contact Phone Number
          </Label>
          <div className="relative">
            <Input
              id="recipient_phone"
              name="recipient_phone"
              type="tel"
              placeholder="e.g. +62 812-3456-7890"
              value={formData.recipient_phone}
              onChange={(e) => onChange("recipient_phone", e.target.value)}
              disabled={disabled}
              error={!!errors.recipient_phone}
              className="pl-9 text-sm"
              autoComplete="tel"
            />
            <Phone className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-neutral-400" />
          </div>
          {errors.recipient_phone && (
            <p className="text-xs font-medium text-red-600 animate-in fade-in-50 duration-150">
              {errors.recipient_phone}
            </p>
          )}
        </div>

        {/* Shipping Delivery Address Field */}
        <div className="space-y-1.5">
          <Label htmlFor="shipping_address" required className="text-xs font-semibold text-neutral-700">
            Delivery Street Address
          </Label>
          <textarea
            id="shipping_address"
            name="shipping_address"
            rows={3}
            placeholder="Enter your complete street name, house/apt unit, district, and city"
            value={formData.shipping_address}
            onChange={(e) => onChange("shipping_address", e.target.value)}
            disabled={disabled}
            className={`w-full rounded-md border bg-white px-3 py-2 text-sm shadow-xs transition-colors placeholder:text-neutral-400 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-rose-400/60 focus-visible:border-rose-400 focus-visible:ring-offset-1 disabled:cursor-not-allowed disabled:opacity-50 ${
              errors.shipping_address
                ? "border-red-500 focus-visible:ring-red-500"
                : "border-rose-100/80"
            }`}
            autoComplete="street-address"
          />
          {errors.shipping_address && (
            <p className="text-xs font-medium text-red-600 animate-in fade-in-50 duration-150">
              {errors.shipping_address}
            </p>
          )}
        </div>
      </CardContent>
    </Card>
  );
}

export default ShippingAddressForm;
