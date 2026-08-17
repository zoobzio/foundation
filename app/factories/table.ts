import type { Actions, Events } from "../types/data/table";
import type { TableWidgetProps } from "../types/data/table/widget";
import type { TableDefinition } from "../definitions/table";
import type { Stamp } from "../types/definition";
import type { Widget } from "../types/widget";
import type { MaybeRefOrGetter } from "vue";

import component from "../components/data/table/widget.vue";

import { rekey } from "objectively";
import { accessTable } from "../stores/table";
import { toValue, useNuxtApp } from "#imports";
import { TableService } from "../services/table";
import { merge } from "../utils/merge";

/**
 * The behavior half of a table, attached in setup: the fetch mechanism,
 * handlers keyed to the definition's action vocabulary, and the reactive pt
 * override merged over the definition's base. Handler records are required
 * exactly when the definition declares descriptors — a stray, missing, or
 * uncovered key errors on the line it is written.
 */
export type TableWiring<T, D extends TableDefinition<T>> = {
  fetch: Actions<T>["fetch"];
  pt?: MaybeRefOrGetter<TableWidgetProps<T>["pt"]>;
} & (undefined extends D["actions"]
  ? { actions?: undefined }
  : { actions: { [A in keyof NonNullable<D["actions"]>]: (row: T) => void } }) &
  (undefined extends D["bulkActions"]
    ? { bulkActions?: undefined }
    : {
        bulkActions: {
          [B in keyof NonNullable<D["bulkActions"]>]: (
            selected: Set<string>,
          ) => void;
        };
      });

/**
 * Instances a definition in the calling scope — call in setup: `id` is the
 * only thing the composable adds; shared state, hook scoping, wiring
 * identity all key on it. `T` infers from the definition's stamp (falling
 * back to the wiring's fetch for unstamped definitions), and the wiring is
 * checked against it here. Settings resolve wiring pt over definition pt
 * per key (widget recipes are the third layer, merged in the component);
 * the getter keeps a reactive wiring pt live.
 */
export const useTable = <T, D extends TableDefinition<T>>(
  id: string,
  definition: D & Stamp<T>,
  wiring: TableWiring<T, D>,
): Widget<TableWidgetProps<T>, Events> => {
  const nuxt = useNuxtApp();
  const state = accessTable(id, definition);
  const service = new TableService(nuxt, id, definition, state, wiring);
  return {
    service,
    component,
    settings: () =>
      rekey<Record<string, unknown>, NonNullable<TableWidgetProps<T>["pt"]>>(
        merge(toValue(wiring.pt) ?? {}, definition.pt ?? {}),
        (key, value) => [key, value],
      ),
  };
};
