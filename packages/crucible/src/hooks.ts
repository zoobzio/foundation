import type { LogEntry } from "./types";

declare module "#app" {
  interface RuntimeNuxtHooks {
    "log:debug": (entry: LogEntry) => void;
    "log:info": (entry: LogEntry) => void;
    "log:warn": (entry: LogEntry) => void;
    "log:error": (entry: LogEntry) => void;
    "log:fatal": (entry: LogEntry) => void;
  }
}
