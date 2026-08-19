import { existsSync, readdirSync, readFileSync, statSync } from "node:fs";
import { basename, dirname, join, resolve } from "node:path";

import { parseFile } from "./scan.js";
import { TIERS } from "./types.js";
import type {
  Catalog,
  CatalogLink,
  Edge,
  EdgeRef,
  FileFacts,
  Graph,
  GraphNode,
  GraphRoot,
  Target,
  Tier,
} from "./types.js";

/**
 * Locate the roots to scan: the installed foundation layer, plus the consumer
 * app — `FOUNDATION_MCP_APP_DIR` (relative to cwd) when set, else cwd itself
 * when it holds a nuxt config and is not the layer.
 */
export function discoverRoots(
  layerDir: string,
  cwd: string,
  appDirOverride?: string,
): GraphRoot[] {
  const roots: GraphRoot[] = [
    { name: "foundation", dir: resolve(layerDir), scanDirs: ["app"] },
  ];
  const appDir = resolve(cwd, appDirOverride ?? ".");
  const hasNuxtConfig = ["nuxt.config.ts", "nuxt.config.js", "nuxt.config.mts"]
    .some((f) => existsSync(join(appDir, f)));
  if (appDir !== resolve(layerDir) && hasNuxtConfig) {
    const scanDirs = ["app", "server"].filter((d) =>
      existsSync(join(appDir, d)),
    );
    if (scanDirs.length > 0) {
      let name = basename(appDir);
      try {
        const pkg = JSON.parse(
          readFileSync(join(appDir, "package.json"), "utf8"),
        ) as { name?: string };
        if (pkg.name) name = pkg.name;
      } catch {
        // No package.json — directory name is fine.
      }
      roots.push({ name, dir: appDir, scanDirs });
    }
  }
  return roots;
}

const SCAN_EXTENSIONS = [".vue", ".ts", ".mts"];

function scannable(file: string): boolean {
  return (
    SCAN_EXTENSIONS.some((ext) => file.endsWith(ext)) && !file.endsWith(".d.ts")
  );
}

function* walk(dir: string): Generator<string> {
  const entries = readdirSync(dir, { withFileTypes: true }).sort((a, b) =>
    a.name.localeCompare(b.name),
  );
  for (const entry of entries) {
    if (entry.name.startsWith(".") || entry.name === "node_modules") continue;
    const path = join(dir, entry.name);
    if (entry.isDirectory()) yield* walk(path);
    else if (entry.isFile() && scannable(entry.name)) yield path;
  }
}

interface CacheEntry {
  mtimeMs: number;
  size: number;
  facts: FileFacts;
  error: string | null;
}

const parseCache = new Map<string, CacheEntry>();

function factsFor(file: string): CacheEntry {
  const stat = statSync(file);
  const hit = parseCache.get(file);
  if (hit && hit.mtimeMs === stat.mtimeMs && hit.size === stat.size) return hit;
  let entry: CacheEntry;
  try {
    entry = {
      mtimeMs: stat.mtimeMs,
      size: stat.size,
      facts: parseFile(file, readFileSync(file, "utf8")),
      error: null,
    };
  } catch (error) {
    entry = {
      mtimeMs: stat.mtimeMs,
      size: stat.size,
      facts: { imports: [], exports: [], renders: [] },
      error: error instanceof Error ? error.message : String(error),
    };
  }
  parseCache.set(file, entry);
  return entry;
}

/** Internal-shaped specifiers resolve to a path; everything else is external. */
function specifierBase(
  specifier: string,
  importerFile: string,
  importerRoot: GraphRoot,
  layerDir: string,
): string | null {
  if (specifier.startsWith(".")) return resolve(dirname(importerFile), specifier);
  if (specifier.startsWith("@zoobzio/foundation/"))
    return join(layerDir, "app", specifier.slice("@zoobzio/foundation/".length));
  if (specifier.startsWith("~/") || specifier.startsWith("@/"))
    return join(importerRoot.dir, "app", specifier.slice(2));
  if (specifier.startsWith("~~/") || specifier.startsWith("@@/"))
    return join(importerRoot.dir, specifier.slice(3));
  return null;
}

function probe(base: string): string | null {
  const candidates = scannable(base)
    ? [base]
    : [`${base}.ts`, `${base}.vue`, `${base}.mts`, join(base, "index.ts")];
  for (const candidate of candidates) {
    if (existsSync(candidate) && statSync(candidate).isFile()) return candidate;
  }
  return null;
}

const KIND_BY_DIR: Record<string, Record<string, string>> = {
  app: {
    components: "component",
    composables: "composable",
    pages: "page",
    layouts: "layout",
    middleware: "middleware",
    plugins: "plugin",
    definitions: "definition",
    factories: "factory",
    types: "types",
    utils: "util",
    stores: "store",
    services: "service",
    constants: "constants",
  },
  server: {
    api: "api endpoint",
    routes: "server route",
    middleware: "server middleware",
    plugins: "server plugin",
    utils: "server util",
  },
};

