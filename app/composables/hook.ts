import type { HookListeners, ScopedEvent } from "../types/hook";

import { onScopeDispose, useNuxtApp } from "#imports";
import { entries } from "objectively";

export const useHooks = <E extends HookListeners>(
  id: string,
  listeners: E,
): void => {
  const nuxt = useNuxtApp();

  const map: HookListeners = listeners;
  const scoped: HookListeners = {};
  for (const [key, listener] of entries(map)) {
    if (!listener) continue;
    scoped[key] = (event: ScopedEvent) => {
      if (event.id !== id) return;
      listener(event);
    };
  }

  onScopeDispose(nuxt.hooks.addHooks(scoped));
};
