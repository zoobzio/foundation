---
name: ore
description: >
  Conventions and playbooks for ore elements in layers/ore/.
  Use when creating, reading, updating, or deleting files in layers/ore/app/.
  Elements are behavior-free HTML wrappers with a modifier system.
  If JS behavior is needed, the work belongs in alloy instead.
user-invocable: false
allowed-tools: Read Grep Glob Write Edit
---

# Ore — Element Conventions

Follow the appropriate playbook based on the operation:

- Creating a new element: follow [create.md](create.md) → cascades to [test.md](test.md)
- Finding the right element: follow [read.md](read.md)
- Modifying an element: follow [update.md](update.md) → cascades to [test.md](test.md)
- Removing an element: follow [delete.md](delete.md) (includes test cleanup)
- Writing/updating tests: follow [test.md](test.md)

## What is an Element?

An ore element wraps exactly one HTML tag with Foundation's modifier system.
It has **no JavaScript behavior** — if it needs JS to function, it belongs in alloy.

Every element consists of:
- **Type file**: `layers/ore/app/types/{name}.ts` — exports `{Name}Props`
- **Component file**: `layers/ore/app/components/{Name}.vue`
- **Registration**: entry in `OreElements` union in `layers/ore/app/types/modifiers.ts`

## Modifier System

Six modifier props typed via module-augmented interfaces (default `never`):
`variant`, `size`, `color`, `radius`, `density`, `elevation`

Each binds to a `data-*` attribute. Consumers augment `OreVariants`, `OreSizes`,
`OreColors`, `OreRadius`, `OreDensity`, `OreElevation` to define allowed values.

## Element Anatomy

**Props**: modifiers + semantic props (label, src, icon, disabled, type, etc.)
**Component**: split script, `useTemplateRef("el")` + `defineExpose({ el })`,
single root with `class="f-{name}"`, modifier `data-*` bindings, default `<slot />`.

Void elements (img, hr, input) have no slot. Some compose `Icon` internally
(Alert, Banner, Caption, Chip) — allowed only if purely presentational.

## Existing Elements

Use `Glob` for `layers/ore/app/components/*.vue` to list all current elements.

## Rules

1. Never duplicate an existing element's semantic purpose
2. Every prop must be declarative — no interaction state, no callbacks
3. Icon composition is allowed only if presentational (no click handlers)
4. `f-{name}` class is the sole styling hook — no scoped styles
5. All elements expose `el` via `defineExpose({ el })`
6. Split script pattern: imports in `<script lang="ts">`, logic in `<script setup lang="ts">`
