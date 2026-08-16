# @zoobzio/foundation-mcp

## 0.0.15

### Patch Changes

- [`88ad11a`](https://github.com/zoobzio/foundation/commit/88ad11a51befa4b5ca3750c6c821ca0edc5b5290) Thanks [@zoobzio](https://github.com/zoobzio)! - Republish with a resolved peer dependency: 0.0.14 shipped with the raw `workspace:*` protocol in `peerDependencies`, making the package uninstallable outside the monorepo.

- Updated dependencies []:
  - @zoobzio/foundation@0.0.15

## 0.1.0

### Minor Changes

- [`6307e49`](https://github.com/zoobzio/foundation/commit/6307e49bd90d982f751014f1cd4fa23b1d35823a) Thanks [@zoobzio](https://github.com/zoobzio)! - Add `@zoobzio/foundation-mcp` — a stdio MCP server giving coding agents structured context on the foundation layer without reading the repo. Tools: `list_components` (catalog by tier), `describe_component` (`#foundation/*` import paths, element roles + token slots, type/definition source), and `help` (the root and per-tier authoring guides). Lookups serve a build-time `catalog.json` generated from `app/components/*` joined with `config/components.ts`; file contents resolve at runtime from the consumer's installed `@zoobzio/foundation` (peer dependency).
