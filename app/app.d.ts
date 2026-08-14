import type { Logger } from "#foundation/types/log";
import type { AnyEvents as AdapterEvents } from "#foundation/types/data/adapter";
import type { Events as AutocompleteEvents } from "#foundation/types/data/autocomplete";
import type { Events as ChartEvents } from "#foundation/types/data/chart";
import type { Events as DeckEvents } from "#foundation/types/data/deck";
import type { Events as FormEvents } from "#foundation/types/data/form";
import type { Events as PreviewEvents } from "#foundation/types/data/preview";
import type { Events as TableEvents } from "#foundation/types/data/table";

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
