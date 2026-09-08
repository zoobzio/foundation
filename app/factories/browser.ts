import type { Actions, BrowserFolder, Events } from "../types/data/browser";
import type { BrowserWidgetProps } from "../types/data/browser/widget";
import type { BrowserDefinition } from "../definitions/browser";
import type { Stamp } from "../types/definition";
import type { Widget } from "../types/widget";
import type { MaybeRefOrGetter } from "vue";

import component from "../components/data/browser/widget.vue";

import { rekey } from "objectively";
import { accessBrowser } from "../stores/browser";
import { toValue, useNuxtApp } from "#imports";
import { BrowserService } from "../services/browser";
import { merge } from "../utils/merge";

/**
 * The behavior half of a browser, attached in setup: the fetch mechanism,
 * handlers keyed to the definition's action vocabulary (file actions,
 * folder actions, bulk actions), and the reactive pt override merged over
 * the definition's base. Handler records are required exactly when the
 * definition declares descriptors — a stray, missing, or uncovered key
 * errors on the line it is written.
 */
export type BrowserWiring<T, D extends BrowserDefinition<T>> = {
  fetch: Actions<T>["fetch"];
  pt?: MaybeRefOrGetter<BrowserWidgetProps<T>["pt"]>;
} & (undefined extends D["actions"]
  ? { actions?: undefined }
  : { actions: { [A in keyof NonNullable<D["actions"]>]: (row: T) => void } }) &
  (undefined extends D["folderActions"]
    ? { folderActions?: undefined }
    : {
        folderActions: {
          [F in keyof NonNullable<D["folderActions"]>]: (
            folder: BrowserFolder,
          ) => void;
        };
      }) &
  (undefined extends D["bulkActions"]
    ? { bulkActions?: undefined }
    : {
        bulkActions: {
          [B in keyof NonNullable<D["bulkActions"]>]: (
            selected: Set<string>,
          ) => void;
        };
      });

/**
 * Instances a definition in the calling scope — call in setup: `id` is the
 * only thing the composable adds; shared state, hook scoping, wiring
 * identity all key on it. `T` infers from the definition's stamp (falling
 * back to the wiring's fetch for unstamped definitions), and the wiring is
 * checked against it here. Settings resolve wiring pt over definition pt
 * per key (widget recipes are the third layer, merged in the component);
 * the getter keeps a reactive wiring pt live.
 */
export const useBrowser = <T, D extends BrowserDefinition<T>>(
  id: string,
  definition: D & Stamp<T>,
  wiring: BrowserWiring<T, D>,
): Widget<BrowserWidgetProps<T>, Events> => {
  const nuxt = useNuxtApp();
  const state = accessBrowser<T>(id);
  const service = new BrowserService(nuxt, id, definition, state, wiring);
  return {
    service,
    component,
    settings: () =>
      rekey<Record<string, unknown>, NonNullable<BrowserWidgetProps<T>["pt"]>>(
        merge(toValue(wiring.pt) ?? {}, definition.pt ?? {}),
        (key, value) => [key, value],
      ),
  };
};
