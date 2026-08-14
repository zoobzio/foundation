import type { Events } from "#foundation/types/data/deck";
import type { DeckWidgetProps } from "#foundation/types/data/deck/widget";
import type { DeckDefinition } from "#foundation/definitions/deck";
import type { Widget } from "#foundation/types/widget";

import component from "#foundation/components/data/deck/widget.vue";

import { accessDeck } from "#foundation/stores/deck";
import { useNuxtApp } from "#imports";
import { DeckService } from "#foundation/services/deck";

/**
 * Instances a definition: `id` is the only thing the factory adds — shared
 * state, hook scoping, wiring identity all key on it.
 */
export const createDeck = <T>(
  id: string,
  definition: DeckDefinition<T>,
) => {
  return (): Widget<DeckWidgetProps<T>, Events> => {
    const nuxt = useNuxtApp();
    const state = accessDeck(id, definition.config);
    const service = new DeckService(nuxt, id, definition.config, state, definition.actions);
    return {
      service,
      component,
      settings: definition.settings,
    };
  };
};
