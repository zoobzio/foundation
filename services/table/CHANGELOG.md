# @zoobzio/table

## 0.1.8

### Patch Changes

- Updated dependencies []:
  - @zoobzio/kit@0.1.8
  - @zoobzio/query@0.1.8

## 0.1.7

### Patch Changes

- Updated dependencies []:
  - @zoobzio/kit@0.1.7
  - @zoobzio/query@0.1.7

## 0.1.6

### Patch Changes

- [`ce677cf`](https://github.com/zoobzio/foundation/commit/ce677cfc26dd4e236d2a233d2e37fd1eef443e6b) Thanks [@zoobzio](https://github.com/zoobzio)! - A column of `@zoobzio/table` may name a route for its cells: `link: (row) => string` on `DataTableColumn`. The table body of `@zoobzio/vue` renders each cell of such a column through its `link` part, an anchor to the route with no `target` or `rel`, around the content the cell would otherwise render: the type's default formatting or a `cell:<type>` slot. A `cell:<key>` slot still replaces the whole cell, and a `url` column without a route keeps its own link to the value in a new tab. The query does not read `link`, so it stays off the column's field, and the column manager's option. The nuxt layer changes nothing: `NuxtLink` already lies under the body's `link` part, so a linked cell routes through the router.

- Updated dependencies []:
  - @zoobzio/kit@0.1.6
  - @zoobzio/query@0.1.6

## 0.1.5

### Patch Changes

- [`eb3ec99`](https://github.com/zoobzio/foundation/commit/eb3ec9958b5091dc05bbee9d170056a7ef283697) Thanks [@zoobzio](https://github.com/zoobzio)! - `dateValues(timeZone, now)` of `@zoobzio/query` is a values provider for a field that filters on a date: it generates `YYYY-MM-DD` days from the term, so a visitor always has an option to pick as long as the term is date syntax. An empty term lists the last 31 days, today first, as the day reads in `timeZone`; a partial year narrows those; a full year lists its days newest first, 31 at most; a month lists its days; a partial day the days of the month that match; a complete day stands alone; and a day that does not exist, or a term that is not date syntax, lists nothing. Every option is a whole day, as choosing one commits the filter; years and months may lie in the future, and only the empty term looks back from today. `QUERY_DATE_VALUES_LIMIT` is the window and the cap. The table applies it by default to every `date` and `datetime` column that declares no `values` of its own, reading today in the config's `timeZone`; a column's own `values` replace it. The query machine, the autocomplete and the components change nothing: the provider is the seam `values` already offered.

- Updated dependencies [[`eb3ec99`](https://github.com/zoobzio/foundation/commit/eb3ec9958b5091dc05bbee9d170056a7ef283697)]:
  - @zoobzio/query@0.1.5
  - @zoobzio/kit@0.1.5

## 0.1.4

### Patch Changes

- Updated dependencies []:
  - @zoobzio/kit@0.1.4
  - @zoobzio/query@0.1.4

## 0.1.3

### Patch Changes

- [`4d53efc`](https://github.com/zoobzio/foundation/commit/4d53efcc827acf43f31378d48d4695a7dbc581ad) Thanks [@zoobzio](https://github.com/zoobzio)! - Add `@zoobzio/prose`, the text of the design system: every label, placeholder and notice the components render by default, authored as FormatJS messages and built by `@prosary/kit` into a typed contract and a bundle per locale. The kit's new `Text` type is what a service or a component carries wherever it carried a label: `string`, until a layer widens it by merging into `TextMap`. The packages and the vue components change in type alone, and render text as they did. `wrap` of `@zoobzio/vue` takes a `props` map, laid under the consumer's props on each render; the bulk-action bars, the column manager and the editor's tools gain a slot around their text, and the date filters' context carries its step and apply. The Nuxt layer loads `@prosary/nuxt` with the prose build as its `prosary.build`, widens `Text` to the app's whole contract, and resolves every message at its boundary: its wrappers resolve the data they are handed and supply the components' defaults from the contract through `pt`, slots and `props`; its factories resolve the labels of a service's columns, actions and fields as the service is built; and its `locale` plugin reloads the app on a switch. The error page, the request defaults and the app's fallback notification read from the contract too.

- Updated dependencies [[`4d53efc`](https://github.com/zoobzio/foundation/commit/4d53efcc827acf43f31378d48d4695a7dbc581ad)]:
  - @zoobzio/kit@0.1.3
  - @zoobzio/query@0.1.3

## 0.1.2

### Patch Changes

- [`cc42cba`](https://github.com/zoobzio/foundation/commit/cc42cba367086ee88c132c2cb7a12cd97593210e) Thanks [@zoobzio](https://github.com/zoobzio)! - The query's text stage is generalized into literals: a value typed between its own `open` and `close` characters, with a label for its option and no stage to suggest from. The config's `literals` are keyed as its fields are, and default to the text literal alone, `text`: free text between quotes under `Search`, the one `text` reads, so a word that is also a field's label is never taken for one. The field panel leads with the literal options while nothing is typed; selecting one writes its `open` before the term typed so far. The literal stage is terminal: it suggests nothing and adds no trail, so the panels are empty while the literal is typed and a panel view closes, where the text stage held its option open in the trail. Typing the `close` commits the literal at once, as Enter does an unclosed one; a bare term submits nothing, as it names a field still. A literal entry is `{ kind: "literal", key, value }`, one held per key, in place of the `text` entry kind; `textFor` of one is its value between the characters, the string `labelFor` gives and `unwrap` hands back minus the last character. `literals: {}` replaces `text: false`: there is no literal option and a quote is a character. `Literal` is an interface a layer may widen, its other properties carried onto its option as a field's are; `QUERY_TEXT_LITERAL`, `QUERY_LITERALS`, and `QUERY_TEXT_KEY` replace the quote and label constants. The table's config takes `literals` in place of `textLabel` and hands them to its query. The vue autocomplete renders nothing, not even its empty state, in a literal stage. The nuxt layer widens `Literal` with `icon`, draws `search` before a literal option that names none, and no arrow after one, as it is terminal.

- Updated dependencies [[`cc42cba`](https://github.com/zoobzio/foundation/commit/cc42cba367086ee88c132c2cb7a12cd97593210e)]:
  - @zoobzio/query@0.1.2
  - @zoobzio/kit@0.1.2

## 0.1.1

### Patch Changes

- [`adbb87f`](https://github.com/zoobzio/foundation/commit/adbb87fb4086243d843b7c981a5e7b84cd58a62b) Thanks [@zoobzio](https://github.com/zoobzio)! - Free text is quoted in the query's draft: `"text"` is the text stage beside `Label: op term`, so a word that is also a field's label is never taken for a search. The field panel leads with the text option, labelled `Search` or the config's `textLabel`, while nothing is typed; selecting it opens the quote before the term typed so far, and while the draft is quoted it is the active trail option, so selecting it again steps back out. The closing quote commits the text at once, as Enter does an unclosed one. A bare term submits nothing: it names a field still. `textFor` of a text entry is its quoted text, the same string `labelFor` gives and `unwrap` hands back minus the closing quote. With `text: false` there is no text option and a quote is a character. The table's config takes `textLabel` and hands it to its query. The nuxt layer's autocomplete draws the `search` icon before the text option, and `next` after it as after any option that enters a stage.

- Updated dependencies [[`adbb87f`](https://github.com/zoobzio/foundation/commit/adbb87fb4086243d843b7c981a5e7b84cd58a62b)]:
  - @zoobzio/query@0.1.1
  - @zoobzio/kit@0.1.1

## 0.1.0

### Minor Changes

- [`506f77e`](https://github.com/zoobzio/foundation/commit/506f77e7c2795aae8c775362168f2e0ed1d3e4d8) Thanks [@zoobzio](https://github.com/zoobzio)! - A table column declares its own query vocabulary: `operators`, `defaultOperator`, and `values` (a list or a provider), named as the query's `Field` names them. The table supplies none from the column type, as it gives an operator no meaning: the consumer reads it from the filters its fetch is handed. A column that declares nothing is a bare field, free entry and no operator stage. `enumValues` is gone: a column's `values` is the one list. The operator constants (`TABLE_OPERATORS`, `TABLE_DEFAULT_OPERATORS`, and the date and number lists) are gone with them. The browser column drops its unused `enumValues` as well.

### Patch Changes

- [`f169434`](https://github.com/zoobzio/foundation/commit/f1694342c7717d2ada6d8ce2795586db09f16fcc) Thanks [@zoobzio](https://github.com/zoobzio)! - A table column's properties beyond the ones the table reads are carried through: `fields` puts them on the column's query field, and the vue table's `columnOption` puts them on the column manager's option. The nuxt layer widens `DataTableColumn` with `icon?: IconAlias`, so a column's `icon` draws before its header (the wrapper's default `headerPrepend`), beside its field in the search, and beside its option in the column manager.

- Updated dependencies [[`83b3439`](https://github.com/zoobzio/foundation/commit/83b3439176a69479e567f86aa18d4bce1db5ed2d)]:
  - @zoobzio/query@0.1.0
  - @zoobzio/kit@0.1.0

## 0.0.15

### Patch Changes

- Updated dependencies []:
  - @zoobzio/kit@0.0.15
  - @zoobzio/query@0.0.15

## 0.0.14

### Patch Changes

- Updated dependencies [[`16696d8`](https://github.com/zoobzio/foundation/commit/16696d8c380ba97166cbfc1a0e29eac2eddfe4a2)]:
  - @zoobzio/query@0.0.14
  - @zoobzio/kit@0.0.14

## 0.0.13

### Patch Changes

- Updated dependencies [[`bf27e77`](https://github.com/zoobzio/foundation/commit/bf27e77fa3b8344d7999acd2f1a4f9ee53cad802)]:
  - @zoobzio/kit@0.0.13
  - @zoobzio/query@0.0.13

## 0.0.12

### Patch Changes

- Updated dependencies [[`0c7ba4d`](https://github.com/zoobzio/foundation/commit/0c7ba4db69e3457c90cbe296e1132fb65cdfdce4)]:
  - @zoobzio/kit@0.0.12
  - @zoobzio/query@0.0.12

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

- Updated dependencies []:
  - @zoobzio/kit@0.0.11
  - @zoobzio/query@0.0.11

## 0.0.10

### Patch Changes

- Updated dependencies [[`8145080`](https://github.com/zoobzio/foundation/commit/81450806518eccb6131f2c7e02bb0a87bc85128a)]:
  - @zoobzio/query@0.0.10
  - @zoobzio/kit@0.0.10

## 0.0.9

### Patch Changes

- [`b124980`](https://github.com/zoobzio/foundation/commit/b124980537225de4e617946846954df73ca35570) Thanks [@zoobzio](https://github.com/zoobzio)! - The table and browser configs take a `timeZone`, the IANA zone their `date` and `datetime` cells format in, beside `locale` and `currency`. It defaults to `UTC`, so a server and a browser render the same text and hydration no longer depends on the process zone. A calendar day, `YYYY-MM-DD`, always formats in UTC: a day has no zone to shift it into the one before. `cell` in `@zoobzio/vue` takes the zone as its fifth argument.

- Updated dependencies []:
  - @zoobzio/kit@0.0.9
  - @zoobzio/query@0.0.9

## 0.0.8

### Patch Changes

- Updated dependencies []:
  - @zoobzio/kit@0.0.8
  - @zoobzio/query@0.0.8

## 0.0.7

### Patch Changes

- Updated dependencies []:
  - @zoobzio/kit@0.0.7
  - @zoobzio/query@0.0.7

## 0.0.6

### Patch Changes

- Updated dependencies []:
  - @zoobzio/kit@0.0.6
  - @zoobzio/query@0.0.6

## 0.0.5

### Patch Changes

- Updated dependencies [[`8834379`](https://github.com/zoobzio/foundation/commit/8834379594010041bc4bb272c4a87add3ba97265)]:
  - @zoobzio/kit@0.0.5
  - @zoobzio/query@0.0.5

## 0.0.4

### Patch Changes

- Updated dependencies []:
  - @zoobzio/kit@0.0.4
  - @zoobzio/query@0.0.4

## 0.0.3

### Patch Changes

- Updated dependencies []:
  - @zoobzio/kit@0.0.3
  - @zoobzio/query@0.0.3

## 0.0.2

### Patch Changes

- Updated dependencies []:
  - @zoobzio/kit@0.0.2
  - @zoobzio/query@0.0.2

## 0.0.1

### Patch Changes

- [`00314f2`](https://github.com/zoobzio/foundation/commit/00314f2819555e2681b5739510aaa7ecb3c4c356) Thanks [@zoobzio](https://github.com/zoobzio)! - Initial alpha release: the headless services (`kit`, `query`, `browser`, `form`, `table`), the Vue components, and the Nuxt layer.

- Updated dependencies [[`00314f2`](https://github.com/zoobzio/foundation/commit/00314f2819555e2681b5739510aaa7ecb3c4c356)]:
  - @zoobzio/kit@0.0.1
  - @zoobzio/query@0.0.1
