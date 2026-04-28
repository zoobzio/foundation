import { vi } from "vitest";
import { computed, ref, shallowRef, watch, watchEffect, nextTick, onMounted, onBeforeUnmount, useTemplateRef, useAttrs, useSlots, toValue } from "vue";
import { passthrough } from "../../layers/alloy/app/utils/passthrough";
import { usePassthrough, useItemPassthrough } from "../../layers/alloy/app/composables/passthrough";

// Vue auto-imports
vi.stubGlobal("computed", computed);
vi.stubGlobal("ref", ref);
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

// Alloy passthrough auto-imports
vi.stubGlobal("passthrough", passthrough);
vi.stubGlobal("usePassthrough", usePassthrough);
vi.stubGlobal("useItemPassthrough", useItemPassthrough);

// Alloy util namespaces (auto-imported by Nuxt from utils/)
vi.stubGlobal("Keywords", (await import("../../layers/alloy/app/utils/keywords")).Keywords);
vi.stubGlobal("Pagination", (await import("../../layers/alloy/app/utils/pagination")).Pagination);
vi.stubGlobal("Command", (await import("../../layers/alloy/app/utils/command")).Command);
vi.stubGlobal("DateUtils", (await import("../../layers/alloy/app/utils/date")).DateUtils);
vi.stubGlobal("MultiSelect", (await import("../../layers/alloy/app/utils/multi-select")).MultiSelect);

// Alloy util auto-imports
vi.stubGlobal("recipe", (await import("../../layers/alloy/app/utils/recipe")).recipe);
vi.stubGlobal("parseMarkdown", (await import("../../layers/alloy/app/utils/markdown")).parseMarkdown);

// Stub useHighlight — returns empty string in tests (no async Shiki)
vi.stubGlobal("useHighlight", () => ref(""));

// Stub useIconAlias used by Icon component
vi.stubGlobal("useIconAlias", (alias: string) => ({
  uri: `/__mocked__/${alias}.svg`,
  mode: "mask",
}));

// Stub VueUse composables used by Fab
vi.stubGlobal("useMagicKeys", () => new Proxy({}, { get: () => ref(false) }));
vi.stubGlobal("whenever", () => {});

// Stub Nuxt helpers
vi.stubGlobal("defineNuxtLink", () => ({ template: "<a><slot /></a>" }));
vi.stubGlobal("useLazyAsyncData", () => ({ data: ref(null), pending: ref(false) }));
vi.stubGlobal("useId", () => Math.random().toString(36).slice(2, 8));
vi.stubGlobal("useState", (_key: string, init?: () => unknown) => ref(init?.()));
vi.stubGlobal("inject", (_key: unknown, defaultValue?: unknown) => defaultValue);
vi.stubGlobal("useNuxtApp", () => ({ callHook: vi.fn() }));

// Forge auto-imports
vi.stubGlobal("DataTableSnapshotSchema", (await import("../../layers/forge/app/schemas/data-table")).DataTableSnapshotSchema);
vi.stubGlobal("DataChartSnapshotSchema", (await import("../../layers/forge/app/schemas/data-chart")).DataChartSnapshotSchema);
vi.stubGlobal("DataPreviewSnapshotSchema", (await import("../../layers/forge/app/schemas/data-preview")).DataPreviewSnapshotSchema);
vi.stubGlobal("DataDeckSnapshotSchema", (await import("../../layers/forge/app/schemas/data-deck")).DataDeckSnapshotSchema);
vi.stubGlobal("WIDGET_CONFIGS", (await import("../../layers/forge/app/factories/data-table")).WIDGET_CONFIGS);
vi.stubGlobal("formatDate", (await import("../../layers/forge/app/utils/unravel")).formatDate);
vi.stubGlobal("formatCell", (await import("../../layers/forge/app/utils/format-cell")).formatCell);
vi.stubGlobal("formatFilter", (await import("../../layers/forge/app/utils/format-filter")).formatFilter);
vi.stubGlobal("useFilterUnravel", (await import("../../layers/forge/app/composables/unravel")).useFilterUnravel);
