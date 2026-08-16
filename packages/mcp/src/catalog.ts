import { readFileSync } from "node:fs";

export const TIERS = ["common", "core", "data", "system"] as const;

export type Tier = (typeof TIERS)[number];

/**
 * Per-element metadata sourced from `config/components.ts`: the ARIA role the
 * element plays and its component-token slots mapped to their default theme
 * tokens.
 */
export interface ElementInfo {
  role: string;
  tokens: Record<string, string>;
}

/**
 * One component in the catalog. All paths are relative to the
 * `@zoobzio/foundation` package root, so `app/...` maps 1:1 onto the
 * `#foundation/...` import alias.
 */
export interface CatalogEntry {
  name: string;
  tier: Tier;
  /** Rendered .vue files — a single file, or every part of a family/widget. */
  components: string[];
  /** Prop/emit/passthrough contract files under `app/types/`. */
  types: string[];
  /** `define<Name>` constructor module, when the component ships one. */
  definition: string | null;
  /** Factory module, for data widgets driven by `create<Name>`. */
  factory: string | null;
  /** Element name → role + token slots, for components backed by config entries. */
  elements: Record<string, ElementInfo> | null;
}

export interface Catalog {
  foundationVersion: string;
  components: CatalogEntry[];
}

export function loadCatalog(): Catalog {
  const url = new URL("../catalog.json", import.meta.url);
  return JSON.parse(readFileSync(url, "utf8")) as Catalog;
}
