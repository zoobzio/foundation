# Common components

Thin, typed wrappers over native HTML elements. Each component renders one
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

// Default slot is scoped as { ctx }
defineSlots<ButtonSlots>();

const el = useTemplateRef<HTMLButtonElement>("el");

// The three channels merged into one flat v-bind object
const bindings = computed<ButtonBindings>(() =>
  useBindings<"button">(modifiers, tokens, aria),
);

// The view model: props + derived state, resolved to values
const ctx = computed<ButtonContext>(() => ({
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
    <slot :ctx="ctx">{{ label }}</slot>
  </button>
</template>
```

Each component's type file declares four types, in a fixed progression:

| Type        | Meaning                                                                | Built from                               |
| ----------- | ---------------------------------------------------------------------- | ---------------------------------------- |
| `XProps`    | authored surface: native attrs + `modifiers`/`tokens`/`aria`           | —                                        |
| `XBindings` | rendered `data-*` / `style` / `aria-*`                                 | [`Bindings<C>`](../../types/bindings.ts) |
| `XContext`  | the view model: `XProps & { bindings; el }`                            | `XProps`                                 |
| `XSlots`    | slotthrough contract: `{ default(props: { ctx: XContext }): VNode[] }` | `XContext`                               |

Void components (no default slot) omit `XSlots` / `defineSlots` / `<slot>`.

## The three channels

Beyond its native attrs, a component's public surface is exactly three
orthogonal, contract-driven channels, merged into one `v-bind` by
[`useBindings`](../../composables/bindings.ts):

| Channel       | Prop type                                      | Renders to     | Composable                                       | Source of truth                 |
| ------------- | ---------------------------------------------- | -------------- | ------------------------------------------------ | ------------------------------- |
| **modifiers** | [`ModifierProps<C>`](../../types/modifiers.ts) | `data-*`       | [`useModifiers`](../../composables/modifiers.ts) | generated `ComponentModifiers`  |
| **tokens**    | [`TokenProps<C>`](../../types/tokens.ts)       | inline `style` | [`useTokens`](../../composables/tokens.ts)       | theme + `dtcg` component tokens |
| **aria**      | [`AriaProps<C>`](../../types/aria.ts)          | `aria-*`       | [`useAria`](../../composables/aria.ts)           | WAI-ARIA, keyed by role         |

All three are driven by the **single `Component` generic** (the registry id,
e.g. `"button"`):

```ts
useBindings<C extends Component>(
  modifiers?: NoInfer<ModifierProps<C>>,
  tokens?:    NoInfer<TokenProps<C>>,
  aria?:      NoInfer<AriaProps<C>>,
) // → data-* ∪ style ∪ aria-*
```

Roles are resolved, not restated: each component's ARIA role is looked up in
[`config/roles.ts`](../../../config/roles.ts) via `ComponentRole<C>`, so
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
- **`bindings` and `ctx` are `computed`.** Their getters read the reactive
  props directly, so they track prop changes. `ctx` resolves `bindings`/`el`
  to values so the exposed/slot surface is flat.
- **`el` uses an explicit element-type generic** —
  `useTemplateRef<HTMLXElement>("el")`.
- **No `.value` in templates** — refs are unwrapped in `<script setup>`; the
  template binds `bindings` / `ctx` directly.
- **ARIA lives in the `aria` channel**, not in named props. Icon and Anchor
  additionally derive aria from behavior (Icon: `label` →
  `aria-hidden`/`aria-label`/`role`; Anchor: `disabled` →
  `aria-disabled`/`aria-current`); the channel `v-bind` comes last, so it can
  override the derived values.
- **`label`** is the default-slot fallback: `<slot :ctx>{{ label }}</slot>`.

### Special cases

- **Anchor** renders `NuxtLink`, so `el` is a `ComponentPublicInstance` rather
  than a DOM node — reach the `<a>` via `el?.$el`.
- **Void** components (Hr, Icon, Img, Input, Textarea) have no slot.

## Manifest

47 components. Each renders `class="f-<name>"`, exposes `ctx`, and (unless
void) accepts a `{ ctx }`-scoped default slot.

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

Legend: **Slot** ● = `{ ctx }`-scoped default slot · ○ = void (no slot).

## Source map

| Concern              | File                                                                                                            |
| -------------------- | --------------------------------------------------------------------------------------------------------------- |
| Channel composition  | [`composables/bindings.ts`](../../composables/bindings.ts)                                                      |
| Modifiers → `data-*` | [`composables/modifiers.ts`](../../composables/modifiers.ts) · [`types/modifiers.ts`](../../types/modifiers.ts) |
| Tokens → `style`     | [`composables/tokens.ts`](../../composables/tokens.ts) · [`types/tokens.ts`](../../types/tokens.ts)             |
| Aria → `aria-*`      | [`composables/aria.ts`](../../composables/aria.ts) · [`types/aria.ts`](../../types/aria.ts)                     |
| `Bindings<C>`        | [`types/bindings.ts`](../../types/bindings.ts)                                                                  |
| Component registry   | [`config/components.ts`](../../../config/components.ts) · [`types/component.ts`](../../types/component.ts)      |
| Component → role map | [`config/roles.ts`](../../../config/roles.ts)                                                                   |
| Reference component  | [`button.vue`](./button.vue) · [`types/common/button.ts`](../../types/common/button.ts)                         |
