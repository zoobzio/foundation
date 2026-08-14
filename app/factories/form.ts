import type { Events } from "#foundation/types/data/form";
import type { FormWidgetProps } from "#foundation/types/data/form/widget";
import type { FormDefinition } from "#foundation/definitions/form";
import type { Widget } from "#foundation/types/widget";

import component from "#foundation/components/data/form/widget.vue";

import { accessForm } from "#foundation/stores/form";
import { useNuxtApp } from "#imports";
import { FormService } from "#foundation/services/form";

/**
 * Instances a definition: `id` is the only thing the factory adds — shared
 * state, hook scoping, wiring identity all key on it.
 */
export const createForm = <T>(
  id: string,
  definition: FormDefinition<T>,
) => {
  return (): Widget<FormWidgetProps<T>, Events<T>> => {
    const nuxt = useNuxtApp();
    const state = accessForm(id, definition.config);
    const service = new FormService(nuxt, id, definition.config, state, definition.actions);
    return {
      service,
      component,
      settings: definition.settings,
    };
  };
};
