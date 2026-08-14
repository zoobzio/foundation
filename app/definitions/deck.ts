import type { Actions, Config } from "../types/data/deck";
import type { DeckWidgetProps } from "../types/data/deck/widget";
import type { WidgetSettings } from "../types/widget";

/**
 * The static description `createDeck` instances: everything about the
 * feature except its id. Reusable — one definition, many ids, many machines.
 */
export type DeckDefinition<T> = {
  config: Config<T>;
  actions: Actions<T>;
  settings?: WidgetSettings<DeckWidgetProps<T>>;
};

/**
 * Declares a deck at module scope — pure data plus consumer callbacks,
 * no runtime, no Vue. The identity function is the type checkpoint: the
 * generics infer from `config`, and every field errors on the line it is
 * written.
 */
export const defineDeck = <T>(
  definition: DeckDefinition<T>,
): DeckDefinition<T> => definition;
