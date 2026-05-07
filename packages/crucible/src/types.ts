export type LogLevel = "debug" | "info" | "warn" | "error" | "fatal";

/**
 * Log data interface. Consumers extend via module augmentation:
 *
 * declare module "@zoobz-io/crucible/types" {
 *   interface LogData {
 *     userId: string;
 *     requestId: string;
 *     duration: number;
 *   }
 * }
 */
// eslint-disable-next-line @typescript-eslint/no-empty-object-type
export interface LogData {}

export type LogPayload = [keyof LogData] extends [never]
  ? Record<string, unknown>
  : Partial<LogData>;

/** Unified log entry. */
export interface LogEntry {
  level: LogLevel;
  message: string;
  data?: LogPayload;
  timestamp: number;
  hook?: string;
  source?: "server" | "client";
}

/** Maps Nuxt hook names to log levels. Unmapped hooks default to debug. */
export type HookLevelMap = Record<string, LogLevel>;

/** Config for the crucible module. */
export interface CrucibleConfig {
  /** Minimum log level to emit. Default: "debug" in dev, "info" in production. */
  level?: LogLevel;
  /** Map Nuxt hook names to log levels. Unmapped hooks default to "debug". */
  hooks?: HookLevelMap;
}
