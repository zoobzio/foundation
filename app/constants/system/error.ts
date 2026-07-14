// system/error constants
import type { Severity } from "#foundation/types/z/error";
import type { ToastProps } from "#foundation/types/core/toast";

// Fallback HTTP status code used when a NuxtError carries no statusCode.
export const ERROR_DEFAULT_STATUS_CODE = 500;

// HTTP status code treated as "not found" on the error page.
export const ERROR_NOT_FOUND_STATUS_CODE = 404;

// Maps an error severity to the toast variant used to surface it.
export const severityToVariant: Record<
  Severity,
  NonNullable<ToastProps["variant"]>
> = {
  fatal: "error",
  error: "error",
  warning: "warning",
  info: "info",
};
