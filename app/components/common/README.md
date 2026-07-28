# Common components

Thin, typed wrappers over base elements — native HTML elements and, where
the platform doesn't ship the behavior, **reka-ui primitives** (see
[Behavioral elements](#behavioral-elements)). Each component renders one
semantic element (or a tiny composition) with **zero styling**, exposes a
uniform set of typed hooks (`f-*` class, `data-*` / `style` / `aria-*`
bindings), and leaves the CSS to the consuming app.

## Anatomy

Every component follows the same shape — [`button.vue`](./button.vue) +
[`types/common/button.ts`](../../types/common/button.ts):

```vue
<script setup lang="ts">
// Props: native attrs + the three channels
const {
  label,
  type = "button",
  disabled,
  modifiers,
  tokens,
  aria,
} = defineProps<ButtonProps>();

// Default slot is scoped with ctx spread as its props
defineSlots<ButtonSlots>();

const el = useTemplateRef<HTMLButtonElement>("el");

// The three channels merged into one reactive v-bind object; native
// elements forward nothing and state it
const bindings = useBindings<"button">(() => ({
  modifiers,
  tokens,
  aria,
  forward: {},
}));

// The view model: props + derived state, resolved to values. The name is
// the component's system identity — inherited by the context as `id`, and
// the entry point for system-level tracking in later iterations.
const ctx = useContext<ButtonContext>("button", () => ({
  label,
  type,
  disabled,
  modifiers,
  tokens,
  aria,
  bindings: bindings.value,
  el: el.value,
}));

// One ctx, two consumers: imperative (expose) + declarative (slot)
defineExpose({ ctx });
</script>

<template>
  <button
    ref="el"
    :type="type"
    :disabled="disabled"
    class="f-button"
    v-bind="bindings"
  >
    <slot v-bind="ctx">{{ label }}</slot>
  </button>
</template>
```

Each component's type file declares four types, in a fixed progression:

| Type        | Meaning                                                                | Built from                               |
| ----------- | ---------------------------------------------------------------------- | ---------------------------------------- |
| `XProps`    | authored surface: native attrs + `modifiers`/`tokens`/`aria`           | —                                        |
| `XBindings` | rendered `data-*` / `style` / `aria-*`                                 | [`Bindings<C>`](../../types/bindings.ts) |
| `XContext`  | the view model: `XProps & { bindings; el }`                            | `XProps`                                 |
| `XSlots`    | slotthrough contract: `{ default(props: XContext): VNode[] }`          | `XContext`                               |

Void components (no default slot) omit `XSlots` / `defineSlots` / `<slot>`.

## The three channels

Beyond its native attrs, a component's public surface is exactly three
orthogonal, contract-driven channels, merged into one `v-bind` by
[`useBindings`](../../composables/bindings.ts):

| Channel       | Prop type                                      | Renders to     | Composable                                       | Source of truth                 |
| ------------- | ---------------------------------------------- | -------------- | ------------------------------------------------ | ------------------------------- |
| **modifiers** | [`ModifierProps<C>`](../../types/modifiers.ts) | `data-*`       | [`useModifiers`](../../composables/modifiers.ts) | generated `ComponentModifiers`  |
| **tokens**    | [`TokenProps<C>`](../../types/tokens.ts)       | inline `style` | [`useTokens`](../../composables/tokens.ts)       | theme + registry `tokens` slots  |
| **aria**      | [`AriaProps<C>`](../../types/aria.ts)          | `aria-*`       | [`useAria`](../../composables/aria.ts)           | WAI-ARIA, keyed by role         |

All three are driven by the **single `Component` generic** (the registry id,
e.g. `"button"`):

```ts
useBindings<C extends Component, Props extends Record<string, any> = {}>(
  source: MaybeRefOrGetter<BindingsSource<C, Props>>,
) // → ComputedRef<data-* ∪ style ∪ aria-* ∪ Props>
```

A real composable: one reactive source in (`{ modifiers, tokens, aria,
forward }`), one computed out — components bind it directly, no hand-rolled
`computed` wrapper. `forward` is **required** so the returned
`Bindings<C, Props>` is always satisfied: native elements state
`forward: {}`; behavioral wrappers pass their filtered rest props.

Roles are resolved, not restated: each component's ARIA role is looked up in
its [`config/components.ts`](../../../config/components.ts) entry via
`ComponentRole<C>`, so
`aria?: AriaProps<"nav">` types against role `navigation` without the author
tracking a role. The registry itself is
[`config/components.ts`](../../../config/components.ts) →
[`types/component.ts`](../../types/component.ts).

The bindings system emits `aria-*` / `data-*` / `style` — **never the `role`
attribute**. Where an explicit `role` is needed on a neutral element, the
template renders it statically (Alert, Banner).

## Conventions

- **One `Component` generic, stated explicitly** — `useBindings<"button">(…)`,
  never inferred. `NoInfer` on all three params makes them pure validation
  sites.
- **`bindings` and `ctx` both come from reactive composables.**
  `useBindings` and `useContext` own their reactivity — the source getters
  read the reactive props, so the returned computeds track them. `ctx`
  resolves `bindings`/`el` to values so the exposed/slot surface is flat,
  and inherits its `useContext` name as `id` — every context self-identifies
  (`useContext<XContext>("<element>", …)`; behavioral parts use their
  registry key, e.g. `"select-trigger"`).
- **`el` uses an explicit element-type generic** —
  `useTemplateRef<HTMLXElement>("el")`.
- **No `.value` in templates** — refs are unwrapped in `<script setup>`; the
  template binds `bindings` / `ctx` directly.
- **ARIA lives in the `aria` channel**, not in named props. Icon and Anchor
  additionally derive aria from behavior (Icon: `label` →
  `aria-hidden`/`aria-label`/`role`; Anchor: `disabled` →
  `aria-disabled`/`aria-current`); the channel `v-bind` comes last, so it can
  override the derived values.
- **`label`** is the default-slot fallback: `<slot v-bind="ctx">{{ label }}</slot>`.
- **Slots receive `ctx` spread** — `<slot v-bind="ctx">`, so consumers destructure
  fields directly (`#default="{ label }"`) without unwrapping a `ctx` prop.

### Special cases

- **Anchor** renders `NuxtLink`, so `el` is a `ComponentPublicInstance` rather
  than a DOM node — reach the `<a>` via `el?.$el`.
- **Void** components (Hr, Icon, Img, Input, Textarea) have no slot.

## Behavioral elements

reka-ui primitives are wrapped as first-class elements, one subdirectory per
family ([`select/`](./select) + [`types/common/select/`](../../types/common/select)
is the reference), so core components compose only foundation elements and
reka stays an implementation detail of this tier. Props **intersect** reka's
exported types with the channels — our mechanisms are additive, nothing reka
declares is re-written:

```ts
export type SelectTriggerProps = RekaSelectTriggerProps & {
  modifiers?: ModifierProps<"select-trigger">;
  tokens?: TokenProps<"select-trigger">;
  aria?: AriaProps<"select-trigger">;
};
```

Two flavors, split by whether the primitive renders an element:

- **Element-rendering** (`select/trigger`, `content`, `item`, `item-text`,
  `checkbox/root`) — the full native anatomy: channels via `useBindings`, an
  owned `f-<family>-<part>` class, ctx + expose. The channel props are
  destructured off; everything else is filtered through reka's
  `useForwardProps` at setup scope and rides into `useBindings` as the
  `forward` key, typed by the component's `XForward` alias — one clean
  `v-bind="bindings"`.
- **Renderless coordinators** (`select/root`, `select/portal`) — no element,
  so no channels and no registry entry; props re-export reka's verbatim and
  forward through the same filter: `v-bind="forward"`.

**Forwarding always goes through `useForwardProps`.** Vue casts absent
boolean props to `false` at `defineProps`, so a raw rest spread would
forward `false` over reka's own `true` defaults (`avoidCollisions`,
`rovingFocus`, `loop`, …). `useForwardProps` filters to the props actually
passed on the vnode, so reka's defaults survive; it consults the current
instance, which is why it must be called at setup scope — never inside a
computed getter.

