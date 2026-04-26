---
name: forge
description: >
  Conventions and playbooks for forge widgets in layers/forge/.
  Use when creating, reading, updating, or deleting files in layers/forge/app/.
  Widgets are factory-driven, stateful compositions with generics, decomposed
  sub-components, and full passthrough/slotthrough. If it needs no owned state
  or generics, the work belongs in alloy instead.
user-invocable: false
allowed-tools: Read Grep Glob Write Edit
---

# Forge — Widget Conventions

Follow the appropriate playbook based on the operation:

- Creating a new widget: follow [create.md](create.md) → cascades to [test.md](test.md)
- Finding the right widget: follow [read.md](read.md)
- Modifying a widget: follow [update.md](update.md) → cascades to [test.md](test.md)
- Removing a widget: follow [delete.md](delete.md) (includes test cleanup)
- Writing/updating tests: follow [test.md](test.md)

## What is a Widget?

A forge widget composes ore elements and alloy components into a **stateful,
generic** unit. It **owns state** — via factories that return reactive interfaces
backed by `useState()`. If it needs no owned state or generics, it belongs in alloy.

Every widget consists of:
- **Factory**: `layers/forge/app/factories/{widget}.ts` — `create{Widget}(id, config)` returns a composable
- **Schema**: `layers/forge/app/schemas/{widget}.ts` — zod schema for snapshot/persistence defaults
- **State interface**: `layers/forge/app/types/{widget}.ts` — the `{Widget}<T, K>` reactive interface + supporting types
- **Root component**: `layers/forge/app/components/{Widget}/Widget.vue` — the consumer-facing entry point
- **Sub-components**: `layers/forge/app/components/{Widget}/{Part}.vue` — decomposed sections
- **Per-component type files**: `layers/forge/app/types/{widget}-{part}.ts` — passthrough + props per sub-component

## Factory Pattern

Factories are the heart of forge. The pattern:

```ts
export const create{Widget} = <T, K = unknown>(
  id: string,
  config: {Widget}Config<T, K>,
) => {
  return (): {Widget}<T, K> => {
    // Inject pre-fetched configs, validate with zod defaults
    const configs = inject(WIDGET_CONFIGS, {});
    const defaults = {Widget}SnapshotSchema.parse(configs[id] ?? {});

    // useState for all reactive state (keyed by id)
    const foo = useState<string>(`{widget}-${id}-foo`, () => defaults.foo);

    // Return the full reactive interface
    return { foo, /* ... */ };
  };
};
```

The factory returns a **composable function** (not the state directly). Consumers call it:
```ts
const useMyTable = createTable("my-table", { columns, rowKey, fetch });
const table = useMyTable();
```

Components accept the state interface as a prop:
```ts
defineProps<{Widget}Props<T, K>>();
```

## Decomposition

Forge widgets are decomposed into sub-components under a nested directory:

```
layers/forge/app/
  components/{Widget}/
    Widget.vue          — root component (consumer entry point)
    {Part}.vue          — sub-components (Head, Body, Filters, etc.)
  types/
    {widget}.ts         — shared types (state interface, config, supporting types)
    {widget}-widget.ts  — root component passthrough + props
    {widget}-{part}.ts  — sub-component passthrough + props
  factories/
    {widget}.ts         — factory function
  schemas/
    {widget}.ts         — zod schemas for persistence
  composables/
    {widget-composable}.ts — widget-specific composables
  utils/
    {widget-util}.ts    — pure utility functions
```

Each sub-component:
- Accepts the state interface (`{Widget}<T, K>`) + its own passthrough
- Has its own type file with `{Widget}{Part}Passthrough` and `{Widget}{Part}Props`
- Uses `generic="T, K = unknown"` in `<script setup>`
- Follows the same passthrough/slotthrough patterns as alloy

## Passthrough System

Same as alloy — every rendered element gets props/handlers through pt:
- **Ore elements**: `Passthrough<OreElementProps>`
- **Alloy components**: `Passthrough<AlloyProps, AlloyEmits>`
- Sub-component passthrough is nested: root pt includes `{part}?: {Widget}{Part}Passthrough`

The root Widget.vue forwards sub-component pt slices:
```vue
<{Widget}Head :table="table" :pt="pt?.head" />
```

## Slotthrough System

Named slots at every level. The root Widget.vue:
- Exposes top-level named slots (toolbar, pagination, etc.)
- Forwards scoped slots to sub-components via `v-for="(_, name) in $slots"`
- Sub-components expose their own named slots (cell, header, empty, etc.)

## Hooks

Widgets can declare Nuxt runtime hooks in `layers/forge/app/hooks.d.ts`:
```ts
declare module "#app" {
  interface RuntimeNuxtHooks {
    "widget:{widget}:snapshot": (event: { id: string; snapshot: Snapshot }) => void;
  }
}
```

## Existing Widgets

Use `Glob` for `layers/forge/app/components/*/Widget.vue` to list current widgets.

## Rules

1. Never duplicate an existing widget's purpose
2. Generics (T, K) must be preserved — never remove or cast away
3. All state lives in the factory via `useState()` — no component-local state for domain data
4. Each sub-component gets its own type file with Passthrough and Props
5. Every rendered element gets a pt key AND follows alloy's passthrough conventions
6. Props types for generic components must be named interfaces (vue-tsc constraint)
7. Split script pattern: imports in `<script lang="ts">`, logic in `<script setup lang="ts">`
8. All alloy components explicitly imported, never auto-registered
9. Schema defaults via zod `.default()` — no hardcoded fallbacks in factories
10. `f-{widget}-{part}` classes on every element — sole styling hooks
