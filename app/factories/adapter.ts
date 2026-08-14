import type { AdapterDefinition } from "../definitions/adapter";
import type { Events } from "../types/data/adapter";
import type { AdapterWidgetProps } from "../types/data/adapter/widget";
import type { Widget } from "../types/widget";

import component from "../components/data/adapter/widget.vue";

import { useNuxtApp } from "#imports";
import { accessAdapter } from "../stores/adapter";
import { AdapterService } from "../services/adapter";

/**
 * Instances an adaptation: `id` is the only thing the factory adds — the
 * override layer, hook scoping, and wiring identity all key on it. Author
 * definitions with `defineAdapter` (or a composite helper like
 * `defineDirectory`), where the contract is enforced.
 */
export const createAdapter = <P extends object>(
  id: string,
  definition: AdapterDefinition<P>,
) => {
  return (): Widget<AdapterWidgetProps<P>, Events<P>> => {
    const nuxt = useNuxtApp();
    const state = accessAdapter<P>(id);
    const service = new AdapterService(nuxt, id, definition, state);
    return { service, component, settings: definition.settings };
  };
};
