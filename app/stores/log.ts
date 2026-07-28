import type { LogLevel, LogLine } from "#foundation/types/log";

import { useState } from "#imports";

export const accessLogs = () => {
  const level = useState<LogLevel>("log:level", () => "info");
  const backlog = useState<LogLine[]>("log:backlog", () => []);
  return {
    level,
    backlog,
  };
};
