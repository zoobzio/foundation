import type { ChartDefinition } from "./chart";
import type { DeckDefinition } from "./deck";
import type { Stamp } from "../types/definition";

/**
 * Binds an entity type once and yields the data-tier definers scoped to it.
 * The currying is what makes literal capture possible: `T` is supplied here,
 * so each definer stays generic over its definition alone — record keys
 * (actions, bulk actions) survive as literals for the `use*` line to wire
 * handlers against, which a single call could not do (supplying `T`
 * explicitly would disable inference for the definition). Data features
 * join the entity as their define/use splits land; the adapter stays
 * outside — its generic is a component contract, not a data type.
 */
export const defineEntity = <T>() => ({
  /**
   * Declares a deck over the entity at module scope — pure serializable
   * data, storable in a constant. The identity function is the type
   * checkpoint: every field errors on the line it is written. The return
   * carries the entity stamp so `useDeck` infers `T` from the definition.
   */
  defineDeck: <D extends DeckDefinition<T>>(definition: D): D & Stamp<T> =>
    definition,

  /**
   * Declares a chart over the entity at module scope — same checkpoint
   * semantics as `defineDeck`.
   */
  defineChart: <D extends ChartDefinition<T>>(definition: D): D & Stamp<T> =>
    definition,
});
