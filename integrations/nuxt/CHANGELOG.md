# @zoobzio/nuxt

## 0.1.0

### Patch Changes

- [`f169434`](https://github.com/zoobzio/foundation/commit/f1694342c7717d2ada6d8ce2795586db09f16fcc) Thanks [@zoobzio](https://github.com/zoobzio)! - A table column's properties beyond the ones the table reads are carried through: `fields` puts them on the column's query field, and the vue table's `columnOption` puts them on the column manager's option. The nuxt layer widens `DataTableColumn` with `icon?: IconAlias`, so a column's `icon` draws before its header (the wrapper's default `headerPrepend`), beside its field in the search, and beside its option in the column manager.

- Updated dependencies [[`a10178c`](https://github.com/zoobzio/foundation/commit/a10178cf639b542aa62bb82d225771b8e71967cb), [`6c97175`](https://github.com/zoobzio/foundation/commit/6c97175e1922b32170583428a3129f721321fc6b), [`83b3439`](https://github.com/zoobzio/foundation/commit/83b3439176a69479e567f86aa18d4bce1db5ed2d), [`f169434`](https://github.com/zoobzio/foundation/commit/f1694342c7717d2ada6d8ce2795586db09f16fcc), [`506f77e`](https://github.com/zoobzio/foundation/commit/506f77e7c2795aae8c775362168f2e0ed1d3e4d8)]:
  - @zoobzio/vue@0.1.0
  - @zoobzio/query@0.1.0
  - @zoobzio/table@0.1.0
  - @zoobzio/browser@0.1.0
  - @zoobzio/form@0.1.0
  - @zoobzio/editor@0.1.0
  - @zoobzio/code@0.1.0
  - @zoobzio/icons@0.1.0
  - @zoobzio/theme@0.1.0

## 0.0.15

### Patch Changes

- Updated dependencies [[`59e70a6`](https://github.com/zoobzio/foundation/commit/59e70a6626c0b612283282729e4ff7ee91822ea7)]:
  - @zoobzio/theme@0.0.15
  - @zoobzio/query@0.0.15
  - @zoobzio/browser@0.0.15
  - @zoobzio/form@0.0.15
  - @zoobzio/table@0.0.15
  - @zoobzio/editor@0.0.15
  - @zoobzio/code@0.0.15
  - @zoobzio/icons@0.0.15
  - @zoobzio/vue@0.0.15

## 0.0.14

### Patch Changes

- [`16696d8`](https://github.com/zoobzio/foundation/commit/16696d8c380ba97166cbfc1a0e29eac2eddfe4a2) Thanks [@zoobzio](https://github.com/zoobzio)! - The autocomplete has `chipPrepend` and `chipAppend` slots either side of a chip's label, within the button that removes its entry; each takes the chip's context. The nuxt layer's Autocomplete draws `remove` in `chipAppend`, so every chip trails an x.

- [`16696d8`](https://github.com/zoobzio/foundation/commit/16696d8c380ba97166cbfc1a0e29eac2eddfe4a2) Thanks [@zoobzio](https://github.com/zoobzio)! - `Field` and `Option` of the query are interfaces, so a layer may widen them by declaration merging, and a field's properties beyond the ones the query reads are carried onto its option in the panel and the trail. The nuxt layer widens both with `icon: IconAlias`, so a field given an `icon` draws it before its option in the autocomplete, and draws the branch arrows: `next` after a field or operator option, as selecting it enters a stage, `expand` after the active trail option, as its stage is the one open, and none after a value, as it commits. `@zoobzio/query` is a dependency of the layer.

- [`c1ac409`](https://github.com/zoobzio/foundation/commit/c1ac4090ba659cc0696a0d8ccd0ea05a0d820adc) Thanks [@zoobzio](https://github.com/zoobzio)! - The autocomplete's active panel scrolls in the package's scroller, and its virtualized items render within a row the component owns. `viewport` in `AutocompletePassthrough` is now `Rendered<ScrollerProps>`: the scroller renders through the package's `Primitive`, so a `pt.viewport` takes the scroller's props and `pt`, and `as` swaps the component, as the nuxt layer does with its own Scroller. The scroller's viewport renders the virtualizer as its child, so the virtualizer scrolls with it; a bounded height on the scroll area's viewport is what makes the panel scroll, and the scrollbar is the scroller's to style. The virtualizer positions a row by its root and reka's item memoizes its element on its own state alone, so a row's corrected position, once measured, landed only when the row was next highlighted; consumers worked around it with an exact `estimateSize`. Each row is now a plain `.f-autocomplete-row` element the virtualizer positions and measures, with the item inside, so a measured height moves the rows after it and the estimate only seeds the first layout. An `item` slot on the active panel renders within that row: it may render any content, and `measure` is gone from its payload. The default item still carries `aria-setsize` and `aria-posinset`. In the nuxt layer, `Autocomplete` is wrapped with the layer's Scroller as its viewport, and the table's search renders through it.

- [`72fbdcf`](https://github.com/zoobzio/foundation/commit/72fbdcf6782282766804ddb7223ad783f2dd878f) Thanks [@zoobzio](https://github.com/zoobzio)! - Change loading indicator token to `--primary`.

- [`16696d8`](https://github.com/zoobzio/foundation/commit/16696d8c380ba97166cbfc1a0e29eac2eddfe4a2) Thanks [@zoobzio](https://github.com/zoobzio)! - The autocomplete has `inputPrepend` and `inputAppend` slots either side of its input and hint, within the group its content anchors to, as the command's filter does. The icon contract adds `magic` (`lucide:wand-sparkles`). In the nuxt layer, the table's search renders through the new `TableSearch`: the layer's Autocomplete with the `magic` icon before its input, the search key drawn as a `kbd` after it, and that key (`TABLE_SEARCH_KEY`, `/`) focusing the input from anywhere on the page the user is not already typing. The key is bound by `useFocusKey`, a composable over `@vueuse/core`'s `useMagicKeys` that focuses a target on a bare press of a key outside a field and cancels the press, leaving a press within a field or with a modifier held to its own handler; `@vueuse/core` is a new dependency of the layer. Both are on `#imports`.

- [`08825c2`](https://github.com/zoobzio/foundation/commit/08825c2c7be451cd1177a153a8d33198396c9aa4) Thanks [@zoobzio](https://github.com/zoobzio)! - Theme. A new `@zoobzio/theme` package carries the foundation theme: the aurora preset of untheme with the foundation palette (cobalt, amber, and teal on stone greys) as its base, authored as an `@untheme/kit` config over `npm:/@untheme/aurora` and built into the modules, the layers (`foundation` first, then every aurora theme), and the preset manifest the untheme runtime consumes. Beside the palette, `src/roles.json` is the injection point for the tokens foundation itself reads: color roles over aurora's roles, so each follows the scheme, the channels, and the applied theme with no bindings of its own. The first is `loading-indicator`, bound to `{primary}`.

  The Nuxt layer loads `@untheme/nuxt` with that package as its default `untheme` option, the way it loads `@icon-sheets/nuxt` with `@zoobzio/icons`, so an app that extends the layer boots the foundation palette, gets `useUntheme()` and the aurora cascade on every page, and may swap a scheme or apply a theme with no setup. An app with a theme of its own names `@zoobzio/theme` as the source of its kit config in place of aurora and passes its own package as `untheme.preset`; the module takes the closest layer's option as a whole. The shell's `NuxtLoadingIndicator` reads `var(--loading-indicator)` in place of `var(--primary)`.

- Updated dependencies [[`16696d8`](https://github.com/zoobzio/foundation/commit/16696d8c380ba97166cbfc1a0e29eac2eddfe4a2), [`16696d8`](https://github.com/zoobzio/foundation/commit/16696d8c380ba97166cbfc1a0e29eac2eddfe4a2), [`c1ac409`](https://github.com/zoobzio/foundation/commit/c1ac4090ba659cc0696a0d8ccd0ea05a0d820adc), [`16696d8`](https://github.com/zoobzio/foundation/commit/16696d8c380ba97166cbfc1a0e29eac2eddfe4a2), [`08825c2`](https://github.com/zoobzio/foundation/commit/08825c2c7be451cd1177a153a8d33198396c9aa4)]:
  - @zoobzio/vue@0.0.14
  - @zoobzio/query@0.0.14
  - @zoobzio/icons@0.0.14
  - @zoobzio/theme@0.0.14
  - @zoobzio/table@0.0.14
  - @zoobzio/browser@0.0.14
  - @zoobzio/form@0.0.14
  - @zoobzio/editor@0.0.14
  - @zoobzio/code@0.0.14

## 0.0.13

### Patch Changes

- Updated dependencies []:
  - @zoobzio/vue@0.0.13
  - @zoobzio/browser@0.0.13
  - @zoobzio/code@0.0.13
  - @zoobzio/editor@0.0.13
  - @zoobzio/form@0.0.13
  - @zoobzio/table@0.0.13
  - @zoobzio/icons@0.0.13

## 0.0.12

### Patch Changes

- Updated dependencies []:
  - @zoobzio/vue@0.0.12
  - @zoobzio/browser@0.0.12
  - @zoobzio/code@0.0.12
  - @zoobzio/editor@0.0.12
  - @zoobzio/form@0.0.12
  - @zoobzio/table@0.0.12
  - @zoobzio/icons@0.0.12

## 0.0.11

### Patch Changes

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
  - @zoobzio/vue@0.0.11
  - @zoobzio/browser@0.0.11
  - @zoobzio/icons@0.0.11
  - @zoobzio/table@0.0.11
  - @zoobzio/editor@0.0.11
  - @zoobzio/code@0.0.11

## 0.0.10

### Patch Changes

- Updated dependencies [[`6ab9cd1`](https://github.com/zoobzio/foundation/commit/6ab9cd1ff148f045cdebee9cfff3494950595ab8), [`9357f3b`](https://github.com/zoobzio/foundation/commit/9357f3b90980828445fd971b6c9936358eed41c2)]:
  - @zoobzio/vue@0.0.10
  - @zoobzio/form@0.0.10
  - @zoobzio/table@0.0.10
  - @zoobzio/browser@0.0.10
  - @zoobzio/editor@0.0.10
  - @zoobzio/code@0.0.10

## 0.0.9

### Patch Changes

- Updated dependencies [[`b124980`](https://github.com/zoobzio/foundation/commit/b124980537225de4e617946846954df73ca35570)]:
  - @zoobzio/table@0.0.9
  - @zoobzio/browser@0.0.9
  - @zoobzio/vue@0.0.9
  - @zoobzio/form@0.0.9
  - @zoobzio/editor@0.0.9
  - @zoobzio/code@0.0.9

## 0.0.8

### Patch Changes

- Updated dependencies [[`b6a0884`](https://github.com/zoobzio/foundation/commit/b6a088476d9c81775335f4d37adb2e46b0d967f5), [`e2face6`](https://github.com/zoobzio/foundation/commit/e2face63138af80cb0c9f23d3ae21d81e9134a04)]:
  - @zoobzio/form@0.0.8
  - @zoobzio/vue@0.0.8
  - @zoobzio/browser@0.0.8
  - @zoobzio/table@0.0.8
  - @zoobzio/editor@0.0.8
  - @zoobzio/code@0.0.8

## 0.0.7

### Patch Changes

- [`930baaa`](https://github.com/zoobzio/foundation/commit/930baaaa0f1f8570638f1e5c307ab98116b99c94) Thanks [@zoobzio](https://github.com/zoobzio)! - Add three field types to the form: `file` (a `File`), `multi-file` (a `File[]`), and `richtext` (the document as an HTML string, with `features` as the editor's feature set). The form field renders the first two through a new `file-input.vue`, a native file input with the picked files listed beneath it and a remove button on each, whose model is the list of files; it renders `richtext` through a new `rich-text.vue`, a v-model over an HTML string with an `@zoobzio/editor` service the component owns behind it, rendered through `editor.vue`. An edit writes the document through the `html` codec (`""` when the document is empty, so `z.string().min(1)` marks a required field), and a model write from outside replaces the document. The Nuxt layer registers both components, their `define*` constructors, and their types.

- Updated dependencies [[`930baaa`](https://github.com/zoobzio/foundation/commit/930baaaa0f1f8570638f1e5c307ab98116b99c94)]:
  - @zoobzio/form@0.0.7
  - @zoobzio/vue@0.0.7
  - @zoobzio/browser@0.0.7
  - @zoobzio/table@0.0.7
  - @zoobzio/editor@0.0.7
  - @zoobzio/code@0.0.7

## 0.0.6

### Patch Changes

- [`f1920da`](https://github.com/zoobzio/foundation/commit/f1920da6a5260824a324d716e331a773d0b16abb) Thanks [@zoobzio](https://github.com/zoobzio)! - fix: raise the catalog `vue` range to `^3.5.44` and dedupe the lockfile so the workspace resolves a single Vue. Nuxt 4.6 requires `^3.5.44` while the catalog still resolved `3.5.39`, leaving two copies of `vue` and `@vue/*` installed. Nitro writes every multi-version package into `.output/server/node_modules/.nitro/<pkg>@<version>` with nested `node_modules` symlinks between parent and child; because `vue` depends on `@vue/server-renderer` and `@vue/server-renderer` has `vue` as a peer, those links formed a cycle and the post-build size scan failed with `ELOOP: too many symbolic links encountered`. With one Vue version Nitro links the packages flat and `nuxi build` completes.

- Updated dependencies []:
  - @zoobzio/browser@0.0.6
  - @zoobzio/form@0.0.6
  - @zoobzio/table@0.0.6
  - @zoobzio/editor@0.0.6
  - @zoobzio/code@0.0.6
  - @zoobzio/vue@0.0.6

## 0.0.5

### Patch Changes

- [`e8e8463`](https://github.com/zoobzio/foundation/commit/e8e8463b8df736801cdcd6ca5a1020ee99661c71) Thanks [@zoobzio](https://github.com/zoobzio)! - feat: code component and useCode composable over the headless code service, static until the user interacts, with its Nuxt store, factory, and hooks

- [`946e44d`](https://github.com/zoobzio/foundation/commit/946e44d0ad3dccf9f08ab5c3f90ad5a169736668) Thanks [@zoobzio](https://github.com/zoobzio)! - feat: editor component and useEditor composable over the headless editor service, static until the user interacts, with its Nuxt store, factory, and hooks

- Updated dependencies [[`e8e8463`](https://github.com/zoobzio/foundation/commit/e8e8463b8df736801cdcd6ca5a1020ee99661c71), [`e8e8463`](https://github.com/zoobzio/foundation/commit/e8e8463b8df736801cdcd6ca5a1020ee99661c71), [`8834379`](https://github.com/zoobzio/foundation/commit/8834379594010041bc4bb272c4a87add3ba97265), [`946e44d`](https://github.com/zoobzio/foundation/commit/946e44d0ad3dccf9f08ab5c3f90ad5a169736668), [`946e44d`](https://github.com/zoobzio/foundation/commit/946e44d0ad3dccf9f08ab5c3f90ad5a169736668), [`a684eb7`](https://github.com/zoobzio/foundation/commit/a684eb7a6a7c1cc75c5266d86dac7b0a53c9f069), [`0c850a2`](https://github.com/zoobzio/foundation/commit/0c850a2c743a548ea9f42e42984c3580ecb289dd)]:
  - @zoobzio/code@0.0.5
  - @zoobzio/vue@0.0.5
  - @zoobzio/editor@0.0.5
  - @zoobzio/form@0.0.5
  - @zoobzio/browser@0.0.5
  - @zoobzio/table@0.0.5

## 0.0.4

### Patch Changes

- Updated dependencies [[`0b68b05`](https://github.com/zoobzio/foundation/commit/0b68b05c8c0798ebb23944a5b90d2bb1a233bf51)]:
  - @zoobzio/vue@0.0.4
  - @zoobzio/browser@0.0.4
  - @zoobzio/form@0.0.4
  - @zoobzio/table@0.0.4

## 0.0.3

### Patch Changes

- [`ad41dec`](https://github.com/zoobzio/foundation/commit/ad41dec4af4ca8a5bf6b9722dcd09c41277a415c) Thanks [@zoobzio](https://github.com/zoobzio)! - The imports module registers `@zoobzio/vue` components, `define*` functions, and types with their `.dist` declarations as the type source (`declarationPath` / `typeFrom`), while runtime still resolves to source. Generated `#components` and `#imports` declarations no longer pull `@zoobzio/vue` source into a consumer's typecheck.

- Updated dependencies []:
  - @zoobzio/browser@0.0.3
  - @zoobzio/form@0.0.3
  - @zoobzio/table@0.0.3
  - @zoobzio/vue@0.0.3

## 0.0.2

### Patch Changes

- [`11569ca`](https://github.com/zoobzio/foundation/commit/11569cac7b307f2b3c95a6c912dbd128d0dc7368) Thanks [@zoobzio](https://github.com/zoobzio)! - The layer's own code no longer reads from `#imports` or `#components`.

  - Both are the consumer's build artifacts: the imports module fills them, and the layer's source imports Nuxt APIs from `#app`, Vue APIs from `vue`, and `NuxtLink` from `#app/components/nuxt-link`. Only `app.vue` keeps `#components`, for the shell built-ins whose module depends on the consumer's pages.
  - An oxlint layer graph (types > constants > utils > stores > composables > factories > components > plugins) refuses an import from a higher layer, a cycle, and the two aliases, so the layer's `#imports` surface cannot be used to route around it.

- [`11569ca`](https://github.com/zoobzio/foundation/commit/11569cac7b307f2b3c95a6c912dbd128d0dc7368) Thanks [@zoobzio](https://github.com/zoobzio)! - `#components` serves the layer's own wrappers for the components that hold links.

  - `Breadcrumb`, `Browser`, `Directory`, `Hero`, `Menu`, `SegmentedControl`, `Table`, `Tabs`, and `Tree` in `app/components/` wrap the vue component and lay `NuxtLink` under its `link` part, so navigation goes through the router with no setup. A wrapper keeps the vue component's contract: the same props, emits, slots, and `ctx`, typed from the same `@zoobzio/vue` types.
  - A consumer's `pt.link` composes with the layer's through `usePassthrough`, so an override keeps `NuxtLink` unless it sets `as`. A disabled item has no `href`, and `NuxtLink` renders it as an inert anchor. `Table` and `Browser` lay the part under `pt.body`, `pt.files`, and `pt.breadcrumb.pt`.
  - The imports module registers a wrapped name from the layer instead of `@zoobzio/vue`; the vue component itself is no longer in `#components`.

- Updated dependencies [[`bfcac44`](https://github.com/zoobzio/foundation/commit/bfcac44da97192a29931450ae82bef3539006684), [`11569ca`](https://github.com/zoobzio/foundation/commit/11569cac7b307f2b3c95a6c912dbd128d0dc7368), [`11569ca`](https://github.com/zoobzio/foundation/commit/11569cac7b307f2b3c95a6c912dbd128d0dc7368)]:
  - @zoobzio/vue@0.0.2
  - @zoobzio/browser@0.0.2
  - @zoobzio/form@0.0.2
  - @zoobzio/table@0.0.2

## 0.0.1

### Patch Changes

- [`00314f2`](https://github.com/zoobzio/foundation/commit/00314f2819555e2681b5739510aaa7ecb3c4c356) Thanks [@zoobzio](https://github.com/zoobzio)! - Initial alpha release: the headless services (`kit`, `query`, `browser`, `form`, `table`), the Vue components, and the Nuxt layer.

- Updated dependencies [[`00314f2`](https://github.com/zoobzio/foundation/commit/00314f2819555e2681b5739510aaa7ecb3c4c356)]:
  - @zoobzio/browser@0.0.1
  - @zoobzio/form@0.0.1
  - @zoobzio/table@0.0.1
  - @zoobzio/vue@0.0.1
