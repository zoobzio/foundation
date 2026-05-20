import { defineNitroPlugin } from "nitropack/runtime";
import { useTelemetryWriter } from "@zoobz-io/crucible/server";
import type { LogLevel, LogEntry } from "@zoobz-io/crucible/types";

const entry = (level: LogLevel, message: string, data?: Record<string, unknown>): LogEntry => ({
  level,
  message,
  timestamp: Date.now(),
  source: "server",
  ...(data ? { data } : {}),
});

export default defineNitroPlugin((nitro) => {
  nitro.hooks.hook("rampart:login", ({ userId }) => {
    useTelemetryWriter()?.(entry("info", "User logged in", { userId }));
  });
  nitro.hooks.hook("rampart:logout", () => {
    useTelemetryWriter()?.(entry("info", "User logged out"));
  });
  nitro.hooks.hook("rampart:refresh", () => {
    useTelemetryWriter()?.(entry("debug", "Token refreshed"));
  });
  nitro.hooks.hook("rampart:expired", () => {
    useTelemetryWriter()?.(entry("warn", "Session expired"));
  });
});
