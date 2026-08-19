/**
 * Graph-wide health report: aggregates the diagnostics the graph already
 * collects per node (parse errors, unresolved imports) with derived findings
 * (cycles, layering violations, dead-code candidates, hotspots, adoption)
 * into one actionable summary. Everything here is a pure function over
 * Graph + Catalog.
 */
import { join } from "node:path";

import { display } from "./graph.js";
import type { Catalog, Graph, GraphNode, Tier } from "./types.js";

export const HEALTH_SECTIONS = [
  "parse-errors",
  "unresolved-imports",
  "catalog-drift",
  "cycles",
  "layering",
  "dead-code",
  "unrendered-imports",
  "hotspots",
  "adoption",
] as const;

export type HealthSectionKey = (typeof HEALTH_SECTIONS)[number];

type Severity = "error" | "warning" | "info";

interface Section {
  key: HealthSectionKey;
  title: string;
  severity: Severity;
  /** One-line explanation + what to do about it, shown under the header. */
  note: string;
  lines: string[];
}

// ─── Individual checks ──────────────────────────────────────────────────────

function parseErrors(graph: Graph): string[] {
  const lines: string[] = [];
  for (const node of graph.nodes.values()) {
    if (node.error !== null) lines.push(`- ${display(node)} — ${node.error}`);
  }
  return lines.sort();
}

function unresolvedImports(graph: Graph): string[] {
  const lines: string[] = [];
  for (const node of graph.nodes.values()) {
    for (const u of node.unresolved) {
      lines.push(`- ${display(node)} — \`${u.specifier}\` L${u.line}`);
    }
  }
  return lines.sort();
}

function catalogDrift(graph: Graph, catalog: Catalog): string[] {
  const layerDir = graph.roots[0]!.dir;
  const lines: string[] = [];
  for (const entry of catalog.components) {
    const files = [
      ...entry.components,
      ...entry.types,
      ...(entry.definition ? [entry.definition] : []),
      ...(entry.factory ? [entry.factory] : []),
    ];
    for (const f of files) {
      if (!graph.nodes.has(join(layerDir, f))) {
        lines.push(`- ${entry.tier}/${entry.name} — ${f} missing from sources`);
      }
    }
  }
  return lines.sort();
}

/** Tarjan SCC over the outgoing edges; only non-trivial components survive. */
function cycles(graph: Graph): string[] {
  let counter = 0;
  const index = new Map<string, number>();
  const low = new Map<string, number>();
  const onStack = new Set<string>();
  const stack: string[] = [];
  const found: GraphNode[][] = [];

  function connect(file: string): void {
    index.set(file, counter);
    low.set(file, counter);
    counter += 1;
    stack.push(file);
    onStack.add(file);
    for (const edge of graph.nodes.get(file)!.outgoing) {
      if (!index.has(edge.to)) {
        connect(edge.to);
        low.set(file, Math.min(low.get(file)!, low.get(edge.to)!));
      } else if (onStack.has(edge.to)) {
        low.set(file, Math.min(low.get(file)!, index.get(edge.to)!));
      }
    }
    if (low.get(file) === index.get(file)) {
      const members: string[] = [];
      let popped: string;
      do {
        popped = stack.pop()!;
        onStack.delete(popped);
        members.push(popped);
      } while (popped !== file);
      const selfLoop =
        members.length === 1 &&
        graph.nodes.get(file)!.outgoing.some((e) => e.to === file);
      if (members.length > 1 || selfLoop) {
        found.push(members.map((f) => graph.nodes.get(f)!).reverse());
      }
    }
  }

  for (const file of graph.nodes.keys()) {
    if (!index.has(file)) connect(file);
  }
  return found
    .map((members) => {
      const root = members[0]!.root;
      const files = new Set(members.map((n) => n.file));
      // A cycle held together purely by type imports is erased at runtime —
      // still worth untangling, but it cannot break module initialization.
      const typeOnly = members.every((n) =>
        n.outgoing.every(
          (e) => !files.has(e.to) || e.refs.every((r) => r.kind === "type"),
        ),
      );
      const rels = members.map((n) => n.rel).sort();
      return `- ${members.length} modules (${root}${typeOnly ? ", type-only" : ""}): ${rels.join(" ⇄ ")}`;
    })
    .sort();
}

const TIER_RANK: Record<Tier, number> = {
  common: 0,
  core: 1,
  data: 2,
  system: 3,
};

/** Edges from a lower-tier catalog file into a higher tier: layering breaks. */
function layering(graph: Graph): string[] {
  const lines: string[] = [];
  for (const node of graph.nodes.values()) {
    const from = node.catalog?.entry.tier;
    if (from === undefined) continue;
    for (const edge of node.outgoing) {
      const target = graph.nodes.get(edge.to)!;
      const to = target.catalog?.entry.tier;
      if (to === undefined || TIER_RANK[from] >= TIER_RANK[to]) continue;
      lines.push(
        `- ${display(node)} imports ${display(target)} — L${edge.refs[0]!.line}`,
      );
    }
  }
  return lines.sort();
}

