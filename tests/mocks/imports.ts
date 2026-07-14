// Vitest shim for Nuxt's virtual `#imports` module.
//
// The consolidated layer imports every framework symbol explicitly from
// "#imports" (Vue APIs, Nuxt composables, VueUse). There is no Nuxt runtime in
// the vitest environment, so we re-export the real Vue + VueUse APIs and stub the
// Nuxt-runtime composables. Type-only imports (Ref, ComputedRef, NuxtError, …)
// are erased by esbuild before this module is ever loaded, so only value exports
// matter here.

import { ref } from "vue";

// Real Vue APIs (ref, computed, watch, useTemplateRef, useId, …).
export * from "vue";

// Override inject: factories call `inject(KEY, default)` outside a component
// setup(), where Vue's real inject returns undefined. Return the default instead
// (matches the old test stub). Local export shadows the `export *` above.
export const inject = <T>(_key: unknown, defaultValue?: T) => defaultValue;

// --- Nuxt composables (stubbed) ---
export const useState = <T>(_key: string, init?: () => T) => ref(init ? init() : undefined);
export const useNuxtApp = () => ({ callHook: () => {} });
export const useLazyAsyncData = () => ({
  data: ref(null),
  pending: ref(false),
  error: ref(null),
  status: ref("idle"),
  refresh: async () => {},
});
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

// --- VueUse (stubbed to avoid real keyboard/DOM listeners in jsdom) ---
export const useMagicKeys = () => new Proxy({}, { get: () => ref(false) });
export const whenever = () => {};
