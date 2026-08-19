# Core components

Stateless coordinators one tier above [common](../common/README.md). Each core
component composes **common elements** — native and
[behavioral](../common/README.md#behavioral-elements) alike — into one widget
with **zero styling**, and exposes every internal part for override through a
single **passthrough** system. reka-ui never appears in this tier: behavior
arrives already wrapped as behavioral elements, which own their `f-*` classes.

Where a common component's surface is the three bindings channels, a core
component's surface is its **part manifest**: the named pieces it renders
(`root`, `trigger`, `content`, `item`, …). Everything — the `pt` prop, the
local recipes, the resolved `settings`, and the slots — is keyed by the same
part names.

[`select.vue`](./select.vue) + [`types/core/select.ts`](../../types/core/select.ts)
is the reference implementation.

## Anatomy

```vue
<script lang="ts">
// type imports, then rendered components, then framework/composable imports
import type { SelectProps, SelectEmits, SelectPassthrough, SelectContext, SelectSlots }
  from "../../types/core/select";
import type { ComponentPublicInstance } from "vue";

import SelectRoot from "../common/select/root.vue";
import SelectTrigger from "../common/select/trigger.vue"; /* … */
import Icon from "../common/icon.vue";

import { computed, useTemplateRef } from "#imports";
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
    triggerIcon: { alias: open.value ? "chevron-up" : "chevron-down" },
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
  <SelectRoot ref="el" v-bind="settings.root">
    <slot name="trigger" v-bind="ctx">
      <SelectTrigger v-bind="settings.trigger">
        …
      </SelectTrigger>
    </slot>
    …
    <SelectItem v-bind="settings.item(option)">…</SelectItem>
  </SelectRoot>
</template>
```

Each component's type file declares five types, in a fixed progression:

| Type           | Meaning                                                                       | Built from                     |
| -------------- | ----------------------------------------------------------------------------- | ------------------------------ |
| `XPassthrough` | part manifest: one key per rendered part → `Passthrough<Props, Emits>`        | common element part types      |
| `XProps`       | authored surface: coordination props + `pt?: PT<XPassthrough>`                | `XPassthrough`                 |
| `XEmits`       | re-emitted events in the component's own vocabulary                           | —                              |
| `XContext`     | view model: props + derived state + `el` + resolved `settings`                | `XProps` + `XPassthrough`      |
| `XSlots`       | per-part slots, ctx spread (+ the item for iterated parts)                    | `XContext`                     |

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
types as the satisfied `XPassthrough`: required props (e.g. Icon's `alias`)
stay required-and-present in `settings` with no gymnastics.

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
takes over that wiring.

**Iterated parts** (`PassthroughIter<Item, Props>`) are recipe *callbacks* —
the local callback is the per-item default and a user-supplied callback
**replaces it entirely** (callbacks are not records, so the merge never looks
inside). A replacement owns the full per-item props, structural wiring
included. The template invokes the resolved part per item:
`v-bind="settings.item(option)"`.

## Template contract

- **One `v-bind` per part** — `v-bind="settings.<part>"`. Core templates add
  no classes: every part's `f-*` class is owned by the element rendering it
  (`f-select-trigger` by the behavioral wrapper, `f-span` by Span).
- **One slot per part, named after the part key**, scoped with the ctx spread
  (`v-bind="ctx"`); iterated slots add the item
  (`v-bind="{ ...ctx, option }"`). Same rule as common: consumers destructure
  fields directly, no unwrapping.
- **Slots wrap the default composition** — overriding a part's slot replaces
  that entire subtree (including any parts inside it); the consumer owns it
  from there.
- **No `.value` in templates** — `settings`/`ctx` are computeds bound
  directly.

## Context + expose

`ctx` is the single view model — props, derived state (`displayText`,
`open`), `el`, and the resolved `settings` so slot/expose consumers see fully
resolved parts. As in common, one ctx serves two consumers:
`defineExpose({ ctx })` (Vue's expose proxy unwraps the computed, so a parent
reads `ref.ctx` live, no `.value`) and the ctx-spread slots.

- **Models ride ctx as writable refs** — ctx carries the `useModel` refs
  themselves (`modelValue`, `open`), not value snapshots, so slot and expose
  consumers can drive state (`ctx.open.value = true`), with writes flowing
  through the same emit-or-fallback path. Derived read-only state
  (`displayText`) stays scalar.
- **`el` is a `ComponentPublicInstance`** — core roots are behavioral
  elements, not DOM nodes (the Anchor special case from common, everywhere).
  Reach the DOM via `el?.$el`, mindful that renderless coordinators have no
  element of their own.
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
- Every part appears in the recipe map, even when its recipe is empty (`{}`)
  — the map *is* the manifest.
- Slot names, pt keys, and settings keys always agree; part classes come
  from the elements themselves.

## Source map

| Concern                    | File                                                                                                   |
| -------------------------- | ------------------------------------------------------------------------------------------------------ |
| Passthrough types          | [`types/passthrough.ts`](../../types/passthrough.ts) (`Passthrough` · `PassthroughIter` · `PT`)        |
| Deep merge                 | [`utils/passthrough.ts`](../../utils/passthrough.ts)                                                   |
| Composable                 | [`composables/passthrough.ts`](../../composables/passthrough.ts)                                       |
| Model fallback             | [`composables/model.ts`](../../composables/model.ts) (`useModel`)                                      |
| Shared item types          | [`types/core/common.ts`](../../types/core/common.ts) (`Option` · `Link` · …)                           |
| Reference component        | [`select.vue`](./select.vue) · [`types/core/select.ts`](../../types/core/select.ts)                    |