/**
 * Kinds the framework invokes without an import edge — never dead-code
 * candidates. Server utils are included because Nitro auto-imports them even
 * in apps that disable app-side auto-import.
 */
const IMPLICIT_ENTRY_KINDS = new Set([
  "entry",
  "page",
  "layout",
  "plugin",
  "middleware",
  "api endpoint",
  "server route",
  "server middleware",
  "server plugin",
  "server util",
]);

/**
 * Modules nothing imports. Layer files only count when they are both outside
 * the catalog and not publicly importable — the layer's public surface is the
 * adoption section's concern, not dead code.
 */
function deadCode(graph: Graph): string[] {
  const layerRoot = graph.roots[0]!.name;
  const lines: string[] = [];
  for (const node of graph.nodes.values()) {
    if (IMPLICIT_ENTRY_KINDS.has(node.kind)) continue;
    if ((graph.incoming.get(node.file) ?? []).length > 0) continue;
    if (
      node.root === layerRoot &&
      (node.catalog !== null || node.importPath !== null)
    )
      continue;
    lines.push(`- ${display(node)} — ${node.kind}, no importers`);
  }
  return lines.sort();
}

/**
 * SFC imports of components that never appear in the template. Files with no
 * recorded render at all are skipped — they may have no template block.
 */
function unrenderedImports(graph: Graph): string[] {
  const lines: string[] = [];
  for (const node of graph.nodes.values()) {
    if (!node.file.endsWith(".vue")) continue;
    const rendersAnything = node.outgoing.some((e) =>
      e.refs.some((r) => r.kind === "render"),
    );
    if (!rendersAnything) continue;
    for (const edge of node.outgoing) {
      if (!edge.to.endsWith(".vue")) continue;
      const kinds = new Set(edge.refs.map((r) => r.kind));
      if (!kinds.has("import") || kinds.has("render")) continue;
      const target = graph.nodes.get(edge.to)!;
      lines.push(
        `- ${display(node)} imports ${display(target)} (L${edge.refs[0]!.line}) but never renders it`,
      );
    }
  }
  return lines.sort();
}

function transitiveDependents(graph: Graph, file: string): number {
  const seen = new Set([file]);
  const queue = [file];
  while (queue.length > 0) {
    const current = queue.pop()!;
    for (const edge of graph.incoming.get(current) ?? []) {
      if (!seen.has(edge.from)) {
        seen.add(edge.from);
        queue.push(edge.from);
      }
    }
  }
  return seen.size - 1;
}

const HOTSPOT_COUNT = 10;
const HOTSPOT_MIN_DEPENDENTS = 5;

function hotspots(graph: Graph): string[] {
  const scored: { node: GraphNode; count: number }[] = [];
  for (const node of graph.nodes.values()) {
    const count = transitiveDependents(graph, node.file);
    if (count >= HOTSPOT_MIN_DEPENDENTS) scored.push({ node, count });
  }
  return scored
    .sort((a, b) => b.count - a.count || a.node.rel.localeCompare(b.node.rel))
    .slice(0, HOTSPOT_COUNT)
    .map(({ node, count }) => `- ${display(node)} — ${count} transitive dependents`);
}

const ADOPTION_TOP = 5;

function adoption(graph: Graph, catalog: Catalog): string[] {
  const layerDir = graph.roots[0]!.dir;
  const consumers = new Set(graph.roots.slice(1).map((r) => r.name));
  if (consumers.size === 0) {
    return [
      "No consumer app in the graph — run from the app (or set FOUNDATION_MCP_APP_DIR) to measure adoption.",
    ];
  }
  const used: { entry: string; count: number }[] = [];
  const unused: string[] = [];
  for (const entry of catalog.components) {
    const files = [
      ...entry.components,
      ...entry.types,
      ...(entry.definition ? [entry.definition] : []),
      ...(entry.factory ? [entry.factory] : []),
    ].map((f) => join(layerDir, f));
    let count = 0;
    for (const file of files) {
      for (const edge of graph.incoming.get(file) ?? []) {
        if (consumers.has(graph.nodes.get(edge.from)!.root)) count += 1;
      }
    }
    const name = `${entry.tier}/${entry.name}`;
    if (count > 0) used.push({ entry: name, count });
    else unused.push(name);
  }
  const total = catalog.components.length;
  const names = [...consumers].join(", ");
  const lines = [`${used.length} of ${total} components imported directly by ${names}.`];
  if (used.length > 0) {
    const top = used
      .sort((a, b) => b.count - a.count || a.entry.localeCompare(b.entry))
      .slice(0, ADOPTION_TOP)
      .map((u) => `${u.entry} (${u.count})`);
    lines.push(`Most used: ${top.join(", ")}.`);
  }
  if (unused.length > 0) {
    lines.push(`Never imported: ${unused.sort().join(", ")}.`);
  }
  return lines;
}

