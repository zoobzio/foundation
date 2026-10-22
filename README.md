# foundation

A design system for Vue 3 + Nuxt, built as a pnpm workspace: framework-free
headless services in `packages/`, and the framework bindings over them in
`integrations/`. Foundation spans the full range from unstyled interactive
components built on semantic HTML up to stateful, generic data widgets.

## Usage

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

> Pre-1.0 — published to npm as an early alpha under the `alpha` dist-tag, so
> install packages explicitly: `pnpm add @zoobzio/nuxt@alpha`. A `0.x` release
> is the running alpha; expect breaking changes between minors until 1.0.

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

```bash
pnpm install
pnpm dev          # run the Nuxt layer in a dev server
pnpm test         # run the vitest suite in every workspace package
pnpm typecheck    # type-check every workspace package
pnpm lint         # oxlint (lint:fix to auto-fix)
pnpm format       # oxfmt (format:check to verify)
```

Lint and format run from the root and walk the whole tree. `typecheck`,
`test`, `build`, and `prepare` fan out through turbo; run them inside a
package directory to target that package alone.

Or via `make` (`make help` lists all targets):

| Command             | Description                      |
| ------------------- | -------------------------------- |
| `make install`      | Install dependencies             |
| `make dev`          | Start the Nuxt dev server        |
| `make lint`         | Run oxlint                       |
| `make lint-fix`     | Run oxlint with auto-fix         |
| `make format`       | Format code with oxfmt           |
| `make format-check` | Check formatting with oxfmt      |
| `make typecheck`    | Type-check every package         |
| `make test`         | Run all tests                    |
| `make coverage`     | Run tests with coverage          |
| `make check`        | Lint + format + typecheck + test |
| `make clean`        | Remove generated files           |

## Testing

Tests run under **vitest** in every package (happy-dom where components mount).
Because the Nuxt layer uses explicit imports, Nuxt's virtual `#imports` is
shimmed for its test environment (`integrations/nuxt/tests/mocks/imports.ts` —
real Vue/VueUse + stubbed Nuxt composables), and `#test` is aliased in its
`vitest.config.ts`. Component tests mount with `@vue/test-utils`.

## Contributing

- Conventional commits: `feat:`, `fix:`, `docs:`, `test:`, `refactor:`, `chore:`
- Tests required for all new code
- `make check` (lint + typecheck + test) must pass before opening a PR
- Add a changeset (`pnpm changeset`) in any PR that should ship a release
- Node 22, pnpm 10.27.0

## Releasing

Versioning runs on [changesets](https://github.com/changesets/changesets). Each
PR that changes published behavior carries a changeset (`pnpm changeset`, then
commit the generated file); pre-1.0, `minor` = feature, `patch` = fix.

Releases are cut manually via the **Release** workflow (Actions tab → Run
workflow, or `gh workflow run Release`). It applies every pending changeset —
bumping versions, rewriting each package's `CHANGELOG.md`, committing the bump,
publishing to npm, and pushing the tags. Publishing uses npm **OIDC trusted
publishing** (no `NPM_TOKEN`; provenance is attested), so each package must have
a trusted publisher configured on npmjs pointing at this repo's `Release`
workflow.

## License

MIT
