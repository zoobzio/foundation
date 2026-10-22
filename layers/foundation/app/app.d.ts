import type { Logger } from "./types/log";
import type { AnyEvents as AdapterEvents } from "./types/data/adapter";
import type { Events as BrowserEvents } from "./types/data/browser";
import type { Events as ChartEvents } from "./types/data/chart";
import type { Events as DeckEvents } from "./types/data/deck";

declare module "#app" {
  interface NuxtApp {
    $log: Logger;
    $logger: (name?: string) => Logger;
  }
  interface RuntimeNuxtHooks
    extends
      AdapterEvents,
      BrowserEvents,
      ChartEvents,
      DeckEvents {}
}

export {};