// ─── Assembly ───────────────────────────────────────────────────────────────

function computeSections(graph: Graph, catalog: Catalog): Section[] {
  return [
    {
      key: "parse-errors",
      title: "Parse errors",
      severity: "error",
      note: "These files could not be parsed, so every other query is blind to their edges. Fix them first.",
      lines: parseErrors(graph),
    },
    {
      key: "unresolved-imports",
      title: "Unresolved imports",
      severity: "error",
      note: "Internal-shaped imports that resolve to no file — a typo, a deleted module, or a moved path.",
      lines: unresolvedImports(graph),
    },
    {
      key: "catalog-drift",
      title: "Catalog drift",
      severity: "error",
      note: "catalog.json references files the installed layer no longer ships — regenerate the catalog.",
      lines: catalogDrift(graph, catalog),
    },
    {
      key: "cycles",
      title: "Import cycles",
      severity: "warning",
      note: "Mutually-importing modules. Break each cycle by extracting the shared piece into a module both sides can import.",
      lines: cycles(graph),
    },
    {
      key: "layering",
      title: "Tier layering violations",
      severity: "warning",
      note: "Lower tiers must not depend on higher tiers (common < core < data < system).",
      lines: layering(graph),
    },
    {
      key: "dead-code",
      title: "Dead-code candidates",
      severity: "warning",
      note: "No file imports these. Dynamic import() and nuxt.config references are invisible to the scanner, so verify with usages before deleting.",
      lines: deadCode(graph),
    },
    {
      key: "unrendered-imports",
      title: "Imported but never rendered",
      severity: "warning",
      note: "Component imports with no matching template tag — likely dead imports; check for render-function or prop usage before removing.",
      lines: unrenderedImports(graph),
    },
    {
      key: "hotspots",
      title: "Blast-radius hotspots",
      severity: "info",
      note: "Most transitive dependents — changes here ripple widest; check dependents before refactoring.",
      lines: hotspots(graph),
    },
    {
      key: "adoption",
      title: "Catalog adoption",
      severity: "info",
      note: "Which foundation components the consuming app imports directly. Never-imported components are deprecation candidates — or adoption gaps.",
      lines: adoption(graph, catalog),
    },
  ];
}

/** Line budget per section: generous when the caller asked for one section. */
function sectionCap(filtered: boolean): number {
  return filtered ? 200 : 30;
}

function renderSection(section: Section, cap: number): string[] {
  const lines = [
    "",
    `## ${section.title} (${section.lines.length}) — ${section.severity}`,
    section.note,
  ];
  if (section.lines.length > cap) {
    lines.push(...section.lines.slice(0, cap));
    lines.push(
      `… ${section.lines.length - cap} more — call health with section="${section.key}" for the full list`,
    );
  } else {
    lines.push(...section.lines);
  }
  return lines;
}

/**
 * Render the health report: a scan summary, then every non-empty section in
 * severity order (info sections describe the graph rather than problems, so
 * their counts are not findings). Pass a section key for just that section
 * at a higher line budget.
 */
export function healthReport(
  graph: Graph,
  catalog: Catalog,
  section?: HealthSectionKey,
): string {
  const sections = computeSections(graph, catalog);
  if (section !== undefined) {
    const match = sections.find((s) => s.key === section)!;
    if (match.lines.length === 0) {
      return `# Foundation health — ${match.title}\n\nNo findings.`;
    }
    return [
      `# Foundation health — ${match.title}`,
      ...renderSection(match, sectionCap(true)),
    ].join("\n");
  }

  const byRoot = new Map<string, number>();
  for (const node of graph.nodes.values()) {
    byRoot.set(node.root, (byRoot.get(node.root) ?? 0) + 1);
  }
  const rootSummary = [...byRoot]
    .map(([root, n]) => `${root} ${n}`)
    .join(", ");
  const problems = sections.filter(
    (s) => s.severity !== "info" && s.lines.length > 0,
  );
  const errors = problems
    .filter((s) => s.severity === "error")
    .reduce((n, s) => n + s.lines.length, 0);
  const warnings = problems
    .filter((s) => s.severity === "warning")
    .reduce((n, s) => n + s.lines.length, 0);

  const lines = [
    "# Foundation health",
    `Scanned ${graph.nodes.size} modules (${rootSummary}) — ${errors} errors, ${warnings} warnings.`,
  ];
  if (problems.length === 0) {
    lines.push("", "No errors or warnings in the graph.");
  }
  const cap = sectionCap(false);
  for (const s of sections) {
    if (s.lines.length === 0) continue;
    lines.push(...renderSection(s, cap));
  }
  return lines.join("\n");
}
