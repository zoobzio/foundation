import type { Preview, Config, Actions } from "#foundation/types/data/preview";

import { accessPreview } from "#foundation/stores/preview";
import { computed, useNuxtApp } from "#imports";
import { PreviewService } from "#foundation/services/preview";

export const createPreview = <T>(
  id: string,
  config: Config<T>,
  actions: Actions<T>,
) => {
  return (): Preview<T> => {
    const nuxt = useNuxtApp();
    const state = accessPreview<T>(id);
    const service = new PreviewService(nuxt, id, config, state, actions);
    return {
      id,
      config,

      loading: computed(() => service.loading),
      initialized: computed(() => service.initialized),
      data: computed(() => service.data),

      fields: service.fields,
      content: service.content,

      contentValue: computed(() => service.contentValue),
      fieldValue: (key: keyof T) => service.fieldValue(key),

      init: () => service.init(),
      fetch: () => service.fetch(),
    };
  };
};
