// The build is checked against its own documents and against aurora's build:
// the palette is the base, the shell roles are the only addition, everything
// else is aurora's, every theme of aurora applies, and the package is a
// preset that another kit build and the Nuxt module take as it is.
import { existsSync, readFileSync } from "node:fs";
import { createRequire } from "node:module";
import { dirname } from "node:path";
import { fileURLToPath } from "node:url";

import { beforeAll, describe, expect, it } from "vitest";
import { makeUntheme } from "untheme";
import { defineRenderer } from "untheme/css";
import { proveTheme } from "@untheme/testing";

type Json = Record<string, unknown>;
type Hex = { hex: string };
type Token = { $type: string; $value: unknown };
type Tokens = Record<string, Token>;
type Layer = { id: string; name: string; tokens?: Record<string, Hex> };

const root = fileURLToPath(new URL("..", import.meta.url));
const read = (file: string) => readFileSync(`${root}${file}`, "utf8");
const json = (file: string) => JSON.parse(read(file)) as Json;

const require = createRequire(`${root}package.json`);
const resolve = (specifier: string) =>
  JSON.parse(readFileSync(require.resolve(specifier), "utf8")) as Json;

const tokensOf = (document: Json) =>
  Object.fromEntries(
    Object.entries(document).filter(([name]) => !name.startsWith("$")),
  ) as Tokens;

const hexOf = (slot: Token) => (slot.$value as Hex).hex;

/** A `{name}` reference, less its braces. */
const target = (slot: Token) => (slot.$value as string).slice(1, -1);

/** A record with each value replaced by `fn` of it and its key. */
const map = <T, U>(
  record: Record<string, T>,
  fn: (value: T, key: string) => U,
) =>
  Object.fromEntries(
    Object.entries(record).map(([key, value]) => [key, fn(value, key)]),
  );

const ramps = tokensOf(json("src/foundation.json"));
const roles = tokensOf(json("src/roles.json"));
const theirs = tokensOf(resolve("@untheme/aurora/src/themes/aurora.json"));

let config: typeof import("../.output/config.mjs");
let index: typeof import("../.output/index.mjs");
let manifest: typeof import("../.output/manifest.mjs");
let layers: typeof import("../.output/layers.mjs");
let aurora: {
  config: typeof import("@untheme/aurora/config");
  manifest: typeof import("@untheme/aurora/manifest");
  layers: typeof import("@untheme/aurora/layers");
};

const layer = (id: string) =>
  json(`.output/layers/${id}.json`) as unknown as Layer;

const boot = () =>
  makeUntheme(config.theme, { patch: {}, input: config.input });

const hex = (untheme: ReturnType<typeof boot>, token: string) =>
  (untheme.resolve(token as never) as Hex).hex;

beforeAll(async () => {
  if (!existsSync(`${root}.output/config.mjs`))
    throw new Error("no .output to test: run `pnpm build` first");
  config = await import("../.output/config.mjs");
  index = await import("../.output/index.mjs");
  manifest = await import("../.output/manifest.mjs");
  layers = await import("../.output/layers.mjs");
  aurora = {
    config: await import("@untheme/aurora/config"),
    manifest: await import("@untheme/aurora/manifest"),
    layers: await import("@untheme/aurora/layers"),
  };
});

describe("package exports", () => {
  it("point at files the build writes", () => {
    const { exports } = json("package.json") as {
      exports: Record<string, string | Record<string, string>>;
    };
    const targets = Object.values(exports).flatMap((entry) =>
      typeof entry === "string" ? [entry] : Object.values(entry),
    );
    expect(targets.length).toBeGreaterThan(0);
    const missing = targets.filter(
      (file) =>
        !existsSync(`${root}${file.includes("*") ? dirname(file) : file}`),
    );
    expect(missing).toEqual([]);
  });
});