Independent of flavor, anything v-model-able (`select/root`'s
`modelValue` / `open`, `checkbox/root`'s `modelValue`) runs through
[`useModel`](../../composables/model.ts) as a `$`-prefixed ref, with the
prop + `update:X` emit pair typed from reka's own `XEmits`. The ref
**v-models straight onto the primitive** (`v-model="$model"`,
`v-model:open="$open"`) and ctx carries the writable refs so slot and expose
consumers can drive state. `bindings` is the channels feature and nothing
else — model wiring never rides in it.

**Concepts stay named.** `$model` (state), `forward` (filtered rest), and
the three channels each keep their own identity in script. They meet inside
`useBindings` — sanctioned because the type declares it:
`Bindings<C, XForward>` says exactly which forwarded surface rides along
with the channels. Models never enter `bindings`; they wire with
`v-model="$model"` beside the single `v-bind="bindings"`.

Conventions on top of the native ones:

- **Registration**: element-rendering wrappers add a kebab-case entry to
  [`config/components.ts`](../../../config/components.ts) with its role and
  events (`select-trigger` →
  `combobox`). Modifier/token axes resolve to `never` until a consumer
  schema declares them — registration is what makes the channels
  *available*.
- **Vocabulary**: wrappers speak reka's types (`AcceptableValue`, no
  coercion). Translating payloads into a component vocabulary (`String(v)`)
  is the core tier's job.
