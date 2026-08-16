# @zoobzio/foundation-mcp

An MCP server that gives coding agents fast, structured context on
[`@zoobzio/foundation`](../../README.md) — what components exist, their type
contracts and `#foundation/*` import paths, and the authoring conventions for
each tier — without reading the whole layer.

## Tools

| Tool                 | Purpose                                                                                                       |
| -------------------- | ------------------------------------------------------------------------------------------------------------- |
| `list_components`    | Every component (optionally by tier): name, tier, rendered parts, whether a definition/factory ships.          |
| `describe_component` | One component's full contract: import paths, element roles + token slots, and its type/definition file source. |
| `help`               | The authoring guides — `overview` plus the per-tier contracts (`common`, `core`, `data`, `system`).            |

Lookups are served from `catalog.json`, generated at build time from the
layer's component tree joined with `config/components.ts` (mismatches in
either direction fail the build). File contents — type contracts, tier
guides — are read at runtime from the consumer's installed
`@zoobzio/foundation`, so they always match the installed version.

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
