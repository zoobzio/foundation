import { readFileSync } from "node:fs";
import { createRequire } from "node:module";
import { dirname, join } from "node:path";

import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { z } from "zod";

import { loadCatalog } from "./catalog.js";
import {
  buildGraph,
  discoverRoots,
  display,
  findTargets,
  nearMatches,
} from "./graph.js";
import { HEALTH_SECTIONS, healthReport } from "./health.js";
import { TIERS } from "./types.js";
import type { CatalogEntry, EdgeRef, Graph, GraphNode, Target } from "./types.js";

const HELP_TOPICS = {
  overview: "README.md",
  common: "app/components/common/README.md",
  core: "app/components/core/README.md",
  data: "app/components/data/README.md",
  system: "app/components/system/README.md",
} as const;

const INSTRUCTIONS = `@zoobzio/foundation is a Vue 3 + Nuxt design system delivered as a single Nuxt layer, organized into tiers: common (behavior-free HTML wrappers + behavioral element families), core (stateless interactive coordinators with a passthrough part system), data (definition-driven generic data widgets), and system (app-shell composition). Auto-import is disabled — everything is imported explicitly: relative paths within the layer, @zoobzio/foundation/* package subpaths from the consuming app (framework symbols via #imports).

Before writing code against a tier, call help with that tier's topic — each tier has a strict authoring contract (bindings, passthrough parts, define*/use* widget verbs) that code must follow. Use list_components to discover what exists and describe_component to get a component's full type contract and import paths.

Because imports are explicit, the module graph is deterministic — prefer asking it over exploring the filesystem: resolve locates any component/module (file, kind, provenance, canonical import), usages lists every call site with line numbers, dependencies walks what something is built from, dependents shows the blast radius of a change. The graph spans the foundation layer AND the consuming app seamlessly; provenance on each node tells you which side it lives on.

health aggregates graph-wide diagnostics — broken imports, parse errors, import cycles, tier-layering violations, dead-code candidates, blast-radius hotspots, and catalog adoption. It is a good first call when auditing, cleaning up, or getting oriented in an unfamiliar app.`;

/**
 * Foundation's shipped sources (app/, config/) resolve from wherever the
 * consumer installed @zoobzio/foundation, so help topics and type contracts
 * always reflect the installed version.
 */
function foundationRoot(): string {
  const require = createRequire(import.meta.url);
  return dirname(require.resolve("@zoobzio/foundation/package.json"));
}

/** Wrap a string as an MCP text tool result. */
function text(value: string) {
  return { content: [{ type: "text" as const, text: value }] };
}

