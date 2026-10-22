// Vitest shim for Nuxt's virtual `#imports` module.
//
// The layer imports every framework symbol explicitly from "#imports". There
// is no Nuxt runtime in the vitest environment, so this re-exports the real
// Vue API and stubs the Nuxt composables the layer uses, with real
// semantics: `useState` dedupes by key and the hook bus dispatches. Typecheck
// resolves the layer's `#imports` against Nuxt's generated types, not this
// shim, so the loose types here never leak.

import { ref, type Ref } from "vue";
import { vi } from "vitest";

export * from "vue";

// --- useState ----------------------------------------------------------

const stateRegistry = new Map<string, Ref<unknown>>();

export const clearNuxtStateRegistry = () => stateRegistry.clear();

export const useState = (key: string, init?: () => unknown): Ref<unknown> => {
  const existing = stateRegistry.get(key);
  if (existing) return existing;
  const state = ref(init ? init() : undefined);
  stateRegistry.set(key, state);
  return state;
};

// --- hook bus ----------------------------------------------------------

type HookFn = (...args: unknown[]) => unknown;

const hookRegistry = new Map<string, Set<HookFn>>();

export const clearNuxtHooks = () => hookRegistry.clear();

const hook = (name: string, fn: HookFn) => {
  const set = hookRegistry.get(name) ?? new Set();
  set.add(fn);
  hookRegistry.set(name, set);
  return () => {
    hookRegistry.get(name)?.delete(fn);
  };
};

const addHooks = (listeners: Record<string, HookFn>) => {
  const offs = Object.entries(listeners).map(([name, fn]) => hook(name, fn));
  return () => {
    for (const off of offs) off();
  };
};

const callHook = async (name: string, ...args: unknown[]) => {
  for (const fn of hookRegistry.get(name) ?? []) {
    await fn(...args);
  }
};

export const useNuxtApp = () => ({
  callHook,
  hook,
  hooks: { addHooks, hook },
});

// --- app shell ---------------------------------------------------------

export const useHead = () => {};

export const clearError = vi.fn();
