import type { ScopedEvent } from "./hook";
import type { Passthrough } from "./passthrough";
import type { Widgets } from "./widget";

/**
 * A component instance as data: props plus emit listeners in `on*` form —
 * the object a template `v-bind`s, and the shape an adapter captures as its
 * settings. `define*` is the stable authoring verb across layers; only the
 * definition's shape changes with the layer (composites bind props, data
 * features bundle config/actions/settings, structures arrange registries,
 * adapters capture components).
 */
export type Definition<Props, Emits = {}> = Passthrough<Props, Emits>;

/**
 * The resolved machines of a registry, keyed like the registry — what wire
 * handlers receive to drive sibling widgets imperatively.
 */
export type ServicesOf<R extends Widgets> = {
  [K in keyof R]: R[K]["service"];
};

/**
 * A registry entry's domain event map, recovered from the widget's events
 * phantom at the composable's concrete generics.
 */
export type EventsOf<R extends Widgets, K extends keyof R> = NonNullable<
  R[K]["events"]
>;

type WireEvent<
  R extends Widgets,
  K extends keyof R,
  H extends keyof EventsOf<R, K>,
> =
  EventsOf<R, K>[H] extends (event: infer E extends ScopedEvent) => unknown
    ? E
    : never;

/**
 * Definition-level coordination: per registry key, a handler per domain
 * event. Handlers receive the typed payload and the full services record.
 * Runtime rides the hooks backbone (id-scoped per resolved machine), so
 * wiring also fires when a machine is driven from elsewhere on the page.
 */
export type Wiring<R extends Widgets> = {
  [K in keyof R]?: {
    [H in keyof EventsOf<R, K>]?: (
      event: WireEvent<R, K, H>,
      services: ServicesOf<R>,
    ) => void;
  };
};

/**
 * The erased handler the wiring runner invokes. Method syntax on purpose —
 * bivariant, hook.ts precedent — so concretely-typed definition handlers
 * assign in and the runner can call them with the erased event/services.
 * Sound by construction: handlers are id-filtered to the machine whose
 * generics they were typed against.
 */
export type WireHandler = {
  fn(event: ScopedEvent, services: Record<string, unknown>): void;
}["fn"];

/**
 * The erased wiring map the runner consumes.
 */
export type AnyWiring = Record<
  string,
  Record<string, WireHandler | undefined> | undefined
>;
