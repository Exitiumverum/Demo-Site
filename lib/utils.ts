import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

/**
 * Format price from minor units (e.g., agorot) to major units (e.g., shekels)
 */
export function formatPrice(priceInMinorUnits: number, currency: string = "₪"): string {
  const majorUnits = priceInMinorUnits / 100;
  return `${currency}${majorUnits.toFixed(2)}`;
}

/**
 * Convert price from major units to minor units
 */
export function priceToMinorUnits(price: number): number {
  return Math.round(price * 100);
}

/**
 * Convert a string to a URL-friendly slug
 */
export function slugify(text: string): string {
  return text
    .toString()
    .toLowerCase()
    .trim()
    .replace(/\s+/g, "-") // Replace spaces with -
    .replace(/[^\w\-]+/g, "") // Remove all non-word chars
    .replace(/\-\-+/g, "-") // Replace multiple - with single -
    .replace(/^-+/, "") // Trim - from start of text
    .replace(/-+$/, ""); // Trim - from end of text
}
