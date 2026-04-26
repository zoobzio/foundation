# forge update

Modify an existing forge widget

## Step 1 — Resolve & Read

Find the widget by name. Read its files:
- `layers/forge/app/types/{widget}.ts` — shared types
- `layers/forge/app/factories/{widget}.ts` — factory
- `layers/forge/app/schemas/{widget}.ts` — schema
- `Glob` for `layers/forge/app/components/{Widget}/*.vue` — all components
- `Glob` for `layers/forge/app/types/{widget}-*.ts` — all type files

If the widget doesn't exist, stop and suggest `/forge create` instead.

## Step 2 — Parse Intent

Understand what the user wants to change:
- **Adding state** — new reactive fields in the factory/state interface
- **Adding a sub-component** — decomposing new functionality
- **Adding pt keys** — new passthrough entries on existing sub-components
- **Adding slots** — new named slots for consumer override
- **Adding props to config** — new consumer configuration options
- **Changing factory logic** — modifying state management, computed, actions
- **Adding composables/utils** — extracting reusable logic
- **Adding hooks** — new Nuxt runtime hooks
- **Other** — clarify before proceeding

## Step 3 — Validate

**Boundary check** — Does the change maintain forge conventions?
- New state must go through `useState()` in the factory, not component-local `ref()`
- Generics must be preserved — never remove or cast away T, K
- Props types must be named interfaces (vue-tsc constraint)

**Contract check** — Does the change maintain the passthrough/slot contract?
- Every new rendered element needs a pt key in its sub-component's Passthrough type
- Every new pt key needs a usePassthrough or passthrough() call
- Every new pt-managed element needs a `f-{widget}-{part}` class
- New sub-components need their own type file

**Schema check** — If adding state that should persist:
- Add field to zod schema with `.default()`
- Add to snapshot/restore in factory

**Downstream impact** — If changing the state interface, config, or component API:
- Search for factory usage (`create{Widget}`) in foundry and apps
- Search for component usage (`<{Widget}Widget`, `<DataTable`) in templates
- Report any consumers that depend on the current contract
- Flag breaking changes

## Step 4 — Present Plan

Show the user what will change using [the template](templates/update.md).
Include before/after for modified sections. Wait for confirmation.

## Step 5 — Execute

Only after user confirms, apply the changes across all affected files:
- State interface changes → update types, factory, schema, and components
- New sub-component → create type file, component file, update root Widget.vue
- New pt keys → update type file and component template

## Step 6 — Test

After updating the widget, follow [test.md](test.md) to update tests.
Run tests to verify: `npx vitest run layers/forge/tests/`
