import type { Events } from "../types/data/preview";
import type { PreviewWidgetProps } from "../types/data/preview/widget";
import type { PreviewDefinition } from "../definitions/preview";
import type { Widget } from "../types/widget";

import component from "../components/data/preview/widget.vue";

import { accessPreview } from "../stores/preview";
import { useNuxtApp } from "#imports";
import { PreviewService } from "../services/preview";

/**
 * Instances a definition in the calling scope — call in setup: `id` is the
 * only thing the composable adds; shared state, hook scoping, wiring
 * identity all key on it.
 */
export const usePreview = <T>(
  id: string,
  definition: PreviewDefinition<T>,
): Widget<PreviewWidgetProps<T>, Events> => {
  const nuxt = useNuxtApp();
  const state = accessPreview<T>(id);
  const service = new PreviewService(nuxt, id, definition.config, state, definition.actions);
  return {
    service,
    component,
    settings: definition.settings,
  };
};
