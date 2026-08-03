import type { Config, Actions } from "#foundation/types/data/chart";
import type { ChartWidgetProps } from "#foundation/types/data/chart/widget";
import type { Widget, WidgetSettings } from "#foundation/types/widget";

import component from "#foundation/components/data/chart/widget.vue";

import { accessChart } from "#foundation/stores/chart";
import { useNuxtApp } from "#imports";
import { ChartService } from "#foundation/services/chart";

export const createChart = <T>(
  id: string,
  config: Config<T>,
  actions: Actions<T> = {},
  settings?: WidgetSettings<ChartWidgetProps<T>>,
) => {
  return (): Widget<ChartWidgetProps<T>> => {
    const nuxt = useNuxtApp();
    const state = accessChart(id, config);
    const service = new ChartService(nuxt, id, config, state, actions);

    return {
      service,
      component,
      settings,
    };
  };
};
