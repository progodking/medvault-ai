/**
 * Extract a human-readable message from an unknown thrown value, falling back to
 * a caller-supplied default. Centralises the `err instanceof Error` narrowing
 * that every catch block would otherwise repeat, so surfaced errors stay
 * consistent instead of being silently reduced to a generic string.
 */
export function errorMessage(err: unknown, fallback: string): string {
  if (err instanceof Error && err.message) return err.message;
  if (typeof err === "string" && err) return err;
  return fallback;
}
