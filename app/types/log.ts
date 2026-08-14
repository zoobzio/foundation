import type { LOG_LEVELS } from "../constants/log";
import type { Ref } from "vue";

export type LogLevel = keyof typeof LOG_LEVELS;

export type LogLine = {
  name: string;
  message: string;
  level: LogLevel;
  data: Record<string, unknown>;
  submitted: string;
};

export type LogEmit = (message: string, data: Record<string, unknown>) => void;

export type Logger = {
  level: Ref<LogLevel>;
  backlog: Ref<LogLine[]>;
  trace: LogEmit;
  debug: LogEmit;
  info: LogEmit;
  warn: LogEmit;
  error: LogEmit;
};
