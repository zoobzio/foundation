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
the [components README](./src/components/README.md);
`select.vue` is the reference implementation there and the first component
here.

## Usage

```ts
import Select from "@zoobzio/vue/components/select.vue";
import { defineSelect } from "@zoobzio/vue/definitions/select";
import type { SelectProps } from "@zoobzio/vue/types/components/select";
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
  components/        — interactive components (32) plus the stateless data components: the table (table.vue and its table-* parts) and the form (form.vue and form-field.vue)
  composables/       — usePassthrough, useForward, useModel, useContext, useSelection, useSearch, useScroller, useDrag, useKeywords, usePaginate, useServiceRefs, useServiceEmits
  definitions/       — define<Name>(definition | source) constructors
  types/             — common, events, passthrough, forward, slots, context, definition; per-component types in core/
  utils/             — passthrough merge, forward render, define runtime, date, keywords, paginate
  constants/         — constants by domain: date, filter, pagination, popper, scroll, selection
tests/               — vitest + happy-dom, mirroring src/ path-for-path
```

Items that can navigate carry an optional `link` (`LinkTarget`: `to`,
`target`) and render as a plain anchor.

## Data components

`table.vue` renders a headless `@zoobzio/table` service. The component owns
no feature state: it reads the service, calls its methods, and relays its
`updated` and `filtered` events as emits. The service's state container
must be reactive for the table to update.

```ts
import { reactive } from "vue";
import { TableService, createTableState } from "@zoobzio/table";
import Table from "@zoobzio/vue/components/table.vue";

const config = { columns, rowKey: "id" };
const state = reactive(createTableState(config));
const service = new TableService("users", config, state, { fetch });
service.init();
```

```vue
<Table :service="service" @updated="onUpdated" />
```

`form.vue` renders a headless `@zoobzio/form` service the same way: one
`form-field.vue` per config field, each resolved to the control its `type`
names (`input`, `textarea`, `select`, `multiSelect`, `checkbox`, `radio`,
`datePicker`, `tagsInput`), with the lifecycle events (`initialized`,
`submitted`, `rejected`, `restored`, `reset`, `failed`) relayed as emits.
Field passthrough is keyed by payload key under `pt.fields`; a field slot
given to the form overrides that region in every field.

```ts
import { reactive } from "vue";
import { FormService, createFormState } from "@zoobzio/form";
import Form from "@zoobzio/vue/components/form.vue";

const config = { title, fields, schema, defaults };
const state = reactive(createFormState(config));
const service = new FormService("profile", config, state, { submit });
```

```vue
<Form
  :service="service"
  :pt="{ fields: { name: { input: { autofocus: true } } } }"
  @submitted="onSubmitted"
/>
```
