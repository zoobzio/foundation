import type { BrowserHooks } from "./types/browser";
import type { FormHooks } from "./types/form";
import type { Logger } from "./types/log";
import type { TableHooks } from "./types/table";

declare module "#app" {
  interface NuxtApp {
    $log: Logger;
    $logger: (name?: string) => Logger;
  }
  interface RuntimeNuxtHooks extends BrowserHooks, FormHooks, TableHooks {}
}

export {};
