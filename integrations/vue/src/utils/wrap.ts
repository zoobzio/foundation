import type { WrapOptions } from "../types/wrap";
import type { Component, VNode } from "vue";

import { record } from "objectively";
import { computed, defineComponent, h, shallowRef } from "vue";
import { merge } from "./merge";

type Slots = Record<string, unknown>;

/**
 * The consumer's `pt` with the wrapper's laid under it. A static layer
 * merges, the consumer winning per key and function parts composing; a
 * function layer is handed the consumer's `pt` and its result is the prop.
 */
const laid = (pt: unknown, layer: unknown): unknown => {
  if (typeof layer === "function") return layer(pt);
  if (!record(layer)) return pt;
  return merge(record(pt) ? pt : {}, layer);
};

/**
 * The events a component declares, by name, from either form of `emits`.
 */
const declared = (core: Component): string[] => {
  const emits = "emits" in core ? core.emits : undefined;
  if (Array.isArray(emits)) return emits;
  return record(emits) ? Object.keys(emits) : [];
};

/**
 * One listener per declared event, in `on*` form, relaying to `emit`.
 */
const relayed = (
  names: string[],
  emit: (name: string, ...args: unknown[]) => void,
): Record<string, (...args: unknown[]) => void> =>
  Object.fromEntries(
    names.map((name) => [
      `on${name.charAt(0).toUpperCase()}${name.slice(1)}`,
      (...args: unknown[]) => emit(name, ...args),
    ]),
  );

/**
 * The consumer's slot record with the defaults filled in where it has no
 * slot of that name. Read on each render, so a slot that appears or
 * disappears later is seen; the consumer's slot wins whenever present.
 */
const filled = (slots: Slots, defaults: Slots): Slots => {
  const out: Slots = { ...slots };
  for (const key of Object.keys(defaults)) {
    if (out[key] == null) out[key] = defaults[key];
  }
  return out;
};

/**
 * Wraps a component with a `pt` layer and slot defaults, typed as the
 * component itself. The wrapper declares no props: it receives what the
 * consumer passed as attrs and hands all of it on, so an absent prop
 * stays absent and the wrapped component's own defaults apply. It
 * declares the wrapped component's emits and relays each, so the events
 * are its own as far as a listener, devtools, or a test can tell. It
 * exposes the wrapped component's `ctx` as its own.
 *
 * @param core - The component to wrap.
 * @param options - The `pt` layer and the slot defaults to lay under it.
 * @returns A component with the wrapped component's contract.
 */
export function wrap<C extends Component>(core: C, options?: WrapOptions<C>): C;
export function wrap(
  core: Component,
  options: { pt?: unknown; slots?: unknown } = {},
): Component {
  const defaults = record(options.slots) ? options.slots : {};
  const names = declared(core);
  return defineComponent({
    name: typeof core.name === "string" ? core.name : undefined,
    inheritAttrs: false,
    emits: names,
    setup(_, { attrs, slots, emit, expose }) {
      const el = shallowRef<{ ctx?: unknown } | null>(null);
      const listeners = relayed(names, emit);
      expose({ ctx: computed(() => el.value?.ctx) });
      return (): VNode =>
        h(
          core,
          { ...attrs, ...listeners, pt: laid(attrs.pt, options.pt), ref: el },
          filled(slots, defaults),
        );
    },
  });
}
