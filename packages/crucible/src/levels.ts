import type { LogLevel } from "./types";

const LEVEL_ORDER: Record<LogLevel, number> = {
  debug: 0,
  info: 1,
  warn: 2,
  error: 3,
  fatal: 4,
};

/** Returns true if the entry level meets or exceeds the minimum. */
export const meetsLevel = (entryLevel: LogLevel, minLevel: LogLevel): boolean =>
  LEVEL_ORDER[entryLevel] >= LEVEL_ORDER[minLevel];
