# @zoobzio/vue

## 0.0.12

### Patch Changes

- Updated dependencies [[`0c7ba4d`](https://github.com/zoobzio/foundation/commit/0c7ba4db69e3457c90cbe296e1132fb65cdfdce4)]:
  - @zoobzio/kit@0.0.12
  - @zoobzio/browser@0.0.12
  - @zoobzio/code@0.0.12
  - @zoobzio/editor@0.0.12
  - @zoobzio/form@0.0.12
  - @zoobzio/query@0.0.12
  - @zoobzio/table@0.0.12

## 0.0.11

### Patch Changes

- [`6c5542d`](https://github.com/zoobzio/foundation/commit/6c5542de47e8e472c50f14bb0f2dd473eab31a4a) Thanks [@zoobzio](https://github.com/zoobzio)! - The form no longer carries a title. `title` is gone from the form's `Config`, and the form component no longer renders a toolbar: the `toolbar` slot and its default markup (`.f-data-form-toolbar` with the title in `.f-data-form-title`) are gone from the form and from `FormSlots`. A consumer that wants a heading renders it outside the form.

- [`c7176a7`](https://github.com/zoobzio/foundation/commit/c7176a7de302090d2568733b6d3fb8b574fba48b) Thanks [@zoobzio](https://github.com/zoobzio)! - Icons. A new `@zoobzio/icons` package carries the foundation icon contract: the roles the components of `@zoobzio/vue` leave to their `*Icon` slots (`prev`, `next`, `close`, `search`, `sort-asc`, …), authored as an icon-sheets config and built by `@icon-sheets/kit` into a typed `Alias` union, a resolved contract, and sprites.

  The Nuxt layer loads `@icon-sheets/nuxt` with that contract as its default `iconSheets` option, so an app that extends the layer gets `<Icon name="…" />` and the sprite with no setup, and an app with its own icons package merges its contract over the foundation's by passing it the usual way. `#imports` carries `IconAlias`, the app's merged alias union.

  A part of `@zoobzio/vue` that renders one of the package's own components is typed `Rendered` (`RenderedIter` per item): the component's props plus `as`, the component rendered, which a recipe names and a consumer's `pt` swaps. The template renders such a part through the package's own `Primitive` component (`components/primitive.vue`): `as` names the component, the rest is its props, and the parent's slots are handed on whole, named ones included, where reka's `Primitive` forwards the default alone. It is a component of the package like any other, so a consumer may render through it too. The parts: the table's `search`, `refresh`, and `pagination`; the pagination's `first`, `prev`, `next`, `last`, and `size`; the row and file `rowCheckbox`, `actionsMenu`, and `actionsTrigger`; the folders' `actionsMenu` and `actionsTrigger`; the table head's `selectAllCheckbox`; the browser's `breadcrumb` and `refresh`; the command's `viewport` and `itemCheckbox`; the multi-select's `itemCheckbox`; the date filters' `popover`, `trigger`, `fieldCommand`, `operatorCommand`, `calendar`, and `rangeCalendar`; the facets', column manager's, and keywords' `trigger` and the command or inputs behind it; and a form field's eight control parts. The fielder's recipes are typed `FormFieldRecipes`, the manifest without `as`, which the field component adds. The popovers of the facets, column manager, and keywords stay direct renders, since they hold a template ref.

  `@zoobzio/vue` gains `wrap` (`utils/wrap`): a component with a `pt` layer and slot defaults, typed as the component itself, for a framework layer to stand in for the component with its own parts and defaults laid under the consumer's. The item types (`MenuItem`, `TabsOption`, `SegmentedControlOption`, `BreadcrumbItem`, `DirectoryItem`, `CommandOption`, `FacetItem`, and the action and crumb items over them) are interfaces now, so a layer may widen one by declaration merging; `TreeNode` stays an alias for reka's record bound. `useExplicit` is gone: it served the layer's former wrappers, which `wrap` replaces.

  The `*Icon` slots are gone from every component of `@zoobzio/vue` (`triggerIcon`, `itemIcon`, `prevIcon`, `nextIcon`, `closeIcon`, `sortIcon`, `refreshIcon`, and the rest, 48 in all). In their place each site has a `prepend` and an `append` slot around the content, with the scope the icon slot had: `itemPrepend`/`itemAppend` (menu, command, directory, segmented control, breadcrumb, tree, autocomplete), `triggerPrepend`/`triggerAppend` (select, multi-select, tabs, accordion, the pickers), `prevPrepend`/`prevAppend` and `nextPrepend`/`nextAppend` (calendars and pickers), `closePrepend`/`closeAppend` (toast), `itemDeletePrepend`/`itemDeleteAppend` (tags input), `itemRemovePrepend`/`itemRemoveAppend` (file input), `backToTopPrepend`/`backToTopAppend` (scroller), `toolPrepend`/`toolAppend` (editor), `headerPrepend`/`headerAppend` and `dragPrepend`/`dragAppend` (table head), `bulkActionPrepend`/`bulkActionAppend` (bulk actions), `actionPrepend`/`actionAppend` (table rows, browser files), and `folderPrepend`/`folderAppend` and `folderActionPrepend`/`folderActionAppend` (browser folders). A site that showed placeholder text under its icon slot (the pickers' "Calendar", "Previous", and "Next", the toast's "Close", the tag and file "Remove") keeps the text between the pair. The checkbox's own `icon` slot stays.

  The Fab is one item, so it has one default slot in place of its label text, and no `icon`, `prepend`, or `append`. A component that renders a Fab as a part has one slot that replaces the part, with the part's `settings` in scope: the table's and browser's `refresh`, a table row's and a browser file's `actions`, a browser folder's `folderActions`, the column manager's `columns`, and the pagination's `first`, `prev`, `next`, and `last`; the facets', keywords', and date filters' `trigger` already replaced theirs. The pairs those sites forwarded into the Fab are gone.

  The action shapes of `@zoobzio/table` and `@zoobzio/browser` (`RowAction`, `FileAction`, `FolderAction`, and the two `BulkAction`s) extend their `ActionDescriptor`, so a field added to the descriptor by declaration merging reaches the service's live actions and the menu items built from them. The Nuxt layer widens both descriptors with an optional `icon: IconAlias`, as it does `MenuItem`. `EditorTool` is an interface for the same reason.

  The contract of `@zoobzio/icons` grows to forty aliases: `filter` and `keywords` for the facets' and keywords' triggers, `remove` for a tag's or file's remove button, and the editor's tools (`bold`, `italic`, `underline`, `strike`, `code`, `heading`, `bullet-list`, `ordered-list`, `blockquote`, `code-block`, `rule`, `undo`, `redo`). The Nuxt layer now wraps thirty components (`WRAPPED`), and every icon site draws its alias by default: the accordion, select, and multi select draw `expand`, the calendars and pickers `prev`, `next`, and `calendar`, the command `search`, the tags input and file input `remove`, the toast `close`, the scroller `top`, the checkbox `check`, the editor and rich text their tools' icons (`EDITOR_TOOL_ICONS`, `toolIcon`), the tree `expand` as a branch's toggle, and the table and browser `refresh`, `columns`, `actions`, `drag`, `sort-asc`/`sort-desc`, `folder`, and the pagination's four. A slot that replaces a Fab renders the part with the icon as its content, so the label stays the `aria-label`. An item draws its own `icon`: the layer widens `Option` (so every option type), `BreadcrumbItem`, `DirectoryItem`, and `FacetItem` beside `MenuItem`, and `createTable`'s and `createBrowser`'s actions carry one through their descriptors. Where a vue component renders another as a part, the wrapper lays the layer's wrapped component under the part's `as`: the table's pagination, column manager command, and checkboxes; the browser's checkboxes; the form's fields and a field's controls; and the facets', keywords', and date filters' popover contents.

  The form renders its fields through a `field` part (`RenderedIter<Field<T>, FormFieldProps<T>>`), so a layer's `pt.field` swaps the field component. `useForward` gains a part form for it: an entry with no `component` takes the component from its getter's `as`, as a `Rendered` recipe carries it. `Surface` (behind `wrap`'s option types) reads a generic SFC's props and slots from its call signature's parameters rather than its render result, which a self-referential bound (the tree's) left uninferrable. `useScroller` reads reka's exposed `viewportElement` where the viewport component has one, since a fragment-rooted viewport's `$el` is its anchor, not the scrolling element; the scroller's back-to-top control now appears on scroll.

  The Nuxt layer's wrappers are each one `wrap` call, so the nine link wrappers are a `pt` line each. The table's and browser's wrappers name the layer's `Menu` for row, file, and folder actions and the layer's `Breadcrumb` for the browser's trail through those parts' `as`. The menu is the first component to draw icons: the layer widens `MenuItem` with an optional `icon: IconAlias` in its `app.d.ts`, and the menu wrapper fills `itemPrepend` with that icon by default; a consumer's own `itemPrepend` slot still wins.

- Updated dependencies [[`6c5542d`](https://github.com/zoobzio/foundation/commit/6c5542de47e8e472c50f14bb0f2dd473eab31a4a), [`c7176a7`](https://github.com/zoobzio/foundation/commit/c7176a7de302090d2568733b6d3fb8b574fba48b)]:
  - @zoobzio/form@0.0.11
  - @zoobzio/browser@0.0.11
  - @zoobzio/table@0.0.11
  - @zoobzio/kit@0.0.11
  - @zoobzio/query@0.0.11
  - @zoobzio/editor@0.0.11
  - @zoobzio/code@0.0.11

## 0.0.10

### Patch Changes

- [`6ab9cd1`](https://github.com/zoobzio/foundation/commit/6ab9cd1ff148f045cdebee9cfff3494950595ab8) Thanks [@zoobzio](https://github.com/zoobzio)! - The autocomplete virtualizes its active panel: the options render through reka's `AutocompleteViewport` and `AutocompleteVirtualizer`, so only the rows in view, plus an overscan, are in the DOM however long the list. The `scroller` passthrough key is gone from `AutocompletePassthrough`; `viewport` and `virtualizer` take its place, the latter taking `overscan` and `estimateSize`. A row's height is measured from the DOM once rendered, so the estimate only seeds the first layout. The viewport scrolls natively and the reka viewport hides its scrollbar; a bounded height on `.f-autocomplete-viewport` is what makes it scroll. An `item` slot on the active panel must render exactly one root element and receives `measure`, a function ref to put on that element. Trail panels still render plain buttons and are not virtualized.

- [`9357f3b`](https://github.com/zoobzio/foundation/commit/9357f3b90980828445fd971b6c9936358eed41c2) Thanks [@zoobzio](https://github.com/zoobzio)! - A form's choice fields (`select`, `radio`, `multi-select`) can key a payload property typed as a string literal union. `Option<V>` is generic over its value, and the three field variants take `V` too: in `Field<T>` each is instantiated once per payload property with the property's own string type, so a select over `role: "admin" | "member"` keys the property, its options are checked against the union, and the config can take the schema's output type as `T` directly. Over a plain `string` property the options stay `Option<string>[]`, as before. The form component's submit recipe now catches the service's rejection: a failed submit action reaches the consumer as the `failed` emit and no longer escapes as an unhandled rejection.

- Updated dependencies [[`9357f3b`](https://github.com/zoobzio/foundation/commit/9357f3b90980828445fd971b6c9936358eed41c2), [`8145080`](https://github.com/zoobzio/foundation/commit/81450806518eccb6131f2c7e02bb0a87bc85128a)]:
  - @zoobzio/form@0.0.10
  - @zoobzio/query@0.0.10
  - @zoobzio/table@0.0.10
  - @zoobzio/kit@0.0.10
  - @zoobzio/browser@0.0.10
  - @zoobzio/editor@0.0.10
  - @zoobzio/code@0.0.10

## 0.0.9

### Patch Changes

- [`b124980`](https://github.com/zoobzio/foundation/commit/b124980537225de4e617946846954df73ca35570) Thanks [@zoobzio](https://github.com/zoobzio)! - The table and browser configs take a `timeZone`, the IANA zone their `date` and `datetime` cells format in, beside `locale` and `currency`. It defaults to `UTC`, so a server and a browser render the same text and hydration no longer depends on the process zone. A calendar day, `YYYY-MM-DD`, always formats in UTC: a day has no zone to shift it into the one before. `cell` in `@zoobzio/vue` takes the zone as its fifth argument.

- Updated dependencies [[`b124980`](https://github.com/zoobzio/foundation/commit/b124980537225de4e617946846954df73ca35570)]:
  - @zoobzio/table@0.0.9
  - @zoobzio/browser@0.0.9
  - @zoobzio/kit@0.0.9
  - @zoobzio/query@0.0.9
  - @zoobzio/form@0.0.9
  - @zoobzio/editor@0.0.9
  - @zoobzio/code@0.0.9

## 0.0.8

### Patch Changes

- [`b6a0884`](https://github.com/zoobzio/foundation/commit/b6a088476d9c81775335f4d37adb2e46b0d967f5) Thanks [@zoobzio](https://github.com/zoobzio)! - Add an optional `hint` to every form field config: help text the form field renders beneath the control, as a `hint` slot with the field context. The form field now wires its parts together with ids derived from the form id and the field key, served as `ctx.ids`: the label's `for` targets the control, a grouped control (radio, date picker, rich text) names the label through `aria-labelledby`, and the control lists the hint and the error in `aria-describedby` while each renders. To carry that wiring, the focusable part of the reka-backed controls (the checkbox root, the radio group root, the select and multi-select trigger, the date picker field, the tags input input) now also types against HTML attributes in `pt`.

- [`e2face6`](https://github.com/zoobzio/foundation/commit/e2face63138af80cb0c9f23d3ae21d81e9134a04) Thanks [@zoobzio](https://github.com/zoobzio)! - The table, form, and browser no longer wrap their contents in a scroller. Whether and how a data view scrolls is a layout decision that belongs to the consumer, so the `scroller` passthrough key is gone from `TablePassthrough`, `FormPassthrough`, and `BrowserPassthrough`. Wrap the component in a `Scroller` (or any scrolling container) where scrolling is wanted. The command palette and autocomplete keep their internal scrollers: their lists live inside a bounded popover.

- Updated dependencies [[`b6a0884`](https://github.com/zoobzio/foundation/commit/b6a088476d9c81775335f4d37adb2e46b0d967f5)]:
  - @zoobzio/form@0.0.8
  - @zoobzio/kit@0.0.8
  - @zoobzio/query@0.0.8
  - @zoobzio/browser@0.0.8
  - @zoobzio/table@0.0.8
  - @zoobzio/editor@0.0.8
  - @zoobzio/code@0.0.8

## 0.0.7

### Patch Changes

- [`930baaa`](https://github.com/zoobzio/foundation/commit/930baaaa0f1f8570638f1e5c307ab98116b99c94) Thanks [@zoobzio](https://github.com/zoobzio)! - Add three field types to the form: `file` (a `File`), `multi-file` (a `File[]`), and `richtext` (the document as an HTML string, with `features` as the editor's feature set). The form field renders the first two through a new `file-input.vue`, a native file input with the picked files listed beneath it and a remove button on each, whose model is the list of files; it renders `richtext` through a new `rich-text.vue`, a v-model over an HTML string with an `@zoobzio/editor` service the component owns behind it, rendered through `editor.vue`. An edit writes the document through the `html` codec (`""` when the document is empty, so `z.string().min(1)` marks a required field), and a model write from outside replaces the document. The Nuxt layer registers both components, their `define*` constructors, and their types.

- Updated dependencies [[`930baaa`](https://github.com/zoobzio/foundation/commit/930baaaa0f1f8570638f1e5c307ab98116b99c94)]:
  - @zoobzio/form@0.0.7
  - @zoobzio/kit@0.0.7
  - @zoobzio/query@0.0.7
  - @zoobzio/browser@0.0.7
  - @zoobzio/table@0.0.7
  - @zoobzio/editor@0.0.7
  - @zoobzio/code@0.0.7

## 0.0.6

### Patch Changes

- Updated dependencies []:
  - @zoobzio/kit@0.0.6
  - @zoobzio/query@0.0.6
  - @zoobzio/browser@0.0.6
  - @zoobzio/form@0.0.6
  - @zoobzio/table@0.0.6
  - @zoobzio/editor@0.0.6
  - @zoobzio/code@0.0.6

## 0.0.5

### Patch Changes

- [`e8e8463`](https://github.com/zoobzio/foundation/commit/e8e8463b8df736801cdcd6ca5a1020ee99661c71) Thanks [@zoobzio](https://github.com/zoobzio)! - feat: code component and useCode composable over the headless code service, static until the user interacts, with its Nuxt store, factory, and hooks

- [`946e44d`](https://github.com/zoobzio/foundation/commit/946e44d0ad3dccf9f08ab5c3f90ad5a169736668) Thanks [@zoobzio](https://github.com/zoobzio)! - feat: editor component and useEditor composable over the headless editor service, static until the user interacts, with its Nuxt store, factory, and hooks

- [`a684eb7`](https://github.com/zoobzio/foundation/commit/a684eb7a6a7c1cc75c5266d86dac7b0a53c9f069) Thanks [@zoobzio](https://github.com/zoobzio)! - Add `tel` and `url` to the text field types, and a `TemporalField` for native string date and time inputs: `time`, `datetime-local`, and `date-input`, which renders `<input type="date">` with a `YYYY-MM-DD` string value. The `date` type stays the `Date`-valued picker. The form field now forwards `maxLength` on text and textarea fields, `minDate` and `maxDate` on date fields, and `required` on checkbox, multi-select, date, and tags-input fields. The date picker gains `required`, `minValue`, and `maxValue` props, and the multi-select and tags input gain `required`.

- Updated dependencies [[`e8e8463`](https://github.com/zoobzio/foundation/commit/e8e8463b8df736801cdcd6ca5a1020ee99661c71), [`8834379`](https://github.com/zoobzio/foundation/commit/8834379594010041bc4bb272c4a87add3ba97265), [`946e44d`](https://github.com/zoobzio/foundation/commit/946e44d0ad3dccf9f08ab5c3f90ad5a169736668), [`a684eb7`](https://github.com/zoobzio/foundation/commit/a684eb7a6a7c1cc75c5266d86dac7b0a53c9f069), [`0c850a2`](https://github.com/zoobzio/foundation/commit/0c850a2c743a548ea9f42e42984c3580ecb289dd)]:
  - @zoobzio/code@0.0.5
  - @zoobzio/kit@0.0.5
  - @zoobzio/editor@0.0.5
  - @zoobzio/form@0.0.5
  - @zoobzio/browser@0.0.5
  - @zoobzio/query@0.0.5
  - @zoobzio/table@0.0.5

## 0.0.4

### Patch Changes

- [`0b68b05`](https://github.com/zoobzio/foundation/commit/0b68b05c8c0798ebb23944a5b90d2bb1a233bf51) Thanks [@zoobzio](https://github.com/zoobzio)! - Add `typesVersions` mirroring the `exports` map so `@zoobzio/vue/*` subpaths resolve under TypeScript's legacy node10 module resolution. `@vue/compiler-sfc` falls back to node10 when it finds no `tsconfig.json` near a compiled SFC, which made `nuxi build` fail in consumers of `@zoobzio/nuxt` with `Failed to resolve import source "@zoobzio/vue/types/..."`.

- Updated dependencies []:
  - @zoobzio/kit@0.0.4
  - @zoobzio/query@0.0.4
  - @zoobzio/browser@0.0.4
  - @zoobzio/form@0.0.4
  - @zoobzio/table@0.0.4

## 0.0.3

### Patch Changes

- Updated dependencies []:
  - @zoobzio/kit@0.0.3
  - @zoobzio/query@0.0.3
  - @zoobzio/browser@0.0.3
  - @zoobzio/form@0.0.3
  - @zoobzio/table@0.0.3

## 0.0.2

### Patch Changes

- [`bfcac44`](https://github.com/zoobzio/foundation/commit/bfcac44da97192a29931450ae82bef3539006684) Thanks [@zoobzio](https://github.com/zoobzio)! - Links render through a `link` passthrough part, and per-item passthrough merges.

  - `merge` composes a consumer's function part with the local recipe: both run with the same argument and the consumer's result merges over the local one, so `pt.item = () => ({ a })` no longer drops the recipe's other keys. Listeners inside a part still replace. `PT` admits a deep-partial return from a function part to match.
  - Every anchor is now a `link` part rendered through reka's `Primitive`, typed as `LinkProps` (`as`, `asChild`, and the anchor attributes). A consumer swaps the element with `pt.link`, for example `{ link: () => ({ as: NuxtLink }) }`; the recipe's `href` and `target` carry over. Covers `Breadcrumb`, `Directory`, `Tree`, `Tabs`, `SegmentedControl`, `Menu`, the `url` cells of `TableBody` and `BrowserFiles`, and the `Hero` action.
  - `Breadcrumb` and `Directory` gain a `pt` prop and `settings` on their context. `TableBodyPassthrough` and `BrowserFilesPassthrough` are generic over the row type.
  - `Hero`'s `action` navigates: it renders as an anchor over its `Link` instead of an inert button, and its `button` slot is renamed `action`.

- [`11569ca`](https://github.com/zoobzio/foundation/commit/11569cac7b307f2b3c95a6c912dbd128d0dc7368) Thanks [@zoobzio](https://github.com/zoobzio)! - `usePassthrough`, `useContext`, and `useExplicit` serve a wrapper.

  - `usePassthrough({ pt, layer })` lays a partial manifest under the consumer's `pt` and returns the layered partial, for a wrapper to hand on as the wrapped component's `pt`. A function part composes as it does over recipes. `PassthroughLayer` types the source; `layer` in `utils/passthrough` is the merge.
  - `useContext(source)` forwards a wrapped component's context unchanged, `undefined` until it mounts.
  - `useExplicit(props)` projects the props the consumer passed explicitly, read off the vnode, so a wrapper hands them on without casting an absent boolean to `false` or turning a model controlled. `explicit` and `isExplicit` in `utils/explicit` are the projection and the presence check; `useModel`'s `explicit` option uses the latter.
  - `PT` keeps a constructor whole, as it does an array, so a component passed through `as` keeps its signature. A `DefineComponent` such as `NuxtLink` now typechecks as a `pt.link` override.

- [`11569ca`](https://github.com/zoobzio/foundation/commit/11569cac7b307f2b3c95a6c912dbd128d0dc7368) Thanks [@zoobzio](https://github.com/zoobzio)! - `@zoobzio/vue` ships declarations. `build` emits `.d.ts` for every source file, `.vue.d.ts` beside each component, into `.dist`, and the exports map serves them under the `types` condition while `default` stays on the source. A consumer's typecheck resolves real declaration files, so a pnpm workspace link no longer loads the package twice, and `skipLibCheck` covers it.

- Updated dependencies []:
  - @zoobzio/kit@0.0.2
  - @zoobzio/query@0.0.2
  - @zoobzio/browser@0.0.2
  - @zoobzio/form@0.0.2
  - @zoobzio/table@0.0.2

## 0.0.1

### Patch Changes

- [`00314f2`](https://github.com/zoobzio/foundation/commit/00314f2819555e2681b5739510aaa7ecb3c4c356) Thanks [@zoobzio](https://github.com/zoobzio)! - Initial alpha release: the headless services (`kit`, `query`, `browser`, `form`, `table`), the Vue components, and the Nuxt layer.

- Updated dependencies [[`00314f2`](https://github.com/zoobzio/foundation/commit/00314f2819555e2681b5739510aaa7ecb3c4c356)]:
  - @zoobzio/kit@0.0.1
  - @zoobzio/query@0.0.1
  - @zoobzio/browser@0.0.1
  - @zoobzio/form@0.0.1
  - @zoobzio/table@0.0.1
