import type { Logger, LogLevel } from "#foundation/types/log";

import { accessLogs } from "#foundation/stores/log";
import { LOG_LEVELS, LOG_ROOT_NAME } from "#foundation/constants/log";

export const useLogger = (name: string = LOG_ROOT_NAME): Logger => {
  const { level, backlog } = accessLogs();

  const make = (lvl: LogLevel) => {
    return (message: string, data: Record<string, unknown>) => {
      if (LOG_LEVELS[lvl] >= LOG_LEVELS[level.value]) {
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
      }
    };
  };

  const trace = make("trace");
  const debug = make("debug");
  const info = make("info");
  const warn = make("warn");
  const error = make("error");

  return {
    level,
    backlog,
    trace,
    debug,
    info,
    warn,
    error,
  };
};
