import type { BrowserHooks } from "./types/browser";
import type { FormHooks } from "./types/form";
import type { TableHooks } from "./types/table";

declare module "#app" {
  interface RuntimeNuxtHooks extends BrowserHooks, FormHooks, TableHooks {}
}

export {};
