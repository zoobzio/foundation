import { vi } from "vitest";
import { computed, ref, useTemplateRef } from "vue";

// Provide Vue auto-imports that Nuxt normally handles
vi.stubGlobal("computed", computed);
vi.stubGlobal("ref", ref);
vi.stubGlobal("useTemplateRef", useTemplateRef);

// Stub useIconAlias used by Icon component
vi.stubGlobal("useIconAlias", (alias: string) => ({
  uri: `/__mocked__/${alias}.svg`,
  mode: "mask",
}));
