// Vitest shim for Nuxt's virtual `#imports` module.
//
// The consolidated layer imports every framework symbol explicitly from
// "#imports" (Vue APIs, Nuxt composables, VueUse). There is no Nuxt runtime in
// the vitest environment, so we re-export the real Vue + VueUse APIs and stub the
// Nuxt-runtime composables. Type-only imports (Ref, ComputedRef, NuxtError, …)
// are erased by esbuild before this module is ever loaded, so only value exports
// matter here.

import { defineComponent, ref, type Ref } from "vue";

// Real Vue APIs (ref, computed, watch, useTemplateRef, useId, …).
export * from "vue";

// Override inject: factories call `inject(KEY, default)` outside a component
// setup(), where Vue's real inject returns undefined. Return the default instead
// (matches the old test stub). Local export shadows the `export *` above.
export const inject = <T>(_key: unknown, defaultValue?: T) => defaultValue;

// --- Nuxt composables (stubbed) ---

// Real useState dedupes by key — two calls with the same key share one ref
// (stores/ depend on this). Keep a keyed registry, cleared between tests by
// tests/setup.ts. Typecheck resolves callers' `#imports` against Nuxt's
// generated types, not this shim, so the loose Ref<unknown> here never leaks.
const stateRegistry = new Map<string, Ref<unknown>>();

export const clearNuxtStateRegistry = () => stateRegistry.clear();

export const useState = (key: string, init?: () => unknown): Ref<unknown> => {
  const existing = stateRegistry.get(key);
  if (existing) return existing;
  const state = ref(init ? init() : undefined);
  stateRegistry.set(key, state);
  return state;
};
// Working hook bus with real Nuxt semantics: `hooks.addHooks` registers a
// listener map and returns its unregister fn; `callHook` dispatches. Cleared
// between tests by tests/setup.ts.
type HookFn = (...args: unknown[]) => unknown;

const hookRegistry = new Map<string, Set<HookFn>>();

export const clearNuxtHooks = () => hookRegistry.clear();

const addHooks = (listeners: Record<string, HookFn>) => {
  const added = Object.entries(listeners);
  for (const [name, fn] of added) {
    const set = hookRegistry.get(name) ?? new Set();
    set.add(fn);
    hookRegistry.set(name, set);
  }
  return () => {
    for (const [name, fn] of added) {
      hookRegistry.get(name)?.delete(fn);
    }
  };
};

const callHook = async (name: string, ...args: unknown[]) => {
  for (const fn of hookRegistry.get(name) ?? []) {
    await fn(...args);
  }
};

const noop = () => {};
const noopLogger = {
  trace: noop,
  debug: noop,
  info: noop,
  warn: noop,
  error: noop,
};

export const useNuxtApp = () => ({
  callHook,
  hooks: { addHooks },
  // Plugin injection from plugins/log.ts.
  $logger: () => noopLogger,
});

// Executes the handler immediately (client-side lazy semantics) so request
// wiring can be exercised for real — await flushes before asserting.
const makeAsyncData = (handler: () => Promise<unknown>) => {
  const data = ref<unknown>(null);
  const error = ref<unknown>(null);
  const pending = ref(true);
  const status = ref("pending");
  const execute = async () => {
    pending.value = true;
    status.value = "pending";
    try {
      data.value = await handler();
      error.value = null;
      status.value = "success";
    } catch (caught) {
      error.value = caught;
      status.value = "error";
    } finally {
      pending.value = false;
    }
  };
  const promise = execute();
  return {
    data,
    error,
    pending,
    status,
    promise,
    execute: () => execute(),
    refresh: () => execute(),
  };
};

export const useAsyncData = (
  _key: unknown,
  handler: () => Promise<unknown>,
) => makeAsyncData(handler);

export const useLazyAsyncData = (
  _key: unknown,
  handler: () => Promise<unknown>,
) => makeAsyncData(handler);
export const useHead = () => {};
export const clearError = () => {};
export const createError = (input: string | Record<string, unknown>) => {
  const err = new Error(
    typeof input === "string" ? input : String(input?.message ?? ""),
  ) as Error & Record<string, unknown>;
  if (input && typeof input === "object") {
    err.statusCode = input.statusCode;
    err.fatal = input.fatal;
    err.data = input.data;
  }
  return err;
};
export const defineNuxtLink = () => ({ name: "NuxtLink", template: "<a><slot /></a>" });

// `#components` also resolves here — ClientOnly just renders its slot.
export const ClientOnly = defineComponent({
  name: "ClientOnly",
  setup(_, { slots }) {
    return () => slots.default?.();
  },
});

// The untheme CSS renderer is provided by a Nuxt plugin at runtime. Stand in
// with a minimal renderer whose `root` serializes token bindings to a
// deterministic custom-property string, so `useTokens` can be exercised without
// a real untheme/Nuxt runtime.
// A small mock of the theme contract's tokens for the no-Nuxt vitest env.
const MOCK_THEME_TOKENS: Record<string, object> = {
  "primary-50": {},
  "primary-500": {},
  "primary-600": {},
};

export const useUntheme = () => ({
  config: { theme: { tokens: MOCK_THEME_TOKENS } },
});

export const useUnthemeRenderer = () => ({
  // Serialize contract-token bindings to a { --var: value } map, resolving a
  // `{token}` reference or a bare token-name value to `var(--token)`, and
  // skipping any key the contract does not know (component tokens) — mirroring
  // the real renderer's `declarations`.
  variables: (bindings: Record<string, unknown> = {}) => {
    const out: Record<string, string> = {};
    for (const [key, value] of Object.entries(bindings)) {
      if (!(key in MOCK_THEME_TOKENS)) continue;
      if (typeof value === "string" && value.startsWith("{") && value.endsWith("}")) {
        out[`--${key}`] = `var(--${value.slice(1, -1)})`;
      } else if (typeof value === "string" && value in MOCK_THEME_TOKENS) {
        out[`--${key}`] = `var(--${value})`;
      } else {
        out[`--${key}`] = String(value);
      }
    }
    return out;
  },
});

// --- VueUse (stubbed to avoid real keyboard/DOM listeners in jsdom) ---
export const useMagicKeys = () => new Proxy({}, { get: () => ref(false) });
export const whenever = () => {};
