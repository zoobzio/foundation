/**
 * Generates catalog.json from the foundation layer's sources: the component
 * tree under app/components/ joined with the registry in config/components.ts.
 *
 * Runs directly under Node's type stripping (`node scripts/generate.ts`), so
 * it can import the layer's config module as-is. Any component that cannot be
 * matched to its config entry is a hard error — the catalog must not drift
 * from the registry silently.
 */
import { existsSync, readdirSync, writeFileSync } from "node:fs";
import { join, resolve } from "node:path";

import components from "../../../config/components.ts";

import type { Catalog, CatalogEntry, Tier } from "../src/types.ts";

const root = resolve(import.meta.dirname, "../../..");

const compounds = components.compounds as Record<string, object>;

function vueFiles(dir: string): string[] {
  return readdirSync(join(root, dir))
    .filter((f) => f.endsWith(".vue"))
    .sort()
    .map((f) => `${dir}/${f}`);
}

function typeFiles(tier: Tier, name: string): string[] {
  const found: string[] = [];
  const single = `app/types/${tier}/${name}.ts`;
  if (existsSync(join(root, single))) found.push(single);
  const familyDir = `app/types/${tier}/${name}`;
  if (existsSync(join(root, familyDir))) {
    found.push(
      ...readdirSync(join(root, familyDir))
        .filter((f) => f.endsWith(".ts"))
        .sort()
        .map((f) => `${familyDir}/${f}`),
    );
  }
  return found;
}

function optionalFile(path: string): string | null {
  return existsSync(join(root, path)) ? path : null;
}

/**
 * The config's `elements` registry feeds the modifier/token type contracts
 * and maps to no component files, so only compound entries are checked
 * against the tree: every compound key must be claimed by exactly the file
 * it describes (checked after enumeration).
 */
const claimed = new Set<string>();

function singleFileEntries(tier: Tier): CatalogEntry[] {
  return vueFiles(`app/components/${tier}`).map((file) => {
    const name = file.replace(/^.*\//, "").replace(/\.vue$/, "");
    if (tier === "core" && name in compounds) claimed.add(`compound:${name}`);
    return {
      name,
      tier,
      components: [file],
      types: typeFiles(tier, name),
      definition: optionalFile(`app/definitions/${name}.ts`),
      factory: null,
      elements: null,
    };
  });
}

function dataEntries(): CatalogEntry[] {
  const dir = join(root, "app/components/data");
  return readdirSync(dir, { withFileTypes: true })
    .filter((d) => d.isDirectory())
    .sort((a, b) => a.name.localeCompare(b.name))
    .map((d) => ({
      name: d.name,
      tier: "data" as const,
      components: vueFiles(`app/components/data/${d.name}`),
      types: typeFiles("data", d.name),
      definition: optionalFile(`app/definitions/${d.name}.ts`),
      factory: optionalFile(`app/factories/${d.name}.ts`),
      elements: null,
    }));
}

const catalog: Catalog = {
  foundationVersion: (
    await import("../../../package.json", { with: { type: "json" } })
  ).default.version,
  components: [
    ...singleFileEntries("core"),
    ...dataEntries(),
    ...singleFileEntries("system"),
  ],
};

const unclaimed = Object.keys(compounds).filter(
  (key) => !claimed.has(`compound:${key}`),
);
if (unclaimed.length > 0) {
  throw new Error(
    `catalog: config/components.ts entries matched no component file: ${unclaimed.join(", ")}`,
  );
}

const out = resolve(import.meta.dirname, "../catalog.json");
writeFileSync(out, `${JSON.stringify(catalog, null, 2)}\n`);
console.log(
  `catalog.json: ${catalog.components.length} components (foundation ${catalog.foundationVersion})`,
);
