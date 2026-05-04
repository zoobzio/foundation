import { vi } from "vitest";
import { computed, ref, readonly, shallowRef, watch, watchEffect, nextTick, onMounted, onBeforeUnmount, useTemplateRef, useAttrs, useSlots, toValue } from "vue";

// Vue auto-imports
vi.stubGlobal("computed", computed);
vi.stubGlobal("ref", ref);
vi.stubGlobal("readonly", readonly);
vi.stubGlobal("shallowRef", shallowRef);
vi.stubGlobal("watch", watch);
vi.stubGlobal("watchEffect", watchEffect);
vi.stubGlobal("nextTick", nextTick);
vi.stubGlobal("onMounted", onMounted);
vi.stubGlobal("onBeforeUnmount", onBeforeUnmount);
vi.stubGlobal("useTemplateRef", useTemplateRef);
vi.stubGlobal("useAttrs", useAttrs);
vi.stubGlobal("useSlots", useSlots);
vi.stubGlobal("toValue", toValue);

// Nuxt helpers
vi.stubGlobal("defineNuxtLink", () => ({ template: "<a><slot /></a>" }));
vi.stubGlobal("useLazyAsyncData", () => ({ data: ref(null), pending: ref(false) }));
vi.stubGlobal("useId", () => Math.random().toString(36).slice(2, 8));
vi.stubGlobal("useState", (_key: string, init?: () => unknown) => ref(init?.()));
vi.stubGlobal("inject", (_key: unknown, defaultValue?: unknown) => defaultValue);
vi.stubGlobal("useNuxtApp", () => ({ callHook: vi.fn() }));

// Stub useIconAlias used by Icon component
vi.stubGlobal("useIconAlias", (alias: string) => ({
  uri: `/__mocked__/${alias}.svg`,
  mode: "mask",
}));
