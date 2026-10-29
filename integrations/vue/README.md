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
  components/        — interactive components (34) plus the stateless data components: the table (table.vue and its table-* parts), the form (form.vue and form-field.vue), the browser (browser.vue and its browser-* parts), the editor (editor.vue), and the code editor (code.vue)
  composables/       — usePassthrough, useForward, useModel, useContext, useSelection, useSearch, useScroller, useDrag, useKeywords, usePaginate, useServiceRefs, useServiceEmits, useEditor, useCode
  definitions/       — define<Name>(definition | source) constructors
  types/             — common, events, passthrough, forward, slots, context, definition, wrap; per-component types in core/
  utils/             — passthrough merge, forward render, wrap (a component with a pt layer and slot defaults), define runtime, date, file, keywords, paginate, table, browser, editor, code
  constants/         — constants by domain: date, filter, pagination, popper, scroll, selection, form, table, browser, editor, code
tests/               — vitest + happy-dom, mirroring src/ path-for-path
```

Items that can navigate carry an optional `link` (`LinkTarget`: `to`,
`target`) and render through a `link` part: a reka `Primitive` whose
recipe is a plain anchor. The part takes `LinkProps` (`as`, `asChild`, and
the anchor attributes), so `pt.link` swaps the element for a component
such as a router link, which receives the same `href` and `target`.

```vue
<Menu :groups="groups" :pt="{ link: () => ({ as: NuxtLink }) }" />
```

A framework layer that wants that on every instance wraps the component
with `wrap` (`utils/wrap`): a `pt` layer laid under the consumer's, and
slot defaults that fill in where the consumer renders no slot of that
name. The result is typed as the component itself, with its props, emits,
slots, and `ctx`, so it stands in for the component wherever the
component's name is served. The consumer's `pt` composes with the layer's
per key as `usePassthrough` lays a layer; a nested manifest is laid where
it sits by passing `pt` as a function of the consumer's. The option types
are read from the component, so a default takes the slot's own scope.

```ts
import Menu from "@zoobzio/vue/components/menu.vue";
import { wrap } from "@zoobzio/vue/utils/wrap";

export default wrap(Menu, {
  pt: { link: () => ({ as: RouterLink }) },
  slots: { itemLabel: ({ item }) => [h("b", item.label)] },
});
```

Where an icon belongs, a component has a `prepend` and an `append` slot
around the content rather than an icon slot: `itemPrepend` and
`itemAppend` around a menu item's label, `triggerPrepend` and
`triggerAppend` around a select's display, `prevPrepend` and `prevAppend`
around a calendar's previous control, and so on. Each receives the scope
of the content it sits beside. A component that renders another's
control forwards the pair under its own name, so a table's `refreshPrepend`
reaches the refresh button's `prepend`.

The item types a component takes (`MenuItem`, `TabsOption`,
`BreadcrumbItem`, `DirectoryItem`, `CommandOption`, …) are interfaces, so
a layer may widen one by declaration merging, and the widened field then
reaches the layer's slot defaults through the slot's scope. `TreeNode` is
the exception: it stays a type alias to satisfy reka's record bound.

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
`datePicker`, `tagsInput`, `fileInput`, `richText`), with the lifecycle
events (`initialized`, `submitted`, `rejected`, `restored`, `reset`,
`failed`) relayed as emits. The form's own submit recipe catches the
service's rejection, so a failed submit action reaches the consumer as the
`failed` emit and never as an unhandled rejection. Field passthrough is
keyed by payload key under `pt.fields`; a field slot given to the form
overrides that region in every field.

Each field renders its label, its control, its `hint` when the config sets
one, and its error once the field is touched and invalid, wired together by
ids derived from the form id and the field key (`ctx.ids`): the label's
`for` targets the control, a grouped control (radio, date picker, rich text)
names the label through `aria-labelledby`, and the control lists the hint
and the error in `aria-describedby` while each renders. A `label`, `hint`,
or `error` slot override keeps the association by reusing the ids.

A `file` or `multi-file` field renders `file-input.vue`: a native file
input with the picked files listed beneath it, each with a remove button.
The model is the list of files; a pick replaces it, as the native input
does, and a form reset clears the native list too. A `richtext` field
renders `rich-text.vue`: a v-model over the document as an HTML string,
with an `@zoobzio/editor` service the component owns behind it, rendered
through `editor.vue`. The field's `features` are the editor's config, an
edit writes the document through the `html` codec (`""` when empty), and a
model write from outside (a reset, a restore) replaces the document. Its
`pt` is the editor's manifest, laid under the component's own layer, and
the editor's slots relay.

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

`browser.vue` renders a headless `@zoobzio/browser` service: a breadcrumb
over the service's `trail`, then one headerless table with the folder rows
(`browser-folders.vue`) above the file rows (`browser-files.vue`), each a
`tbody` of its own so the columns line up. Folder clicks `open`, crumb
clicks `navigate`, row and folder menus dispatch by key through `runAction`
and `runFolderAction`, and the bulk actions bar runs `runBulkAction` over
the selection. The `updated` and `navigated` events relay as emits. Cell
slots cascade as the table's do (`cell:<key>`, `cell:<type>`, `cell`);
`noFiles` fills the empty file section, `empty` replaces the whole body once
a folder settles with neither folders nor files.

```ts
import { reactive } from "vue";
import { BrowserService, createBrowserState } from "@zoobzio/browser";
import Browser from "@zoobzio/vue/components/browser.vue";

