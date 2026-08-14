import type { Actions, Config } from "#foundation/types/data/autocomplete";
import type { AutocompleteWidgetProps } from "#foundation/types/data/autocomplete/widget";
import type { WidgetSettings } from "#foundation/types/widget";

/**
 * The static description `createAutocomplete` instances: everything about the
 * feature except its id. Reusable — one definition, many ids, many machines.
 */
export type AutocompleteDefinition<M> = {
  config: Config<M>;
  actions?: Actions<M>;
  settings?: WidgetSettings<AutocompleteWidgetProps<M>>;
};

/**
 * Declares a autocomplete at module scope — pure data plus consumer callbacks,
 * no runtime, no Vue. The identity function is the type checkpoint: the
 * generics infer from `config`, and every field errors on the line it is
 * written.
 */
export const defineAutocomplete = <M>(
  definition: AutocompleteDefinition<M>,
): AutocompleteDefinition<M> => definition;
