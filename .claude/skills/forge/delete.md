# forge delete

Remove a forge widget

## Step 1 — Resolve

Find the widget by name. Verify it exists:
- `layers/forge/app/types/{widget}.ts`
- `layers/forge/app/factories/{widget}.ts`
- `layers/forge/app/schemas/{widget}.ts`
- `Glob` for `layers/forge/app/components/{Widget}/*.vue`
- `Glob` for `layers/forge/app/types/{widget}-*.ts`
- `Glob` for `layers/forge/app/composables/*{widget}*.ts`
- `Glob` for `layers/forge/app/utils/*{widget}*.ts`

If the widget doesn't exist, stop and report.

## Step 2 — Dependency Check

Search for ALL usages across the codebase. This is mandatory — never skip.

- `Grep` for `create{Widget}` (factory usage) in layers/foundry, apps/
- `Grep` for `<{Widget}Widget` or `<DataTable` (template usage) in layers/foundry, apps/
- `Grep` for `{Widget}Props` or `{Widget}Passthrough` (type imports) in the same locations
- `Grep` for `Table<` or `{Widget}<` (state interface usage)
- `Grep` for `widget:{widget}` (hook references) in layers/foundry, apps/

## Step 3 — Report

Present findings using [the template](templates/delete.md):
- List every file that references this widget
- Categorize: foundry workspaces, apps, other forge widgets

**If dependents exist**: report them and DO NOT proceed unless the user explicitly
confirms they want to remove the widget and handle the breakage.

**If no dependents**: confirm with the user before proceeding.

## Step 4 — Execute

Only after explicit user confirmation:

1. Delete `layers/forge/app/types/{widget}.ts`
2. Delete all `layers/forge/app/types/{widget}-*.ts`
3. Delete `layers/forge/app/factories/{widget}.ts`
4. Delete `layers/forge/app/schemas/{widget}.ts`
5. Delete all `layers/forge/app/components/{Widget}/*.vue`
6. Remove the `layers/forge/app/components/{Widget}/` directory
7. Delete any composables: `layers/forge/app/composables/*{widget}*.ts`
8. Delete any utils: `layers/forge/app/utils/*{widget}*.ts`
9. Remove hook declarations from `layers/forge/app/hooks.d.ts`
10. Delete all test files: `layers/forge/tests/**/{widget}*.test.ts`
