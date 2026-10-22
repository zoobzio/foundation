// The registry is a hand-kept list, so it can drift from the files: a name
// removed or renamed in app/ would still be registered, and a consumer's
// `#imports` would break at build. Each entry is checked against its file.
import { readFile } from "node:fs/promises";
import { dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";
import { describe, expect, it } from "vitest";
import { LAYER, LAYER_TYPES } from "../../../modules/imports/constant";

// node:path, not `new URL`: happy-dom's URL does not resolve relative paths.
const here = dirname(fileURLToPath(import.meta.url));
const app = (subpath: string) => resolve(here, "../../../app", `${subpath}.ts`);

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
      const missing = names.filter(
        (name) =>
          !new RegExp(`^export (?:type|interface) ${name}\\b`, "m").test(
            source,
          ),
      );
      expect(missing).toEqual([]);
    });
  }

  it("registers no name twice", () => {
    const names = Object.values(LAYER_TYPES).flat();
    expect(new Set(names).size).toBe(names.length);
  });
});