describe("palette", () => {
  it("defines exactly the tokens an aurora theme defines", () => {
    expect(Object.keys(ramps)).toEqual(Object.keys(theirs));
    const malformed = Object.entries(ramps)
      .filter(
        ([, slot]) =>
          slot.$type !== "color" || !/^#[0-9a-f]{6}$/.test(hexOf(slot)),
      )
      .map(([token]) => token);
    expect(malformed).toEqual([]);
  });
});

describe("roles", () => {
  it("each reference a color role of aurora, and add rather than rebind", () => {
    const upstream = aurora.config.theme.tokens as Tokens;
    expect(Object.keys(roles).length).toBeGreaterThan(0);
    expect(Object.keys(roles).filter((token) => token in upstream)).toEqual([]);
    expect(
      map(roles, (slot) => ({
        type: slot.$type,
        reference: /^\{[a-z-]+\}$/.test(slot.$value as string),
        target: upstream[target(slot)]?.$type,
      })),
    ).toEqual(
      map(roles, () => ({ type: "color", reference: true, target: "color" })),
    );
  });

  it("name the loading indicator over the primary role", () => {
    expect(roles["loading-indicator"]?.$value).toBe("{primary}");
  });
});

describe("theme", () => {
  it("carries the foundation identity", () => {
    expect(config.theme.id).toBe("foundation");
    expect(config.theme.name).toBe("Foundation");
  });

  it("has aurora's contract, plus the roles", () => {
    const upstream = aurora.config.theme.tokens as Tokens;
    expect([...index.tokens].sort()).toEqual(
      [...Object.keys(upstream), ...Object.keys(roles)].sort(),
    );
    expect(map(config.theme.tokens as Tokens, (slot) => slot.$type)).toEqual({
      ...map(upstream, (slot) => slot.$type),
      ...map(roles, (slot) => slot.$type),
    });
    expect(index.isToken("loading-indicator")).toBe(true);
    expect(index.isToken("foundation")).toBe(false);
  });

  it("binds the palette and the roles as authored and everything else as aurora does", () => {
    // Terrazzo normalizes a color it reads, so a ramp stop is compared by
    // hex. A reference stays the string it was authored as.
    const upstream = aurora.config.theme.tokens as Tokens;
    const built = config.theme.tokens as Tokens;
    expect(
      map(built, (slot, token) =>
        token in ramps ? (slot.$value as Hex).hex : slot.$value,
      ),
    ).toEqual(
      map(built, (_, token) =>
        token in ramps
          ? hexOf(ramps[token]!)
          : token in roles
            ? roles[token]!.$value
            : upstream[token]?.$value,
      ),
    );
  });

  it("is sound at the boot selection and at each single-context change", () => {
    expect(() => proveTheme(config.theme)).not.toThrow();
  });

  it("declares aurora's modifiers, contexts, and boot selection, untouched", () => {
    expect(index.modifiers).not.toHaveProperty("theme");
    expect(config.theme.order).toEqual(aurora.config.theme.order);
    expect(config.theme.modifiers).toEqual(aurora.config.theme.modifiers);
    expect(config.input).toEqual(aurora.config.input);
    expect(manifest.manifest).toEqual(aurora.manifest.manifest);
  });
});

describe("loading indicator", () => {
  it("resolves to the primary role in each scheme", () => {
    const untheme = boot();
    expect(hex(untheme, "loading-indicator")).toBe(hex(untheme, "primary"));
    expect(hex(untheme, "loading-indicator")).toBe(
      hexOf(ramps["primary-600"]!),
    );
    untheme.swap("color", "dark");
    expect(hex(untheme, "loading-indicator")).toBe(hex(untheme, "primary"));
    expect(hex(untheme, "loading-indicator")).toBe(
      hexOf(ramps["primary-400"]!),
    );
  });

  it("renders as a custom property over the primary role", () => {
    const renderer = defineRenderer(boot());
    expect(renderer.var("loading-indicator" as never)).toBe(
      "var(--loading-indicator)",
    );
    expect(renderer.root()).toContain("--loading-indicator: var(--primary);");
  });
});

