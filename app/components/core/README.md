# Core components

Stateless interactive coordinators. Each core component composes
[reka-ui](https://reka-ui.com) primitives and semantic HTML into one widget
with **zero styling**, and exposes its interactive parts for override through
a single **passthrough** system.

Every rendered piece is one of two kinds:

- **Behavioral parts** — reka-ui components (`SelectRoot`, `SelectTrigger`,
  `AccordionItem`, …), imported directly from `"reka-ui"`. These are the
  component's **part manifest**: everything — the `pt` prop, the local
  recipes, the resolved `settings`, and a named slot — is keyed by the same
  part names (`root`, `trigger`, `content`, `item`, …).
- **Semantic HTML** — native tags (`<span>`, `<button>`, `<div>`, `<kbd>`, …)
  written directly in the template. They are *not* parts: they carry no pt
  key and no settings entry. Their props are template expressions; consumers
  restyle them through their class or replace them through the enclosing
  slot.

Every rendered element owns a semantic class: `f-<kebab-name>` of the reka
component for behavioral parts (`f-select-trigger`), `f-<tag>` for native
tags (`f-span`). `*Portal` and `*Provider` components render no element and
carry no class. Icons render through the global `Icon` component
(`<Icon class="f-icon" fill="currentColor" :name="…" />` — `name` is typed to
the registered alias union); links render through the global `<NuxtLink>`.

A component whose template is pure semantic HTML (no behavioral parts) has no
passthrough system at all: no `pt` prop, no `XPassthrough` type, no
`settings`. Its surface is coordination props, emits, ctx, and slots.

[`select.vue`](./select.vue) + [`types/core/select.ts`](../../types/core/select.ts)
is the reference implementation.

## Anatomy

```vue
<script lang="ts">
// type imports, then rendered components, then framework/composable imports
import type { SelectProps, SelectEmits, SelectPassthrough, SelectContext, SelectSlots }
  from "../../types/core/select";
import type { ComponentPublicInstance } from "vue";

import { SelectRoot, SelectTrigger, SelectPortal, SelectContent, SelectItem } from "reka-ui";

import { useTemplateRef } from "#imports";
import { usePassthrough } from "../../composables/passthrough";
import { useModel } from "../../composables/model";
</script>

<script setup lang="ts">
const { modelValue, open: openProp, options, pt } = defineProps<SelectProps>();
const emit = defineEmits<SelectEmits>();
defineSlots<SelectSlots>();

const el = useTemplateRef<ComponentPublicInstance>("el");

// v-model-able state: the prop wins, internal state is the fallback
const model = useModel(() => modelValue, (v) => emit("update:modelValue", v));
const open = useModel(() => openProp, (v) => emit("update:open", v), { default: false });

// the part manifest: local recipes must satisfy every part; `pt` layers on
// top. A real composable — one reactive source in, the settings computed out.
const settings = usePassthrough<SelectPassthrough>(() => ({
  pt,
  recipes: {
    root: {
      modelValue: model.value,
      open: open.value,
      "onUpdate:modelValue": (v) => {
        model.value = String(v); // coercion at the reka boundary
      },
      "onUpdate:open": (v) => {
        open.value = v;
      },
    },
    trigger: {},
    // iterated part: a per-item recipe callback
    item: (option) => ({ value: option.value, disabled: option.disabled }),
    /* … every remaining part, even when empty … */
  },
}));

const ctx = useContext<SelectContext>("select", () => ({
  /* props */ options,
  /* models — the writable refs themselves */ modelValue: model, open,
  /* derived */ displayText: displayText.value,
  el: el.value,
  settings: settings.value,
}));

defineExpose({ ctx });
</script>

<template>
  <SelectRoot ref="el" class="f-select-root" v-bind="settings.root">
    <slot name="trigger" v-bind="ctx">
      <SelectTrigger class="f-select-trigger" v-bind="settings.trigger">
        <slot name="triggerLabel" v-bind="ctx">
          <span class="f-span">{{ displayText }}</span>
        </slot>
        <slot name="triggerIcon" v-bind="ctx">
          <Icon
            class="f-icon"
            fill="currentColor"
            :name="open ? 'chevron-up' : 'chevron-down'"
          />
        </slot>
      </SelectTrigger>
    </slot>
    <SelectPortal>
      …
      <SelectItem class="f-select-item" v-bind="settings.item(option)">…</SelectItem>
    </SelectPortal>
  </SelectRoot>
</template>
```

Each component's type file declares five types, in a fixed progression:

| Type           | Meaning                                                                       | Built from                     |
| -------------- | ----------------------------------------------------------------------------- | ------------------------------ |
| `XPassthrough` | part manifest: one key per behavioral part → `Passthrough<Props, Emits>`      | reka-ui `*Props` / `*Emits`    |
| `XProps`       | authored surface: coordination props + `pt?: PT<XPassthrough>`                | `XPassthrough`                 |
| `XEmits`       | re-emitted events in the component's own vocabulary                           | —                              |
| `XContext`     | view model: props + derived state + `el` + resolved `settings`                | `XProps` + `XPassthrough`      |
| `XSlots`       | per-region slots, ctx spread (+ the item for iterated regions)                | `XContext`                     |

Part types come straight from reka-ui's exports
(`Passthrough<SelectRootProps, SelectRootEmits>`); keep the `Emits` argument
exactly where reka declares one.

## The passthrough system

Three layers per part, merged by
[`usePassthrough`](../../composables/passthrough.ts) →
[`utils/passthrough.ts`](../../utils/passthrough.ts):

| Layer         | Type                              | Owner     | Role                                    |
| ------------- | --------------------------------- | --------- | --------------------------------------- |
| local recipes | `XPassthrough` (all keys required) | component | coordination logic + required props     |
| `pt` prop     | `PT<XPassthrough>` (deep partial) | consumer  | purely additive overrides               |
| `settings`    | `XPassthrough` (resolved)         | merge     | what the template binds                 |

Because the local layer must *satisfy* the full manifest — every part key,
every required prop — and the user layer is deep-partial, the merged result
types as the satisfied `XPassthrough`: required props stay
required-and-present in `settings` with no gymnastics.

**Merge semantics** (deep merge via `defu`, arrays adjusted):

- user value wins per key; local backfills where the user left `undefined`
- plain objects recurse (fresh objects — inputs never mutated; untouched
  parts pass through as local references)
- arrays, functions, and class instances **replace wholesale** — never merged
- user `null`/`undefined` values are treated as *not provided* (local wins)

**Handlers ride with props.** Emits are authored in listener-prop form
(`"onUpdate:modelValue"`), typed against the part's emits record by
[`Passthrough`](../../types/passthrough.ts), and flat-merged with props — so
the template needs exactly one `v-bind` per part, no `v-on`. Because user
overrides replace handlers wholesale, a consumer overriding a wired handler
takes over that wiring. Listeners for events reka does not declare belong on
the tag as template `@event` handlers, not in a recipe.

**Iterated parts** (`PassthroughIter<Item, Props>`) are recipe *callbacks* —
the local callback is the per-item default and a user-supplied callback
**replaces it entirely** (callbacks are not records, so the merge never looks
inside). A replacement owns the full per-item props, structural wiring
included. The template invokes the resolved part per item:
`v-bind="settings.item(option)"`.

## Template contract

- **One `v-bind` per behavioral part** — `v-bind="settings.<part>"`, with the
  part's `f-*` class written alongside on the same tag.
- **Semantic HTML binds inline** — native tags take their class, attributes
  (`:disabled`, `:aria-current`, …), handlers (`@click`), and text content as
  ordinary template expressions. No settings entry, no pt key.
- **One slot per region, named after the region**, scoped with the ctx spread
  (`v-bind="ctx"`); iterated slots add the item
  (`v-bind="{ ...ctx, option }"`). Consumers destructure fields directly, no
  unwrapping. Regions rendered as semantic HTML keep their named slots — the
  markup is the slot's fallback content.
- **Slots wrap the default composition** — overriding a region's slot
  replaces that entire subtree (including any parts inside it); the consumer
  owns it from there.
- **No `.value` in templates** — `settings`/`ctx` are computeds bound
  directly; refs auto-unwrap.

## Context + expose

`ctx` is the single view model — props, derived state (`displayText`,
`open`), `el`, and the resolved `settings` so slot/expose consumers see fully
resolved parts. One ctx serves two consumers: `defineExpose({ ctx })` (Vue's
expose proxy unwraps the computed, so a parent reads `ref.ctx` live, no
`.value`) and the ctx-spread slots.

- **Models ride ctx as writable refs** — ctx carries the `useModel` refs
  themselves (`modelValue`, `open`), not value snapshots, so slot and expose
  consumers can drive state (`ctx.open.value = true`), with writes flowing
  through the same emit-or-fallback path. Derived read-only state
  (`displayText`) stays scalar.
- **`el` matches the root** — a reka root yields a `ComponentPublicInstance`
  (reach the DOM via `el?.$el`, mindful that renderless coordinators have no
  element of their own); a native root yields its DOM type
  (`HTMLDivElement`, `HTMLButtonElement`, …). `XContext` declares whichever
  applies.
- **Child state is controllable, never merely internal** — any state a child
  owns (e.g. `open`) is a prop + `update:X` emit pair declared in
  `XProps`/`XEmits`, so consumers can drive it with `v-model:X`.
  [`useModel`](../../composables/model.ts) abstracts the dance: reads resolve
  prop-over-internal-fallback (`null`/`undefined` count as *not provided*,
  matching the merge semantics), writes update the fallback *and* emit. The
  recipe binds `model.value` down to the child part — controlled either way —
  and its `onUpdate:X` handler writes the model, coercing reka payloads to
  the component's vocabulary at the boundary (`String(v)`).
- **Emits re-emit in the component's vocabulary** — reka payloads are
  coerced at the boundary (`String(v)`) so `XEmits` stays the public
  contract.

## Definitions

Every composite ships a `define<Name>` constructor in
`definitions/<name>.ts`: `<Name>Definition` is
`Definition<XProps, XEmits>` ([`types/definition.ts`](../../types/definition.ts))
— the component's props plus emit listeners in `on*` form, a static
declaration a template `v-bind`s:

```ts
const picker = defineSelect({ options, "onUpdate:modelValue": (v) => {} });
```

```vue
<Select v-bind="picker" />
```

Definitions are pure data at module scope (the identity function is the type
checkpoint), declared as named consts and composed by reference. The same
object is what an [adapter](../data/README.md#the-adapter) captures as
`settings` when a composite becomes page furniture.

## Conventions

- **State the generic explicitly** — `usePassthrough<XPassthrough>(…)`; the
  local recipe map is then checked against the full manifest.
- `pt ?? {}` — the user layer is optional; the recipe map never is.
- **Boolean model props declare `= undefined` in the destructure** — Vue
  casts an absent boolean prop to `false`, which would make `useModel` read
  every mount as controlled-at-false. An explicit `undefined` default
  suppresses the cast so "not provided" stays detectable.
- Every behavioral part appears in the recipe map, even when its recipe is
  empty (`{}`) — the map *is* the manifest.
- Slot names, pt keys, and settings keys always agree.
- Data-driven required props narrow structurally — an `Icon` whose alias
  comes from item data binds `:name="item.icon!"` inside
  `v-if="item.icon"`.

## Source map

| Concern                    | File                                                                                                   |
| -------------------------- | ------------------------------------------------------------------------------------------------------ |
| Passthrough types          | [`types/passthrough.ts`](../../types/passthrough.ts) (`Passthrough` · `PassthroughIter` · `PT`)        |
| Deep merge                 | [`utils/passthrough.ts`](../../utils/passthrough.ts)                                                   |
| Composable                 | [`composables/passthrough.ts`](../../composables/passthrough.ts)                                       |
| Model fallback             | [`composables/model.ts`](../../composables/model.ts) (`useModel`)                                      |
| Shared item types          | [`types/core/common.ts`](../../types/core/common.ts) (`Option` · `Link` · …)                           |
| Reference component        | [`select.vue`](./select.vue) · [`types/core/select.ts`](../../types/core/select.ts)                    |
