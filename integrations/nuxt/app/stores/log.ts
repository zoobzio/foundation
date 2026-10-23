import type { LogLevel, LogLine } from "../types/log";

import { useState } from "#app";

/**
 * The Nuxt backing for the app's logs: the current level under `log:level`
 * (default `info`) and the kept lines under `log:backlog`, each a `useState`
 * record shared by every logger.
 */
export const accessLogs = () => {
  const level = useState<LogLevel>("log:level", () => "info");
  const backlog = useState<LogLine[]>("log:backlog", () => []);
  return { level, backlog };
};
