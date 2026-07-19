import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

/**
 * Extracts a human-readable message from an unknown thrown value, falling back
 * to a generic message for non-`Error` throws. Centralises the
 * `err instanceof Error ? err.message : "…"` check repeated across the app.
 */
export function getErrorMessage(err: unknown, fallback = "Please try again."): string {
  return err instanceof Error ? err.message : fallback
}
