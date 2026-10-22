import type { RuntimeNuxtHooks } from "#app";

/**
 * An event payload scoped to a service instance by its id. Every event the
 * layer relays carries one.
 */
export interface ScopedEvent {
  id: string;
}

/**
 * The hook names whose payload carries a scoping id: the hooks `useHooks`
 * can filter by instance. The payload is checked whole, not member by
 * member, so a hook with an optional payload stays out.
 */
export type ScopedHookKey = {
  [K in keyof RuntimeNuxtHooks]: RuntimeNuxtHooks[K] extends (
    event: infer E,
  ) => unknown
    ? [E] extends [ScopedEvent]
      ? K
      : never
    : never;
}[keyof RuntimeNuxtHooks];

/**
 * A listener for one scoped hook, with the hook's own payload.
 */
export type HookListener<K extends ScopedHookKey> = {
  fn(event: Parameters<RuntimeNuxtHooks[K]>[0]): void;
}["fn"];

/**
 * A listener as the runner sees it, over the erased payload. Method syntax
 * on purpose: it is bivariant, so a listener typed on its hook's payload
 * assigns in. Sound by construction, since the runner only calls it with
 * events of the hook it was registered under.
 */
export type ErasedHookListener = {
  fn(event: ScopedEvent): void;
}["fn"];

/**
 * A listener map: scoped hook name to callback. Each callback receives that
 * hook's payload.
 */
export type HookListeners = {
  [K in ScopedHookKey]?: HookListener<K>;
};