describe("layers", () => {
  it("list the foundation palette first, then every aurora theme in aurora's order", () => {
    const ids = layers.layers.map((entry) => entry.id);
    expect(ids[0]).toBe("foundation");
    expect(ids.slice(1)).toEqual(aurora.layers.layers.map((entry) => entry.id));
    expect(ids.length).toBe(32);
    expect(ids).toContain("nord");
  });

  it("name and describe the palette in its entry", () => {
    const { description, ...entry } = layers.layers[0]!;
    expect(entry).toEqual({ id: "foundation", name: "Foundation" });
    expect(description).toBeTruthy();
  });

  it("hold, in the palette's layer, the stops that differ from aurora's", () => {
    const foundation = layer("foundation");
    expect(foundation.name).toBe("Foundation");
    const changed = Object.entries(ramps)
      .filter(([token, slot]) => hexOf(slot) !== hexOf(theirs[token]!))
      .map(([token]) => token)
      .sort();
    expect(changed.length).toBeGreaterThan(0);
    expect(map(foundation.tokens ?? {}, (value) => value.hex)).toEqual(
      Object.fromEntries(changed.map((token) => [token, hexOf(ramps[token]!)])),
    );
  });

  it("apply every aurora theme, which the roles follow, and the palette again", () => {
    const untheme = boot();
    const own = hexOf(ramps["primary-600"]!);
    expect(hex(untheme, "primary-600")).toBe(own);
    const applied = layers.layers.slice(1).map((entry) => {
      untheme.apply(layer(entry.id) as never);
      const upstream = resolve(
        `@untheme/aurora/layers/${entry.id}.json`,
      ) as unknown as Layer;
      return {
        id: entry.id,
        active: untheme.theme().id,
        stop: hex(untheme, "primary-600"),
        indicator: hex(untheme, "loading-indicator"),
        upstream: upstream.tokens!["primary-600"]!.hex,
      };
    });
    expect(applied).toEqual(
      applied.map(({ id, upstream }) => ({
        id,
        active: id,
        stop: upstream,
        indicator: upstream,
        upstream,
      })),
    );
    untheme.apply(layer("foundation") as never);
    expect(untheme.theme().id).toBe("foundation");
    expect(hex(untheme, "primary-600")).toBe(own);
    expect(hex(untheme, "loading-indicator")).toBe(own);
  });
});

describe("preset", () => {
  it("names the resolver and lists the layers", () => {
    const preset = json(".output/preset.json") as {
      resolver: string;
      layers: unknown[];
    };
    expect(preset.resolver).toBe("./resolver.json");
    expect(preset.layers).toEqual(layers.layers);
  });

  it("references the palette and the roles through this package, after aurora's", () => {
    const resolver = json(".output/resolver.json") as {
      name: string;
      description: string;
      sets: Record<string, { sources: { $ref: string }[] }>;
      modifiers: Record<string, unknown>;
    };
    expect(resolver.name).toBe("Foundation");
    expect(resolver.description).toBeTruthy();
    expect(resolver.sets.ramps!.sources).toEqual([
      { $ref: "npm:/@untheme/aurora/src/themes/aurora.json" },
      { $ref: "npm:/@zoobzio/theme/src/foundation.json" },
    ]);
    expect(resolver.sets.roles!.sources.at(-1)).toEqual({
      $ref: "npm:/@zoobzio/theme/src/roles.json",
    });
    expect(Object.keys(resolver.modifiers)).toEqual(config.theme.order);
    expect(resolve("@zoobzio/theme/src/foundation.json")).toEqual(
      json("src/foundation.json"),
    );
    expect(resolve("@zoobzio/theme/src/roles.json")).toEqual(
      json("src/roles.json"),
    );
  });

  it("is a source for another build, which reads the same theme and layers", async () => {
    const { resolveKit } = await import("@untheme/kit");
    const downstream = await resolveKit(
      { source: "npm:/@zoobzio/theme" },
      { cwd: root },
    );
    expect(downstream.theme).toEqual(config.theme);
    expect(downstream.input).toEqual(config.input);
    expect(downstream.layers.map((built) => built.entry)).toEqual(
      layers.layers,
    );
  });
});
