import { describe, it, expect, vi, beforeEach } from "vitest";
import { join } from "node:path";

const { mkdirSync, writeFileSync, addTemplate, addImports, mockNuxt } = vi.hoisted(() => {
  const mockNuxt = {
    options: {
      buildDir: "/tmp/.nuxt",
      nitro: {} as Record<string, unknown>,
    },
  };

  return {
    mkdirSync: vi.fn(),
    writeFileSync: vi.fn(),
    addTemplate: vi.fn(),
    addImports: vi.fn(),
    mockNuxt,
  };
});

vi.mock("node:fs", () => ({ default: { mkdirSync, writeFileSync }, mkdirSync, writeFileSync }));

vi.mock("@nuxt/kit", () => ({
  defineNuxtModule: (opts: { setup: (config: unknown) => void }) => opts,
  addTemplate,
  addImports,
  createResolver: vi.fn(() => ({
    resolve: (...args: string[]) => args.join("/"),
  })),
  useNuxt: vi.fn(() => mockNuxt),
}));

// eslint-disable-next-line import/first
import module from "../src/module";

const testEntries = {
  home: { viewBox: "0 0 24 24" },
  star: { viewBox: "0 0 32 32" },
};
const testSprite = '<svg xmlns="http://www.w3.org/2000/svg"><symbol id="home" viewBox="0 0 24 24"><path/></symbol></svg>';

describe("iconic module", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    mockNuxt.options.nitro = {};
  });

  it("creates the iconic directory inside buildDir", () => {
    module.setup({ entries: testEntries, sprite: testSprite });
    expect(mkdirSync).toHaveBeenCalledWith(
      join("/tmp/.nuxt", "iconic"),
      { recursive: true },
    );
  });

  it("writes the sprite to icons.svg in the iconic directory", () => {
    module.setup({ entries: testEntries, sprite: testSprite });
    expect(writeFileSync).toHaveBeenCalledWith(
      join("/tmp/.nuxt", "iconic", "icons.svg"),
      testSprite,
      "utf-8",
    );
  });

  it("registers the iconic directory as a Nitro public asset", () => {
    module.setup({ entries: testEntries, sprite: testSprite });
    expect(mockNuxt.options.nitro.publicAssets).toEqual([
      { dir: join("/tmp/.nuxt", "iconic"), baseURL: "/" },
    ]);
  });

  it("appends to existing publicAssets", () => {
    mockNuxt.options.nitro.publicAssets = [{ dir: "/existing", baseURL: "/other" }];
    module.setup({ entries: testEntries, sprite: testSprite });
    expect(mockNuxt.options.nitro.publicAssets).toHaveLength(2);
  });

  it("adds a template for iconic.config.mjs with entries only", () => {
    module.setup({ entries: testEntries, sprite: testSprite });
    const call = addTemplate.mock.calls[0][0] as {
      filename: string;
      write: boolean;
      getContents: () => string;
    };
    expect(call.filename).toBe("iconic.config.mjs");
    expect(call.write).toBe(true);
    const contents = call.getContents();
    expect(contents).toContain('"home"');
    expect(contents).toContain('"0 0 24 24"');
    expect(contents).not.toContain("<symbol");
  });

  it("auto-imports Iconic and IconAlias types", () => {
    module.setup({ entries: testEntries, sprite: testSprite });
    const typeCalls = addImports.mock.calls.filter((c: unknown[]) =>
      Array.isArray(c[0]) && c[0].every((i: { type?: boolean }) => i.type),
    );
    expect(typeCalls).toHaveLength(1);
    const types = typeCalls[0][0];
    expect(types).toContainEqual(
      expect.objectContaining({ name: "IconAliases", type: true }),
    );
    expect(types).toContainEqual(
      expect.objectContaining({ name: "IconAlias", type: true }),
    );
  });

  it("auto-imports useIconAlias composable", () => {
    module.setup({ entries: testEntries, sprite: testSprite });
    const composableCalls = addImports.mock.calls.filter(
      (c: unknown[]) => !Array.isArray(c[0]),
    );
    expect(composableCalls).toHaveLength(1);
    expect(composableCalls[0][0]).toMatchObject({ name: "useIconAlias" });
  });
});
