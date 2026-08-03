import type { Config, Actions } from "#foundation/types/data/table";
import type { TableWidgetProps } from "#foundation/types/data/table/widget";
import type { Widget, WidgetSettings } from "#foundation/types/widget";

import component from "#foundation/components/data/table/widget.vue";

import { accessTable } from "#foundation/stores/table";
import { useNuxtApp } from "#imports";
import { TableService } from "#foundation/services/table";

export const createTable = <T, K = unknown>(
  id: string,
  config: Config<T, K>,
  actions: Actions<T, K>,
  settings?: WidgetSettings<TableWidgetProps<T, K>>,
) => {
  return (): Widget<TableWidgetProps<T, K>> => {
    const nuxt = useNuxtApp();
    const state = accessTable(id, config);
    const service = new TableService(nuxt, id, config, state, actions);

    return {
      service,
      component,
      settings,
    };
  };
};
