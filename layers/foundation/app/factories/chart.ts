import type { Actions, Events } from "../types/data/chart";
import type { ChartWidgetProps } from "../types/data/chart/widget";
import type { ChartDefinition } from "../definitions/chart";
import type { Stamp } from "../types/definition";
import type { Widget } from "../types/widget";
import type { MaybeRefOrGetter } from "vue";

import component from "../components/data/chart/widget.vue";

import { rekey } from "objectively";
import { accessChart } from "../stores/chart";
import { toValue, useNuxtApp } from "#imports";
import { ChartService } from "@zoobzio/chart";
import { merge } from "../utils/merge";

/**
 * The behavior half of a chart, attached in setup: one fetcher per variant
 * the definition declares — required exactly when its config exists,
 * rejected when it doesn't — and the reactive pt override merged over the
 * definition's base.
 */
export type ChartWiring<T, D extends ChartDefinition<T>> = {
  pt?: MaybeRefOrGetter<ChartWidgetProps<T>["pt"]>;
} & (undefined extends D["breakdown"]
  ? { breakdown?: undefined }
  : { breakdown: NonNullable<Actions<T>["breakdown"]> }) &
  (undefined extends D["series"]
    ? { series?: undefined }
    : { series: NonNullable<Actions<T>["series"]> }) &
  (undefined extends D["distribution"]
    ? { distribution?: undefined }
    : { distribution: NonNullable<Actions<T>["distribution"]> }) &
  (undefined extends D["comparison"]
    ? { comparison?: undefined }
    : { comparison: NonNullable<Actions<T>["comparison"]> });

/**
 * Instances a definition in the calling scope — call in setup: `id` is the
 * only thing the composable adds; shared state, hook scoping, wiring
 * identity all key on it. The Nuxt wiring is here: the `useState` container
 * via the store, and the service's events relayed onto the hook bus and the
 * app logger — the machine itself is `@zoobzio/chart`. `T` infers from the
 * definition's stamp (falling back to the wiring's fetchers for unstamped
 * definitions). Settings resolve wiring pt over definition pt per key
 * (widget recipes are the third layer, merged in the component); the getter
 * keeps a reactive wiring pt live.
 */
export const useChart = <T, D extends ChartDefinition<T>>(
  id: string,
  definition: D & Stamp<T>,
  wiring: ChartWiring<T, D>,
): Widget<ChartWidgetProps<T>, Events> => {
  const nuxt = useNuxtApp();
  const log = nuxt.$logger(id);
  const state = accessChart(id, definition);
  const service = new ChartService(id, definition, state, wiring);
  service.on("updated", (event) => {
    log.debug("Chart updated", { id: event.id, variant: event.variant });
    nuxt.callHook("chart:updated", event);
  });
  service.on("variantChanged", (event) => {
    log.debug("Chart variant changed", event);
    nuxt.callHook("chart:variant-changed", event);
  });
  service.on("rendererChanged", (event) => {
    log.debug("Chart renderer changed", event);
    nuxt.callHook("chart:renderer-changed", event);
  });
  return {
    service,
    component,
    settings: () =>
      rekey<Record<string, unknown>, NonNullable<ChartWidgetProps<T>["pt"]>>(
        merge(toValue(wiring.pt) ?? {}, definition.pt ?? {}),
        (key, value) => [key, value],
      ),
  };
};
