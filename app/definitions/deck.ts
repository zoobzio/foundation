import type { Config } from "../types/data/deck";
import type { DeckWidgetProps } from "../types/data/deck/widget";
import type { Stamp } from "../types/definition";

/**
 * The static description of a deck — one flat serializable record: the
 * domain config plus the passthrough base. Everything functional — fetch,
 * reactive pt — attaches at `useDeck`. Declared through an entity's
 * `defineDeck`, which checks every field against the entity type on the
 * line it is written.
 */
export type DeckDefinition<T> = Config<T> &
  Stamp<T> & {
    pt?: DeckWidgetProps<T>["pt"];
  };
