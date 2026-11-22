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
  components/        — interactive components (34) plus the stateless data components: the table (table.vue and its table-* parts), the form (form.vue and form-field.vue), the browser (browser.vue and its browser-* parts), the editor (editor.vue), the code editor (code.vue), the calendar (calendar.vue), the timeline (timeline.vue), and the saved views (views.vue)
  composables/       — usePassthrough, useForward, useModel, useContext, useSelection, useSearch, useScroller, useDrag, useKeywords, usePaginate, useServiceRefs, useServiceEmits, useSync, useEditor, useCode, useCalendar, useTimeline
  definitions/       — define<Name>(definition | source) constructors
  types/             — common, events, passthrough (Passthrough, Rendered, PT), forward, slots, context, definition, wrap; per-component types in core/
  utils/             — passthrough merge, forward render, part (renders a Rendered part's `as`), wrap (a component with a pt layer and slot defaults), define runtime, date, file, keywords, paginate, table, browser, sync, editor, code, calendar, timeline
  constants/         — constants by domain: date, filter, pagination, popper, scroll, selection, form, table, browser, sync, editor, code, calendar, timeline, views
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

A part that renders one of the package's own components (the table's
`pagination`, a form's `field` and a form field's `select`, a row's
`actionsMenu`, a pagination control's `first`) is typed `Rendered`
(`RenderedIter` per item): the component's props, plus `as`, the
component rendered. The recipe names the component, and the template
renders the part through the package's own `Primitive`
(`components/primitive.vue`), which hands the parent's slots on whole,
named ones included, where reka's `Primitive` would forward the default
alone. A part the parent must hand its own slot record to (the form's
`field`) renders through `useForward` instead, whose part form takes the
component from the getter's `as`. Either way `pt` reaches into a nested
component the same way it reaches an anchor: `pt.pagination.pt.first` is
the pagination's own part, and `pt.pagination.as` renders another
pagination in its place, such as a framework layer's wrapper of it.

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

Where an icon belongs beside content, a component has a `prepend` and an
`append` slot around it rather than an icon slot: `itemPrepend` and
`itemAppend` around a menu item's label, `triggerPrepend` and
`triggerAppend` around a select's display, `prevPrepend` and `prevAppend`
around a date grid's previous control, and so on. Each receives the scope
of the content it sits beside. The Fab is one item, so it has one default
slot in place of its label text, and a component that renders a Fab as a
part has one slot that replaces the part (a table's `refresh`, a row's
`actions`, the column manager's `columns`, the pagination's `first`); the
slot's scope carries `settings`, so a replacement renders the part's
props through `Primitive` with its own content.

The item types a component takes (`MenuItem`, `TabsOption`,
`BreadcrumbItem`, `DirectoryItem`, `CommandOption`, the query's `Field`
and `Option` behind the autocomplete, …) are interfaces, so a layer may
widen one by declaration merging, and the widened field then reaches the
layer's slot defaults through the slot's scope. `TreeNode` is
the exception: it stays a type alias to satisfy reka's record bound.

## Data components

`table.vue` renders a headless `@zoobzio/table` service. The component owns
no feature state: it renders from the service's TanStack table
(`service.table`: its header groups, rows, and visible cells), writes
through it, and relays the service's `updated` and `filtered` events as
emits. The service's state container must be reactive for the table to
update.

```ts
import { reactive } from "vue";
import { TableService, createTableState } from "@zoobzio/table";
import Table from "@zoobzio/vue/components/table.vue";

const config = { columns, getRowId: (row) => row.id };
const state = reactive(createTableState(config));
const service = new TableService("users", config, state, { fetch });
service.init();
```

```vue
<Table :service="service" @updated="onUpdated" />
```

A slot of the head receives its `column`, and a cell slot its `cell`,
`row`, `column`, and `value`, as TanStack Table holds them: a column's
label and type are on `column.columnDef.meta`, and a row's record is
`row.original`. Cell slots cascade: `cell:<id>` for one column, then
`cell:<type>`, then `cell`.

A header whose column sorts is a button over the column's own sort
handler: a click sorts, a click with Shift held adds the column to the
sorts, and a third click clears it. The `th` carries
`f-data-table-sortable`, `f-data-table-sorted` while sorted, and
`aria-sort`. The checkbox column renders while the table's
`enableRowSelection` is on, which a config with bulk actions turns on; the
head's checkbox selects the rows of the page.

Where the service has a `sync` (its wiring names a `refresh`), the refresh
button is the trigger of a menu, the `syncMenu` part, in place of fetching
itself: its first item refreshes now, and the rest set the interval the
table keeps its page alive on, off and each one the sync offers, the one it
is on carrying `data-current`. The `syncPrepend`, `syncLabel`, and
`syncAppend` slots reach each item. The table watches the sync while it is
mounted and the document is visible (`useSync`), and polls at once when
the document comes back into view. Its root carries `f-data-table-live`
while an interval is set and `f-data-table-syncing` while a poll is out.

The table renders what the service's `permissions` grant, and follows a
reactive record as it changes. Without `search`, `hide`, or `refresh` the
toolbar has no search, column manager, or refresh; without `sort` a header
is plain text; without `reorder` a header has no drag handle and does not
drag; without `pin`, or on a column with `enablePinning: false`, it has
no pin menu; without `resize`, or on a column with `enableResizing: false`, it
has no resizer; without `pageSize` the pagination has no size picker
(`pagination.vue` takes `sizable: false`); and without `select`,
`bulkActions`, or `actions` the checkbox and actions columns are gone.

A column that names a route (`meta.link: (row) => string`) renders each of
its cells through the body's `link` part, an anchor to the route around the
content the cell would otherwise render: the type's formatting or a
`cell:<type>` slot. A `cell:<id>` slot still replaces the whole cell. A
`url` column without a route keeps its own link, to the value in a new tab.
`pt.body.link` swaps the anchor for a router link, which receives the same
`href`.

Every column's header carries a resizer on its trailing border, a
`span.f-data-table-resizer` that is the last child of the `th`, outside
the `header` slot so a replaced header keeps it. A drag writes the
column's size to the table's `columnSizing` as the pointer moves, starting
from the column's size; the left and right arrow keys step it by 16
pixels, and a double click or Enter restores the size the column declares.
The table holds a size at the column's `minSize` and `maxSize`. The `th`
carries `f-data-table-resizing` for the length of a drag. The resizer is a
focusable `separator` named for its column (`Resize Name`), with the size
as its value; `pt.head.resizer` builds its attributes per column.

The table renders the sizes by value: a `colgroup` with one `col` per
rendered column, each data column's `col` carrying its size as an inline
`width`, but the last visible unpinned one, which carries none. The `table`
element carries the total of the sizes as an inline `min-width`. Under
`table-layout: fixed` and `width: 100%`, which the stylesheet sets, every
column then holds exactly its size, the last takes what the table has left
while it is wider than its columns, and once they outgrow it the table
widens and scrolls. A resize of the last column starts from the width it
is rendered at. The total counts the data columns, and past them the two
custom properties the stylesheet may set on the root for the columns that
are its own: `--f-data-table-start-inset`, the width of the select column,
on `.f-data-table-selectable`, and `--f-data-table-end-inset`, the width
of the actions column, on `.f-data-table-actionable`. Where it sets
neither, their width comes out of the last column's. The package ships no
styles, so the stylesheet also places
the resizer on the border (an absolutely positioned strip on the `th`'s
inline end, with `cursor: col-resize` and `touch-action: none`).

A column pins to the start or the end of the table (TanStack's
`columnPinning`, `{ start, end }`: left and right in a left-to-right
layout), where it stays while the others scroll beneath it. The head, the
rows, and the `colgroup` lay the columns out pinned to the start, then
unpinned, then pinned to the end. A pinned column's `th` and `td` carry
`f-data-table-pinned`, `f-data-table-pinned-start` or
`f-data-table-pinned-end`, `f-data-table-pinned-edge` on the column that
borders the unpinned ones, and where they stick as an inline
`inset-inline-start` or `inset-inline-end`: the sizes of the pinned
columns before them, past the inset property of that side. The stylesheet
makes the class stick (`position: sticky`, a `z-index`, and an opaque
background, so a row's tints must be mixed into the surface on a pinned
cell). The actions column always carries the pinned classes of the end,
and the select column those of the start once a column is pinned there;
the stylesheet sticks them at `0`. Each header whose column pins
(`column.getCanPin()`: the `pin` permission, and no `enablePinning: false`
on the column) holds a menu of the sides the column is not on and, once
pinned, `Unpin`, opened by a `button.f-data-table-pin` named for the
column (`Pin Name`). `pt.head.pinMenu` and `pt.head.pinTrigger` build them
per column, the `pin` slot replaces the button, and `pinPrepend` and
`pinAppend` sit beside an item. A drag moves a column within its region:
among the unpinned ones it writes the column order, among the ones pinned
to a side that side's pinning order, and across regions nothing.

The `table` element renders within a scroller, `.f-data-table-scroller`,
a horizontal `scroller.vue` between the toolbar and the pagination, so
columns resized past the space the table has scroll within it, and the
toolbar, the bulk actions, and the pagination keep their width.
`pt.scroller` configures it or swaps it through `as`. The stylesheet bounds
the scroller rather than the table: where the root is a grid or a flex
container its track must be free to shrink
(`grid-template-columns: minmax(0, 1fr)`, or `min-width: 0` on the
scroller), or the root grows with the table and nothing scrolls. The
table's frame (border, radius, clipping) belongs on the scroller, and the
scrollbar is the scroller's own `.f-scroll-area-scrollbar` and
`.f-scroll-area-thumb`.

`form.vue` renders a headless `@zoobzio/form` service the same way: one
`form-field.vue` per config field, each resolved to the control its `type`
names (`input`, `textarea`, `select`, `multiSelect`, `checkbox`, `radio`,
`datePicker`, `tagsInput`, `fileInput`, `imageInput`, `richText`), with the lifecycle
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
does, and a form reset clears the native list too. An `image` field
renders `image-input.vue`: a preview of the image, or a placeholder while
there is none, with a native file input, a `pick` label that opens it, and
a `remove` button. The model is the stored image's URL, a picked `File`,
or undefined; the component previews a picked file through an object URL
it revokes when the model moves on or it unmounts. The native input is
`required` only while there is no image, as a stored image leaves it
empty. The package ships no styles, so the stylesheet hides the native
input behind the label and frames the preview (`f-image-input-root`,
`-preview`, `-placeholder`, `-input`, `-pick`, `-remove`); the
`placeholder` slot takes an avatar in its place, and `placeholderContent`
an icon inside it. A `richtext` field
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

`browser.vue` renders a headless `@zoobzio/browser` service. Its toolbar
holds the search (the autocomplete over the service's `query`, as the
table's is, hidden by `searchable: false`), the sort menu (the service's
`sortableColumns` behind a Fab; an item sorts by its column, and again
flips the direction; the sorted item carries `data-current` and
`data-direction`), and the refresh, which is the trigger of the sync menu
where the service has a `sync`, as the table's is, with the same part,
slots, and `f-data-browser-live` and `f-data-browser-syncing` on the
root. Under it is one table. Its head
(`browser-head.vue`) is a single row attached to the listing: the
select-all checkbox where the rows are selectable, then one cell with the
breadcrumb over the service's `trail` and, once the first fetch settles,
the listing's counts (`summary`). The folder rows (`browser-folders.vue`)
sit above the file rows (`browser-files.vue`), each a `tbody` of its own,
and both render a cell per column, so a folder's values line up with the
files'. A folder's label fills the first column; the other
cells format the folder's `values` as a file's are, empty where it carries
none. Where the service is selectable a folder row has a checkbox as a
file row does (`pt.folders.rowCheckbox`), and the bulk actions bar counts
both. Folder clicks `open`, crumb clicks `navigate` (either
drops the search, which belongs to the folder it was typed in); a crumb
whose folder carries a `link` (or the root crumb under `rootLink`) renders
as an anchor to it and still calls `navigate` on click, row and
folder menus dispatch by key through `runAction` and `runFolderAction`, and
the bulk actions bar runs `runBulkAction` over the selection. The
`updated`, `navigated`, and `filtered` events relay as emits. Cell slots
cascade as the table's do (`cell:<key>`, `cell:<type>`, `cell`), and a
folder's the same way under `folderCell` (`folderCell:<key>`,
`folderCell:<type>`, `folderCell`), with the `folder` slots filling the
label's cell;
`crumbPrepend` and `crumbAppend` sit around a crumb's label, `sort`
replaces the sort trigger and `sortPrepend` and `sortAppend` sit around
its items; `noFiles` fills the empty file section, and `empty` fills the
one row the body becomes, under the head, once a folder settles with
neither folders nor files: `Empty folder`, or `No matches` under a search.
The head's parts take passthrough under `pt.head` (`breadcrumb`,
`selectAllCheckbox`).

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

