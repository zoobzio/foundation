import type { NuxtError } from "#app";
import type { Notification } from "./notification";

export type ErrorData = {
  submitted: string;
  notification?: Omit<Notification, "id">;
};

export type ErrorOptions = {
  notification?: Omit<Notification, "id">;
  cause?: unknown;
  fatal?: boolean;
};

export type AppError = NuxtError<ErrorData>;
