import type { Events } from "../types/data/autocomplete";
import type { AutocompleteWidgetProps } from "../types/data/autocomplete/widget";
import type { AutocompleteDefinition } from "../definitions/autocomplete";
import type { Widget } from "../types/widget";

import component from "../components/data/autocomplete/widget.vue";

import { accessAutocomplete } from "../stores/autocomplete";
import { useNuxtApp } from "#imports";
import { AutocompleteService } from "../services/autocomplete";

/**
 * Instances a definition: `id` is the only thing the factory adds — shared
 * state, hook scoping, wiring identity all key on it.
 */
export const createAutocomplete = <M>(
  id: string,
  definition: AutocompleteDefinition<M>,
) => {
  return (): Widget<AutocompleteWidgetProps<M>, Events<M>> => {
    const nuxt = useNuxtApp();
    const state = accessAutocomplete<M>(id);
    const service = new AutocompleteService(nuxt, id, definition.config, state, definition.actions ?? {});
    return {
      service,
      component,
      settings: definition.settings,
    };
  };
};