- **Emits are declared only where `useModel` needs them** (root). All other
  listeners fall through as attrs onto the reka primitive, which declares
  them itself.
- **`el` is a `ComponentPublicInstance`** — the Anchor special case,
  generalized. Reach the DOM via `el?.$el`; renderless coordinators have no
  element of their own.

## Manifest

47 native components plus the behavioral families below. Each renders
`class="f-<name>"`, exposes `ctx`, and (unless void) accepts a default slot
scoped with the spread `ctx` fields.

### Native elements

| Component                      | `el`                      | Role            | Slot | Notes                                          |
| ------------------------------ | ------------------------- | --------------- | :--: | ---------------------------------------------- |
| [Alert](./alert.vue)           | `HTMLDivElement`          | `alert`         |  ●   | static `role="alert"`                          |
| [Anchor](./anchor.vue)         | `ComponentPublicInstance` | `link`          |  ●   | renders `NuxtLink` · derived aria (`disabled`) |
| [Article](./article.vue)       | `HTMLElement`             | `article`       |  ●   |                                                |
| [Aside](./aside.vue)           | `HTMLElement`             | `complementary` |  ●   |                                                |
| [Banner](./banner.vue)         | `HTMLDivElement`          | `banner`        |  ●   | static `role="banner"`                         |
| [Blockquote](./blockquote.vue) | `HTMLQuoteElement`        | `blockquote`    |  ●   |                                                |
| [Button](./button.vue)         | `HTMLButtonElement`       | `button`        |  ●   | reference component                            |
| [Caption](./caption.vue)       | `HTMLDivElement`          | `caption`       |  ●   |                                                |
| [Card](./card.vue)             | `HTMLDivElement`          | `group`         |  ●   |                                                |
| [Chip](./chip.vue)             | `HTMLButtonElement`       | `button`        |  ●   |                                                |
| [Code](./code.vue)             | `HTMLElement`             | `code`          |  ●   |                                                |
| [Container](./container.vue)   | `HTMLDivElement`          | `generic`       |  ●   |                                                |
| [Del](./del.vue)               | `HTMLModElement`          | `deletion`      |  ●   |                                                |
| [Em](./em.vue)                 | `HTMLElement`             | `emphasis`      |  ●   |                                                |
| [Fieldset](./fieldset.vue)     | `HTMLFieldSetElement`     | `group`         |  ●   | `<legend>` · `disabled`                        |
| [Footer](./footer.vue)         | `HTMLElement`             | `contentinfo`   |  ●   |                                                |
| [Group](./group.vue)           | `HTMLDivElement`          | `group`         |  ●   |                                                |
| [H1](./h1.vue)–[H6](./h6.vue)  | `HTMLHeadingElement`      | `heading`       |  ●   | levels 1–6                                     |
| [Header](./header.vue)         | `HTMLElement`             | `banner`        |  ●   |                                                |
| [Hr](./hr.vue)                 | `HTMLHRElement`           | `separator`     |  ○   | void                                           |
| [Icon](./icon.vue)             | `SVGSVGElement`           | `img`           |  ○   | void · derived aria (`label`)                  |
| [Img](./img.vue)               | `HTMLImageElement`        | `img`           |  ○   | void                                           |
| [Input](./input.vue)           | `HTMLInputElement`        | `textbox`       |  ○   | void · form                                    |
| [Kbd](./kbd.vue)               | `HTMLElement`             | `generic`       |  ●   |                                                |
| [Label](./label.vue)           | `HTMLLabelElement`        | `generic`       |  ●   | `for` prop                                     |
| [Li](./li.vue)                 | `HTMLLIElement`           | `listitem`      |  ●   |                                                |
| [Main](./main.vue)             | `HTMLElement`             | `main`          |  ●   |                                                |
| [Nav](./nav.vue)               | `HTMLElement`             | `navigation`    |  ●   |                                                |
| [Ol](./ol.vue)                 | `HTMLOListElement`        | `list`          |  ●   |                                                |
| [P](./p.vue)                   | `HTMLParagraphElement`    | `paragraph`     |  ●   |                                                |
| [Pre](./pre.vue)               | `HTMLPreElement`          | `generic`       |  ●   |                                                |
| [Section](./section.vue)       | `HTMLElement`             | `region`        |  ●   |                                                |
| [Span](./span.vue)             | `HTMLSpanElement`         | `generic`       |  ●   |                                                |
| [Strong](./strong.vue)         | `HTMLElement`             | `strong`        |  ●   |                                                |
| [Table](./table.vue)           | `HTMLTableElement`        | `table`         |  ●   |                                                |
| [Tbody](./tbody.vue)           | `HTMLTableSectionElement` | `rowgroup`      |  ●   |                                                |
| [Td](./td.vue)                 | `HTMLTableCellElement`    | `cell`          |  ●   |                                                |
| [Textarea](./textarea.vue)     | `HTMLTextAreaElement`     | `textbox`       |  ○   | void · form                                    |
| [Th](./th.vue)                 | `HTMLTableCellElement`    | `columnheader`  |  ●   |                                                |
| [Thead](./thead.vue)           | `HTMLTableSectionElement` | `rowgroup`      |  ●   |                                                |
| [Tr](./tr.vue)                 | `HTMLTableRowElement`     | `row`           |  ●   |                                                |
| [Ul](./ul.vue)                 | `HTMLUListElement`        | `list`          |  ●   |                                                |

