import type { RuntimeNuxtHooks } from "#app";

/**
 * An event payload scoped to a service instance by id.
 */
export interface ScopedEvent {
  id: string;
}

/**
 * Hook names whose event payload carries a scoping id — the only hooks
 * `useHooks` can filter by instance.
 */
export type ScopedHookKey = {
  [K in keyof RuntimeNuxtHooks]: RuntimeNuxtHooks[K] extends (
    event: infer E,
  ) => unknown
    ? E extends ScopedEvent
      ? K
      : never
    : never;
}[keyof RuntimeNuxtHooks];

export type HookListener = {
  fn(event: ScopedEvent): void;
}["fn"];

/**
 * Bulk listener map: scoped hook name -> callback.
 */
export type HookListeners = {
  [K in ScopedHookKey]?: HookListener;
};