function inferKind(rel: string): string {
  const [first, second] = rel.split("/");
  if (first === "app" && second !== undefined) {
    if (!second.includes(".")) return KIND_BY_DIR.app![second] ?? "module";
    return "entry";
  }
  if (first === "server" && second !== undefined) {
    return KIND_BY_DIR.server![second] ?? "server module";
  }
  return "module";
}

function stripExtension(path: string): string {
  return path.replace(/\.(vue|mts|ts)$/, "");
}

/** Top-level `app/` directories exposed as `@zoobzio/foundation/<dir>/*` subpath exports. */
const EXPORTED_DIRS = new Set([
  "components",
  "composables",
  "constants",
  "definitions",
  "factories",
  "plugins",
  "services",
  "stores",
  "types",
  "utils",
]);

function importPathFor(rel: string, isLayer: boolean): string | null {
  const keepVue = rel.endsWith(".vue") ? rel : stripExtension(rel);
  if (rel.startsWith("app/")) {
    const sub = keepVue.slice("app/".length);
    if (!isLayer) return `~/${sub}`;
    const [dir] = sub.split("/");
    return dir !== undefined && EXPORTED_DIRS.has(dir)
      ? `@zoobzio/foundation/${sub}`
      : null;
  }
  return isLayer ? null : `~~/${keepVue}`;
}

function catalogIndex(
  catalog: Catalog,
  layerDir: string,
): Map<string, CatalogLink> {
  const index = new Map<string, CatalogLink>();
  for (const entry of catalog.components) {
    for (const f of entry.components)
      index.set(join(layerDir, f), { entry, role: "part" });
    for (const f of entry.types)
      index.set(join(layerDir, f), { entry, role: "types" });
    if (entry.definition)
      index.set(join(layerDir, entry.definition), { entry, role: "definition" });
    if (entry.factory)
      index.set(join(layerDir, entry.factory), { entry, role: "factory" });
  }
  return index;
}

/**
 * Build the unified module graph across all roots. Parses are cached by
 * (mtime, size), so repeat calls only re-read files that changed.
 */
export function buildGraph(roots: GraphRoot[], catalog: Catalog): Graph {
  const layer = roots[0]!;
  const links = catalogIndex(catalog, layer.dir);
  const nodes = new Map<string, GraphNode>();
  const queue: string[] = [];

  function rootOf(file: string): GraphRoot {
    let best: GraphRoot | null = null;
    for (const root of roots) {
      const prefix = root.dir + "/";
      if (file.startsWith(prefix) && (!best || root.dir.length > best.dir.length))
        best = root;
    }
    return best ?? layer;
  }

  function addNode(file: string): GraphNode {
    const existing = nodes.get(file);
    if (existing) return existing;
    const root = rootOf(file);
    const rel = file.slice(root.dir.length + 1).split("\\").join("/");
    const cached = factsFor(file);
    const node: GraphNode = {
      file,
      rel,
      root: root.name,
      kind: inferKind(rel),
      name: stripExtension(rel.startsWith("app/") ? rel.slice(4) : rel),
      importPath: importPathFor(rel, root === layer),
      exports: cached.facts.exports,
      outgoing: [],
      externals: [],
      unresolved: [],
      catalog: links.get(file) ?? null,
      error: cached.error,
    };
    nodes.set(file, node);
    queue.push(file);
    return node;
  }

  for (const root of roots) {
    for (const scanDir of root.scanDirs) {
      const dir = join(root.dir, scanDir);
      if (!existsSync(dir)) continue;
      for (const file of walk(dir)) addNode(file);
    }
  }

  // Resolve edges; imports that land outside the scanned trees (but inside a
  // root, e.g. config/) pull their files into the graph via the queue.
  while (queue.length > 0) {
    const file = queue.shift()!;
    const node = nodes.get(file)!;
    const { facts } = factsFor(file);
    const edges = new Map<string, Edge>();
    const bySpecifier = new Map<string, string>();

    function addRef(to: string, ref: EdgeRef) {
      let edge = edges.get(to);
      if (!edge) {
        edge = { from: file, to, refs: [] };
        edges.set(to, edge);
      }
      edge.refs.push(ref);
    }

    const root = rootOf(file);
    for (const imp of facts.imports) {
      const base = specifierBase(imp.specifier, file, root, layer.dir);
      if (base === null) {
        node.externals.push({
          specifier: imp.specifier,
          line: imp.line,
          kind: imp.kind,
        });
        continue;
      }
      const target = probe(base);
      if (target === null) {
        node.unresolved.push({ specifier: imp.specifier, line: imp.line });
        continue;
      }
      addNode(target);
      bySpecifier.set(imp.specifier, target);
      addRef(target, { line: imp.line, kind: imp.kind });
    }
    for (const render of facts.renders) {
      const target = bySpecifier.get(render.specifier);
      if (target !== undefined)
        addRef(target, { line: render.line, kind: "render" });
    }
    node.outgoing = [...edges.values()].map((edge) => ({
      ...edge,
      refs: edge.refs.sort((a, b) => a.line - b.line),
    }));
  }

  const incoming = new Map<string, Edge[]>();
  for (const node of nodes.values()) {
    for (const edge of node.outgoing) {
      const list = incoming.get(edge.to) ?? [];
      list.push(edge);
      incoming.set(edge.to, list);
    }
  }
  return { roots, nodes, incoming };
}

