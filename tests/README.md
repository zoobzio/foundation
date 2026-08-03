# Tests

Vitest + happy-dom, no Nuxt runtime. `#imports`/`#app`/`#components` resolve
to `mocks/imports.ts` — real Vue re-exported, Nuxt composables shimmed with
real semantics (`useState` dedupes by key, the hook bus dispatches,
async-data executes its handler). `#test/*` resolves to this directory.
`setup.ts` clears shim state between tests automatically.

Tests live here only, mirroring `app/` path-for-path: one `.test.ts` per
source file that has logic (`app/services/table.ts` →
`tests/services/table.test.ts`). Types, constants, and config files don't
get test files — assertions about literals are theater.

## Layout

- `mocks/` — module shims (`imports.ts`) and per-feature contract mocks
  (`table.ts`, …) typed against the real contracts so tsc catches drift.
- `stubs/` — component doubles: `factories.ts` plus per-tier maps. Stub keys
  match the **import binding name** in the consuming component (VTU resolves
  against the parent's setupState; kebab/Pascal variants of the key match).
- `suites/` — canonical shared test suites (`runElementSuite`) so repetitive
  files stay thin.
- `data/` — fake datasets, one file per domain shape.
- `mount/` — mount harnesses (`composable.ts` → `withSetup`).

## The mount formula

Tests earn mounts; they don't default to them. For each behavior you assert,
mount the **shallowest tree in which that behavior is observable**, and add a
mount per **logic path** — never per assertion.

1. **No instance needed** — utils, stores, services, factories: no mount.
   Call the seam directly; fake collaborators at the constructor/argument
   boundary (`vi.fn()` actions, hand-rolled `State` refs, the shim's
   `useNuxtApp`).
2. **Instance-bound composable** — `withSetup`, no DOM. If it inspects the
   mounting vnode (`useModel`'s `explicit`), a minimal harness component
   that renders the observable state so tests stay in the DOM.
3. **Behavior local to the component** — prop branching, slot fallbacks,
   pt resolution, ctx contents: mount the component; stub children only when
   their rendering is irrelevant to the assertion.
4. **Behavior crossing a child boundary** — model round-trips, re-emit
   chains, DOM semantics (`role`, `data-state`): render real down to where
   the behavior becomes observable and drive it through DOM events. Reka
   renders real DOM in happy-dom, including portalled content (query
   `document` for it) and pointer/keyboard interactions (`flushPromises`
   after — reka defers behind its own `nextTick`).
5. **Composed feature parts** — a widget composing parts that have their own
   test files stubs those parts and keeps only the wiring it owns under
   test; data widgets mount against contract mocks, and the state logic
   behind the contract gets its depth in the service tests.

Depth means logic paths, not line coverage: every `it` drives at least one
behavior — a state transition, a branch, an interaction. "Renders without
crashing" is not a test, and a covered line whose behavior was never
asserted is not tested.

## Gold standards

Replicate the matching file for the tier you're testing:

| Tier | File |
| --- | --- |
| utils | `tests/utils/passthrough.test.ts` |
| composables | `tests/composables/model.test.ts` |
| stores | `tests/stores/table.test.ts` |
| services | `tests/services/table.test.ts` |
| factories | `tests/factories/table.test.ts` |
| components/common (elements) | `tests/components/common/button.test.ts` |
| components/common (reka wrappers) | `tests/components/common/select/root.test.ts` |
| components/core | `tests/components/core/select.test.ts` |
| components/data | `tests/components/data/table/widget.test.ts` |

## Conventions

- Element wrappers: one thin `runElementSuite` call + a describe block for
  element-specific behavior only.
- No snapshots. Assert explicit DOM structure, attributes, text, and emitted
  payloads (`toEqual([[payload]])`, not just presence).
- No type casts or non-null assertions — restructure instead (guard +
  `throw new Error(...)` narrows naturally in tests).
- Generic SFCs don't instantiate through `mount()`/`h()` type inference:
  assign to a concretely-typed `FunctionalComponent<Props, Emits>` first
  (see the data widget gold standard) — never `as DefineComponent`.
- Don't re-test another file's depth: if you're re-deriving service logic in
  a widget test or wrapper behavior in a core test, you're at the wrong
  depth for that assertion.
