# @zoobzio/vue

Vue 3 components for the foundation design system. Every framework symbol
is imported from `vue`, and the package ships its source (`src/`) through
subpath exports, the same way the layer ships `app/`.

Each core component composes [reka-ui](https://reka-ui.com) primitives and
semantic HTML into one unstyled widget (`f-*` classes), and exposes its
interactive parts through one **passthrough** system: a part manifest
(`XPassthrough`), the consumer's deep-partial `pt` prop, and the resolved
`settings` the template binds. A single `ctx` view model serves both
`defineExpose` and the ctx-scoped slots. The full contract is documented in
the layer's [core README](../../layers/foundation/app/components/core/README.md);
`select.vue` is the reference implementation there and the first component
here.

## Usage

```ts
import Select from "@zoobzio/vue/components/select.vue";
import { defineSelect } from "@zoobzio/vue/definitions/select";
import type { SelectProps } from "@zoobzio/vue/types/core/select";
```

```vue
<script setup lang="ts">
const picker = defineSelect({
  options: [
    { value: "a", label: "Apple" },
    { value: "b", label: "Banana" },
  ],
  "onUpdate:modelValue": (option) => console.log(option.value),
});
</script>

<template>
  <Select v-bind="picker" />
</template>
```

## Layout

```
src/
  components/        — interactive components (32)
  composables/       — usePassthrough, useModel, useContext, useSelection, useSearch, useScroller, useKeywords, usePaginate
  definitions/       — define<Name>(definition | source) constructors
  types/             — common, events, passthrough, context, definition; per-component types in core/
  utils/             — passthrough merge, define runtime, date, keywords, paginate
  constants/         — constants by domain: date, filter, pagination, popper, scroll, selection
tests/               — vitest + happy-dom, mirroring src/ path-for-path
```

Items that can navigate carry an optional `link` (`LinkTarget`: `to`,
`target`) and render as a plain anchor.
