/**
 * The name of the root logger, and the default of `useLogger`.
 */
export const LOG_ROOT_NAME = "app";

/**
 * The log levels by severity. A line is kept when its level is at or above
 * the current level.
 */
export const LOG_LEVELS = {
  trace: 0,
  debug: 1,
  info: 2,
  warn: 3,
  error: 4,
} as const;
