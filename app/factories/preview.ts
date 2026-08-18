import type { Actions, Events } from "../types/data/preview";
import type { PreviewWidgetProps } from "../types/data/preview/widget";
import type { PreviewDefinition } from "../definitions/preview";
import type { Widget } from "../types/widget";
import type { MaybeRefOrGetter } from "vue";

import component from "../components/data/preview/widget.vue";

import { rekey } from "objectively";
import { accessPreview } from "../stores/preview";
import { toValue, useNuxtApp } from "#imports";
import { PreviewService } from "../services/preview";
import { merge } from "../utils/merge";

/**
 * The behavior half of a preview, attached in setup: the fetch mechanism
 * and the reactive pt override merged over the definition's base.
 */
export type PreviewWiring<T> = {
  fetch: Actions<T>["fetch"];
  pt?: MaybeRefOrGetter<PreviewWidgetProps<T>["pt"]>;
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
export const usePreview = <T>(
  id: string,
  definition: PreviewDefinition<T>,
  wiring: PreviewWiring<T>,
): Widget<PreviewWidgetProps<T>, Events> => {
  const nuxt = useNuxtApp();
  const state = accessPreview<T>(id);
  const service = new PreviewService(nuxt, id, definition, state, wiring);
  return {
    service,
    component,
    settings: () =>
      rekey<Record<string, unknown>, NonNullable<PreviewWidgetProps<T>["pt"]>>(
        merge(toValue(wiring.pt) ?? {}, definition.pt ?? {}),
        (key, value) => [key, value],
      ),
  };
};
