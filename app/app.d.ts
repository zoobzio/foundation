import type { Logger } from "#foundation/types/log";
import type { Events as AutocompleteEvents } from "#foundation/types/data/autocomplete";
import type { Events as ChartEvents } from "#foundation/types/data/chart";
import type { Events as FormEvents } from "#foundation/types/data/form";

declare module "#app" {
  interface NuxtApp {
    $log: Logger;
    $logger: (name?: string) => Logger;
  }
  interface RuntimeNuxtHooks
    extends FormEvents<unknown>,
      AutocompleteEvents<unknown>,
      ChartEvents {}
}

export {};