`editor.vue` renders a headless `@zoobzio/editor` service: a toolbar
grouped as a rich text editor's is (the block type; the marks and the
link; the lists; quote, code block, and rule; the image; then undo and
redo) with a separator between
groups, over a host `div` that shows the document as static HTML. The
block type is one dropdown, the package's Menu, over the paragraph and the
headings the service offers by level; its trigger names the block at the
selection, and a pick applies it. The editor is
off until the user interacts: a pointer or keyboard focus on the host, or
a toolbar click, mounts the service's editor over the host in place, so
the content is readable from the first paint (server-rendered and hydrated
untouched) and turns editable with no visible change. The static copy
follows `load` while the editor is off.

The toolbar is reka's: one tab stop, with the arrow keys moving between
the controls, the dropdown's trigger among them. Each tool is a Fab
rendered through `Primitive`, with the
tool's label as its accessible name and, by default, its text; a
`toolLabel` slot that draws an icon makes the button icon-only with the
name intact. A press keeps focus in the document, so the selection the
command applies to stays where it is. A toggle (a mark, a block) reports
`aria-pressed` from the service's `active`; an action (undo, redo, rule)
never does. A tool is disabled where the service's `can` says its command
would not apply: a mark inside a code block, undo with nothing to undo.

The link and the image are prompts: the button opens the package's
Popover over a small form, and the tool runs with what was typed. The
link asks for an address and links the selection, or changes the link
the caret is in; it opens on that link's address, with a button that
removes it, and an address typed away removes it too. The image asks for
an address and an alternative text and inserts the image at the caret, or,
with an image selected, opens on its values and replaces them. A prompt's
button is never pressed: `data-active` says its link or image is at the
selection. Applying or removing hands focus back to the document;
dismissing changes nothing. `pt.prompt` is the Popover's props, built per
tool, and `pt.form`, `pt.field`, `pt.submit`, and `pt.clear` reach the
form, each input, and the two buttons; the `prompt` slot replaces the form of
every prompt and `prompt-<key>` that of one tool alone (`prompt-image`,
`prompt-link`), the tool's own winning; each receives the tool, its
`fields`, the `values` typed so far, and `submit` and `clear`, and
`fieldLabel`, `submitLabel`, and `clearLabel` fill the default form. The
editor stores an image's address only: an app that takes uploads fills
`prompt-image` with its own picker, which sets `values.src` to the address
it gets back and calls `submit`, and the link's form stays as it is.
The `loaded`, `updated`, `mounted`, and `unmounted` events relay as
emits; `data-mounted` on the root says the editor is on. `pt.tool` is
built per tool, `pt.separator` per group, and `pt.block` is the Menu's
props; the `tool` slot receives its tool, `separator` its group, and
`block` replaces the dropdown, whose trigger and items `blockLabel`,
`blockAppend`, and `blockItemLabel` fill; `toolbar` replaces the whole
bar, and its context carries `tools`, `groups`, `blocks`, `block`, and
`activate` for a custom bar to turn the editor on.

