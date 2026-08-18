import type { ChartDefinition } from "./chart";
import type { DeckDefinition } from "./deck";
import type { FormDefinition } from "./form";
import type { PreviewDefinition } from "./preview";
import type { TableDefinition } from "./table";
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
   * Declares a table over the entity at module scope — pure serializable
   * data, storable in a constant. The identity function is the type
   * checkpoint: every field errors on the line it is written. The return
   * carries the entity stamp so `useTable` infers `T` from the definition.
   */
  defineTable: <D extends TableDefinition<T>>(definition: D): D & Stamp<T> =>
    definition,

  /**
   * Declares a deck over the entity at module scope — same checkpoint
   * semantics as `defineTable`.
   */
  defineDeck: <D extends DeckDefinition<T>>(definition: D): D & Stamp<T> =>
    definition,

  /**
   * Declares a preview over the entity at module scope — same checkpoint
   * semantics as `defineTable`.
   */
  definePreview: <D extends PreviewDefinition<T>>(
    definition: D,
  ): D & Stamp<T> => definition,

  /**
   * Declares a chart over the entity at module scope — same checkpoint
   * semantics as `defineTable`.
   */
  defineChart: <D extends ChartDefinition<T>>(definition: D): D & Stamp<T> =>
    definition,

  /**
   * Declares a form over the entity at module scope — same checkpoint
   * semantics as `defineTable`. The Zod schema rides the definition: it is
   * the form's intrinsic contract, not wiring.
   */
  defineForm: <D extends FormDefinition<T>>(definition: D): D & Stamp<T> =>
    definition,
});
