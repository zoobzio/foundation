import type { Events } from "../types/data/chart";
import type { ChartWidgetProps } from "../types/data/chart/widget";
import type { ChartDefinition } from "../definitions/chart";
import type { Widget } from "../types/widget";

import component from "../components/data/chart/widget.vue";

import { accessChart } from "../stores/chart";
import { useNuxtApp } from "#imports";
import { ChartService } from "../services/chart";

/**
 * Instances a definition: `id` is the only thing the factory adds — shared
 * state, hook scoping, wiring identity all key on it.
 */
export const createChart = <T>(
  id: string,
  definition: ChartDefinition<T>,
) => {
  return (): Widget<ChartWidgetProps<T>, Events> => {
    const nuxt = useNuxtApp();
    const state = accessChart(id, definition.config);
    const service = new ChartService(nuxt, id, definition.config, state, definition.actions ?? {});
    return {
      service,
      component,
      settings: definition.settings,
    };
  };
};
