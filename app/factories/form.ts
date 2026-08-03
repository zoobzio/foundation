import type { Config, Actions } from "#foundation/types/data/form";
import type { FormWidgetProps } from "#foundation/types/data/form/widget";
import type { Widget, WidgetSettings } from "#foundation/types/widget";

import component from "#foundation/components/data/form/widget.vue";

import { accessForm } from "#foundation/stores/form";
import { useNuxtApp } from "#imports";
import { FormService } from "#foundation/services/form";

export const createForm = <T>(
  id: string,
  config: Config<T>,
  actions: Actions<T>,
  settings?: WidgetSettings<FormWidgetProps<T>>,
) => {
  return (): Widget<FormWidgetProps<T>> => {
    const nuxt = useNuxtApp();
    const state = accessForm(id, config);
    const service = new FormService(nuxt, id, config, state, actions);

    return {
      service,
      component,
      settings,
    };
  };
};
