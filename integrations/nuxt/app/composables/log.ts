import type { Logger, LogLevel } from "../types/log";

import { accessLogs } from "../stores/log";
import { LOG_LEVELS, LOG_ROOT_NAME } from "../constants/log";

/**
 * A named logger over the shared store. Each emit keeps a line when its
 * level is at or above the current level and drops it otherwise. The level
 * and the backlog are the shared refs, so any logger may read or change
 * them.
 *
 * @param name - The logger's name, kept on each line. Defaults to the root.
 */
export const useLogger = (name: string = LOG_ROOT_NAME): Logger => {
  const { level, backlog } = accessLogs();

  const make = (lvl: LogLevel) => {
    return (message: string, data: Record<string, unknown> = {}) => {
      if (LOG_LEVELS[lvl] < LOG_LEVELS[level.value]) return;
      backlog.value = [
        ...backlog.value,
        {
          name,
          level: lvl,
          message,
          data,
          submitted: new Date().toISOString(),
        },
      ];
    };
  };

  return {
    level,
    backlog,
    trace: make("trace"),
    debug: make("debug"),
    info: make("info"),
    warn: make("warn"),
    error: make("error"),
  };
};
