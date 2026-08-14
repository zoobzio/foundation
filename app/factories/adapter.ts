import type { Config, Events } from "#foundation/types/data/adapter";
import type { AdapterWidgetProps } from "#foundation/types/data/adapter/widget";
import type { Widget, WidgetSettings } from "#foundation/types/widget";

import component from "#foundation/components/data/adapter/widget.vue";

import { useNuxtApp } from "#imports";
import { accessAdapter } from "#foundation/stores/adapter";
import { AdapterService } from "#foundation/services/adapter";

type RequiredKeys<P> = {
  [K in keyof P]-?: {} extends Pick<P, K> ? never : K;
}[keyof P];

/**
 * `settings` is optional only when the contract can render without it: a
 * contract with required props demands the settings argument that supplies
 * them.
 */
type SettingsArgs<P extends object> = [RequiredKeys<P>] extends [never]
  ? [settings?: WidgetSettings<AdapterWidgetProps<P>>]
  : [settings: WidgetSettings<AdapterWidgetProps<P>>];

/**
 * Lifts a plain component into the widget contract so userland content is
 * resolvable wherever a structure resolves widgets.
 *
 * Pass the contract explicitly — `createAdapter<NavContract>(…)` — to author
 * the adapter's surface: the component must implement it, `settings`/`patch`
 * check against exactly its props, and its `on*` listener props define the
 * emit vocabulary `emits` must acknowledge in full. Omitting the generic
 * infers the contract from the component's own `$props`.
 *
 * `settings` is the wrapped component's base props — static or reactive —
 * delivered through the standard settings channel; the service's `patch`
 * layer overrides them per key, and every contract emit bridges onto the
 * hook bus for spec wiring.
 */
export const createAdapter = <P extends object>(
  id: string,
  config: Config<P>,
  ...args: SettingsArgs<P>
) => {
  const [settings] = args;
  return (): Widget<AdapterWidgetProps<P>, Events<P>> => {
    const nuxt = useNuxtApp();
    const state = accessAdapter<P>(id);
    const service = new AdapterService(nuxt, id, config, state);
    return { service, component, settings };
  };
};
