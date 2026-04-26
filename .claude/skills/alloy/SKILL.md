---
name: alloy
description: >
  Conventions and playbooks for alloy components in layers/alloy/.
  Use when creating, reading, updating, or deleting files in layers/alloy/app/.
  Components combine ore elements and reka-ui primitives with full passthrough and
  slotthrough for total consumer control. If it needs owned state or generics,
  the work belongs in forge instead.
user-invocable: false
allowed-tools: Read Grep Glob Write Edit
---

# Alloy — Component Conventions

Follow the appropriate playbook based on the operation:

- Creating a new component: follow [create.md](create.md) → cascades to [test.md](test.md)
- Finding the right component: follow [read.md](read.md)
- Modifying a component: follow [update.md](update.md) → cascades to [test.md](test.md)
- Removing a component: follow [delete.md](delete.md) (includes test cleanup)
- Writing/updating tests: follow [test.md](test.md)

## What is a Component?

An alloy component composes ore elements and reka-ui primitives into a stateless
functional unit. It has **no owned state** — no `useState()`, no stores, no factories.
If it needs those, it belongs in forge.

Every component consists of:
- **Type file**: `layers/alloy/app/types/{name}.ts`
- **Component file**: `layers/alloy/app/components/{Name}.vue`
- **Recipe composable**: entry in `layers/alloy/app/composables/recipe.ts`

## Type Contract

Every type file exports:
- `{Name}Passthrough` — one key per rendered element (ore, reka, or alloy)
- `{Name}Props` — includes `pt?: {Name}Passthrough` and explicit model props
- `{Name}Emits` — includes model update emits explicitly

Recipe composables live in `composables/recipe.ts`:
- `use{Name}(props, handlers)` — reactive, returns `ComputedRef<Recipe>`
- Accepts `MaybeRefOrGetter` for both args (plain object, ref, or getter)
- Built on `recipe()` util from `utils/recipe.ts` (static, non-reactive)

## Passthrough System

Every rendered element in the template gets props/handlers through pt:
- **Ore elements**: `Passthrough<OreElementProps>`
- **Reka primitives**: `Passthrough<RekaProps, RekaEmits>`
- **Alloy components**: `Passthrough<AlloyProps, AlloyEmits>`

Local defaults use `Recipe<P, E>` (props required). Parent overrides via
`Passthrough<P, E>` (all optional). Merge: `{ ...local, ...user }` — parent wins.

```ts
const rootPT = usePassthrough(pt?.root, {
  props: { modelValue: model.value, disabled },
  handlers: { "update:modelValue": (v) => { model.value = v; } },
});
```

**No direct prop bindings** alongside `v-bind="PT.props"`. All props flow through pt.
**No v-model** on pt-managed elements. Model value + handler go in pt.
**Native HTML attrs** (alt, placeholder, tabindex) are in `HtmlAttrs` and flow through pt.
**Per-item dynamic props**: factory functions calling `passthrough()` for loop/scoped-slot values.

## Slotthrough System

Every pt-managed element gets a **named slot** wrapping it with `v-bind="ctx"`.
No anonymous default slots in alloy — all slots are named.
Per-item loops get both a list-level slot and an item-level slot.

## Component Anatomy

**Split scripts**: reka-ui imports in `<script lang="ts">`, logic in `<script setup>`
**Explicit reka-ui imports**: never auto-registered
**`ctx` computed**: bundles all relevant state for slot bindings
**`f-{name}-{part}` classes**: sole styling hooks on every element
**`useTemplateRef("el")` + `defineExpose({ el })`**: ref forwarding

## Directory Structure

```
layers/alloy/app/
  components/{Name}.vue     — component files
  types/{name}.ts           — type contracts (Props, Emits, Passthrough)
  composables/
    passthrough.ts          — usePassthrough, useItemPassthrough (reactive pt merging)
    recipe.ts               — useX composables (reactive recipe builders)
  utils/
    passthrough.ts          — passthrough() static merge
    recipe.ts               — recipe() static builder
```

## Existing Components

Use `Glob` for `layers/alloy/app/components/*.vue` to list current components.

## Rules

1. Never duplicate an existing component's purpose
2. No owned state — if it needs useState/stores, redirect to /forge
3. No generics — if user types flow through, redirect to /forge
4. Every rendered element gets a pt key AND a named slot
5. All props flow through pt — no direct bindings alongside v-bind="PT.props"
6. No v-model on pt-managed elements — modelValue + handler in pt
7. Model props (modelValue, selected, open, etc.) must be explicit in Props and Emits types
8. Split script pattern: imports in `<script lang="ts">`, logic in `<script setup lang="ts">`
9. reka-ui explicitly imported, never auto-registered
10. All slots are named — no anonymous default slots
