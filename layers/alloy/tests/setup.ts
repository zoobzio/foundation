import { vi } from "vitest";
import { ref } from "vue";
import { passthrough } from "../app/utils/passthrough";
import { usePassthrough, useItemPassthrough } from "../app/composables/passthrough";

// Alloy passthrough auto-imports
vi.stubGlobal("passthrough", passthrough);
vi.stubGlobal("usePassthrough", usePassthrough);
vi.stubGlobal("useItemPassthrough", useItemPassthrough);

// Alloy util namespaces
vi.stubGlobal("Keywords", (await import("../app/utils/keywords")).Keywords);
vi.stubGlobal("Pagination", (await import("../app/utils/pagination")).Pagination);
vi.stubGlobal("Command", (await import("../app/utils/command")).Command);
vi.stubGlobal("DateUtils", (await import("../app/utils/date")).DateUtils);
vi.stubGlobal("MultiSelect", (await import("../app/utils/multi-select")).MultiSelect);

// Alloy util auto-imports
vi.stubGlobal("recipe", (await import("../app/utils/recipe")).recipe);
vi.stubGlobal("parseMarkdown", (await import("../app/utils/markdown")).parseMarkdown);

// Stub useHighlight — returns empty string in tests (no async Shiki)
vi.stubGlobal("useHighlight", () => ref(""));

// Stub VueUse composables used by Fab
vi.stubGlobal("useMagicKeys", () => new Proxy({}, { get: () => ref(false) }));
vi.stubGlobal("whenever", () => {});
