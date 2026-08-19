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

import type { Catalog, CatalogEntry, ElementInfo, Tier } from "../src/types.ts";

const root = resolve(import.meta.dirname, "../../..");

const elements = components.elements as Record<string, ElementInfo>;
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
 * Parts with no config entry are renderless (portals, providers, renderless
 * roots) — they own no DOM element, so they carry no role or token slots.
 * Drift is caught the other way round: every config key must be claimed by
 * exactly the file it describes (checked after enumeration).
 */
const claimed = new Set<string>();

function elementInfo(key: string): ElementInfo | null {
  const entry = elements[key];
  if (!entry) return null;
  claimed.add(key);
  return { role: entry.role, tokens: entry.tokens };
}

function commonEntries(): CatalogEntry[] {
  const dir = join(root, "app/components/common");
  return readdirSync(dir, { withFileTypes: true })
    .filter((d) => d.name !== "README.md")
    .sort((a, b) => a.name.localeCompare(b.name))
    .map((d) => {
      const name = d.name.replace(/\.vue$/, "");
      const family = d.isDirectory();
      const files = family
        ? vueFiles(`app/components/common/${name}`)
        : [`app/components/common/${name}.vue`];
      const entryElements: Record<string, ElementInfo> = {};
      for (const file of files) {
        const part = file.replace(/^.*\//, "").replace(/\.vue$/, "");
        const key = family ? `${name}-${part}` : name;
        const info = elementInfo(key);
        if (info) entryElements[key] = info;
      }
      return {
        name,
        tier: "common" as const,
        components: files,
        types: typeFiles("common", name),
        // Definitions exist only for composites — a common name colliding with
        // a core one (select, dialog, …) must not claim the core's definition.
        definition: null,
        factory: null,
        elements: entryElements,
      };
    });
}

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
    ...commonEntries(),
    ...singleFileEntries("core"),
    ...dataEntries(),
    ...singleFileEntries("system"),
  ],
};

const unclaimed = [
  ...Object.keys(elements).filter((key) => !claimed.has(key)),
  ...Object.keys(compounds).filter((key) => !claimed.has(`compound:${key}`)),
];
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
