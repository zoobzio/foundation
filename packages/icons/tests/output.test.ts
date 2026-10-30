// The build is checked against the config and its Iconify sources: every
// alias resolves to the lucide icon its ref names, the typed union lists the
// same aliases, and the sprites hold one symbol each.
import { existsSync, readFileSync } from "node:fs";
import { fileURLToPath } from "node:url";

import { beforeAll, describe, expect, it } from "vitest";

import config from "../icon-sheets.config";

type IconifyCollection = {
  width?: number;
  height?: number;
  icons: Record<string, { body: string; width?: number; height?: number }>;
};
type Symbol = { id: string; viewBox: string; body: string };

const root = fileURLToPath(new URL("..", import.meta.url));
const read = (file: string) => readFileSync(`${root}${file}`, "utf8");

type Alias = keyof typeof config.icons;

const expectedAliases = (Object.keys(config.icons) as Alias[]).sort();

const source = (alias: Alias) => {
  const [collection, name] = config.icons[alias].split(":") as [string, string];
  const data = JSON.parse(
    read(`node_modules/@iconify-json/${collection}/icons.json`),
  ) as IconifyCollection;
  const icon = data.icons[name]!;
  return {
    body: icon.body,
    width: icon.width ?? data.width ?? 16,
    height: icon.height ?? data.height ?? 16,
  };
};

const symbols = (svg: string): Symbol[] =>
  [
    ...svg.matchAll(/<symbol id="([^"]+)" viewBox="([^"]+)">(.*?)<\/symbol>/gs),
  ].map(([, id, viewBox, body]) => ({
    id: id!,
    viewBox: viewBox!,
    body: body!,
  }));

const expectedSymbols: Symbol[] = expectedAliases.map((alias) => {
  const { body, width, height } = source(alias);
  return { id: alias, viewBox: `0 0 ${width} ${height}`, body };
});

const byId = (list: Symbol[]) =>
  Object.fromEntries(list.map((symbol) => [symbol.id, symbol]));

let index: typeof import("../.output/index.mjs");
let contract: typeof import("../.output/config.mjs");
let sets: typeof import("../.output/sets.mjs");
let sheet: typeof import("../.output/sheet.mjs");

beforeAll(async () => {
  if (!existsSync(`${root}.output/index.mjs`))
    throw new Error("no .output to test: run `pnpm build` first");
  index = await import("../.output/index.mjs");
  contract = await import("../.output/config.mjs");
  sets = await import("../.output/sets.mjs");
  sheet = await import("../.output/sheet.mjs");
});

describe("config", () => {
  it("names every ref in the lucide collection", () => {
    for (const [alias, ref] of Object.entries(config.icons)) {
      expect(`${alias} ${ref}`).toMatch(/^[a-z-]+ lucide:[a-z0-9-]+$/);
    }
  });

  it("names each alias by role, in the sprite id grammar", () => {
    for (const alias of expectedAliases) {
      expect(alias).toMatch(/^[a-z][a-z-]*$/);
    }
  });
});

describe("package exports", () => {
  it("point at files the build writes", () => {
    const { exports } = JSON.parse(read("package.json")) as {
      exports: {
        ".": Record<string, string>;
        "./*": Record<string, string>;
        "./*.svg": string;
      };
    };
    const targets = [
      ...Object.values(exports["."]),
      ...["config", "sets", "sheet"].flatMap((entry) =>
        Object.values(exports["./*"]).map((target) =>
          target.replace("*", entry),
        ),
      ),
      exports["./*.svg"].replace("*", "sprite"),
    ];
    for (const target of targets) {
      expect(target).toSatisfy((file: string) => existsSync(`${root}${file}`));
    }
  });
});

describe("index", () => {
  it("lists every configured alias", () => {
    expect([...index.aliases].sort()).toEqual(expectedAliases);
  });

  it("recognises aliases and nothing else", () => {
    for (const alias of expectedAliases) {
      expect(index.isAlias(alias)).toBe(true);
    }
    expect(index.isAlias("not-an-icon")).toBe(false);
    expect(index.isAlias(undefined)).toBe(false);
    expect(index.isAlias(1)).toBe(false);
  });

  it("builds the sprite reference for an alias, with no prefix", () => {
    expect(index.prefix).toBe("");
    for (const alias of index.aliases) {
      expect(index.href(alias)).toBe(`#${alias}`);
    }
  });

  it("types Alias as the union of configured aliases", () => {
    const [, union] = /export type Alias =([^;]+);/.exec(
      read(".output/index.d.mts"),
    )!;
    const members = [...union!.matchAll(/"([^"]+)"/g)].map(([, name]) => name);
    expect(members.sort()).toEqual(expectedAliases);
  });
});

describe("config module", () => {
  it("carries the configured id and name", () => {
    expect(contract.contract.id).toBe(config.id);
    expect(contract.contract.name).toBe(config.name);
    expect(contract.default).toEqual({ contract: contract.contract });
  });

  it("resolves each alias to its Iconify icon, with its size", () => {
    expect(Object.keys(contract.contract.icons).sort()).toEqual(
      expectedAliases,
    );
    for (const alias of expectedAliases) {
      expect(contract.contract.icons[alias]).toEqual(source(alias));
    }
  });
});

describe("sets", () => {
  it("is empty while no sets are configured", () => {
    expect(sets.default).toEqual({});
    expect(index.setIds).toEqual([]);
  });
});

describe("sprite", () => {
  const check = (list: Symbol[]) => {
    expect(list.map(({ id }) => id).sort()).toEqual(expectedAliases);
    const found = byId(list);
    for (const symbol of expectedSymbols) {
      expect(found[symbol.id]).toEqual(symbol);
    }
  };

  it("holds one symbol per alias, drawn from its Iconify icon", () => {
    check(symbols(read(".output/sprite.svg")));
  });

  it("inlines the same symbols as hidden markup", () => {
    expect(sheet.default).toMatch(/^<svg [^>]*style="display:none"/);
    check(symbols(sheet.default));
  });
});