Legend: **Slot** ● = `ctx`-spread default slot · ○ = void (no slot).

### Behavioral elements

| Element                                   | Registry key       | Role       | Flavor     | Notes                         |
| ----------------------------------------- | ------------------ | ---------- | ---------- | ----------------------------- |
| [Select/Root](./select/root.vue)          | —                  | —          | renderless | models: `modelValue` · `open` |
| [Select/Trigger](./select/trigger.vue)    | `select-trigger`   | `combobox` | element    |                               |
| [Select/Portal](./select/portal.vue)      | —                  | —          | renderless |                               |
| [Select/Content](./select/content.vue)    | `select-content`   | `listbox`  | element    |                               |
| [Select/Item](./select/item.vue)          | `select-item`      | `option`   | element    |                               |
| [Select/ItemText](./select/item-text.vue) | `select-item-text` | `generic`  | element    |                               |
| [Listbox/Root](./listbox/root.vue)        | —                  | —          | renderless | model: `modelValue` (single or array) |
| [Listbox/Content](./listbox/content.vue)  | `listbox-content`  | `listbox`  | element    |                               |
| [Listbox/Filter](./listbox/filter.vue)    | `listbox-filter`   | `textbox`  | element    | void input · model: `modelValue` |
| [Listbox/Group](./listbox/group.vue)      | `listbox-group`    | `group`    | element    |                               |
| [Listbox/GroupLabel](./listbox/group-label.vue) | `listbox-group-label` | `generic` | element |                          |
| [Listbox/Item](./listbox/item.vue)        | `listbox-item`     | `option`   | element    |                               |
| [Checkbox/Root](./checkbox/root.vue)      | `checkbox-root`    | `checkbox` | element    | model: `modelValue`           |
| [RadioGroup/Root](./radio-group/root.vue) | `radio-group-root` | `radiogroup` | element  | model: `modelValue`           |
| [RadioGroup/Item](./radio-group/item.vue) | `radio-group-item` | `radio`    | element    |                               |
| [RadioGroup/Indicator](./radio-group/indicator.vue) | `radio-group-indicator` | `generic` | element |                    |
| [Tooltip/Provider](./tooltip/provider.vue) | —                 | —          | renderless | app-level delay context       |
| [Tooltip/Root](./tooltip/root.vue)        | —                  | —          | renderless | model: `open`                 |
| [Tooltip/Trigger](./tooltip/trigger.vue)  | `tooltip-trigger`  | `button`   | element    |                               |
| [Tooltip/Portal](./tooltip/portal.vue)    | —                  | —          | renderless |                               |
| [Tooltip/Content](./tooltip/content.vue)  | `tooltip-content`  | `tooltip`  | element    |                               |
| [Popover/Root](./popover/root.vue)        | —                  | —          | renderless | model: `open`                 |
| [Popover/Anchor](./popover/anchor.vue)    | `popover-anchor`   | `generic`  | element    |                               |
| [Popover/Trigger](./popover/trigger.vue)  | `popover-trigger`  | `button`   | element    |                               |
| [Popover/Portal](./popover/portal.vue)    | —                  | —          | renderless |                               |
| [Popover/Content](./popover/content.vue)  | `popover-content`  | `dialog`   | element    |                               |
| [Popover/Arrow](./popover/arrow.vue)      | `popover-arrow`    | `generic`  | element    |                               |
| [Popover/Close](./popover/close.vue)      | `popover-close`    | `button`   | element    |                               |
| [ToggleGroup/Root](./toggle-group/root.vue) | `toggle-group-root` | `group`  | element    | model: `modelValue`           |
| [ToggleGroup/Item](./toggle-group/item.vue) | `toggle-group-item` | `button` | element    |                               |
| [DropdownMenu/Root](./dropdown-menu/root.vue) | —                | —          | renderless | model: `open`                 |
| [DropdownMenu/Trigger](./dropdown-menu/trigger.vue) | `dropdown-menu-trigger` | `button` | element |                        |
| [DropdownMenu/Portal](./dropdown-menu/portal.vue) | —              | —          | renderless |                               |
| [DropdownMenu/Content](./dropdown-menu/content.vue) | `dropdown-menu-content` | `menu` | element |                          |
| [DropdownMenu/Group](./dropdown-menu/group.vue) | `dropdown-menu-group` | `group` | element |                               |
| [DropdownMenu/Label](./dropdown-menu/label.vue) | `dropdown-menu-label` | `generic` | element |                             |
| [DropdownMenu/Item](./dropdown-menu/item.vue) | `dropdown-menu-item` | `menuitem` | element |                               |
| [DropdownMenu/Separator](./dropdown-menu/separator.vue) | `dropdown-menu-separator` | `separator` | element |                |
| [Dialog/Root](./dialog/root.vue)          | —                  | —          | renderless | model: `open`                 |
| [Dialog/Portal](./dialog/portal.vue)      | —                  | —          | renderless |                               |
| [Dialog/Overlay](./dialog/overlay.vue)    | `dialog-overlay`   | `generic`  | element    |                               |
| [Dialog/Content](./dialog/content.vue)    | `dialog-content`   | `dialog`   | element    |                               |
| [Dialog/Title](./dialog/title.vue)        | `dialog-title`     | `heading`  | element    |                               |
| [Dialog/Description](./dialog/description.vue) | `dialog-description` | `paragraph` | element |                            |
| [Toast/Provider](./toast/provider.vue)   | —                  | —          | renderless | app-level duration/swipe context |
| [Toast/Root](./toast/root.vue)            | `toast-root`       | `status`   | element    | model: `open`                 |
| [Toast/Title](./toast/title.vue)          | `toast-title`      | `generic`  | element    |                               |
| [Toast/Description](./toast/description.vue) | `toast-description` | `generic` | element  |                               |
| [Toast/Close](./toast/close.vue)          | `toast-close`      | `button`   | element    |                               |
| [Toast/Viewport](./toast/viewport.vue)    | `toast-viewport`   | `region`   | element    |                               |
| [TagsInput/Root](./tags-input/root.vue)   | `tags-input-root`  | `group`    | element    | model: `modelValue`           |
| [TagsInput/Item](./tags-input/item.vue)   | `tags-input-item`  | `generic`  | element    |                               |
| [TagsInput/ItemText](./tags-input/item-text.vue) | `tags-input-item-text` | `generic` | element |                          |
| [TagsInput/ItemDelete](./tags-input/item-delete.vue) | `tags-input-item-delete` | `button` | element |                    |
| [TagsInput/Input](./tags-input/input.vue) | `tags-input-input` | `textbox`  | element    | void input                    |
| [Calendar/Root](./calendar/root.vue)      | `calendar-root`    | `group`    | element    | model: `modelValue` (explicit, required) · slot payload |
| [Calendar/Header](./calendar/header.vue)  | `calendar-header`  | `generic`  | element    |                               |
| [Calendar/Heading](./calendar/heading.vue) | `calendar-heading` | `generic` | element    | slot payload (`headingValue`) |
| [Calendar/Prev](./calendar/prev.vue)      | `calendar-prev`    | `button`   | element    | slot payload (`disabled`)     |
| [Calendar/Next](./calendar/next.vue)      | `calendar-next`    | `button`   | element    | slot payload (`disabled`)     |
| [Calendar/Grid](./calendar/grid.vue)      | `calendar-grid`    | `grid`     | element    |                               |
| [Calendar/GridHead](./calendar/grid-head.vue) | `calendar-grid-head` | `rowgroup` | element |                              |
| [Calendar/GridBody](./calendar/grid-body.vue) | `calendar-grid-body` | `rowgroup` | element |                              |
| [Calendar/GridRow](./calendar/grid-row.vue) | `calendar-grid-row` | `row`     | element    |                               |
| [Calendar/HeadCell](./calendar/head-cell.vue) | `calendar-head-cell` | `columnheader` | element |                          |
| [Calendar/Cell](./calendar/cell.vue)      | `calendar-cell`    | `cell`     | element    |                               |
| [Calendar/CellTrigger](./calendar/cell-trigger.vue) | `calendar-cell-trigger` | `button` | element | slot payload (`dayValue` + day states) |
| [RangeCalendar/*](./range-calendar)       | `range-calendar-*` | —          | element    | 12 parts mirroring the Calendar family; root model is `DateRange` (explicit, required) |
| [DatePicker/*](./date-picker)             | `date-picker-*`    | —          | element    | 17 parts: root (models: `modelValue` explicit/required + `open`) · field/input segments · trigger/content popover · calendar clone of the Calendar family |
| [DateRangePicker/*](./date-range-picker)  | `date-range-picker-*` | —       | element    | 17 parts mirroring the DatePicker family; root model is `DateRange` (explicit, required) · field payload splits `segments.start`/`segments.end` |

All behavioral elements accept a `ctx`-spread default slot; further families
land here as core migrations wrap the parts they compose.

## Source map

| Concern              | File                                                                                                            |
| -------------------- | --------------------------------------------------------------------------------------------------------------- |
| Channel composition  | [`composables/bindings.ts`](../../composables/bindings.ts)                                                      |
| Modifiers → `data-*` | [`composables/modifiers.ts`](../../composables/modifiers.ts) · [`types/modifiers.ts`](../../types/modifiers.ts) |
| Tokens → `style`     | [`composables/tokens.ts`](../../composables/tokens.ts) · [`types/tokens.ts`](../../types/tokens.ts)             |
| Aria → `aria-*`      | [`composables/aria.ts`](../../composables/aria.ts) · [`types/aria.ts`](../../types/aria.ts)                     |
| `Bindings<C>`        | [`types/bindings.ts`](../../types/bindings.ts)                                                                  |
| Component registry   | [`config/components.ts`](../../../config/components.ts) · [`types/component.ts`](../../types/component.ts)      |
| Model fallback       | [`composables/model.ts`](../../composables/model.ts) (`useModel`)                                               |
| Reference component  | [`button.vue`](./button.vue) · [`types/common/button.ts`](../../types/common/button.ts)                         |
| Behavioral reference | [`select/`](./select) · [`types/common/select/`](../../types/common/select)                                     |
