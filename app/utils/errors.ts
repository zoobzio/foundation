import { createError } from "#imports";
import type { AppError, AppErrorOptions, ErrorPayload, Severity } from "#foundation/types/error";
const make = (severity: Severity, options: AppErrorOptions, isFatal: boolean): AppError =>
  createError<ErrorPayload>({
    statusCode: options.code,
    message: options.message,
    fatal: isFatal,
    data: {
      severity,
      detail: options.data,
    },
  });

export const fatal = (options: AppErrorOptions): AppError =>
  make("fatal", options, true);

export const error = (options: AppErrorOptions): AppError =>
  make("error", options, false);

export const warning = (options: AppErrorOptions): AppError =>
  make("warning", options, false);

export const info = (options: AppErrorOptions): AppError =>
  make("info", options, false);
