import type { NuxtError } from "#app";
import type { Notification } from "./notification";

/**
 * The `data` an app error may carry: when it names a notification, the
 * shell's error boundary toasts that instead of the error's message.
 */
export type ErrorData = {
  submitted?: string;
  notification?: Omit<Notification, "id">;
};

/**
 * A Nuxt error carrying {@link ErrorData}.
 */
export type AppError = NuxtError<ErrorData>;
