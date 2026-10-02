// system/error constants
import type { ToastVariant } from "../types/core/toast";

// Fallback HTTP status code used when a NuxtError carries no statusCode.
export const ERROR_DEFAULT_STATUS_CODE = 500;

// HTTP status code treated as "not found" on the error page.
export const ERROR_NOT_FOUND_STATUS_CODE = 404;

export const ERROR_SEVERITY = ["fatal", "error", "warning"] as const;

// Maps an error severity to the toast variant used to surface it.
export const severityToVariant: Record<
  (typeof ERROR_SEVERITY)[number],
  ToastVariant
> = {
  fatal: "error",
  error: "error",
  warning: "warning",
};
