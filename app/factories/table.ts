import type { Events } from "#foundation/types/data/table";
import type { TableWidgetProps } from "#foundation/types/data/table/widget";
import type { TableDefinition } from "#foundation/definitions/table";
import type { Widget } from "#foundation/types/widget";

import component from "#foundation/components/data/table/widget.vue";

import { accessTable } from "#foundation/stores/table";
import { useNuxtApp } from "#imports";
import { TableService } from "#foundation/services/table";

/**
 * Instances a definition: `id` is the only thing the factory adds — shared
 * state, hook scoping, wiring identity all key on it.
 */
export const createTable = <T, K = unknown>(
  id: string,
  definition: TableDefinition<T, K>,
) => {
  return (): Widget<TableWidgetProps<T, K>, Events> => {
    const nuxt = useNuxtApp();
    const state = accessTable(id, definition.config);
    const service = new TableService(nuxt, id, definition.config, state, definition.actions);
    return {
      service,
      component,
      settings: definition.settings,
    };
  };
};
