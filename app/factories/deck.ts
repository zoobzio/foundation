import type { Actions, Events } from "../types/data/deck";
import type { DeckWidgetProps } from "../types/data/deck/widget";
import type { DeckDefinition } from "../definitions/deck";
import type { Widget } from "../types/widget";
import type { MaybeRefOrGetter } from "vue";

import component from "../components/data/deck/widget.vue";

import { rekey } from "objectively";
import { accessDeck } from "../stores/deck";
import { toValue, useNuxtApp } from "#imports";
import { DeckService } from "../services/deck";
import { merge } from "../utils/merge";

/**
 * The behavior half of a deck, attached in setup: the fetch mechanism and
 * the reactive pt override merged over the definition's base.
 */
export type DeckWiring<T> = {
  fetch: Actions<T>["fetch"];
  pt?: MaybeRefOrGetter<DeckWidgetProps<T>["pt"]>;
};

/**
 * Instances a definition in the calling scope — call in setup: `id` is the
 * only thing the composable adds; shared state, hook scoping, wiring
 * identity all key on it. `T` infers from the definition's stamp (falling
 * back to the wiring's fetch for unstamped definitions). Settings resolve
 * wiring pt over definition pt per key (widget recipes are the third
 * layer, merged in the component); the getter keeps a reactive wiring pt
 * live.
 */
export const useDeck = <T>(
  id: string,
  definition: DeckDefinition<T>,
  wiring: DeckWiring<T>,
): Widget<DeckWidgetProps<T>, Events> => {
  const nuxt = useNuxtApp();
  const state = accessDeck(id, definition);
  const service = new DeckService(nuxt, id, definition, state, wiring);
  return {
    service,
    component,
    settings: () =>
      rekey<Record<string, unknown>, NonNullable<DeckWidgetProps<T>["pt"]>>(
        merge(toValue(wiring.pt) ?? {}, definition.pt ?? {}),
        (key, value) => [key, value],
      ),
  };
};
