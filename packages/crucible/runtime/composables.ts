import { useNuxtApp } from "#app";
import type { LogLevel, LogPayload, LogEntry } from "../src/types";
import "../src/hooks";

type NuxtApp = ReturnType<typeof useNuxtApp>;

let app: NuxtApp | null = null;

const getApp = (): NuxtApp => {
  if (!app) app = useNuxtApp();
  return app;
};

const emit = (level: LogLevel, message: string, data?: LogPayload): void => {
  const entry: LogEntry = {
    level,
    message,
    timestamp: Date.now(),
    ...(data ? { data } : {}),
  };
  const hookName = `log:${level}` as `log:${LogLevel}`;
  getApp().callHook(hookName, entry);
};

export const log = {
  debug: (message: string, data?: LogPayload) => emit("debug", message, data),
  info: (message: string, data?: LogPayload) => emit("info", message, data),
  warn: (message: string, data?: LogPayload) => emit("warn", message, data),
  error: (message: string, data?: LogPayload) => emit("error", message, data),
  fatal: (message: string, data?: LogPayload) => emit("fatal", message, data),
};
