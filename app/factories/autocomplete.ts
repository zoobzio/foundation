import type { Events } from "#foundation/types/data/autocomplete";
import type { AutocompleteWidgetProps } from "#foundation/types/data/autocomplete/widget";
import type { AutocompleteDefinition } from "#foundation/definitions/autocomplete";
import type { Widget } from "#foundation/types/widget";

import component from "#foundation/components/data/autocomplete/widget.vue";

import { accessAutocomplete } from "#foundation/stores/autocomplete";
import { useNuxtApp } from "#imports";
import { AutocompleteService } from "#foundation/services/autocomplete";

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
