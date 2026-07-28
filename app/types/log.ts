import type { LOG_LEVELS } from "#foundation/constants/log";

export type LogLevel = keyof typeof LOG_LEVELS;

export type LogLine = {
  name: string;
  message: string;
  level: LogLevel;
  data: Record<string, unknown>;
  submitted: string;
};
