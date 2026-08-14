import type { Logger } from "./types/log";
import type { AnyEvents as AdapterEvents } from "./types/data/adapter";
import type { Events as AutocompleteEvents } from "./types/data/autocomplete";
import type { Events as ChartEvents } from "./types/data/chart";
import type { Events as DeckEvents } from "./types/data/deck";
import type { Events as FormEvents } from "./types/data/form";
import type { Events as PreviewEvents } from "./types/data/preview";
import type { Events as TableEvents } from "./types/data/table";

declare module "#app" {
  interface NuxtApp {
    $log: Logger;
    $logger: (name?: string) => Logger;
  }
  interface RuntimeNuxtHooks
    extends FormEvents<unknown>,
      AdapterEvents,
      AutocompleteEvents<unknown>,
      ChartEvents,
      DeckEvents,
      PreviewEvents,
      TableEvents {}
}

export {};
