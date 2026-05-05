import { defineEventHandler, getRouterParams } from "h3";
import { readFileSync, existsSync } from "node:fs";
import { join } from "node:path";

export default defineEventHandler((event) => {
  const params = getRouterParams(event);
  const locale = params.locale || "en";
  const route = params.route || "index";

  const rosettaDir = join(process.cwd(), ".rosetta");

  // Load the page map
  const pageMapPath = join(rosettaDir, "pages.json");
  if (!existsSync(pageMapPath)) {
    return {};
  }
  const pageMap: Record<string, string[]> = JSON.parse(readFileSync(pageMapPath, "utf-8"));

  // Resolve the route key — incoming is URL-encoded
  const routeKey = route === "index" ? "/" : `/${decodeURIComponent(route)}`;
  const hashes = pageMap[routeKey];
  if (!hashes) {
    return {};
  }

  // Load the locale corpus
  const corpusPath = join(rosettaDir, `${locale}.json`);
  if (!existsSync(corpusPath)) {
    // Fall back to source map (original text)
    const sourcePath = join(rosettaDir, "source.json");
    if (!existsSync(sourcePath)) return {};
    const source: Record<string, string> = JSON.parse(readFileSync(sourcePath, "utf-8"));
    const result: Record<string, string> = {};
    for (const hash of hashes) {
      const value = source[hash];
      if (value) result[hash] = value;
    }
    return result;
  }

  const corpus: Record<string, string> = JSON.parse(readFileSync(corpusPath, "utf-8"));
  const result: Record<string, string> = {};
  for (const hash of hashes) {
    const value = corpus[hash];
    if (value) result[hash] = value;
  }
  return result;
});
