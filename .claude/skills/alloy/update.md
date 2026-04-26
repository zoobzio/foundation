# alloy update

Modify an existing alloy component

## Step 1 — Resolve & Read

Find the component by name. Read both files:
- `layers/alloy/app/types/{name}.ts`
- `layers/alloy/app/components/{Name}.vue`

If the component doesn't exist, stop and suggest `/alloy create` instead.

## Step 2 — Parse Intent

Understand what the user wants to change:
- **Adding pt keys** — new passthrough entries for elements
- **Adding slots** — new named slots for consumer override
- **Adding props** — new configuration options
- **Adding model** — new v-model support
- **Changing reka-ui primitives** — swapping underlying behavior
- **Restructuring template** — changing element hierarchy
- **Other** — clarify before proceeding

## Step 3 — Validate

**Boundary check** — Does the change introduce owned state?
- Adding useState, stores, watchers on external data = redirect to forge
- Adding generics = redirect to forge

**Contract check** — Does the change maintain the alloy contract?
- Every new rendered element needs a pt key in Passthrough type
- Every new pt key needs a usePassthrough call with Recipe local defaults
- Every new pt-managed element needs a named slot with v-bind="ctx"
- New model props must be explicit in Props AND Emits types
- No direct prop bindings alongside v-bind="PT.props"
- No anonymous default slots

**Downstream impact** — If changing Props, Emits, or Passthrough types:
- Search for usages in alloy (alloy-to-alloy), forge, foundry, example
- Report any components that depend on the current contract
- Flag breaking changes

## Step 4 — Present Plan

Show the user what will change using [the template](templates/update.md).
Include before/after for modified sections. Wait for confirmation.

## Step 5 — Execute

Only after user confirms, apply the changes to both type and component files.

## Step 6 — Test

After updating the component, follow [test.md](test.md) to update the test file.
Add tests for new pt keys/slots, remove tests for removed elements, update assertions.
Run the test to verify: `npx vitest run layers/alloy/tests/components/{Name}.test.ts`
