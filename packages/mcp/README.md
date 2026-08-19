# @zoobzio/foundation-mcp

An MCP server that gives coding agents fast, structured context on
[`@zoobzio/foundation`](../../README.md) — what components exist, their type
contracts and import paths, and the authoring conventions for each tier —
without reading the whole layer.

## Tools

| Tool                 | Purpose                                                                                                       |
| -------------------- | ------------------------------------------------------------------------------------------------------------- |
| `list_components`    | Every component (optionally by tier): name, tier, rendered parts, whether a definition/widget composable ships.          |
| `describe_component` | One component's full contract: import paths, element roles + token slots, and its type/definition file source. |
| `help`               | The authoring guides — `overview` plus the per-tier contracts (`common`, `core`, `data`, `system`).            |
| `resolve`            | Locate a component/module: file, kind, provenance (layer vs app), canonical import, exports, edge counts.      |
| `usages`             | Every call site of a component/module — importers and template render sites, with line numbers and edge kinds. |
| `dependencies`       | What a module is built from: resolved import/render tree, externals collapsed, unresolved imports flagged.     |
| `dependents`         | Blast radius: everything that transitively imports/renders a module, as a depth-limited tree.                  |
| `health`             | Graph-wide report: broken imports, parse errors, catalog drift, cycles, tier-layering violations, dead-code candidates, hotspots, adoption. |

Lookups are served from `catalog.json`, generated at build time from the
layer's component tree joined with `config/components.ts` (mismatches in
either direction fail the build). File contents — type contracts, tier
guides — are read at runtime from the consumer's installed
`@zoobzio/foundation`, so they always match the installed version.

## The module graph

Because the layer disables auto-import, every dependency edge is a literal
import statement — so the graph tools are deterministic, not heuristic. On
each call the server scans two roots with one scanner: the installed layer's
`app/`, and the consuming app (`app/` + `server/`). Nodes carry provenance
(which root they came from) and, for layer files, their catalog identity
(tier/component/part), so `usages("core/select")` answers in design-system
vocabulary and spans layer and app seamlessly. Edges record their kind —
`import`, `type` (type-only), or `render` (matched template tag) — with line
numbers. Parses are cached by mtime, so repeat queries only re-read files
that changed.

The consumer root is the server's working directory when it contains a
`nuxt.config.*`, or the directory named by the `FOUNDATION_MCP_APP_DIR`
environment variable (relative to cwd) — this repo's `.mcp.json` points it
at `example/`.

`health` runs the whole graph through a battery of checks and reports only
what it finds, ordered by severity: errors (files the scanner cannot parse,
imports that resolve to nothing, catalog entries whose files no longer
exist), warnings (import cycles — type-only cycles labeled as such — tier
layering violations, dead-code candidates, components imported by an SFC
but never rendered), and info (the modules with the largest transitive
blast radius, and which catalog components the consuming app actually
imports). Dead-code findings are candidates, not verdicts: dynamic
`import()` and `nuxt.config` references are invisible to the scanner, so
verify with `usages` before deleting.

## Usage

In a downstream project that installs `@zoobzio/foundation`:

```bash
pnpm add -D @zoobzio/foundation-mcp
```

Then add to `.mcp.json` (or your client's MCP config):

```json
{
  "mcpServers": {
    "foundation": {
      "command": "pnpm",
      "args": ["exec", "foundation-mcp"]
    }
  }
}
```

`@zoobzio/foundation` is a peer dependency, resolved from the server's own
install location — installing the server in the project (not via `npx`,
which resolves peers in its cache) is what guarantees help topics and type
contracts come from the project's installed foundation version.

## Development

```bash
pnpm generate   # regenerate catalog.json from the workspace layer
pnpm build      # generate + tsc → dist/
```

Smoke-test over stdio from `packages/mcp`:

```bash
printf '%s\n' \
  '{"jsonrpc":"2.0","id":1,"method":"initialize","params":{"protocolVersion":"2025-03-26","capabilities":{},"clientInfo":{"name":"dev","version":"0"}}}' \
  '{"jsonrpc":"2.0","method":"notifications/initialized"}' \
  '{"jsonrpc":"2.0","id":2,"method":"tools/call","params":{"name":"list_components","arguments":{"tier":"core"}}}' \
  | node dist/cli.js
```
