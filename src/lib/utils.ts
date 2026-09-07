import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";
import dayjs from "dayjs";

/**
 * Combines conditional class names with tailwind-merge to prevent class collision.
 */
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

/**
 * Format numeric value as currency (default IDR, fallback USD).
 */
export function formatCurrency(amount: number, currency: "IDR" | "USD" = "IDR"): string {
  if (currency === "IDR") {
    return new Intl.NumberFormat("id-ID", {
      style: "currency",
      currency: "IDR",
      maximumFractionDigits: 0,
    }).format(amount);
  }

  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
  }).format(amount);
}

/**
 * Format date or timestamp to human-readable date using dayjs.
 * @param date - Date string, Date object, or timestamp
 * @param formatStr - dayjs format pattern (default: "DD MMM YYYY, HH:mm")
 */
export function formatDate(
  date: string | number | Date | null | undefined,
  formatStr: string = "DD MMM YYYY, HH:mm"
): string {
  if (!date) return "-";
  const parsed = dayjs(date);
  if (!parsed.isValid()) return "-";
  return parsed.format(formatStr);
}

export { dayjs };
