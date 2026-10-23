// The module registers the layer's app.d.ts as a type reference so a
// consumer's typecheck sees the NuxtApp and RuntimeNuxtHooks augmentations
// without a shim of its own. The reference must point at the real file.
import { access } from "node:fs/promises";
import { describe, expect, it, vi } from "vitest";

vi.mock("@nuxt/kit", async (importActual) => {
  const kit = await importActual<typeof import("@nuxt/kit")>();
  return {
    ...kit,
    defineNuxtModule: (definition: unknown) => definition,
    addComponent: vi.fn(),
    addImports: vi.fn(),
  };
});

type Hooks = Record<
  string,
  (payload: { references: { path: string }[] }) => void
>;

const setup = async () => {
  const hooks: Hooks = {};
  const nuxt = {
    hook: (name: string, fn: Hooks[string]) => {
      hooks[name] = fn;
    },
  };
  const { default: module } = await import("../../../modules/imports/index");
  (module as unknown as { setup: (o: unknown, n: unknown) => void }).setup(
    {},
    nuxt,
  );
  return hooks;
};

describe("imports module", () => {
  it("references app.d.ts in prepare:types", async () => {
    const hooks = await setup();
    const references: { path: string }[] = [];
    hooks["prepare:types"]?.({ references });

    expect(references).toHaveLength(1);
    const path = references[0]!.path;
    expect(path.endsWith("/app/app.d.ts")).toBe(true);
    await expect(access(path)).resolves.toBeUndefined();
  });
});
