import type { AppError, ErrorData, ErrorOptions } from "../types/error";
import type { HTTPCode } from "ltrl-http";

import { createError } from "#app";
import { useHTTPCode } from "ltrl-http";

/**
 * Builds an app error: a Nuxt error with the code's status text, stamped
 * with when it was built and carrying the notification the shell toasts
 * for it. Throw it, or pass it to `showError`.
 *
 * @param code - The HTTP status code.
 * @param message - The error's message.
 * @param options - The notification, the cause, and whether it is fatal.
 */
export const useAppError = (
  code: HTTPCode,
  message: string,
  options: ErrorOptions = {},
): AppError => {
  const status = useHTTPCode(code);
  const { cause, fatal, notification } = options;
  return createError<ErrorData>({
    statusCode: code,
    statusText: status.label,
    message,
    cause,
    fatal,
    data: {
      submitted: new Date().toISOString(),
      notification,
    },
  });
};
