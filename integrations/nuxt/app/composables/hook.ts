import type {
  ErasedHookListener,
  HookListeners,
  ScopedEvent,
} from "../types/hook";

import { useNuxtApp } from "#app";
import { onScopeDispose } from "vue";
import { entries } from "objectively";

/**
 * Subscribes to the Nuxt hook bus for one service instance. Each listener
 * fires only for events whose `id` matches, and every subscription is
 * removed when the calling scope is disposed, so call this in setup.
 *
 * @param id - The service id the listeners are scoped to.
 * @param listeners - Scoped hook name to callback.
 */
export const useHooks = (id: string, listeners: HookListeners): void => {
  const nuxt = useNuxtApp();

  const scoped: Record<string, (event: ScopedEvent) => void> = {};
  for (const [key, listener] of entries(listeners)) {
    if (!listener) continue;
    const fn: ErasedHookListener = listener;
    scoped[key] = (event) => {
      if (event.id !== id) return;
      fn(event);
    };
  }

  onScopeDispose(nuxt.hooks.addHooks(scoped));
};
