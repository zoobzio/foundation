// system/error constants
import type { ModifierAxesOptions } from "../types/modifiers";

// Fallback HTTP status code used when a NuxtError carries no statusCode.
export const ERROR_DEFAULT_STATUS_CODE = 500;

// HTTP status code treated as "not found" on the error page.
export const ERROR_NOT_FOUND_STATUS_CODE = 404;

export const ERROR_SEVERITY = ["fatal", "error", "warning"] as const;

// Maps an error severity to the toast-root variant modifier used to surface it.
export const severityToVariant: Record<
  (typeof ERROR_SEVERITY)[number],
  ModifierAxesOptions<"toast-root", "variant">
> = {
  fatal: "error",
  error: "error",
  warning: "warning",
};
