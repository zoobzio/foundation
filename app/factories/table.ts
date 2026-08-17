import type { Events } from "../types/data/table";
import type { TableWidgetProps } from "../types/data/table/widget";
import type { TableDefinition } from "../definitions/table";
import type { Widget } from "../types/widget";

import component from "../components/data/table/widget.vue";

import { accessTable } from "../stores/table";
import { useNuxtApp } from "#imports";
import { TableService } from "../services/table";

/**
 * Instances a definition in the calling scope — call in setup: `id` is the
 * only thing the composable adds; shared state, hook scoping, wiring
 * identity all key on it.
 */
export const useTable = <T, K = unknown>(
  id: string,
  definition: TableDefinition<T, K>,
): Widget<TableWidgetProps<T, K>, Events> => {
  const nuxt = useNuxtApp();
  const state = accessTable(id, definition.config);
  const service = new TableService(nuxt, id, definition.config, state, definition.actions);
  return {
    service,
    component,
    settings: definition.settings,
  };
};
