import type { BrowserHooks } from "./types/browser";
import type { EditorHooks } from "./types/editor";
import type { FormHooks } from "./types/form";
import type { Logger } from "./types/log";
import type { TableHooks } from "./types/table";

declare module "#app" {
  interface NuxtApp {
    $log: Logger;
    $logger: (name?: string) => Logger;
  }
  interface RuntimeNuxtHooks
    extends BrowserHooks, EditorHooks, FormHooks, TableHooks {}
}

export {};
