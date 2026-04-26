# alloy delete

Remove an alloy component

## Step 1 — Resolve

Find the component by name. Verify it exists:
- `layers/alloy/app/types/{name}.ts`
- `layers/alloy/app/components/{Name}.vue`

If the component doesn't exist, stop and report.

## Step 2 — Dependency Check

Search for ALL usages across the codebase. This is mandatory — never skip.

- `Grep` for `<{Name}` (template usage) in layers/alloy, layers/forge, layers/foundry, apps/
- `Grep` for `{Name}Props` or `{Name}Passthrough` (type import) in the same locations
- `Grep` for `Passthrough<{Name}Props` (alloy-to-alloy pt references)
- `Grep` for `define{Name}` (recipe factory usage)

## Step 3 — Report

Present findings using [the template](templates/delete.md):
- List every file that references this component
- Categorize: alloy-to-alloy, forge widgets, foundry, example app

**If dependents exist**: report them and DO NOT proceed unless the user explicitly
confirms they want to remove the component and handle the breakage.

**If no dependents**: confirm with the user before proceeding.

## Step 4 — Execute

Only after explicit user confirmation:

1. Delete `layers/alloy/app/types/{name}.ts`
2. Delete `layers/alloy/app/components/{Name}.vue`
3. Remove `use{Name}` entry from `layers/alloy/app/composables/recipe.ts`
4. Delete `layers/alloy/tests/components/{Name}.test.ts`
5. Remove fixture from `layers/alloy/tests/fixtures/index.ts` if present
6. Remove stub from `packages/testing/helpers/stubs.ts` alloyStubs