`useEditor(service, host)` is the component's view model on its own, for a
consumer that renders the editor its own way: `markup`, the document as
static HTML that follows `load` while the editor is off and freezes at
mount; `tools`, the toolbar as data, `groups`, the same by group, `blocks`,
the block types, and `block`, the one at the selection; and `activate`,
which mounts the editor over the host in place. Bind `markup` to the host's `innerHTML`,
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

`calendar.vue` renders a headless `@zoobzio/calendar` service: a toolbar
over the days of the service's view. The month, week, and day views are one `table`, a row
per week and a cell per day; the agenda view is a list of the days that
hold an occurrence. Each day lists the occurrences that touch it, so one
that spans three days is in each. The component owns no feature state: it
reads the service, calls its methods, and relays its `navigated`, `loaded`,
`changed`, `selected`, `filtered`, and `restored` events as emits.

```ts
import { reactive } from "vue";
import { CalendarService, createCalendarState, json } from "@zoobzio/calendar";
import Calendar from "@zoobzio/vue/components/calendar.vue";

const config = { timeZone: "Europe/Amsterdam" };
const state = reactive(createCalendarState(config));
const service = new CalendarService("team", config, state, { ...json, fetch });
service.init();
```

```vue
<Calendar :service="service" @selected="onSelected" />
```

