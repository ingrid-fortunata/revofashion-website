import dayjs from "dayjs";

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