/** Layer-relative file path → its `@zoobzio/foundation/*` subpath import specifier. */
function importPath(file: string): string {
  return file.replace(/^app\//, "@zoobzio/foundation/").replace(/\.ts$/, "");
}

function describe(entry: CatalogEntry, root: string): string {
  const lines: string[] = [
    `# ${entry.name} (${entry.tier})`,
    "",
    "## Imports",
    "",
    ...entry.components.map((f) => `- \`${importPath(f)}\``),
    ...(entry.definition ? [`- \`${importPath(entry.definition)}\``] : []),
    ...(entry.factory ? [`- \`${importPath(entry.factory)}\``] : []),
  ];
  if (entry.elements && Object.keys(entry.elements).length > 0) {
    lines.push("", "## Elements", "");
    for (const [name, info] of Object.entries(entry.elements)) {
      const tokens = Object.entries(info.tokens)
        .map(([slot, token]) => `${slot}→${token}`)
        .join(", ");
      lines.push(
        `- \`${name}\` — role \`${info.role}\`${tokens ? `, tokens: ${tokens}` : ""}`,
      );
    }
  }
  const contracts = [
    ...entry.types,
    ...(entry.definition ? [entry.definition] : []),
  ];
  for (const file of contracts) {
    lines.push("", `## ${file}`, "", "```ts");
    lines.push(readFileSync(join(root, file), "utf8").trimEnd());
    lines.push("```");
  }
  if (entry.factory) {
    lines.push(
      "",
      `Widget composable: \`${entry.factory}\` (\`${importPath(entry.factory)}\`) — read it for the widget's reactive interface.`,
    );
  }
  return lines.join("\n");
}

/** Format edge refs grouped by kind: `import L12, render L41 L44`. */
function renderRefs(refs: EdgeRef[]): string {
  const parts: string[] = [];
  for (const kind of ["import", "type", "render"] as const) {
    const lines = refs.filter((r) => r.kind === kind).map((r) => `L${r.line}`);
    if (lines.length > 0) parts.push(`${kind} ${lines.join(" ")}`);
  }
  return parts.join(", ");
}

/** No-match reply with substring suggestions so the agent can self-correct. */
function noMatch(graph: Graph, query: string): string {
  const near = nearMatches(graph, query).slice(0, 12);
  return [
    `No component or module matches "${query}".`,
    near.length > 0
      ? `Near matches:\n${near.map((n) => `- ${n}`).join("\n")}`
      : "Try a component name (list_components), a file basename, or an import path.",
  ].join("\n");
}

/** Graph nodes for a target's files (files can drop out between scans). */
function targetNodes(graph: Graph, target: Target): GraphNode[] {
  return target.files
    .map((f) => graph.nodes.get(f))
    .filter((n): n is GraphNode => n !== undefined);
}

/** Render every call site of a target, grouped by file for multi-part components. */
function usagesFor(graph: Graph, target: Target): string {
  const lines: string[] = [`## ${target.label}`];
  let total = 0;
  for (const node of targetNodes(graph, target)) {
    const edges = graph.incoming.get(node.file) ?? [];
    if (edges.length === 0) continue;
    if (target.files.length > 1) lines.push("", `### ${node.rel}`);
    for (const edge of edges.sort((a, b) => a.from.localeCompare(b.from))) {
      const importer = graph.nodes.get(edge.from)!;
      lines.push(`- ${display(importer)} — ${renderRefs(edge.refs)}`);
      total += 1;
    }
  }
  if (total === 0) lines.push("", "No usages found in the scanned graph.");
  return lines.join("\n");
}

/** Emit one traversal level as indented list lines; cycles are marked, not followed. */
function dependencyTree(
  graph: Graph,
  file: string,
  depth: number,
  direction: "outgoing" | "incoming",
  indent: number,
  seen: Set<string>,
  lines: string[],
): void {
  const edges =
    direction === "outgoing"
      ? (graph.nodes.get(file)?.outgoing ?? [])
      : (graph.incoming.get(file) ?? []);
  for (const edge of edges) {
    const next = direction === "outgoing" ? edge.to : edge.from;
    const node = graph.nodes.get(next)!;
    const cycle = seen.has(next);
    lines.push(
      `${"  ".repeat(indent)}- ${display(node)} — ${renderRefs(edge.refs)}${cycle ? " (shown elsewhere)" : ""}`,
    );
    if (!cycle && indent + 1 < depth) {
      seen.add(next);
      dependencyTree(graph, next, depth, direction, indent + 1, seen, lines);
    }
  }
}

/**
 * Output budget for a tree. Hub modules can have hundreds of dependents, so
 * a deep tree explodes multiplicatively — when it would, the tool degrades to
 * the deepest depth that fits and says so, rather than overflowing the
 * client's tool-result limit.
 */
const MAX_TREE_LINES = 300;

function treeAtDepth(
  graph: Graph,
  target: Target,
  depth: number,
  direction: "outgoing" | "incoming",
): string[] {
  const lines: string[] = [];
  // Shared across the target's sections: a component and its types file reach
  // largely the same modules, so subtrees render once and repeats are marked.
  const seen = new Set(target.files);
  for (const node of targetNodes(graph, target)) {
    const hasEdges =
      direction === "outgoing"
        ? node.outgoing.length > 0 || node.externals.length > 0
        : (graph.incoming.get(node.file) ?? []).length > 0;
    if (!hasEdges && target.files.length > 1) continue;
    lines.push("", `### ${node.rel}`);
    const before = lines.length;
    dependencyTree(graph, node.file, depth, direction, 0, seen, lines);
    if (direction === "outgoing" && node.externals.length > 0) {
      const externals = [...new Set(node.externals.map((e) => e.specifier))];
      lines.push(`- (external) ${externals.join(", ")}`);
    }
    if (lines.length === before) lines.push("(none)");
    if (node.unresolved.length > 0) {
      lines.push(
        `- (unresolved) ${node.unresolved.map((u) => `${u.specifier} L${u.line}`).join(", ")}`,
      );
    }
  }
  return lines;
}

/**
 * Full-transitive blast-radius summary for a dependents query — computed at
 * unlimited depth regardless of how deep the rendered tree goes.
 */
function blastRadius(graph: Graph, target: Target): string | null {
  const queue = [...target.files];
  const seen = new Set(target.files);
  const byRoot = new Map<string, number>();
  const components = new Set<string>();
  let total = 0;
  while (queue.length > 0) {
    const file = queue.pop()!;
    for (const edge of graph.incoming.get(file) ?? []) {
      if (seen.has(edge.from)) continue;
      seen.add(edge.from);
      queue.push(edge.from);
      const node = graph.nodes.get(edge.from)!;
      total += 1;
      byRoot.set(node.root, (byRoot.get(node.root) ?? 0) + 1);
      if (node.catalog) {
        const { entry } = node.catalog;
        components.add(`${entry.tier}/${entry.name}`);
      }
    }
  }
  if (total === 0) return null;
  const roots = [...byRoot].map(([root, n]) => `${root} ${n}`).join(", ");
  const suffix =
    components.size > 0 ? `, ${components.size} catalog components` : "";
  return `Blast radius: ${total} modules (${roots})${suffix}.`;
}

/** Render a target's dependency (outgoing) or dependent (incoming) tree. */
function treeFor(
  graph: Graph,
  target: Target,
  depth: number,
  direction: "outgoing" | "incoming",
): string {
  let body: string[] = [];
  let rendered = depth;
  for (let d = depth; d >= 1; d--) {
    body = treeAtDepth(graph, target, d, direction);
    rendered = d;
    if (body.length <= MAX_TREE_LINES) break;
  }
  const lines = [`## ${target.label}`];
  if (direction === "incoming") {
    const summary = blastRadius(graph, target);
    if (summary !== null) lines.push(summary);
  }
  if (rendered < depth) {
    lines.push(
      `(fan-out too large for depth ${depth} — rendered at depth ${rendered}; re-query a specific ${direction === "outgoing" ? "dependency" : "dependent"} to go deeper)`,
    );
  }
  if (body.length > MAX_TREE_LINES) {
    const omitted = body.length - MAX_TREE_LINES;
    body = body.slice(0, MAX_TREE_LINES);
    body.push(`… ${omitted} more lines omitted`);
  }
  lines.push(...body);
  return lines.join("\n");
}

/** Render a target's identity card: location, kind, import, exports, edge counts. */
function resolveFor(graph: Graph, target: Target): string {
  const lines: string[] = [`## ${target.label}`];
  for (const node of targetNodes(graph, target)) {
    const dependents = (graph.incoming.get(node.file) ?? []).length;
    lines.push("", `### ${node.rel}`);
    lines.push(`- kind: ${node.kind} (${node.root})`);
    if (node.catalog && node.catalog.role !== "part")
      lines.push(`- role: ${node.catalog.role} of ${node.catalog.entry.name}`);
    if (node.importPath) lines.push(`- import: \`${node.importPath}\``);
    if (node.exports.length > 0)
      lines.push(`- exports: ${node.exports.join(", ")}`);
    lines.push(
      `- edges: ${node.outgoing.length} internal + ${node.externals.length} external dependencies, ${dependents} dependents`,
    );
    if (node.error) lines.push(`- parse error: ${node.error}`);
  }
  if (target.entry) {
    lines.push(
      "",
      `Full type contract: describe_component name=${target.entry.name} tier=${target.entry.tier}`,
    );
  }
  return lines.join("\n");
}

export function createServer(): McpServer {
  const catalog = loadCatalog();
  const server = new McpServer(
    { name: "foundation", version: catalog.foundationVersion },
    { instructions: INSTRUCTIONS },
  );

  server.registerTool(
    "list_components",
    {
      title: "List foundation components",
      description:
        "List every component in @zoobzio/foundation, optionally filtered by tier (common | core | data | system). Returns one line per component: name, tier, and its rendered parts.",
      inputSchema: { tier: z.enum(TIERS).optional() },
    },
    async ({ tier }) => {
      const entries = catalog.components.filter(
        (c) => tier === undefined || c.tier === tier,
      );
      const lines = entries.map((c) => {
        const parts = c.components
          .map((f) => f.replace(/^.*\//, "").replace(/\.vue$/, ""))
          .join(", ");
        const extras = [
          c.definition ? "definition" : null,
          c.factory ? "widget composable" : null,
        ].filter((x) => x !== null);
        return `${c.tier}/${c.name} — parts: ${parts}${extras.length ? ` (${extras.join(", ")})` : ""}`;
      });
      return text(lines.join("\n"));
    },
  );

  server.registerTool(
    "describe_component",
    {
      title: "Describe a foundation component",
      description:
        "Full contract for one component: @zoobzio/foundation/* import paths, element roles and token slots, and the source of its type files and definition. Pass tier to disambiguate names that exist in more than one tier (e.g. 'select' is both a common element family and a core component).",
      inputSchema: { name: z.string(), tier: z.enum(TIERS).optional() },
    },
    async ({ name, tier }) => {
      const matches = catalog.components.filter(
        (c) => c.name === name && (tier === undefined || c.tier === tier),
      );
      if (matches.length === 0) {
        const known = catalog.components.map((c) => `${c.tier}/${c.name}`);
        return text(
          `No component named "${name}"${tier ? ` in tier "${tier}"` : ""}. Known components:\n${known.join("\n")}`,
        );
      }
      const root = foundationRoot();
      return text(matches.map((m) => describe(m, root)).join("\n\n---\n\n"));
    },
  );

  const roots = discoverRoots(
    foundationRoot(),
    process.cwd(),
    process.env.FOUNDATION_MCP_APP_DIR,
  );
  const graphQuery = { name: z.string() };
  const depthField = z.number().int().min(1).max(6).optional();

  function withTargets(
    name: string,
    render: (graph: Graph, target: Target) => string,
  ) {
    const graph = buildGraph(roots, catalog);
    const targets = findTargets(graph, catalog, name);
    if (targets.length === 0) return text(noMatch(graph, name));
    return text(targets.map((t) => render(graph, t)).join("\n\n---\n\n"));
  }

  server.registerTool(
    "usages",
    {
      title: "Find call sites",
      description:
        "Deterministic call sites for a component or module: every file that imports or renders it, across the foundation layer and the consuming app, with line numbers and edge kinds (import / type / render). Accepts a component name (optionally tier-qualified like core/select), a file basename, a root-relative path, or a @zoobzio/foundation/* import path.",
      inputSchema: graphQuery,
    },
    async ({ name }) => withTargets(name, usagesFor),
  );

  server.registerTool(
    "dependencies",
    {
      title: "Dependency tree",
      description:
        "What a component or module is built from: its resolved import/render tree across the layer and the app, with external packages collapsed to one line and unresolved imports flagged. depth 1-6 (default 3); when fan-out is too large for the requested depth the tree is rendered shallower and says so. Same name matching as usages.",
      inputSchema: { ...graphQuery, depth: depthField },
    },
    async ({ name, depth }) =>
      withTargets(name, (g, t) => treeFor(g, t, depth ?? 3, "outgoing")),
  );

  server.registerTool(
    "dependents",
    {
      title: "Reverse dependency tree",
      description:
        "Blast radius of a change: a full-transitive summary (module count by provenance, catalog components affected) followed by the dependent tree up to depth 1-6 (default 3); when fan-out is too large for the requested depth the tree is rendered shallower and says so. Same name matching as usages.",
      inputSchema: { ...graphQuery, depth: depthField },
    },
    async ({ name, depth }) =>
      withTargets(name, (g, t) => treeFor(g, t, depth ?? 3, "incoming")),
  );

  server.registerTool(
    "resolve",
    {
      title: "Locate a module",
      description:
        "Locate a component or module by name: file, kind, provenance (foundation layer vs consuming app), canonical import specifier, exports, and edge counts. The entry point for 'where is X and how do I import it'.",
      inputSchema: { query: z.string() },
    },
    async ({ query }) => withTargets(query, resolveFor),
  );

  server.registerTool(
    "health",
    {
      title: "Graph health report",
      description:
        "Aggregate diagnostics over the whole module graph: parse errors, unresolved imports, catalog drift (errors); import cycles, tier-layering violations, dead-code candidates, imported-but-never-rendered components (warnings); blast-radius hotspots and catalog adoption by the consuming app (info). Empty sections are omitted. Pass section to get one section in full detail.",
      inputSchema: { section: z.enum(HEALTH_SECTIONS).optional() },
    },
    async ({ section }) => {
      const graph = buildGraph(roots, catalog);
      return text(healthReport(graph, catalog, section));
    },
  );

  server.registerTool(
    "help",
    {
      title: "Foundation usage guide",
      description:
        "Authoring guides for @zoobzio/foundation. 'overview' covers architecture, tiers, and the explicit-import model; each tier topic (common | core | data | system) is that tier's full authoring contract — read it before writing code that uses or extends the tier.",
      inputSchema: {
        topic: z.enum(
          Object.keys(HELP_TOPICS) as [keyof typeof HELP_TOPICS],
        ),
      },
    },
    async ({ topic }) =>
      text(readFileSync(join(foundationRoot(), HELP_TOPICS[topic]), "utf8")),
  );

  return server;
}
