import type { LOG_LEVELS } from "../constants/log";
import type { Ref } from "vue";

/**
 * A log level, by name.
 */
export type LogLevel = keyof typeof LOG_LEVELS;

/**
 * One kept line: the logger's name, the level, the message, its data, and
 * when it was submitted as an ISO string.
 */
export type LogLine = {
  name: string;
  message: string;
  level: LogLevel;
  data: Record<string, unknown>;
  submitted: string;
};

/**
 * One level's emit: a message and optional structured data.
 */
export type LogEmit = (message: string, data?: Record<string, unknown>) => void;

/**
 * A named logger over the shared level and backlog, with one emit per
 * level.
 */
export type Logger = {
  level: Ref<LogLevel>;
  backlog: Ref<LogLine[]>;
  trace: LogEmit;
  debug: LogEmit;
  info: LogEmit;
  warn: LogEmit;
  error: LogEmit;
};
