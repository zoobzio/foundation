// The registry is a hand-kept list, so it can drift from the files: a name
// removed or renamed in app/ would still be registered, and a consumer's
// `#imports` would break at build. Each entry is checked against its file.
import { readFile } from "node:fs/promises";
import { createRequire } from "node:module";
import { dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";
import { describe, expect, it } from "vitest";
import {
  LAYER,
  LAYER_TYPES,
  VUE_TYPES,
} from "../../../modules/imports/constant";

// node:path, not `new URL`: happy-dom's URL does not resolve relative paths.
const here = dirname(fileURLToPath(import.meta.url));
const app = (subpath: string) => resolve(here, "../../../app", `${subpath}.ts`);

// The module resolves @zoobzio/vue through the package's exports map, so
// the test does too: a subpath the map does not serve fails here first.
const require = createRequire(import.meta.url);
const vue = (subpath: string) => require.resolve(`@zoobzio/vue/${subpath}`);

const missingTypes = (source: string, names: readonly string[]) =>
  names.filter(
    (name) =>
      !new RegExp(`^export (?:type|interface) ${name}\\b`, "m").test(source),
  );

describe("LAYER", () => {
  for (const [subpath, names] of Object.entries(LAYER)) {
    it(`${subpath} exports ${names.join(", ")}`, async () => {
      const mod: Record<string, unknown> = await import(app(subpath));
      const missing = names.filter((name) => mod[name] === undefined);
      expect(missing).toEqual([]);
    });
  }

  it("registers no name twice", () => {
    const names = Object.values(LAYER).flat();
    expect(new Set(names).size).toBe(names.length);
  });
});

describe("LAYER_TYPES", () => {
  for (const [subpath, names] of Object.entries(LAYER_TYPES)) {
    it(`${subpath} exports ${names.join(", ")}`, async () => {
      const source = await readFile(app(subpath), "utf8");
      expect(missingTypes(source, names)).toEqual([]);
    });
  }
});

describe("VUE_TYPES", () => {
  for (const [subpath, names] of Object.entries(VUE_TYPES)) {
    it(`types/${subpath} exports ${names.join(", ")}`, async () => {
      const source = await readFile(vue(`types/${subpath}`), "utf8");
      expect(missingTypes(source, names)).toEqual([]);
    });
  }
});

// Both registries re-export from the one `#imports` module, so a name may
// appear once across them, not once per registry.
describe("type registries", () => {
  it("register no name twice", () => {
    const names = [
      ...Object.values(LAYER_TYPES).flat(),
      ...Object.values(VUE_TYPES).flat(),
    ];
    const seen = new Set<string>();
    const dupes = names.filter((name) => seen.size === seen.add(name).size);
    expect(dupes).toEqual([]);
  });
});
