import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

/**
 * URL-safe slug. NFD first so Vietnamese diacritics decompose and strip rather
 * than being dropped whole — "Tài liệu" becomes "tai-lieu", not "t-i-li-u".
 */
export function slugify(value: string) {
  return value
    .toLowerCase()
    .normalize("NFD")
    .replace(/[̀-ͯ]/g, "")
    .replace(/đ/g, "d")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

/** The portal's one date format. Day-first, month spelled out — no ambiguity. */
export function formatDate(value: Date) {
  return new Intl.DateTimeFormat("en-GB", { dateStyle: "medium" }).format(value);
}
