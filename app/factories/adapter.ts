import type { AdapterDefinition } from "../definitions/adapter";
import type { Events } from "../types/data/adapter";
import type { AdapterWidgetProps } from "../types/data/adapter/widget";
import type { Widget } from "../types/widget";

import component from "../components/data/adapter/widget.vue";

import { useNuxtApp } from "#imports";
import { accessAdapter } from "../stores/adapter";
import { AdapterService } from "../services/adapter";

/**
 * Instances an adaptation in the calling scope — call in setup: `id` is the
 * only thing the composable adds; the override layer, hook scoping, and
 * wiring identity all key on it. Author definitions with `defineAdapter`
 * (or a composite helper like `defineDirectory`), where the contract is
 * enforced.
 */
export const useAdapter = <P extends object>(
  id: string,
  definition: AdapterDefinition<P>,
): Widget<AdapterWidgetProps<P>, Events<P>> => {
  const nuxt = useNuxtApp();
  const state = accessAdapter<P>(id);
  const service = new AdapterService(nuxt, id, definition, state);
  return { service, component, settings: definition.settings };
};
