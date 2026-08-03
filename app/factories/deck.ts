import type { Config, Actions } from "#foundation/types/data/deck";
import type { DeckWidgetProps } from "#foundation/types/data/deck/widget";
import type { Widget, WidgetSettings } from "#foundation/types/widget";

import component from "#foundation/components/data/deck/widget.vue";

import { accessDeck } from "#foundation/stores/deck";
import { useNuxtApp } from "#imports";
import { DeckService } from "#foundation/services/deck";

export const createDeck = <T>(
  id: string,
  config: Config<T>,
  actions: Actions<T>,
  settings?: WidgetSettings<DeckWidgetProps<T>>,
) => {
  return (): Widget<DeckWidgetProps<T>> => {
    const nuxt = useNuxtApp();
    const state = accessDeck(id, config);
    const service = new DeckService(nuxt, id, config, state, actions);

    return {
      service,
      component,
      settings,
    };
  };
};
