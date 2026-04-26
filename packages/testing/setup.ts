import { vi } from "vitest";
import { computed, ref, watch, nextTick, useTemplateRef, useAttrs, toValue } from "vue";
import { passthrough } from "../../layers/alloy/app/utils/passthrough";
import { usePassthrough, useItemPassthrough } from "../../layers/alloy/app/composables/passthrough";

// Vue auto-imports
vi.stubGlobal("computed", computed);
vi.stubGlobal("ref", ref);
vi.stubGlobal("watch", watch);
vi.stubGlobal("nextTick", nextTick);
vi.stubGlobal("useTemplateRef", useTemplateRef);
vi.stubGlobal("useAttrs", useAttrs);
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
