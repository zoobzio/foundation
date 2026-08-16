import { readFileSync } from "node:fs";
import { createRequire } from "node:module";
import { dirname, join } from "node:path";

import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { z } from "zod";

import { loadCatalog, TIERS } from "./catalog.js";
import type { CatalogEntry } from "./catalog.js";

const HELP_TOPICS = {
  overview: "README.md",
  common: "app/components/common/README.md",
  core: "app/components/core/README.md",
  data: "app/components/data/README.md",
  system: "app/components/system/README.md",
} as const;

const INSTRUCTIONS = `@zoobzio/foundation is a Vue 3 + Nuxt design system delivered as a single Nuxt layer, organized into tiers: common (behavior-free HTML wrappers + behavioral element families), core (stateless interactive coordinators with a passthrough part system), data (factory-driven generic data widgets), and system (app-shell composition). Auto-import is disabled — everything is imported explicitly via the #foundation/* alias (framework symbols via #imports).

Before writing code against a tier, call help with that tier's topic — each tier has a strict authoring contract (bindings, passthrough parts, factories) that code must follow. Use list_components to discover what exists and describe_component to get a component's full type contract and import paths.`;

/**
 * Foundation's shipped sources (app/, config/) resolve from wherever the
 * consumer installed @zoobzio/foundation, so help topics and type contracts
 * always reflect the installed version.
 */
function foundationRoot(): string {
  const require = createRequire(import.meta.url);
  return dirname(require.resolve("@zoobzio/foundation/package.json"));
}

function text(value: string) {
  return { content: [{ type: "text" as const, text: value }] };
}

function importPath(file: string): string {
  return file.replace(/^app\//, "#foundation/").replace(/\.ts$/, "");
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
      `Factory: \`${entry.factory}\` (\`${importPath(entry.factory)}\`) — read it for the widget's reactive interface.`,
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
          c.factory ? "factory" : null,
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
        "Full contract for one component: #foundation/* import paths, element roles and token slots, and the source of its type files and definition. Pass tier to disambiguate names that exist in more than one tier (e.g. 'select' is both a common element family and a core component).",
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
