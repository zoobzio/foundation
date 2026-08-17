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
});
