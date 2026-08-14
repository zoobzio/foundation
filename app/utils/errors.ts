import type {
  AppError,
  ErrorData,
  ErrorOptions,
} from "../types/error";
import type { HTTPCode } from "ltrl-http";

import { createError } from "#imports";
import { useHTTPCode } from "ltrl-http";

export const useError = (
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