const config = {
  columns,
  fileKey: "id",
  actions: { download: { label: "Download" } },
};
const state = reactive(createBrowserState());
const service = new BrowserService("assets", config, state, {
  fetch,
  actions: { download: (file) => save(file) },
});
service.init();
```

```vue
<Browser
  :service="service"
  :pt="{ files: { actionsTrigger: { label: 'More' } } }"
  @navigated="onNavigated"
>
  <template #folderLabel="{ folder }"><b>{{ folder.label }}</b></template>
</Browser>
```

`editor.vue` renders a headless `@zoobzio/editor` service: a toolbar with
one button per mark and node the service's schema holds (bold, italic,
headings by level, lists, quote, code block, rule, then undo and redo),
over a host `div` that shows the document as static HTML. The editor is
off until the user interacts: a pointer or keyboard focus on the host, or
a toolbar click, mounts the service's editor over the host in place, so
the content is readable from the first paint (server-rendered and hydrated
untouched) and turns editable with no visible change. The static copy
follows `load` while the editor is off. Each button runs the tool's
command and reports `aria-pressed` from the service's `active`. The
`loaded`, `updated`, `mounted`, and `unmounted` events relay as emits;
`data-mounted` on the root says the editor is on. `pt.tool` is built per
tool; the `tool` slot receives its tool; `toolbar`
replaces the whole bar, and its context carries `activate` for a custom
bar to turn the editor on.

`useEditor(service, host)` is the component's view model on its own, for a
consumer that renders the editor its own way: `markup`, the document as
static HTML that follows `load` while the editor is off and freezes at
mount; `tools`, the toolbar as data; and `activate`, which mounts the
editor over the host in place. Bind `markup` to the host's `innerHTML`,
`activate` to its `pointerdown` and `focus`, and give the host a
`tabindex`. The editor unmounts with the scope.

```ts
import { reactive } from "vue";
import { EditorService, createEditorState, hast } from "@zoobzio/editor";
import Editor from "@zoobzio/vue/components/editor.vue";

const config = { headings: [1, 2, 3] };
const state = reactive(createEditorState());
const service = new EditorService("body", config, state, hast);
service.load(tree);
```

```vue
<Editor
  :service="service"
  :pt="{ tool: (tool) => ({ title: tool.label }) }"
  @updated="onUpdated"
/>
```

`code.vue` renders a headless `@zoobzio/code` service: a host `div` that
shows the text static in a `pre`, and a status line that reports the
cursor as a line and a column. The editor is off until the user interacts:
a pointer or keyboard focus on the host mounts the service's CodeMirror
view in the host, in place of the static copy, so the text is readable
from the first paint (server-rendered and hydrated untouched) and turns
editable with the same text under a different DOM. A pointer places the
caret where it pressed; keyboard focus starts at the top. The static copy
follows `load` while the editor is off. The component decides nothing
about the look of the code: the language, the theme, the highlight style,
and the gutters are the service's extensions, the consumer's own. The
`loaded`, `updated`, `mounted`, and `unmounted` events relay as emits;
`data-mounted` on the root says the editor is on. The `status` slot
replaces the status line, and its context carries `activate`.

`useCode(service, host)` is the component's view model on its own, for a
consumer that renders the editor its own way: `markup`, the text in a
`pre` that follows `load` while the editor is off and freezes at mount;
and `activate`, which mounts the view in the host. Bind `markup` to the
host's `innerHTML`, `activate` to its `pointerdown` and `focus`, and give
the host a `tabindex`. The editor unmounts with the scope.

```ts
import { reactive } from "vue";
import { CodeService, createCodeState, text } from "@zoobzio/code";
import { markdown } from "@codemirror/lang-markdown";
import Code from "@zoobzio/vue/components/code.vue";

const state = reactive(createCodeState());
const service = new CodeService("readme", {}, state, {
  ...text,
  extensions: [markdown(), myTheme],
});
service.load(source);
```

```vue
<Code
  :service="service"
  :pt="{ status: { hidden: true } }"
  @updated="onUpdated"
/>
```
