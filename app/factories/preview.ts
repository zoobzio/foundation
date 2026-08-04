import type { Config, Actions, Events } from "#foundation/types/data/preview";
import type { PreviewWidgetProps } from "#foundation/types/data/preview/widget";
import type { Widget, WidgetSettings } from "#foundation/types/widget";

import component from "#foundation/components/data/preview/widget.vue";

import { accessPreview } from "#foundation/stores/preview";
import { useNuxtApp } from "#imports";
import { PreviewService } from "#foundation/services/preview";

export const createPreview = <T>(
  id: string,
  config: Config<T>,
  actions: Actions<T>,
  settings?: WidgetSettings<PreviewWidgetProps<T>>,
) => {
  return (): Widget<PreviewWidgetProps<T>, Events> => {
    const nuxt = useNuxtApp();
    const state = accessPreview<T>(id);
    const service = new PreviewService(nuxt, id, config, state, actions);
    return {
      service,
      component,
      settings,
    };
  };
};
