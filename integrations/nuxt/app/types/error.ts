import type { NuxtError } from "#app";
import type { Notification } from "./notification";

/**
 * The `data` an app error carries: when it was built and, optionally, the
 * notification the shell's error boundary toasts in place of the message.
 */
export type ErrorData = {
  submitted: string;
  notification?: Omit<Notification, "id">;
};

/**
 * What `useError` takes beyond the code and the message: the notification
 * to toast, the underlying cause, and whether the error is fatal (renders
 * the error page rather than toasting).
 */
export type ErrorOptions = {
  notification?: Omit<Notification, "id">;
  cause?: unknown;
  fatal?: boolean;
};

/**
 * A Nuxt error carrying {@link ErrorData}.
 */
export type AppError = NuxtError<ErrorData>;
