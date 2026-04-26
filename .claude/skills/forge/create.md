# forge create

Create a new forge widget from the user's description

## Step 1 — Parse Intent

Extract from the description:
- **Widget name** — what is the PascalCase name? (e.g., DataTable, KanbanBoard)
- **Semantic purpose** — what does this widget do?
- **User types** — what generics does the consumer provide? (T for row data, K for key, etc.)
- **State shape** — what reactive state does the factory manage?
- **Config** — what does the consumer configure at factory creation time?
- **Fetch** — does it need an async data source?
- **Sub-components** — how should the widget decompose? (toolbar, body, pagination, etc.)
- **Alloy components used** — which alloy components compose the template?
- **Ore elements used** — which ore elements compose the template?

## Step 2 — Validate

Before proceeding, check ALL of the following. If any fail, stop and explain why.

**Boundary check** — Does this need owned state?
- No `useState()`, no factories, no persistence = belongs in **alloy**, not forge
- No generics needed = probably belongs in **alloy**
- Needs both state AND generics = confirmed forge

**Overlap check** — Use `Glob` for `layers/forge/app/components/*/Widget.vue` to list existing widgets.

Ask: does an existing widget already serve this purpose?
- Data table/grid → DataTable

If there's overlap, explain which existing widget covers the use case.

**Name check** — Does the name conflict with:
- Alloy components (check `layers/alloy/app/components/`)
- Ore elements (check `layers/ore/app/components/`)
- Other forge widgets

**Decomposition check** — Plan the sub-component breakdown:
- Each section with its own passthrough concerns should be a sub-component
- Sections with complex logic should be extracted
- Keep the root Widget.vue as an orchestrator, not a monolith

## Step 3 — Present Plan

Show the user what will be created using [the template](templates/create.md).
Fill in all fields. Wait for confirmation before writing any files.

## Step 4 — Execute

Only after user confirms:

1. Create `layers/forge/app/types/{widget}.ts` — shared types (state interface, config, supporting types)
2. Create `layers/forge/app/types/{widget}-widget.ts` — root component passthrough + props
3. Create `layers/forge/app/types/{widget}-{part}.ts` — per sub-component type files
4. Create `layers/forge/app/schemas/{widget}.ts` — zod schema with defaults
5. Create `layers/forge/app/factories/{widget}.ts` — factory function
6. Create `layers/forge/app/components/{Widget}/Widget.vue` — root component
7. Create `layers/forge/app/components/{Widget}/{Part}.vue` — sub-components
8. Create composables/utils if needed

Follow the exact patterns from existing widgets. Reference DataTable as the primary analog.

Ensure:
- Factory returns a composable, not raw state
- All state uses `useState()` keyed by `${widget}-${id}-${field}`
- Schema provides all defaults via zod `.default()`
- Every sub-component accepts the state interface + its own passthrough
- Generics flow through: factory → state interface → component props → template
- Per-component type files with named Props interfaces
- Every rendered element has a pt key and `f-{widget}-{part}` class
- Root Widget.vue forwards sub-component pt slices and slots

## Step 5 — Test

After creating the widget, follow [test.md](test.md) to generate test files.
Run tests to verify: `npx vitest run layers/forge/tests/`