/** Human identity for a graph node: catalog name when it has one. */
export function identity(node: GraphNode): string {
  if (node.catalog) {
    const { entry, role } = node.catalog;
    const base = `${entry.tier}/${entry.name}`;
    if (role === "part") {
      return entry.components.length > 1
        ? `${base} · ${basename(node.file)}`
        : base;
    }
    return `${base} (${role})`;
  }
  return node.name;
}

/** One-line node reference: identity, root-relative path, provenance. */
export function display(node: GraphNode): string {
  return `${identity(node)} — ${node.rel} (${node.root})`;
}

/** Export names that identify a module when queried (skips default/re-exports). */
function namedExports(node: GraphNode): string[] {
  return node.exports.filter((e) => e !== "default" && !e.startsWith("* from "));
}

/**
 * Resolve a query string to graph targets. Matches catalog component names
 * (optionally `tier/name`), node basenames, query-facing names and name
 * suffixes, root-relative paths, canonical import paths, and exported symbol
 * names (so `useBindings` finds `composables/bindings`). Import-path queries
 * accept the `@zoobzio/foundation/*` and `~/*` forms.
 */
export function findTargets(graph: Graph, catalog: Catalog, query: string): Target[] {
  const q = query.replace(/^@zoobzio\/foundation\//, "").replace(/^~\//, "");
  const lower = stripExtension(q).toLowerCase();
  const layer = graph.roots[0]!;
  const targets: Target[] = [];
  const claimed = new Set<string>();

  let tierFilter: Tier | null = null;
  let nameQuery = lower;
  const slash = lower.indexOf("/");
  if (slash > 0 && (TIERS as readonly string[]).includes(lower.slice(0, slash))) {
    tierFilter = lower.slice(0, slash) as Tier;
    nameQuery = lower.slice(slash + 1);
  }

  for (const entry of catalog.components) {
    if (entry.name.toLowerCase() !== nameQuery) continue;
    if (tierFilter !== null && entry.tier !== tierFilter) continue;
    const files = [
      ...entry.components,
      ...entry.types,
      ...(entry.definition ? [entry.definition] : []),
      ...(entry.factory ? [entry.factory] : []),
    ].map((f) => join(layer.dir, f));
    for (const f of files) claimed.add(f);
    targets.push({ label: `${entry.tier}/${entry.name}`, files, entry });
  }

  for (const node of graph.nodes.values()) {
    if (claimed.has(node.file)) continue;
    const base = stripExtension(basename(node.file)).toLowerCase();
    const name = node.name.toLowerCase();
    const rel = node.rel.toLowerCase();
    const matches =
      base === lower ||
      name === lower ||
      name.endsWith(`/${lower}`) ||
      rel === lower ||
      stripExtension(rel) === lower;
    if (matches) {
      targets.push({
        label: `${node.name} (${node.root})`,
        files: [node.file],
        entry: null,
      });
      continue;
    }
    const symbol = namedExports(node).find((e) => e.toLowerCase() === lower);
    if (symbol !== undefined) {
      targets.push({
        label: `${node.name} (${node.root}) — exports \`${symbol}\``,
        files: [node.file],
        entry: null,
      });
    }
  }
  return targets;
}

/**
 * Modules whose name or exports contain the query as a substring — the
 * "did you mean" pool for a failed lookup.
 */
export function nearMatches(graph: Graph, query: string): string[] {
  // A tier-qualified miss (e.g. "core/button" for a common-tier component)
  // should still suggest by the bare name.
  const bare = (query.toLowerCase().split("/").pop() ?? query).toLowerCase();
  const out: string[] = [];
  for (const node of graph.nodes.values()) {
    if (node.name.toLowerCase().includes(bare)) {
      out.push(`${node.name} (${node.root})`);
      continue;
    }
    const symbol = namedExports(node).find((e) =>
      e.toLowerCase().includes(bare),
    );
    if (symbol !== undefined) {
      out.push(`${node.name} (${node.root}) — exports \`${symbol}\``);
    }
  }
  return out;
}
