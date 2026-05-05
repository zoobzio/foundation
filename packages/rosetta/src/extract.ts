import { hashText } from "./hash";
import type { SourceMap, PageMap } from "./types";

/** Regex matching $t("...") and $t('...') calls, capturing the string content. */
const T_CALL_RE = /\$t\(\s*(?:"([^"\\]*(?:\\.[^"\\]*)*)"|'([^'\\]*(?:\\.[^'\\]*)*)')\s*(?:,\s*\{[^}]*\}\s*)?\)/g;

/** Regex matching import statements, capturing the module specifier. */
const IMPORT_RE = /import\s[^"']*from\s+["']([^"']+)["']|import\s+["']([^"']+)["']/g;

/** Extract all $t(...) string literals from source code. */
export const extractStrings = (code: string): string[] => {
  const strings: string[] = [];
  let match: RegExpExecArray | null = null;
  while ((match = T_CALL_RE.exec(code)) !== null) {
    const text = match[1] ?? match[2];
    if (text) strings.push(text);
  }
  return strings;
};

/** Extract all import specifiers from source code. */
export const extractImports = (code: string): string[] => {
  const imports: string[] = [];
  let match: RegExpExecArray | null = null;
  while ((match = IMPORT_RE.exec(code)) !== null) {
    const specifier = match[1] ?? match[2];
    if (specifier && specifier.startsWith(".")) {
      imports.push(specifier);
    }
  }
  return imports;
};

/** Resolves a file path to a route path, or undefined if not a page. */
export const fileToRoute = (filePath: string): string | undefined => {
  const pagesMatch = filePath.match(/pages\/(.+)\.(vue|ts)$/);
  if (!pagesMatch || !pagesMatch[1]) return undefined;
  const route = pagesMatch[1]
    .replace(/^index$/, "")
    .replace(/\/index$/, "")
    .replace(/\[([^\]]+)\]/g, ":$1");
  return route ? `/${route}` : "/";
};

/** Per-file data collected during pass 1. */
export interface FileEntry {
  hashes: string[];
  imports: string[];
}

/** Collects strings and imports for a single file (pass 1). */
export const collectFile = (
  strings: string[],
  imports: string[],
  sourceMap: SourceMap,
): FileEntry => {
  const hashes: string[] = [];
  for (const text of strings) {
    const hash = hashText(text);
    sourceMap[hash] = text;
    if (!hashes.includes(hash)) {
      hashes.push(hash);
    }
  }
  return { hashes, imports };
};

/** Resolves a relative import specifier against a file path. */
export const resolveImport = (fromFile: string, specifier: string): string => {
  const dir = fromFile.replace(/\/[^/]+$/, "");
  const parts = `${dir}/${specifier}`.split("/");
  const resolved: string[] = [];
  for (const part of parts) {
    if (part === "..") resolved.pop();
    else if (part !== ".") resolved.push(part);
  }
  return resolved.join("/");
};

/** Walks the import tree from a file, collecting all reachable hashes. */
export const walkImports = (
  fileId: string,
  fileMap: Record<string, FileEntry>,
  visited: Set<string>,
): string[] => {
  if (visited.has(fileId)) return [];
  visited.add(fileId);

  const entry = fileMap[fileId];
  if (!entry) return [];

  const hashes = [...entry.hashes];

  for (const specifier of entry.imports) {
    const resolved = resolveImport(fileId, specifier);
    // Try exact match, then common extensions
    const candidates = [
      resolved,
      `${resolved}.ts`,
      `${resolved}.vue`,
      `${resolved}.js`,
      `${resolved}/index.ts`,
      `${resolved}/index.vue`,
    ];
    for (const candidate of candidates) {
      if (fileMap[candidate]) {
        hashes.push(...walkImports(candidate, fileMap, visited));
        break;
      }
    }
  }

  return hashes;
};

/** Builds the page map from the file map by walking each page's import tree (pass 2). */
export const buildPageMap = (fileMap: Record<string, FileEntry>): PageMap => {
  const pageMap: PageMap = {};
  const attributed = new Set<string>();

  // Walk each page file's full import tree
  for (const fileId of Object.keys(fileMap)) {
    const route = fileToRoute(fileId);
    if (!route) continue;

    const visited = new Set<string>();
    const hashes = walkImports(fileId, fileMap, visited);
    const deduped = [...new Set(hashes)];
    if (deduped.length > 0) {
      pageMap[route] = deduped;
    }
    for (const hash of deduped) {
      attributed.add(hash);
    }
  }

  // Anything not reachable from a page goes to __common
  const commonHashes: string[] = [];
  for (const entry of Object.values(fileMap)) {
    for (const hash of entry.hashes) {
      if (!attributed.has(hash) && !commonHashes.includes(hash)) {
        commonHashes.push(hash);
      }
    }
  }
  if (commonHashes.length > 0) {
    pageMap["__common"] = commonHashes;
  }

  return pageMap;
};
