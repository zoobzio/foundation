import type { Events } from "#foundation/types/data/preview";
import type { PreviewWidgetProps } from "#foundation/types/data/preview/widget";
import type { PreviewDefinition } from "#foundation/definitions/preview";
import type { Widget } from "#foundation/types/widget";

import component from "#foundation/components/data/preview/widget.vue";

import { accessPreview } from "#foundation/stores/preview";
import { useNuxtApp } from "#imports";
import { PreviewService } from "#foundation/services/preview";

/**
 * Instances a definition: `id` is the only thing the factory adds — shared
 * state, hook scoping, wiring identity all key on it.
 */
export const createPreview = <T>(
  id: string,
  definition: PreviewDefinition<T>,
) => {
  return (): Widget<PreviewWidgetProps<T>, Events> => {
    const nuxt = useNuxtApp();
    const state = accessPreview<T>(id);
    const service = new PreviewService(nuxt, id, definition.config, state, definition.actions);
    return {
      service,
      component,
      settings: definition.settings,
    };
  };
};
