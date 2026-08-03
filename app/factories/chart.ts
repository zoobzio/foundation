import type { Chart, Config, Actions } from "#foundation/types/data/chart";

import { accessChart } from "#foundation/stores/chart";
import { computed, useNuxtApp } from "#imports";
import { ChartService } from "#foundation/services/chart";

export const createChart = <T>(
  id: string,
  config: Config<T>,
  actions: Actions<T> = {},
) => {
  return (): Chart<T> => {
    const nuxt = useNuxtApp();
    const state = accessChart(id, config);
    const service = new ChartService(nuxt, id, config, state, actions);
    return {
      id,
      config,
      variants: service.variants,

      loading: computed(() => service.loading),
      initialized: computed(() => service.initialized),
      variantData: computed(() => service.variantData),
      activeVariant: computed(() => service.activeVariant),
      activeRenderer: computed(() => service.activeRenderer),
      activeField: computed(() => service.activeField),
      activeGroupBy: computed(() => service.activeGroupBy),
      activeX: computed(() => service.activeX),
      activeY: computed(() => service.activeY),
      activeBucket: computed(() => service.activeBucket),
      activeRange: computed(() => service.activeRange),

      activeVariantConfig: computed(() => service.activeVariantConfig),
      title: computed(() => service.title),

      setVariant: (type: string) => service.setVariant(type),
      setRenderer: (type: string) => service.setRenderer(type),
      setField: (field: string) => service.setField(field),
      setGroupBy: (field: string) => service.setGroupBy(field),
      setX: (field: string) => service.setX(field),
      setY: (field: string) => service.setY(field),
      setBucket: (bucket: string) => service.setBucket(bucket),
      setRange: (range: [Date, Date]) => service.setRange(range),
      fetch: () => service.fetch(),
      init: () => service.init(),
    };
  };
};
