# @zoobzio/foundation

A design system for Vue 3 + Nuxt, delivered as a **single Nuxt layer**. Foundation spans the full range from behavior-free HTML element wrappers up to stateful, generic data widgets — consumed by extending one layer.

## Usage

Extend Foundation from your app's `nuxt.config`:

```ts
export default defineNuxtConfig({
  extends: ["@zoobzio/foundation"],
});
```

> Pre-1.0 — published to npm as an early alpha under the `alpha` dist-tag, so
> install it explicitly: `pnpm add @zoobzio/foundation@alpha`. A `0.x` release is
> the running alpha; expect breaking changes between minors until 1.0.

## Architecture

Foundation is one Nuxt layer rooted at `app/`, organized into tiers by responsibility:

| Tier       | Directory            | What it is                                                                                                                                                    |
| ---------- | -------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Elements   | `components/common/` | Behavior-free HTML wrappers + slot-through primitives, with a modifier system (`variant`, `size`, `color`, `radius`, `density`, `elevation`). No JS behavior. |
| Components | `components/core/`   | Stateful/interactive components composing elements + [reka-ui](https://reka-ui.com) primitives, with full passthrough & slotthrough.                          |
| Widgets    | `components/data/`   | Factory-driven, generic data widgets (autocomplete, table, chart, deck, form, preview).                                                                       |
| System     | `components/system/` | App-shell composition (workspace layout).                                                                                                                     |

### Data widgets

Each widget pairs a **factory** (`createTable`, `createForm`, …) that returns a reactive interface with a **component** that renders it:

- `DataAutocomplete` — stepped, suggestion-driven autocomplete input
- `DataTable` — paginated, sortable, filterable data grid
- `DataForm` — programmatic form over `T` with zod validation
- `DataChart` — configurable chart visualizations
- `DataDeck` — infinite-scroll card feeds
- `DataPreview` — code / markdown content viewer

## Imports

Auto-import is **disabled** — everything is imported explicitly. Foundation-owned modules use the `#foundation/*` alias, an absolute path to the layer's `app/` so it keeps resolving to Foundation even when the layer is extended by a consumer app:

```ts
import Button from "#foundation/components/common/button.vue";
import { createTable } from "#foundation/factories/data/table";
import type { ButtonProps } from "#foundation/types/common/button";
```

Framework symbols (Vue, Nuxt, VueUse) come from Nuxt's virtual `#imports`.

## Project structure

```
app/
  components/
    common/     — HTML element wrappers (48) + behavioral element families (19)
    core/       — interactive components (28)
    data/       — data widgets: autocomplete, table, chart, deck, form, preview
    system/     — app-shell composition (1)
  composables/  — useBindings, usePassthrough, useContext, useModel, useHooks, …
  factories/    — data-widget + workspace factories
  services/     — feature logic classes (the unit under test)
  stores/       — useState-backed feature state
  plugins/      — log, tokens
  types/        — per-component prop/emit types
  utils/        — pure helpers (dates, formatting, passthrough merge, …)
  constants/    — shared constants
  app.vue · error.vue · app.d.ts
tests/          — vitest suite mirroring app/ (see tests/README.md)
nuxt.config.ts  — layer config (auto-import off, #foundation alias)
```

## Development

```bash
pnpm install
pnpm dev          # run the layer in a Nuxt dev server
pnpm test         # run the vitest suite
pnpm typecheck    # nuxi typecheck
pnpm lint         # eslint (lint:fix to auto-fix)
```

Or via `make` (`make help` lists all targets):

| Command          | Description                   |
| ---------------- | ----------------------------- |
| `make install`   | Install dependencies          |
| `make dev`       | Start the Nuxt dev server     |
| `make lint`      | Run ESLint                    |
| `make lint-fix`  | Run ESLint with auto-fix      |
| `make typecheck` | Type-check (`nuxi typecheck`) |
| `make test`      | Run all tests                 |
| `make coverage`  | Run tests with coverage       |
| `make check`     | Lint + typecheck + test       |
| `make clean`     | Remove generated files        |

## Testing

Tests run under **vitest** (happy-dom). Because the layer uses explicit imports, Nuxt's virtual `#imports` is shimmed for the test environment (`tests/mocks/imports.ts` — real Vue/VueUse + stubbed Nuxt composables), and `#foundation` / `#test` are aliased in `vitest.config.ts`. Component tests mount with `@vue/test-utils` using the shared stubs in `tests/stubs/` (`commonStubs` / `coreStubs` / per-feature data maps).

## Companion modules (in progress)

Theming, i18n, auth, telemetry, and icons are being extracted into standalone modules — `@zoobz-io/untheme`, `@zoobz-io/rosetta`, `@zoobz-io/rampart`, `@zoobz-io/crucible`, `@zoobz-io/iconic`. Until they land, the components that depend on them (auth / theme / locale controls, the icon sprite) are not wired up.

## Contributing

- Conventional commits: `feat:`, `fix:`, `docs:`, `test:`, `refactor:`, `chore:`
- Tests required for all new code
- `make check` (lint + typecheck + test) must pass before opening a PR
- Add a changeset (`pnpm changeset`) in any PR that should ship a release
- Node 22, pnpm 9.10.0

## Releasing

Versioning runs on [changesets](https://github.com/changesets/changesets). Each
PR that changes published behavior carries a changeset (`pnpm changeset`, then
commit the generated file); pre-1.0, `minor` = feature, `patch` = fix.

Releases are cut manually via the **Release** workflow (Actions tab → Run
workflow, or `gh workflow run Release`). It applies every pending changeset —
bumping the version, rewriting `CHANGELOG.md`, committing the bump, publishing to
npm, and pushing the tag. Publishing uses npm **OIDC trusted publishing** (no
`NPM_TOKEN`; provenance is attested), so the package must have a trusted
publisher configured on npmjs pointing at this repo's `Release` workflow.

## License

MIT