A day's date is a button that opens the day: it moves the service's date
there, in the day view where the service offers one. An occurrence is a
button that selects it (`service.select`), pressed while it is the
selection. The heading, the weekdays, and the times read in the config's
`locale`, and the times in its `timeZone`. The component is unstyled and
lays nothing out: the root carries `data-view` and `data-loading`, a day
`data-date`, `data-today`, and `data-outside` (a day of the month view
outside its month), and an occurrence `data-key`, `data-type` (`Event` or
`Task`), `data-all-day`, and `data-selected`, for a stylesheet to read.

The toolbar is built from the service as the editor's is: one tool per
command, in groups, each a button inside reka's toolbar, which gives the
controls one tab stop and arrow-key focus. The `navigate` group holds
`today` (off while the calendar is on today), `prev`, and `next`; the
heading stands after it; the `views` group holds one toggle per view the
service offers, pressed while the calendar is in it, and is left out where
the service offers one view. A button carries `f-data-calendar-tool`,
`data-tool` (the tool's key), and `data-group`. The `tool` part and the
`tool`, `toolPrepend`, `toolLabel`, and `toolAppend` slots reach one tool
at a time, so a consumer dresses a button without rebuilding the bar; the
`toolbarPrepend` and `toolbarAppend` slots add controls of the consumer's
own before and after the tools, inside the same toolbar.

Over the toolbar, outside it, stand the controls, a row of their own under
`f-data-calendar-controls`, as a table's and a browser's stand over
theirs: the search, where the service is `searchable` (its config names
`fields` or `literals`, or says so), the autocomplete over `service.query`
under `f-data-calendar-search`; and the refresh, a Fab that fetches the
range again, or where the service has a `sync` the trigger of the sync
menu, as the table's is, with the same `syncMenu` part and `syncPrepend`,
`syncLabel`, and `syncAppend` slots; the root carries `data-live` while an
interval is set and `data-syncing` while a poll is out. The `search` and
`refresh` parts and slots reach each, and
the `controls` slot replaces the row. The toolbar and the view under it
sit together in `f-data-calendar-body`.

The parts are `search`, `refresh`, `syncMenu`, `toolbar`, `separator`, `tool`, `grid`,
`agenda`, `weekday`, `day`, `dayLabel`, and `occurrence`; the slots are
`controls`, `search`, `refresh`, `syncPrepend`, `syncLabel`, `syncAppend`,
`toolbar`, `toolbarPrepend`,
`toolbarAppend`, `separator`, `heading`, `tool`, `toolPrepend`,
`toolLabel`, `toolAppend`, `weekday`, `day`, `dayLabel`, `occurrence`,
`occurrenceTime`, `occurrenceLabel`, and `empty`.
`useCalendar(service)` is the view model on its own (the tools and their
groups, the heading, the weekdays, the days and weeks with their
occurrences, an occurrence's time, and `open`), for a consumer's own
rendering. The
month grids that pick a date are `date-grid.vue` and `date-range-grid.vue`.

`timeline.vue` renders a headless `@zoobzio/timeline` service: records
in the order of their time, a card each, under the day each falls on. The
groups are a list (`f-data-timeline-groups`), each a
`f-data-timeline-group` with its heading, the day as the timeline's locale
reads it, over the list of its records; a record is an `article`,
`f-data-timeline-record`, holding a button that selects it
(`f-data-timeline-record-label`, pressed while it is the selection) and
its time, in the timeline's zone. Under the records stands the button
that loads the next batch (`f-data-timeline-more`), while the service has
`more`. The component owns no feature state: it reads the service, calls
its methods, and relays its `loaded`, `appended`, `selected`, `filtered`,
and `restored` events as emits.

```ts
import { reactive } from "vue";
import { TimelineService, createTimelineState } from "@zoobzio/timeline";
import Timeline from "@zoobzio/vue/components/timeline.vue";

const config = { key: "sha", label: "message" } as const;
const state = reactive(createTimelineState<Commit>(config));
const service = new TimelineService<Commit>("history", config, state, {
  fetch,
});
service.init();
```

```vue
<Timeline :service="service" @selected="onSelected">
  <template #recordAppend="{ item }">
    <code>{{ item.record.sha }}</code>
  </template>
</Timeline>
```

The card is the consumer's to draw. The `record` slot replaces it whole,
given the `item` (its `key`, the `record` itself, its `label`, and its
`time`) and its `group`; `recordPrepend` and `recordAppend` add to the
default card around what it holds, `recordLabel` fills the button that
selects it, and `recordTime` replaces its time. A record's time reads as
the time alone under a day's heading, and with its date where the
timeline groups by the month, the year, or nothing; a timeline that
groups by nothing has no heading.

The component is unstyled and lays nothing out: the root carries
`data-order` (`desc` or `asc`), `data-loading` while the records are
fetched anew, and `data-appending` while a further batch is out; a group
`data-group` (its day, month, or year) and `data-today` while today falls
in it; and a card `data-key` and `data-selected`, for a stylesheet to
read. Over the records stand the controls, the search and the refresh or
sync menu, as over a calendar's, under `f-data-timeline-controls`.

The parts are `search`, `refresh`, `syncMenu`, `groups`, `group`,
`heading`, `record`, `label`, and `more`; the slots are `controls`,
`search`, `refresh`, `syncPrepend`, `syncLabel`, `syncAppend`, `group`,
`heading`, `record`, `recordPrepend`, `recordLabel`, `recordTime`,
`recordAppend`, `empty`, and `more`. `useTimeline(service)` is the view
model on its own, the groups with their records as cards read them, for a
consumer's own rendering.

`views.vue` renders a headless `@zoobzio/views` service: the saved views
of a table or a browser as a row of tabs, and the actions of the active
one in a menu beside them. The component owns one piece of state, the name
being typed in a dialog; everything else it renders from the service and
writes through it. It relays the service's `selected`, `saved`, `renamed`,
`removed`, `reverted`, and `failed` events as emits. The service's state
container must be reactive, and so must what its `read` action reads, for
the mark of an edited view to show.

```ts
import { reactive } from "vue";
import { ViewsService, createViewsState } from "@zoobzio/views";
import Views from "@zoobzio/vue/components/views.vue";

const views = new ViewsService(
  "orders",
  config,
  reactive(createViewsState(config)),
  {
    read: () => table.snapshot(),
    apply: (payload) => table.restore(payload),
  },
);
await views.init();
```

```vue
<Views :service="views" />
<Table :service="table" />
```

The tabs are the package's own `tabs.vue`, controlled by the service: a
tab selects its view, and stays where it was while the service holds the
selection. While the active view has drifted the root carries
`f-views-drifted` and its tab an empty `f-views-badge` for a stylesheet to
draw. The menu is `menu.vue` behind a `fab.vue`, and lists `save`,
`saveAs`, `rename`, `revert`, and `remove`, each disabled where the view
does not allow it or there is nothing to do: a view that is not the user's
own offers `saveAs` and, once edited, `revert`.

Two dialogs open from the service's state. The confirmation opens while
the service holds a `pending` intent and settles it: cancel, proceed, and,
for a held selection, save, with a name field where saving makes a new
view. It stays open when the save fails, as the service keeps the intent.
The naming dialog takes the name of a new view or a new name for the
active one.

The parts are `tabs`, `menu`, `trigger`, and, built per kind of intent
and per purpose, `confirm` and `naming`. The slots are `tabPrepend`,
`tabLabel`, `badge`, `trigger`, `actionPrepend`, `actionLabel`,
`actionAppend`, `nameLabel`, `cancelLabel`, `saveLabel`, and
`proceedLabel`.
