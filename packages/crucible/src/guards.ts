import type { LogEntry, LogLevel } from "./types";

const LOG_LEVELS: Set<string> = new Set(["debug", "info", "warn", "error", "fatal"]);

/** Type guard for LogEntry — validates shape without casting. */
export const isLogEntry = (value: unknown): value is LogEntry => {
  if (typeof value !== "object" || value === null) return false;
  const obj = value as Record<string, unknown>;
  return (
    typeof obj.level === "string" &&
    LOG_LEVELS.has(obj.level) &&
    typeof obj.message === "string" &&
    typeof obj.timestamp === "number"
  );
};

/** Type guard for LogLevel. */
export const isLogLevel = (value: unknown): value is LogLevel =>
  typeof value === "string" && LOG_LEVELS.has(value);
