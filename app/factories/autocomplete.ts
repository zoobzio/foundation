import type { Config, Actions } from "#foundation/types/data/autocomplete";
import type { AutocompleteWidgetProps } from "#foundation/types/data/autocomplete/widget";
import type { Widget, WidgetSettings } from "#foundation/types/widget";

import component from "#foundation/components/data/autocomplete/widget.vue";

import { accessAutocomplete } from "#foundation/stores/autocomplete";
import { useNuxtApp } from "#imports";
import { AutocompleteService } from "#foundation/services/autocomplete";

export const createAutocomplete = <M>(
  id: string,
  config: Config<M>,
  actions: Actions<M> = {},
  settings?: WidgetSettings<AutocompleteWidgetProps<M>>,
) => {
  return (): Widget<AutocompleteWidgetProps<M>> => {
    const nuxt = useNuxtApp();
    const state = accessAutocomplete<M>(id);
    const service = new AutocompleteService(nuxt, id, config, state, actions);

    return {
      service,
      component,
      settings,
    };
  };
};
