import { readFileSync } from "node:fs";

import type { Catalog } from "./types.js";

/** Read the build-time generated catalog.json co-located with the package. */
export function loadCatalog(): Catalog {
  const url = new URL("../catalog.json", import.meta.url);
  return JSON.parse(readFileSync(url, "utf8")) as Catalog;
}
