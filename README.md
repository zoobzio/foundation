# foundation

A design system for Vue 3 + Nuxt, built as a pnpm workspace: framework-free
headless services in `packages/`, and the framework bindings over them in
`integrations/`. Foundation spans the full range from unstyled interactive
components built on semantic HTML up to stateful, generic data widgets.

## Usage

The packages are published to npm under the `@zoobzio` scope:

```sh
pnpm add @zoobzio/nuxt
```

Extend the Nuxt layer from your app's `nuxt.config`:

```ts
export default defineNuxtConfig({
  extends: ["@zoobzio/nuxt"],
});
```

Or use the Vue components directly, without Nuxt:

```ts
import Select from "@zoobzio/vue/components/select.vue";
import { defineSelect } from "@zoobzio/vue/definitions/select";
```

> Pre-1.0 — a `0.x` release is the running alpha; expect breaking changes
> between minors until 1.0.

## Architecture

| Tier       | Where                | What it is                                                                                                                                         |
| ---------- | -------------------- | -------------------------------------------------------------------------------------------------------------------------------------------------- |
| Services   | `packages/*`         | Headless data machines (query, browser, form, table) in pure TypeScript, sharing the emitter and state proxy in [`@zoobzio/kit`](./packages/kit/). |
| Components | `integrations/vue/`  | Unstyled composites of [reka-ui](https://reka-ui.com) primitives and semantic HTML (`f-*` classes), with full passthrough & slotthrough.           |
| Nuxt       | `integrations/nuxt/` | The Nuxt layer: `useState`-backed stores, hook-bus factories, and the app shell over `@zoobzio/vue` and the services.                              |

Each data component pairs a **definition** (`defineTable`, `defineForm`, …) —
inert typed config, storable in a constant — with a headless **service** that
owns the data machine, and a **component** that renders it. The Nuxt layer adds
the stores and factories that instance a service in setup.

## Imports

Auto-import is **disabled** — everything is imported explicitly. Each package
ships its source through subpath exports; see the package READMEs for the
import surface:

- [`packages/README.md`](./packages/README.md) — the headless services
- [`integrations/vue/README.md`](./integrations/vue/README.md) — the Vue components
- [`integrations/nuxt/README.md`](./integrations/nuxt/README.md) — the Nuxt layer

## Project structure

```
packages/
  kit/            — @zoobzio/kit: the emitter, state proxy, and types the services share
  query/          — @zoobzio/query: headless query service (pure TS, no framework)
  browser/        — @zoobzio/browser: headless browser service (pure TS, no framework)
  form/           — @zoobzio/form: headless form service (pure TS, no framework)
  table/          — @zoobzio/table: headless table service (pure TS, no framework)
integrations/
  vue/            — @zoobzio/vue: Vue 3 components, definitions, and types
  nuxt/           — @zoobzio/nuxt: the Nuxt layer (stores, factories, app shell)
```

## Development

```sh
pnpm install
pnpm build        # build every package to its .dist (turbo)
pnpm -r prepare   # nuxi prepare: generate the layer's tsconfig and types
pnpm dev          # run the Nuxt layer in a dev server
pnpm test         # run the vitest suite in every workspace package (turbo)
pnpm coverage     # one aggregated coverage pass through the root vitest config
pnpm typecheck    # type-check every workspace package (turbo)
pnpm lint         # oxlint
pnpm format       # oxfmt (inspect to verify)
```

Lint and format run from the root and walk the whole tree. `build`, `stub`,
`typecheck`, and `test` fan out through turbo; run them inside a package
directory to target that package alone. Shared dependency versions live in the
[pnpm catalog](./pnpm-workspace.yaml); packages reference them as `catalog:`.

Or via `make` (`make help` lists all targets):

| Command          | Description                                          |
| ---------------- | ---------------------------------------------------- |
| `make install`   | Install dependencies                                 |
| `make stub`      | Link the packages to their source for development    |
| `make build`     | Build every package to its `.dist`                   |
| `make prepare`   | Run the workspace prepare hooks (after build)        |
| `make dev`       | Start the Nuxt dev server                            |
| `make typecheck` | Type-check every package                             |
| `make test`      | Run all tests                                        |
| `make coverage`  | Run all tests with an aggregated coverage report     |
| `make lint`      | Run oxlint                                           |
| `make format`    | Format code with oxfmt                               |
| `make inspect`   | Check formatting with oxfmt                          |
| `make check`     | Lint + typecheck + test on the existing build output |
| `make verify`    | Clean, install, build, prepare, typecheck, and test  |
| `make ci`        | Build, prepare, typecheck, test, lint, and inspect   |
| `make clean`     | Remove build output and the Nuxt caches              |

## Testing

Tests run under **vitest** in every package (happy-dom where components mount).
Because the Nuxt layer uses explicit imports, Nuxt's virtual `#imports` is
shimmed for its test environment (`integrations/nuxt/tests/mocks/imports.ts` —
real Vue/VueUse + stubbed Nuxt composables), and `#test` is aliased in its
`vitest.config.ts`. Component tests mount with `@vue/test-utils`.

## Contributing

- Conventional commits: `feat:`, `fix:`, `docs:`, `test:`, `refactor:`, `chore:`
- Tests required for all new code
- `make ci` (build + prepare + typecheck + test + lint + inspect) must pass
  before opening a PR
- Add a changeset (`pnpm changeset`) in any PR that should ship a release
- Node 22, 24, or 25 (CI tests all three; `.nvmrc` pins the dev version),
  pnpm 10.27.0

CI runs on every PR and push to `main`: a build job warms the turbo cache, then
lint, format, typecheck, a test matrix across the supported Node versions, and
an aggregated coverage upload to Codecov. A separate Security workflow runs
CodeQL on every push and a dependency review on every PR.

## Releasing

Versioning runs on [changesets](https://github.com/changesets/changesets) with
**fixed** versioning: every `@zoobzio/*` package shares one version and
releases together. Each PR that changes published behavior carries a changeset
(`pnpm changeset`, then commit the generated file); pre-1.0, `minor` = feature,
`patch` = fix.

Releases are cut manually via the **Release** workflow (Actions tab → Run
workflow, or `gh workflow run Release`). It applies every pending changeset —
bumping the version, rewriting each package's `CHANGELOG.md`, committing the
bump, building, publishing to npm, and pushing the tags.

Publishing authenticates with npm [trusted publishing](https://docs.npmjs.com/trusted-publishers)
over OIDC (`id-token: write`), so no `NPM_TOKEN` secret is configured. Each
package lists this repo and the Release workflow as its trusted publisher on
npm, and every publish carries a provenance attestation.

## License

MIT
