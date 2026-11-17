# @zoobzio/browser

## 0.1.12

### Patch Changes

- [`6a25d6c`](https://github.com/zoobzio/foundation/commit/6a25d6cffcf9b0efc56ba1d2bc5052769312251e) Thanks [@zoobzio](https://github.com/zoobzio)! - Browser crumbs can be links: a folder's `link` and the config's `rootLink` reach the trail, and the browser head renders those crumbs as anchors.

- [`86c4cd2`](https://github.com/zoobzio/foundation/commit/86c4cd25d1ae20e20f7f7d91c2da607a241da05b) Thanks [@zoobzio](https://github.com/zoobzio)! - The query's committed entries are its clauses. Breaking: the `Entry` type is `Clause`, and `entries` is `clauses` on the query service, its state container, and its `changed` event; on the table's and the browser's containers and snapshots; and the table's `initialEntries` config is `initialClauses`. The autocomplete's chip slots are handed `clause` in place of `entry`, and `QueryEntry` is `QueryClause`. `TABLE_VIEW_SCHEMA` and `BROWSER_VIEW_SCHEMA` read a view stored under `entries` as its `clauses`; each is now a preprocess over its object, so an app that extends one extends its `out`.

- Updated dependencies [[`86c4cd2`](https://github.com/zoobzio/foundation/commit/86c4cd25d1ae20e20f7f7d91c2da607a241da05b)]:
  - @zoobzio/query@0.1.12
  - @zoobzio/kit@0.1.12

## 0.1.11

### Patch Changes

- Updated dependencies [[`a365fe4`](https://github.com/zoobzio/foundation/commit/a365fe4a423c09e6ec11aaaaea1cd46fa0c8e7c6)]:
  - @zoobzio/kit@0.1.11
  - @zoobzio/query@0.1.11

## 0.1.10

### Patch Changes

- [`acded68`](https://github.com/zoobzio/foundation/commit/acded68743ce435c0aee70008c9b29b0ed4096f9) Thanks [@zoobzio](https://github.com/zoobzio)! - The browser's folders use the files' columns and take part in the selection. In `@zoobzio/browser` a folder carries `values`, what it shows under each column (`BrowserFolder<T>`, generic over the file with a default, as `FolderAction<T>` now is). Its label renders in the first column. Folders select beside files: their keys are a second set of the container, `selectedFolders`, as a folder's key and a file's may be the same, with `toggleFolder` and `isFolderSelected` on the service and `selectionCount` over both sets. `toggleAll`, `isAllSelected`, `isIndeterminate`, `hasSelection`, and `clearSelection` cover both, and a bulk handler is handed the folder keys after the file keys. A fetch that settles now keeps only the selected keys it still lists, so a bulk action no longer reaches a row a search or a refresh took out of view. The service no longer re-sorts the folders by label: they render in the order the fetch returns them, as the files do, so a fetch can sort them by the column it is handed.

  The vue `browser-folders.vue` renders a cell per column in place of one cell across them: the label in the first column, the folder's `values` in the others, formatted as a file's are and empty where it carries none, overridden through `folderCell:<key>`, `folderCell:<type>`, and `folderCell`. Where the service is selectable a folder row has a checkbox (the `rowCheckbox` part of `pt.folders`) and `f-data-browser-selected`, and the bulk actions bar counts folders and files.

  The nuxt wrapper formats a folder's typed values through the prosary service as it does a file's and draws the folder checkbox as the layer's `Checkbox`; `createBrowser` takes `selectedFolders` in `initial`.

  Breaking: a fetch that relied on the service to put its folders in alphabetical order must now return them in it, and `sortFolders` is gone from the package's utilities. Folders are selectable wherever a bulk action is declared, so a bulk handler that reads its first argument alone acts on the files of a selection that may also hold folders: read the second. The `folder` slot fills the first column's cell rather than one spanning every column, and a folder row's selection cell is no longer empty. A selection seeded through `initial` is narrowed to the first listing.

- [`74c7717`](https://github.com/zoobzio/foundation/commit/74c7717e676ed9f71486905aabfd9ea3288a6424) Thanks [@zoobzio](https://github.com/zoobzio)! - The browser searches and sorts from its toolbar, and its trail is the head of its listing. `@zoobzio/browser` holds a `query`, a `@zoobzio/query` machine over its filterable columns as the table's is: a column declares `filterable`, `operators`, `defaultOperator`, and `values`, the config `searchable` and `literals`, and the container gains the query's `entries` and `draft`. A change to the entries refetches the current folder and emits `filtered`; the fetch is handed `query` and `filters` beside `path`. A search belongs to the folder it was typed in, so `open` and `navigate` drop it in the one fetch the move makes: a fetch that matches within `path` searches the current folder. `sortableColumns`, `filterableColumns`, and `isFiltered` are new on the service.

  The vue `browser.vue` toolbar is now the search (the `search` part and slot, an autocomplete over the query), a sort menu over the sortable columns (the `sortMenu` and `sortTrigger` parts, the `sort`, `sortPrepend`, and `sortAppend` slots; the sorted item carries `data-current` and `data-direction`), and the refresh. The breadcrumb leaves the toolbar for a head on the table, the new `browser-head.vue` (`BrowserHead*` types, `f-data-browser-head`): the select-all checkbox, which the browser had no place for, then one cell with the trail and the listing's counts (`summary` slot, `f-data-browser-summary`), with `crumbPrepend` and `crumbAppend` around a crumb's label. It relays `filtered`.

  Breaking for a consumer of the view: the breadcrumb's passthrough moves from `pt.breadcrumb` to `pt.head.breadcrumb`, `BrowserCrumbItem` is declared in `types/components/browser-head`, the `breadcrumb` slot's scope is the head's context, and the `toolbar` slot no longer wraps the trail. The table and its head now stay over a settled empty folder, so the `empty` slot fills a cell of a `tbody.f-data-browser-empty` rather than replacing the table, and its default reads `No matches` under a search.

  The nuxt wrapper draws the search as the table's (`TableSearch`), `sort` on the sort trigger until the files sort by a column and `sort-asc` or `sort-desc` after, as on that column's menu item, and `folder-open` before the root crumb; `sort` and `folder-open` are new aliases of `@zoobzio/icons`. `createBrowser` relays `browser:filtered`, takes `entries` in `initial`, and labels the text literal from the contract. A browser column takes an `icon`, drawn in the search and the sort menu. New in the prose contract: `browser.search`, `browser.text`, `browser.sort`, `browser.summary`, and `browser.noMatches`.

- [`f3ba642`](https://github.com/zoobzio/foundation/commit/f3ba642458b64fb7b5e175ece3ff8e5fe9f196e7) Thanks [@zoobzio](https://github.com/zoobzio)! - A field's values provider may ask an API, and gives its values a page at a time. `@zoobzio/query` asks a provider once per change of the draft, at the value stage, rather than on every read of `items`, and holds what it gives in a new member of the container, `suggest`: `{ options, status, more }`. A provider gives a list, a page (`{ values, next }`), or a promise of either, and is handed the lookup beside the term: the field `key`, the `op`, an `AbortSignal`, and the `cursor`. `more()` asks for the page after the last while the provider names one, and adds its values to the options. `status` is `loading` for the first page of a term and `extending` for a further one; the options of the term before stay while the next loads on the same field and operator. A draft that moves on aborts the lookup and drops its result. A provider that throws or rejects emits the new `failed` event. `debounced(provider, ms)` wraps a provider so a term typed through asks once. `Provider`, `Page`, `Lookup`, `Suggest`, and `SuggestStatus` are new types; the service gains `suggest` and `more`.

  Breaking for a consumer of `dateValues`: it returns a page, `{ values, next }`, where it returned a list, and `QUERY_DATE_VALUES_LIMIT` is the size of a page where it was a cap. The days no longer stop at 31: an empty term runs back from today with no end, and a year lists all its days. A partial year runs back from the latest day it can start rather than narrowing the last 31 days, so `19` lists from `1999-12-31` where it listed nothing. A year below 1000 reads as itself, `0099-12-31`.

  Breaking for a container built by hand: `State` of the query, the table, and the browser gains `suggest`, which `createQueryState`, `createTableState`, and `createBrowserState` seed.

  The vue `autocomplete.vue` asks for more as the visitor nears the end of a provider's options, by scroll or by key: a sentinel (`f-autocomplete-sentinel`) lies over the last of them, `AUTOCOMPLETE_MORE_LEAD` deep, and is watched while it is on screen. The viewport of the active panel needs a height to bound it, as before; without one the options load until they run off the page. New slots: `loading`, in place of the options while a first page is out and none are held, and `more`, after the options while a further page is out. The content carries `aria-busy` through either, and an item's `aria-setsize` is `-1` while more remain. Fixed: the default `empty` state rendered under the options whenever `empty` was set; it now renders once the panel has none.

  The texts of the autocomplete's panel are named: `AUTOCOMPLETE_EMPTY_TEXT`, `AUTOCOMPLETE_LOADING_TEXT`, and `AUTOCOMPLETE_MORE_TEXT` in the vue package, and the nuxt wrapper reads the `empty`, `loading`, and `more` states from the contract, so they follow the visitor's locale. New in the prose contract: `autocomplete.empty`, `autocomplete.loading`, and `autocomplete.more`.

- [`56e6d5b`](https://github.com/zoobzio/foundation/commit/56e6d5b4ecc0a8eb47eee18ad48c09f47d00a932) Thanks [@zoobzio](https://github.com/zoobzio)! - Saved views. `@zoobzio/views` is a new headless service: named payloads over a Zod schema the payload type is inferred from, the active view, and the lifecycle around them (`select`, `save`, `saveAs`, `rename`, `remove`, `revert`). It holds no live payload: `read` yields it and `apply` puts one in place, so a table or a browser stays the source of truth and `drifted` is the difference between what it holds and the active view. A view is the app's or inherited (`system`: select and copy only) or the user's own. An action that would lose something (a selection over unsaved edits, a revert, a removal) is held as `pending` until `resolve("save" | "proceed" | "cancel")`; a save that fails leaves the intent pending and the edits in place. A stored view the schema no longer accepts is set aside as `stale` and never applied.

  `@zoobzio/table` and `@zoobzio/browser` gain `snapshot()` and `restore(snapshot)`, and a `restored` event. A table's snapshot is its `sorting`, `columnOrder`, `columnVisibility`, and `columnSizing` slices, its `pageSize`, and the query's `entries`; a browser's is its `sortField`, `sortDirection`, and `entries`. A restore lands in one fetch, from the first page, and fetches nothing before `init`. `@zoobzio/query` gains `replace(entries)`, which commits a whole set of entries with one `changed`.

  The vue `views.vue` renders the service: the views as tabs, a mark on the active tab while it has drifted (`f-views-drifted` on the root, `f-views-badge` on the tab), the active view's actions in a menu beside them, and the dialogs that confirm a pending intent and name a view. `defineViews` and the `Views*` types come with it.

  The nuxt layer has `createViews(id, options)`, whose composable takes what the views are over (anything with a `snapshot` and a `restore`), `accessViews`, the `views:*` hooks, `TABLE_VIEW_SCHEMA` and `BROWSER_VIEW_SCHEMA` with their `TableView` and `BrowserView` types, and the `Views` component with its text under `views.*` in `@zoobzio/prose`. `createTable` and `createBrowser` relay `table:restored` and `browser:restored`.

- Updated dependencies [[`f3ba642`](https://github.com/zoobzio/foundation/commit/f3ba642458b64fb7b5e175ece3ff8e5fe9f196e7), [`56e6d5b`](https://github.com/zoobzio/foundation/commit/56e6d5b4ecc0a8eb47eee18ad48c09f47d00a932)]:
  - @zoobzio/query@0.1.10
  - @zoobzio/kit@0.1.10

## 0.1.9

### Patch Changes

- Updated dependencies []:
  - @zoobzio/kit@0.1.9

## 0.1.8

### Patch Changes

- Updated dependencies []:
  - @zoobzio/kit@0.1.8

## 0.1.7

### Patch Changes

- Updated dependencies []:
  - @zoobzio/kit@0.1.7

## 0.1.6

### Patch Changes

- Updated dependencies []:
  - @zoobzio/kit@0.1.6

## 0.1.5

### Patch Changes

- Updated dependencies []:
  - @zoobzio/kit@0.1.5

## 0.1.4

### Patch Changes

- [`16cde38`](https://github.com/zoobzio/foundation/commit/16cde38403b100b642cbaaa9c47320e60dc4829b) Thanks [@zoobzio](https://github.com/zoobzio)! - The Nuxt layer resolves a label where the component renders it. Every component of `@zoobzio/vue` now exposes a slot around each text it draws — the select's and multi-select's `itemLabel`, the listbox's `itemLabel`, the tabs' and the accordion's `triggerLabel`, the hero's `actionLabel`, the form field's `labelText` and `hintText`, the tree's `itemText`, and the date filters' `fieldLabel`, `operatorLabel` and `valueLabel` over a context that carries the stepper's `field`, `operator` and `value` — and the select, multi-select and autocomplete leave an item's typeahead text to what the item renders. The layer's wrappers fill those slots with the text in the visitor's locale and hand their props through untouched, save a scalar the component gives to an attribute (a placeholder, an accessible name); the `texts` helper that resolved a wrapper's props by walking them is gone. The factories resolve the whole config of a table, browser or form in one call, rather than the columns, actions and fields by name, so a text anywhere in the config — a literal's label, say — resolves as a column's does; the form's `defaults`, the payload's values, stand as given. Two defaults the headless packages ship in English have messages in `@zoobzio/prose` and are laid under the config when it names none: `table.text`, the label of the query's text literal, and `browser.root`, the label of the browser's root crumb. `@zoobzio/browser` carries `rootLabel` and a crumb's `label` as `Text`, as it carries a column's.

- Updated dependencies []:
  - @zoobzio/kit@0.1.4

## 0.1.3

### Patch Changes

- [`4d53efc`](https://github.com/zoobzio/foundation/commit/4d53efcc827acf43f31378d48d4695a7dbc581ad) Thanks [@zoobzio](https://github.com/zoobzio)! - Add `@zoobzio/prose`, the text of the design system: every label, placeholder and notice the components render by default, authored as FormatJS messages and built by `@prosary/kit` into a typed contract and a bundle per locale. The kit's new `Text` type is what a service or a component carries wherever it carried a label: `string`, until a layer widens it by merging into `TextMap`. The packages and the vue components change in type alone, and render text as they did. `wrap` of `@zoobzio/vue` takes a `props` map, laid under the consumer's props on each render; the bulk-action bars, the column manager and the editor's tools gain a slot around their text, and the date filters' context carries its step and apply. The Nuxt layer loads `@prosary/nuxt` with the prose build as its `prosary.build`, widens `Text` to the app's whole contract, and resolves every message at its boundary: its wrappers resolve the data they are handed and supply the components' defaults from the contract through `pt`, slots and `props`; its factories resolve the labels of a service's columns, actions and fields as the service is built; and its `locale` plugin reloads the app on a switch. The error page, the request defaults and the app's fallback notification read from the contract too.

- Updated dependencies [[`4d53efc`](https://github.com/zoobzio/foundation/commit/4d53efcc827acf43f31378d48d4695a7dbc581ad)]:
  - @zoobzio/kit@0.1.3

## 0.1.2

### Patch Changes

- Updated dependencies []:
  - @zoobzio/kit@0.1.2

## 0.1.1

### Patch Changes

- Updated dependencies []:
  - @zoobzio/kit@0.1.1

## 0.1.0

### Minor Changes

- [`506f77e`](https://github.com/zoobzio/foundation/commit/506f77e7c2795aae8c775362168f2e0ed1d3e4d8) Thanks [@zoobzio](https://github.com/zoobzio)! - A table column declares its own query vocabulary: `operators`, `defaultOperator`, and `values` (a list or a provider), named as the query's `Field` names them. The table supplies none from the column type, as it gives an operator no meaning: the consumer reads it from the filters its fetch is handed. A column that declares nothing is a bare field, free entry and no operator stage. `enumValues` is gone: a column's `values` is the one list. The operator constants (`TABLE_OPERATORS`, `TABLE_DEFAULT_OPERATORS`, and the date and number lists) are gone with them. The browser column drops its unused `enumValues` as well.

### Patch Changes

- Updated dependencies []:
  - @zoobzio/kit@0.1.0

## 0.0.15

### Patch Changes

- Updated dependencies []:
  - @zoobzio/kit@0.0.15

## 0.0.14

### Patch Changes

- Updated dependencies []:
  - @zoobzio/kit@0.0.14

## 0.0.13

### Patch Changes

- Updated dependencies [[`bf27e77`](https://github.com/zoobzio/foundation/commit/bf27e77fa3b8344d7999acd2f1a4f9ee53cad802)]:
  - @zoobzio/kit@0.0.13

## 0.0.12

### Patch Changes

- Updated dependencies [[`0c7ba4d`](https://github.com/zoobzio/foundation/commit/0c7ba4db69e3457c90cbe296e1132fb65cdfdce4)]:
  - @zoobzio/kit@0.0.12

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

## 0.0.10

### Patch Changes

- Updated dependencies []:
  - @zoobzio/kit@0.0.10

## 0.0.9

### Patch Changes

- [`b124980`](https://github.com/zoobzio/foundation/commit/b124980537225de4e617946846954df73ca35570) Thanks [@zoobzio](https://github.com/zoobzio)! - The table and browser configs take a `timeZone`, the IANA zone their `date` and `datetime` cells format in, beside `locale` and `currency`. It defaults to `UTC`, so a server and a browser render the same text and hydration no longer depends on the process zone. A calendar day, `YYYY-MM-DD`, always formats in UTC: a day has no zone to shift it into the one before. `cell` in `@zoobzio/vue` takes the zone as its fifth argument.

- Updated dependencies []:
  - @zoobzio/kit@0.0.9

## 0.0.8

### Patch Changes

- Updated dependencies []:
  - @zoobzio/kit@0.0.8

## 0.0.7

### Patch Changes

- Updated dependencies []:
  - @zoobzio/kit@0.0.7

## 0.0.6

### Patch Changes

- Updated dependencies []:
  - @zoobzio/kit@0.0.6

## 0.0.5

### Patch Changes

- Updated dependencies [[`8834379`](https://github.com/zoobzio/foundation/commit/8834379594010041bc4bb272c4a87add3ba97265)]:
  - @zoobzio/kit@0.0.5

## 0.0.4

### Patch Changes

- Updated dependencies []:
  - @zoobzio/kit@0.0.4

## 0.0.3

### Patch Changes

- Updated dependencies []:
  - @zoobzio/kit@0.0.3

## 0.0.2

### Patch Changes

- Updated dependencies []:
  - @zoobzio/kit@0.0.2

## 0.0.1

### Patch Changes

- [`00314f2`](https://github.com/zoobzio/foundation/commit/00314f2819555e2681b5739510aaa7ecb3c4c356) Thanks [@zoobzio](https://github.com/zoobzio)! - Initial alpha release: the headless services (`kit`, `query`, `browser`, `form`, `table`), the Vue components, and the Nuxt layer.

- Updated dependencies [[`00314f2`](https://github.com/zoobzio/foundation/commit/00314f2819555e2681b5739510aaa7ecb3c4c356)]:
  - @zoobzio/kit@0.0.1
