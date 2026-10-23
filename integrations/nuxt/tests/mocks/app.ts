// Vitest shim for Nuxt's `#app` entry.
//
// The layer imports every Nuxt symbol explicitly from "#app" (Vue's own API
// comes from "vue"). There is no Nuxt runtime in the vitest environment, so
// this stubs the Nuxt composables the layer uses, with real semantics:
// `useState` dedupes by key and the hook bus dispatches. Typecheck resolves
// the layer's `#app` against Nuxt's own types, not this shim, so the loose
// types here never leak.

import { ref, type Ref } from "vue";
import { vi } from "vitest";

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

// --- logger --------------------------------------------------------------

// The plugin's injections, as spies: one recorded logger per name, so a
// test can assert what a factory logged. Cleared between tests by
// tests/setup.ts.
const makeSpyLogger = () => ({
  level: ref("info"),
  backlog: ref([]),
  trace: vi.fn(),
  debug: vi.fn(),
  info: vi.fn(),
  warn: vi.fn(),
  error: vi.fn(),
});

const loggers = new Map<string, ReturnType<typeof makeSpyLogger>>();

export const clearNuxtLoggers = () => loggers.clear();

const $logger = (name = "app") => {
  const existing = loggers.get(name);
  if (existing) return existing;
  const logger = makeSpyLogger();
  loggers.set(name, logger);
  return logger;
};

export const useNuxtApp = () => ({
  callHook,
  hook,
  hooks: { addHooks, hook },
  $log: $logger(),
  $logger,
});

// A plugin is its setup function; a test calls it with a fake app.
export const defineNuxtPlugin = <P>(plugin: P): P => plugin;

// --- app shell ---------------------------------------------------------

export const useHead = () => {};

export const clearError = vi.fn();

// --- errors --------------------------------------------------------------

// Nuxt marks its errors with this non-enumerable flag; isNuxtError reads it.
const NUXT_ERROR_SIGNATURE = "__nuxt_error";

export const isNuxtError = (error: unknown) =>
  !!error && typeof error === "object" && NUXT_ERROR_SIGNATURE in error;

// Nuxt's createError, reduced to the fields the layer reads back.
export const createError = (input: string | Record<string, unknown>) => {
  const err = new Error(
    typeof input === "string" ? input : String(input.message ?? ""),
  ) as Error & Record<string, unknown>;
  Object.defineProperty(err, NUXT_ERROR_SIGNATURE, { value: true });
  if (typeof input === "object") {
    err.statusCode = input.statusCode;
    err.statusText = input.statusText;
    err.fatal = input.fatal;
    err.data = input.data;
    err.cause = input.cause;
  }
  return err;
};

// --- async data ----------------------------------------------------------

// Executes the handler at once (client-side semantics) so request wiring
// can be exercised for real; await `promise` before asserting.
const makeAsyncData = (
  handler: () => Promise<unknown>,
  options: Record<string, unknown> = {},
) => {
  const data = ref<unknown>(null);
  const error = ref<unknown>(null);
  const status = ref("idle");
  const pending = ref(false);
  const execute = async () => {
    status.value = "pending";
    pending.value = true;
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
    status,
    pending,
    promise,
    options,
    execute: () => execute(),
    refresh: () => execute(),
  };
};

export const useAsyncData = (
  _key: unknown,
  handler: () => Promise<unknown>,
  options?: Record<string, unknown>,
) => makeAsyncData(handler, options);

export const useLazyAsyncData = (
  _key: unknown,
  handler: () => Promise<unknown>,
  options?: Record<string, unknown>,
) => makeAsyncData(handler, options);
