import type { Events } from "../types/data/form";
import type { FormWidgetProps } from "../types/data/form/widget";
import type { FormDefinition } from "../definitions/form";
import type { Widget } from "../types/widget";

import component from "../components/data/form/widget.vue";

import { accessForm } from "../stores/form";
import { useNuxtApp } from "#imports";
import { FormService } from "../services/form";

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
