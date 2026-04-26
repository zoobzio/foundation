# forge read

Find the right forge widget for a use case

## Step 1 — Understand Intent

Parse what the user is looking for. They may describe:
- A UI pattern ("I need a data grid with sorting and filtering")
- A stateful concern ("something that manages paginated server data")
- A specific widget by name ("show me DataTable")
- A feature ("filterable, sortable table with bulk actions")

If they name a specific widget, skip to Step 3.

## Step 2 — Decision Table

Match the user's intent against widget categories:

| Need | Widget | Key Differentiator |
|------|--------|-------------------|
| **Tabular data** | DataTable | Server-fetched, sortable, filterable, paginated, selectable, column management |

If the need doesn't require owned state or generics, redirect to `/alloy read`.
If no forge widget fits, suggest `/forge create`.

## Step 3 — Inspect

Read the matched widget's files:

**Types** — shared state interface and supporting types:
- `layers/forge/app/types/{widget}.ts`

**Factory** — how consumers create instances:
- `layers/forge/app/factories/{widget}.ts`

**Schema** — persistence/defaults:
- `layers/forge/app/schemas/{widget}.ts`

**Root component**:
- `layers/forge/app/components/{Widget}/Widget.vue`
- `layers/forge/app/types/{widget}-widget.ts`

**Sub-components** — list all:
- `Glob` for `layers/forge/app/components/{Widget}/*.vue`
- `Glob` for `layers/forge/app/types/{widget}-*.ts`

Present:
- Name, purpose, generic parameters
- State interface fields (reactive state, static config, computed getters, actions)
- Config interface (what consumers provide at creation)
- Sub-components and their roles
- Top-level passthrough keys (root Widget.vue)
- Sub-component passthrough keys (per sub-component)
- Named slots at each level
- Alloy components and ore elements composed

## Step 4 — Usage Context

Search for where this widget is used:
- `Grep` for `create{Widget}` in `layers/foundry/` and `apps/`
- `Grep` for `<{Widget}Widget` or `<DataTable` in templates
- Show 2-3 representative usages with file paths.
