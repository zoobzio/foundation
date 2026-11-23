# @zoobzio/nuxt

## 0.1.13

### Patch Changes

- [`c7d52a2`](https://github.com/zoobzio/foundation/commit/c7d52a25032c7ecaaccfdb443189d1cfd067c4c6) Thanks [@zoobzio](https://github.com/zoobzio)! - The editor takes links and images. `@zoobzio/editor` gains `images` in its config, on unless turned off: an inline image node holding a `src`, an `alt`, and a `title`, which `insert({ type: "image", attrs })` adds at the selection. It is inline, as an image is in HTML and in Markdown, so `<p>text <img> text</p>` and `![alt](src)` read and write back as they were. The editor stores the address and nothing else. `link(href)` sets the link over the selection, or over the whole link the caret is in, or, with the caret in plain text, inserts the `href` as the link's text; `link(null)` removes it; an `href` of a protocol the link extension refuses changes nothing. `attributes(name)` reads the attributes of a mark or node at the selection. A click on a link in the editor now places the caret and no longer follows the link.

  A document that held an `<img>` lost it on load; it is now kept, in `rich-text.vue` too. Turn `images` off to drop them as before.

  The Vue `editor.vue` and `rich-text.vue` add two tools, each a `prompt`, a new tool kind: the button opens a Popover over a form and the tool runs with what was typed. `link`, after the marks, asks for an address, opens on the address of the link at the selection, and offers to remove it. `image`, in a new `media` group before history, asks for an address and an alternative text, and over a selected image opens on its values and replaces them. `pt.prompt`, `pt.form`, `pt.field`, `pt.submit`, and `pt.clear` reach the parts; the `prompt` slot replaces the form of every prompt and `prompt-<key>` that of one tool alone (`prompt-image`, `prompt-link`), so an app's own image picker leaves the link's form as it is, and `fieldLabel`, `submitLabel`, and `clearLabel` fill the default form. A prompt's button carries `data-active` where its link or image is at the selection.

  The Nuxt layer draws the two tools as the `link` and `image` icons, `link` a new alias of the icon contract, and reads their labels and their prompts' in the visitor's locale, from the new `editor.link`, `editor.image`, `editor.url`, `editor.alt`, `editor.apply`, and `editor.remove` messages of the prose contract; `EDITOR_FIELD_TEXT` maps a prompt's fields to them.

- [`26dc3e5`](https://github.com/zoobzio/foundation/commit/26dc3e5ce4ac8ddaff69d7d365a72f7dada65d1f) Thanks [@zoobzio](https://github.com/zoobzio)! - A table, a browser, and a calendar keep themselves up to date. `@zoobzio/sync` is a new headless service: the interval a visitor sets, the mark of the last sync (`since`), and the loop that polls for what changed since, while a view watches. A service whose wiring names a `refresh` has one as `service.sync`, over its own container, which gains `interval`, `since`, and `syncing`. The refresh is handed the fetch's params and `since`, and answers nothing (unchanged), `true` (fetch again), or what the fetch would as it now stands; a table's or a browser's result may name its own `since`. The Vue table, browser, and calendar render the refresh as the trigger of a menu, the `syncMenu` part, where the service has a sync: refresh now, or the interval to keep alive on. `createTable`, `createBrowser`, and `createCalendar` take `refresh`, and `accessBrowser` a third argument, the config whose `sync` sets the interval the browser starts on. Without a `refresh` the button fetches as before.

  Breaking: every `Snapshot` carries `interval`, the sync's, so a saved view keeps the pace it was saved with, and `restore` sets it. `TABLE_VIEW_SCHEMA`, `BROWSER_VIEW_SCHEMA`, and `CALENDAR_VIEW_SCHEMA` read it, off where a stored view names none; an app with a view schema of its own adds the member.

- [`48bf6a7`](https://github.com/zoobzio/foundation/commit/48bf6a7597b23cf7d12f352aa7309d00e4d998e1) Thanks [@zoobzio](https://github.com/zoobzio)! - `@zoobzio/timeline` is a new headless service: records in the order of their time, the latest first, as a commit history or an activity feed reads. A record is the consumer's own; the config names the properties that hold its `key`, its time (`at`), and its `label`. The fetch is handed `{ cursor, limit, query, filters }` and answers a batch with the cursor of the one after it: `init` and `fetch` read from the first, and `loadMore` adds the next to the records held, `appending` while it is out, dropped where the records were fetched anew in the meantime. `groups` is the records under the day, the month, or the year each falls on in the config's zone. With it come the query over the config's fields, `snapshot` and `restore` for saved views, the selection, and, where the wiring names a `refresh`, a sync whose refresh is laid into the records held by key, so a timeline kept alive grows at the top and keeps what was loaded further down.

  The Vue `timeline.vue` renders one: the search and the refresh over a list of groups, each a heading over its records, a card per record with a button that selects it and its time, and the button that loads the next batch. The `record` slot draws a consumer's own card; `recordPrepend`, `recordLabel`, `recordTime`, and `recordAppend` fill the default one. `useTimeline` is its view model, `defineTimeline` its definition. The Nuxt layer adds `createTimeline` and `accessTimeline`, the `timeline:*` hooks, `TIMELINE_VIEW_SCHEMA` and `TimelineView` for saved views, and the wrapped `Timeline`, in the visitor's locale from the new `timeline.*` messages of the prose contract.

- Updated dependencies [[`c7d52a2`](https://github.com/zoobzio/foundation/commit/c7d52a25032c7ecaaccfdb443189d1cfd067c4c6), [`d37dab6`](https://github.com/zoobzio/foundation/commit/d37dab630a8df85e577b0fcb34ce3412aea40ea0), [`26dc3e5`](https://github.com/zoobzio/foundation/commit/26dc3e5ce4ac8ddaff69d7d365a72f7dada65d1f), [`8d33940`](https://github.com/zoobzio/foundation/commit/8d339402d55c8f1c2b722c616ebd2c1dc1f5ccce), [`48bf6a7`](https://github.com/zoobzio/foundation/commit/48bf6a7597b23cf7d12f352aa7309d00e4d998e1)]:
  - @zoobzio/editor@0.1.13
  - @zoobzio/vue@0.1.13
  - @zoobzio/prose@0.1.13
  - @zoobzio/icons@0.1.13
  - @zoobzio/kit@0.1.13
  - @zoobzio/table@0.1.13
  - @zoobzio/browser@0.1.13
  - @zoobzio/calendar@0.1.13
  - @zoobzio/sync@0.1.13
  - @zoobzio/timeline@0.1.13
  - @zoobzio/code@0.1.13
  - @zoobzio/form@0.1.13
  - @zoobzio/query@0.1.13
  - @zoobzio/views@0.1.13
  - @zoobzio/theme@0.1.13

## 0.1.12

### Patch Changes

- [`747d0ac`](https://github.com/zoobzio/foundation/commit/747d0ac6a484080d7c04446c273b0685d4fc3c7d) Thanks [@zoobzio](https://github.com/zoobzio)! - The calendar's search stands over the calendar, with a refresh. The Vue calendar renders its controls, the search and a `refresh` Fab that fetches the range again, in a row of their own under `f-data-calendar-controls`, as the table and the browser do; the toolbar and the view sit in `f-data-calendar-body`. Breaking: the search is no longer inside the toolbar, and the root's frame belongs on the body. The `refresh` part and the `controls` and `refresh` slots are new, the Nuxt layer draws the `refresh` icon under `calendar.refresh`.

- [`3494a66`](https://github.com/zoobzio/foundation/commit/3494a669729827097a9e222763f62f873e19c995) Thanks [@zoobzio](https://github.com/zoobzio)! - The calendar searches and saves views. Its config declares the `fields` (and `literals`, `initialClauses`) of a query the service holds as `query`; a change to the clauses refetches the range and emits `filtered`. `snapshot()` and `restore()` hold `{ view, clauses }`, so the views sit over a calendar as over a table, through `CALENDAR_VIEW_SCHEMA`. Breaking: `fetch` is handed `{ range, query, filters }` where it was handed the range. The Vue calendar renders the search in its toolbar where the service is `searchable`, and the Nuxt layer dresses it and relays `calendar:filtered` and `calendar:restored`.

- [`86c4cd2`](https://github.com/zoobzio/foundation/commit/86c4cd25d1ae20e20f7f7d91c2da607a241da05b) Thanks [@zoobzio](https://github.com/zoobzio)! - The query's committed entries are its clauses. Breaking: the `Entry` type is `Clause`, and `entries` is `clauses` on the query service, its state container, and its `changed` event; on the table's and the browser's containers and snapshots; and the table's `initialEntries` config is `initialClauses`. The autocomplete's chip slots are handed `clause` in place of `entry`, and `QueryEntry` is `QueryClause`. `TABLE_VIEW_SCHEMA` and `BROWSER_VIEW_SCHEMA` read a view stored under `entries` as its `clauses`; each is now a preprocess over its object, so an app that extends one extends its `out`.

- [`8e283b8`](https://github.com/zoobzio/foundation/commit/8e283b8f31e515e5a60b7f583ce91e58fa482208) Thanks [@zoobzio](https://github.com/zoobzio)! - The table pins columns. The service registers TanStack's column pinning: the container holds `columnPinning` (`{ start, end }`), `initialState.columnPinning` and a column's `enablePinning` are the table's own, the `pin` permission answers `column.getCanPin()`, and `snapshot()` and `restore()` carry the slice, as `TABLE_VIEW_SCHEMA` does with an empty default, so a view saved before it still reads. Breaking: `State` and `Snapshot` have a `columnPinning` member. The Vue table lays the columns out pinned to the start, unpinned, then pinned to the end, and marks a pinned column's cells with `f-data-table-pinned` and where they stick, for the stylesheet to make sticky; the actions column is always pinned to the end, and the select column to the start once a column is. Each header holds a pin menu (`pt.head.pinMenu`, `pt.head.pinTrigger`, the `pin` slot), and a drag moves a column within its region. The table's `min-width` counts `--f-data-table-start-inset` and `--f-data-table-end-inset`, the widths a stylesheet gives the select and actions columns, so the last column no longer gives its width up to them once the table scrolls. The Nuxt layer dresses the menu with the `pin`, `unpin`, `pin-start`, and `pin-end` icons and the `table.pin`, `table.pinStart`, `table.pinEnd`, and `table.unpin` messages. Its checkbox draws the new `indeterminate` icon in place of `check` while it is neither on nor off, as the select-all of a table or a browser is over some of its rows.

- Updated dependencies [[`6a25d6c`](https://github.com/zoobzio/foundation/commit/6a25d6cffcf9b0efc56ba1d2bc5052769312251e), [`747d0ac`](https://github.com/zoobzio/foundation/commit/747d0ac6a484080d7c04446c273b0685d4fc3c7d), [`3494a66`](https://github.com/zoobzio/foundation/commit/3494a669729827097a9e222763f62f873e19c995), [`86c4cd2`](https://github.com/zoobzio/foundation/commit/86c4cd25d1ae20e20f7f7d91c2da607a241da05b), [`8e283b8`](https://github.com/zoobzio/foundation/commit/8e283b8f31e515e5a60b7f583ce91e58fa482208)]:
  - @zoobzio/browser@0.1.12
  - @zoobzio/vue@0.1.12
  - @zoobzio/prose@0.1.12
  - @zoobzio/calendar@0.1.12
  - @zoobzio/query@0.1.12
  - @zoobzio/table@0.1.12
  - @zoobzio/icons@0.1.12
  - @zoobzio/kit@0.1.12
  - @zoobzio/form@0.1.12
  - @zoobzio/editor@0.1.12
  - @zoobzio/code@0.1.12
  - @zoobzio/views@0.1.12
  - @zoobzio/theme@0.1.12

## 0.1.11

### Patch Changes

- Updated dependencies [[`a365fe4`](https://github.com/zoobzio/foundation/commit/a365fe4a423c09e6ec11aaaaea1cd46fa0c8e7c6)]:
  - @zoobzio/kit@0.1.11
  - @zoobzio/vue@0.1.11
  - @zoobzio/browser@0.1.11
  - @zoobzio/calendar@0.1.11
  - @zoobzio/code@0.1.11
  - @zoobzio/editor@0.1.11
  - @zoobzio/form@0.1.11
  - @zoobzio/query@0.1.11
  - @zoobzio/table@0.1.11
  - @zoobzio/views@0.1.11
  - @zoobzio/prose@0.1.11
  - @zoobzio/icons@0.1.11
  - @zoobzio/theme@0.1.11

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

- [`90104a6`](https://github.com/zoobzio/foundation/commit/90104a693b6b06ee5ba99edec470dbf617c523c7) Thanks [@zoobzio](https://github.com/zoobzio)! - A calendar. `@zoobzio/calendar` is a new headless service over JSCalendar 2.0 entries (draft-ietf-calext-jscalendarbis-22), events and tasks as plain JSON, exported as types under `JSCalendar`. It owns the view (`month`, `week`, `day`, `agenda`), the date, the range they span, the entries the range loaded, and the occurrences they recur into: a rule expands through rrule-temporal, overrides add, change and exclude occurrences, a wall-clock time holds across a clock change, and each occurrence is a JSCalendar object of its own. `fetch(range)` loads through the reader; `create`, `update(key, patch, scope)` and `remove(key, scope)` change an entry, one occurrence (`one`, into `recurrenceOverrides`), or an occurrence and every later one (`following`, the entry cut in two with `relatedTo` between them), and persist through `save`, which puts the entries back when it rejects. It emits `navigated`, `loaded`, `changed`, and `selected`. The vue `calendar.vue` renders it (`defineCalendar`, the `Calendar*` types, `useCalendar`, the `f-data-calendar-*` classes): a toolbar built from the service as the editor's is, one tool per command in groups inside reka's toolbar (`today`, `prev`, `next`, then a toggle per view), with the `tool` part, the `tool`, `toolPrepend`, `toolLabel`, and `toolAppend` slots per tool, and `toolbarPrepend` and `toolbarAppend` for a consumer's own controls, over a table of the view's days, or the agenda's list, each day with the occurrences that touch it. The nuxt layer adds `createCalendar`, `accessCalendar`, the `calendar:*` hooks, and a wrapper that names each tool in the visitor's locale and draws `prev` and `next` as icons by the tool's key (`CALENDAR_TOOL_ICONS`, `CALENDAR_TOOL_TEXT`), with the rest of its text in the visitor's locale (`calendar.today`, `calendar.previous`, `calendar.next`, `calendar.month`, `calendar.week`, `calendar.day`, `calendar.agenda`, `calendar.untitled`, `calendar.empty`, new in the prose contract).

- [`90104a6`](https://github.com/zoobzio/foundation/commit/90104a693b6b06ee5ba99edec470dbf617c523c7) Thanks [@zoobzio](https://github.com/zoobzio)! - The month grids that pick a date are renamed, so `calendar` is free for the calendar service: `calendar.vue` is `date-grid.vue` and `range-calendar.vue` is `date-range-grid.vue`, with their definitions (`defineDateGrid`, `defineDateRangeGrid`), their types (`DateGrid*`, `DateRangeGrid*`, under `types/components/date-grid` and `types/components/date-range-grid`), their classes (`f-date-grid-*`, `f-date-range-grid-*`), and their context ids (`date-grid`, `date-range-grid`; the range grid's was `calendar` too). The nuxt layer's wrappers and its `#components` names follow (`DateGrid`, `DateRangeGrid`). The date filters keep their `calendar` and `rangeCalendar` parts and their `calendar` slots.

- [`527018a`](https://github.com/zoobzio/foundation/commit/527018a3a82504898e0b06973b0d46243d7a250c) Thanks [@zoobzio](https://github.com/zoobzio)! - A form takes an `image` field. Its value is the stored image's URL, a newly picked `File`, or undefined once removed (`ImageField`, keyed to a payload property that accepts `File | string`), so an image saves with the rest of the form: the submit action uploads a `File`, keeps a string, and removes the image when the value is empty where the record held one. `accept` defaults to `image/*`. The vue form field renders it through the new `image-input.vue` (the `imageInput` control, slot and `pt` entry, the `f-data-form-image-input` class): a preview or a placeholder, a native file input, a `pick` label that opens it and a `remove` button, each a part with passthrough and a slot (`f-image-input-root`, `-preview`, `-placeholder`, `-input`, `-pick`, `-remove`). The component previews a picked file through an object URL it revokes when the model moves on or it unmounts, clears the native pick when the model stops being a file, and marks the native input `required` only while there is no image. `defineImageInput` and the `ImageInput*` types come with it. The icon contract gains `image` and `camera`. The nuxt layer wraps it with `image` in the placeholder (the new `placeholderContent` slot), `camera` before the pick label, `remove` before the remove label, and its labels in the visitor's locale (`imageInput.choose`, `imageInput.change`, `imageInput.remove`, new in the prose contract), and its form field renders the wrapped version.

- [`f3ba642`](https://github.com/zoobzio/foundation/commit/f3ba642458b64fb7b5e175ece3ff8e5fe9f196e7) Thanks [@zoobzio](https://github.com/zoobzio)! - A field's values provider may ask an API, and gives its values a page at a time. `@zoobzio/query` asks a provider once per change of the draft, at the value stage, rather than on every read of `items`, and holds what it gives in a new member of the container, `suggest`: `{ options, status, more }`. A provider gives a list, a page (`{ values, next }`), or a promise of either, and is handed the lookup beside the term: the field `key`, the `op`, an `AbortSignal`, and the `cursor`. `more()` asks for the page after the last while the provider names one, and adds its values to the options. `status` is `loading` for the first page of a term and `extending` for a further one; the options of the term before stay while the next loads on the same field and operator. A draft that moves on aborts the lookup and drops its result. A provider that throws or rejects emits the new `failed` event. `debounced(provider, ms)` wraps a provider so a term typed through asks once. `Provider`, `Page`, `Lookup`, `Suggest`, and `SuggestStatus` are new types; the service gains `suggest` and `more`.

  Breaking for a consumer of `dateValues`: it returns a page, `{ values, next }`, where it returned a list, and `QUERY_DATE_VALUES_LIMIT` is the size of a page where it was a cap. The days no longer stop at 31: an empty term runs back from today with no end, and a year lists all its days. A partial year runs back from the latest day it can start rather than narrowing the last 31 days, so `19` lists from `1999-12-31` where it listed nothing. A year below 1000 reads as itself, `0099-12-31`.

  Breaking for a container built by hand: `State` of the query, the table, and the browser gains `suggest`, which `createQueryState`, `createTableState`, and `createBrowserState` seed.

  The vue `autocomplete.vue` asks for more as the visitor nears the end of a provider's options, by scroll or by key: a sentinel (`f-autocomplete-sentinel`) lies over the last of them, `AUTOCOMPLETE_MORE_LEAD` deep, and is watched while it is on screen. The viewport of the active panel needs a height to bound it, as before; without one the options load until they run off the page. New slots: `loading`, in place of the options while a first page is out and none are held, and `more`, after the options while a further page is out. The content carries `aria-busy` through either, and an item's `aria-setsize` is `-1` while more remain. Fixed: the default `empty` state rendered under the options whenever `empty` was set; it now renders once the panel has none.

  The texts of the autocomplete's panel are named: `AUTOCOMPLETE_EMPTY_TEXT`, `AUTOCOMPLETE_LOADING_TEXT`, and `AUTOCOMPLETE_MORE_TEXT` in the vue package, and the nuxt wrapper reads the `empty`, `loading`, and `more` states from the contract, so they follow the visitor's locale. New in the prose contract: `autocomplete.empty`, `autocomplete.loading`, and `autocomplete.more`.

- [`830aa0d`](https://github.com/zoobzio/foundation/commit/830aa0df8684184f565d2f55bbca0bbd456082f2) Thanks [@zoobzio](https://github.com/zoobzio)! - Table permissions. `@zoobzio/table` takes `permissions` in its config: one record of booleans over what a visitor may do (`search`, `sort`, `multiSort`, `select`, `actions`, `bulkActions`, `hide`, `reorder`, `resize`, `pageSize`, `refresh`), so the answers of an app's permission model drop straight in. `true` grants, `false` takes away, and one left out is granted (`TABLE_DEFAULT_PERMISSIONS`). `service.can(permission)` is the check; the table's own follow it (`getCanSort()`, `getCanMultiSort()`, `getCanHide()`, `getCanResize()`, `row.getCanSelect()`), `actions` and `bulkActions` are empty and run nothing without theirs, and a write of the column order or the page size through the table is dropped without its permission. The record is read on every check, so a reactive one is followed. A permission taken away leaves the state as it is, and `restore` applies a snapshot whatever the permissions say.

  Breaking: `searchable` is gone from the config and the service, for `permissions.search`. The table-wide `enableSorting`, `enableMultiSort`, `enableHiding`, and `enableColumnResizing` are no longer config, and `enableRowSelection` is a predicate over the row only: rows select with the `select` and `bulkActions` permissions and bulk actions to run, so a table without bulk actions no longer selects by `enableRowSelection: true`. A column's own `enableSorting`, `enableHiding`, and `enableResizing` stand.

  The table registers TanStack's `columnResizingFeature`, for `enableResizing` on a column and `column.getCanResize()`. Its `columnResizing` state, the progress of a resize through TanStack's own handler, stays with the table and out of the container.

  The vue table renders what the permissions grant: no search, column manager, or refresh, a plain header, no drag handle, no resizer, no size picker, and no checkbox or actions column without theirs. `pagination.vue` takes `sizable`, which leaves the size picker out when `false`.

  The nuxt layer's table composable takes the visitor's permissions, as a record, a ref, or a getter, over the options' own: `useUsers(() => ({ bulkActions: can("users.write") }))`.

- [`8669116`](https://github.com/zoobzio/foundation/commit/8669116162574b547e270a9569fee23124795e66) Thanks [@zoobzio](https://github.com/zoobzio)! - The table scrolls sideways. The vue `table.vue` renders its `table` element within a horizontal `scroller.vue`, `.f-data-table-scroller`, between the toolbar and the pagination, so columns resized past the space the table has scroll within it rather than widening the page. `pt.scroller` configures it or swaps it through `as`. The nuxt wrapper renders it as the layer's `Scroller`.

  A column that grows no longer squeezes the others to nothing. `@zoobzio/table` has `columnsMinWidth`, the narrowest the visible columns go together: the widths of the sized ones plus room for every unsized one to hold the widest `minWidth` among them. The vue table carries it on the `table` element as an inline `min-width`, so the unsized columns give way down to their minimum and from there the table widens and scrolls.

  Breaking: the `table` element is no longer a child of `.f-data-table`, so a `.f-data-table > .f-table` selector no longer matches. A stylesheet moves the table's frame (border, radius, clipping) to `.f-data-table-scroller`, styles its `.f-scroll-area-scrollbar` and `.f-scroll-area-thumb`, and lets the root's track shrink (`grid-template-columns: minmax(0, 1fr)` on a grid root), or the root grows with the table and nothing scrolls.

- [#12](https://github.com/zoobzio/foundation/pull/12) [`84d4e44`](https://github.com/zoobzio/foundation/commit/84d4e4495ac0ee577ba491cf3f1b8219463deed1) Thanks [@zoobzio](https://github.com/zoobzio)! - The table's engine is TanStack Table. `@zoobzio/table` builds a `@tanstack/table-core` table over its state container and exposes it as `service.table`; the service keeps the container, the fetch, the query over the columns, the row and bulk actions, and its events, and nothing else. There is no second API over the table: a view renders from it and writes through it.

  Breaking, throughout. The container holds TanStack's slices under TanStack's names: `pagination` (`{ pageIndex, pageSize }`, zero-based) for `page` and `pageSize`, `sorting` (`[{ id, desc }]`) for `sortField` and `sortDirection`, `rowSelection` (a record) for `selected` (a `Set`), `columnOrder` and `columnVisibility` for the one `columnOrder` that held both, `columnSizing` for `columnWidths`, and `rowCount` for `total`; `pageCount` is gone, the table derives it. The table holds no state of its own, so two services over one container still agree and a payload still carries it. The config is the table's options as TanStack takes them beside the service's own: `columns` are TanStack column definitions (`accessorKey`, `size`, `minSize`, `enableSorting`, `enableHiding`), with `label`, `type`, `align`, `link`, `filterable`, `operators`, `defaultOperator`, and `values` on `meta`; `getRowId` replaces `rowKey`, `enableHiding: false` on a column replaces `pinnedColumns`, `initialState.columnOrder` replaces `defaultColumnOrder`, and `sortKey` is gone, a sort names the column's id. The fetch is handed `{ pagination, sorting, query, filters }` and returns `{ data, rowCount }`. A bulk action is handed the selected ids as an array. `updated` carries `rowCount`. The service's own methods and getters over paging, sorting, selection, and columns are gone (`goToPage`, `sortBy`, `toggleRow`, `moveColumn`, `resizeColumn`, `visibleColumns`, and the rest): call the table.

  What a visitor sees change: the first sort of a column runs ascending for strings and descending for numbers and booleans; a third sort clears it; a sort with Shift held adds the column to the sorts, which the fetch receives in order; a sort stays on its page, a change of page size keeps the top row in view, and a change of the query still goes to the first page; every column that reads a value sorts unless it says `enableSorting: false`; a page is 10 rows by default; the head's checkbox selects and deselects the rows of the page and leaves the other pages' selection alone; and every column has a size, 150 pixels unless it names one, where an unsized column fitted what was left.

  The vue table renders from `service.table`. Slot scopes carry TanStack's objects: a head slot's `column`, and a cell slot's `cell`, `row`, `column`, and `value`, so a record is `row.original` and a label `column.columnDef.meta.label`; `TableCell` is `TableCellScope`. Each data column's `col` carries its size but the last, which takes what the table has left, and the `table` element's inline `min-width` is the table's total size. `th` carries `aria-sort`. `utils/table` has `columnLabel`, `moveColumn`, `isSelectable`, `selectAllState`, and `columnWidth`; `columnOption` takes the column alone.

  The nuxt layer's `createTable` takes `initialState` and `initialEntries` in place of `initial`, and `TableInitial` is gone. A column's `icon` is on its `meta`, which the layer widens through TanStack's `ColumnMeta`.

- [`56e6d5b`](https://github.com/zoobzio/foundation/commit/56e6d5b4ecc0a8eb47eee18ad48c09f47d00a932) Thanks [@zoobzio](https://github.com/zoobzio)! - Saved views. `@zoobzio/views` is a new headless service: named payloads over a Zod schema the payload type is inferred from, the active view, and the lifecycle around them (`select`, `save`, `saveAs`, `rename`, `remove`, `revert`). It holds no live payload: `read` yields it and `apply` puts one in place, so a table or a browser stays the source of truth and `drifted` is the difference between what it holds and the active view. A view is the app's or inherited (`system`: select and copy only) or the user's own. An action that would lose something (a selection over unsaved edits, a revert, a removal) is held as `pending` until `resolve("save" | "proceed" | "cancel")`; a save that fails leaves the intent pending and the edits in place. A stored view the schema no longer accepts is set aside as `stale` and never applied.

  `@zoobzio/table` and `@zoobzio/browser` gain `snapshot()` and `restore(snapshot)`, and a `restored` event. A table's snapshot is its `sorting`, `columnOrder`, `columnVisibility`, and `columnSizing` slices, its `pageSize`, and the query's `entries`; a browser's is its `sortField`, `sortDirection`, and `entries`. A restore lands in one fetch, from the first page, and fetches nothing before `init`. `@zoobzio/query` gains `replace(entries)`, which commits a whole set of entries with one `changed`.

  The vue `views.vue` renders the service: the views as tabs, a mark on the active tab while it has drifted (`f-views-drifted` on the root, `f-views-badge` on the tab), the active view's actions in a menu beside them, and the dialogs that confirm a pending intent and name a view. `defineViews` and the `Views*` types come with it.

  The nuxt layer has `createViews(id, options)`, whose composable takes what the views are over (anything with a `snapshot` and a `restore`), `accessViews`, the `views:*` hooks, `TABLE_VIEW_SCHEMA` and `BROWSER_VIEW_SCHEMA` with their `TableView` and `BrowserView` types, and the `Views` component with its text under `views.*` in `@zoobzio/prose`. `createTable` and `createBrowser` relay `table:restored` and `browser:restored`.

- Updated dependencies [[`acded68`](https://github.com/zoobzio/foundation/commit/acded68743ce435c0aee70008c9b29b0ed4096f9), [`74c7717`](https://github.com/zoobzio/foundation/commit/74c7717e676ed9f71486905aabfd9ea3288a6424), [`90104a6`](https://github.com/zoobzio/foundation/commit/90104a693b6b06ee5ba99edec470dbf617c523c7), [`90104a6`](https://github.com/zoobzio/foundation/commit/90104a693b6b06ee5ba99edec470dbf617c523c7), [`527018a`](https://github.com/zoobzio/foundation/commit/527018a3a82504898e0b06973b0d46243d7a250c), [`f3ba642`](https://github.com/zoobzio/foundation/commit/f3ba642458b64fb7b5e175ece3ff8e5fe9f196e7), [`830aa0d`](https://github.com/zoobzio/foundation/commit/830aa0df8684184f565d2f55bbca0bbd456082f2), [`8669116`](https://github.com/zoobzio/foundation/commit/8669116162574b547e270a9569fee23124795e66), [`84d4e44`](https://github.com/zoobzio/foundation/commit/84d4e4495ac0ee577ba491cf3f1b8219463deed1), [`56e6d5b`](https://github.com/zoobzio/foundation/commit/56e6d5b4ecc0a8eb47eee18ad48c09f47d00a932)]:
  - @zoobzio/browser@0.1.10
  - @zoobzio/vue@0.1.10
  - @zoobzio/prose@0.1.10
  - @zoobzio/icons@0.1.10
  - @zoobzio/calendar@0.1.10
  - @zoobzio/form@0.1.10
  - @zoobzio/query@0.1.10
  - @zoobzio/table@0.1.10
  - @zoobzio/views@0.1.10
  - @zoobzio/kit@0.1.10
  - @zoobzio/editor@0.1.10
  - @zoobzio/code@0.1.10
  - @zoobzio/theme@0.1.10

## 0.1.9

### Patch Changes

- [`aeb045f`](https://github.com/zoobzio/foundation/commit/aeb045ff1d1a8141385ac076cb21d1cf4789a493) Thanks [@zoobzio](https://github.com/zoobzio)! - The table's columns resize. The service's container gains `columnWidths`, the width of each sized column in pixels by column key, seeded from the `width` a column declares; `resizeColumn(key, width)` rounds a width and holds it at the column's `minWidth` (`TABLE_MIN_COLUMN_WIDTH`, 48, where it names none), `resetColumnWidth(key)` restores the declared width or none, `columnWidth(key)` and `columnMinWidth(key)` read them, and `resetColumns()` now restores the declared widths along with the default order. A column's `width` and `minWidth` stay off its query field and its column manager option. The vue table renders a resizer on every column's trailing border, a focusable `separator` in the `th` named for its column: a drag writes the width as the pointer moves, the arrow keys step it, and a double click or Enter resets it (`pt.head.resizer`, the `f-data-table-resizer` and `f-data-table-resizing` classes, the new `useResize` composable). The table renders the widths by value, in a `colgroup` with one `col` per rendered column. `TableHeadPassthrough` takes the row type. The nuxt layer names each resizer in the visitor's locale (`table.resize`, new in the prose contract) and takes `columnWidths` in a table's `initial`.

- Updated dependencies [[`aeb045f`](https://github.com/zoobzio/foundation/commit/aeb045ff1d1a8141385ac076cb21d1cf4789a493)]:
  - @zoobzio/table@0.1.9
  - @zoobzio/vue@0.1.9
  - @zoobzio/prose@0.1.9
  - @zoobzio/kit@0.1.9
  - @zoobzio/query@0.1.9
  - @zoobzio/browser@0.1.9
  - @zoobzio/form@0.1.9
  - @zoobzio/editor@0.1.9
  - @zoobzio/code@0.1.9
  - @zoobzio/icons@0.1.9
  - @zoobzio/theme@0.1.9

## 0.1.8

### Patch Changes

- [`f8f59b3`](https://github.com/zoobzio/foundation/commit/f8f59b3ba0a43f5b305a058a9348c1d211d04e58) Thanks [@zoobzio](https://github.com/zoobzio)! - The editor's toolbar behaves as a rich text editor's. The service puts the selection at the start of a loaded document, as a fresh editor's is, rather than at the end where tiptap's replace left it, so a toolbar bound before the user interacts reflects the document's start; `insert` after `load` now inserts there. The service gains `can`, a dry run of each command by name (`can.toggle`, `can.block`, `can.wrap`, `can.list`, `can.insert`, `can.undo`, `can.redo`) that reads the revision and the active snapshot, so a reactive toolbar disables a tool as the selection moves. The vue editor renders its toolbar on reka's toolbar root, one tab stop with arrow-key focus between the controls and a separator between groups (the block type, marks, lists, blocks, history); the headings are one dropdown, the package's Menu over the paragraph and the heading levels, whose trigger names the block at the selection (`pt.block`, the `block`, `blockLabel`, `blockAppend`, and `blockItemLabel` slots, `blocks` and `block` on the context and from `useEditor`), and a menu item now takes HTML attributes through `pt.item`; each tool is a Fab part with the tool's label as its accessible name, a toggle reports `aria-pressed` and an action never does, a press keeps focus in the document, and a tool is disabled where its command would not apply. `EditorTool` carries `kind` and `group`; the context and `useEditor` carry `groups`; `pt.separator` and the `separator` slot are new. The nuxt layer's editor and rich text wrappers draw each tool's icon in place of its text, so the toolbar is icon-only, with the label in the visitor's locale as the button's `aria-label` and `title`, and read the block type dropdown in the visitor's locale with the `expand` icon after its text; the heading message reads `Heading {level}` and `editor.paragraph` is new. The layer's `nuxt.config` defines `navigator` for the server build as the runtime's own: Nuxt's default, `undefined`, crashed tiptap as the editor was constructed on the server in a production build. The layer also leaves `objectively` out of Vite's dev pre-bundle: Vite keys a pre-bundled dependency by its bare name, and `@untheme` and `@icon-sheets` pin older versions than the layer and `@zoobzio/vue` import, so in dev whichever version Vite met first was served to every importer and a page could fail on a missing export. A new `examples/nuxt` app renders the editor on one page with a mock stylesheet, run with `pnpm example:nuxt`.

- Updated dependencies [[`f8f59b3`](https://github.com/zoobzio/foundation/commit/f8f59b3ba0a43f5b305a058a9348c1d211d04e58)]:
  - @zoobzio/editor@0.1.8
  - @zoobzio/vue@0.1.8
  - @zoobzio/icons@0.1.8
  - @zoobzio/prose@0.1.8
  - @zoobzio/kit@0.1.8
  - @zoobzio/query@0.1.8
  - @zoobzio/browser@0.1.8
  - @zoobzio/form@0.1.8
  - @zoobzio/table@0.1.8
  - @zoobzio/code@0.1.8
  - @zoobzio/theme@0.1.8

## 0.1.7

### Patch Changes

- [`9d9bd1b`](https://github.com/zoobzio/foundation/commit/9d9bd1b577c8c9304d53355492a9697858e1ad79) Thanks [@zoobzio](https://github.com/zoobzio)! - The nuxt layer's date and datetime cells format in the service's time zone. The `cell:date` and `cell:datetime` slots of the table and browser wrappers formatted through the app's prosary service with no zone, so a cell read in the runtime's own: a server in UTC and a browser elsewhere rendered different text, and the page hydrated with a mismatch. Each now passes the table's or the browser's `timeZone` — the config's, `UTC` when it names none — as the vue components' own cells do, so the config's zone is the one a cell renders in on both sides. A calendar day, `YYYY-MM-DD`, still formats in UTC.

- [`e09554d`](https://github.com/zoobzio/foundation/commit/e09554d03d8baa6925275c8a112d9a9654c2c5a8) Thanks [@zoobzio](https://github.com/zoobzio)! - The nuxt layer's shell shows the loading indicator at once. The shell passed `threshold` to `NuxtLoadingIndicator`, which is not a prop of the component, so Nuxt dropped it and kept its default throttle of 200ms: the bar only appeared for a page change that outlasted the window, and a fast one, a local request in particular, never showed it. The shell now passes `throttle` as `0`, so the bar runs for every page change and for every call that starts it.

- Updated dependencies []:
  - @zoobzio/kit@0.1.7
  - @zoobzio/query@0.1.7
  - @zoobzio/browser@0.1.7
  - @zoobzio/form@0.1.7
  - @zoobzio/table@0.1.7
  - @zoobzio/editor@0.1.7
  - @zoobzio/code@0.1.7
  - @zoobzio/prose@0.1.7
  - @zoobzio/icons@0.1.7
  - @zoobzio/theme@0.1.7
  - @zoobzio/vue@0.1.7

## 0.1.6

### Patch Changes

- Updated dependencies [[`ce677cf`](https://github.com/zoobzio/foundation/commit/ce677cfc26dd4e236d2a233d2e37fd1eef443e6b)]:
  - @zoobzio/table@0.1.6
  - @zoobzio/vue@0.1.6
  - @zoobzio/kit@0.1.6
  - @zoobzio/query@0.1.6
  - @zoobzio/browser@0.1.6
  - @zoobzio/form@0.1.6
  - @zoobzio/editor@0.1.6
  - @zoobzio/code@0.1.6
  - @zoobzio/prose@0.1.6
  - @zoobzio/icons@0.1.6
  - @zoobzio/theme@0.1.6

## 0.1.5

### Patch Changes

- Updated dependencies [[`eb3ec99`](https://github.com/zoobzio/foundation/commit/eb3ec9958b5091dc05bbee9d170056a7ef283697)]:
  - @zoobzio/query@0.1.5
  - @zoobzio/table@0.1.5
  - @zoobzio/vue@0.1.5
  - @zoobzio/kit@0.1.5
  - @zoobzio/browser@0.1.5
  - @zoobzio/form@0.1.5
  - @zoobzio/editor@0.1.5
  - @zoobzio/code@0.1.5
  - @zoobzio/prose@0.1.5
  - @zoobzio/icons@0.1.5
  - @zoobzio/theme@0.1.5

## 0.1.4

### Patch Changes

- [`16cde38`](https://github.com/zoobzio/foundation/commit/16cde38403b100b642cbaaa9c47320e60dc4829b) Thanks [@zoobzio](https://github.com/zoobzio)! - The Nuxt layer resolves a label where the component renders it. Every component of `@zoobzio/vue` now exposes a slot around each text it draws — the select's and multi-select's `itemLabel`, the listbox's `itemLabel`, the tabs' and the accordion's `triggerLabel`, the hero's `actionLabel`, the form field's `labelText` and `hintText`, the tree's `itemText`, and the date filters' `fieldLabel`, `operatorLabel` and `valueLabel` over a context that carries the stepper's `field`, `operator` and `value` — and the select, multi-select and autocomplete leave an item's typeahead text to what the item renders. The layer's wrappers fill those slots with the text in the visitor's locale and hand their props through untouched, save a scalar the component gives to an attribute (a placeholder, an accessible name); the `texts` helper that resolved a wrapper's props by walking them is gone. The factories resolve the whole config of a table, browser or form in one call, rather than the columns, actions and fields by name, so a text anywhere in the config — a literal's label, say — resolves as a column's does; the form's `defaults`, the payload's values, stand as given. Two defaults the headless packages ship in English have messages in `@zoobzio/prose` and are laid under the config when it names none: `table.text`, the label of the query's text literal, and `browser.root`, the label of the browser's root crumb. `@zoobzio/browser` carries `rootLabel` and a crumb's `label` as `Text`, as it carries a column's.

- Updated dependencies [[`16cde38`](https://github.com/zoobzio/foundation/commit/16cde38403b100b642cbaaa9c47320e60dc4829b)]:
  - @zoobzio/prose@0.1.4
  - @zoobzio/browser@0.1.4
  - @zoobzio/vue@0.1.4
  - @zoobzio/kit@0.1.4
  - @zoobzio/query@0.1.4
  - @zoobzio/form@0.1.4
  - @zoobzio/table@0.1.4
  - @zoobzio/editor@0.1.4
  - @zoobzio/code@0.1.4
  - @zoobzio/icons@0.1.4
  - @zoobzio/theme@0.1.4

## 0.1.3

### Patch Changes

- [`4d53efc`](https://github.com/zoobzio/foundation/commit/4d53efcc827acf43f31378d48d4695a7dbc581ad) Thanks [@zoobzio](https://github.com/zoobzio)! - Add `@zoobzio/prose`, the text of the design system: every label, placeholder and notice the components render by default, authored as FormatJS messages and built by `@prosary/kit` into a typed contract and a bundle per locale. The kit's new `Text` type is what a service or a component carries wherever it carried a label: `string`, until a layer widens it by merging into `TextMap`. The packages and the vue components change in type alone, and render text as they did. `wrap` of `@zoobzio/vue` takes a `props` map, laid under the consumer's props on each render; the bulk-action bars, the column manager and the editor's tools gain a slot around their text, and the date filters' context carries its step and apply. The Nuxt layer loads `@prosary/nuxt` with the prose build as its `prosary.build`, widens `Text` to the app's whole contract, and resolves every message at its boundary: its wrappers resolve the data they are handed and supply the components' defaults from the contract through `pt`, slots and `props`; its factories resolve the labels of a service's columns, actions and fields as the service is built; and its `locale` plugin reloads the app on a switch. The error page, the request defaults and the app's fallback notification read from the contract too.

- Updated dependencies [[`4d53efc`](https://github.com/zoobzio/foundation/commit/4d53efcc827acf43f31378d48d4695a7dbc581ad)]:
  - @zoobzio/prose@0.1.3
  - @zoobzio/kit@0.1.3
  - @zoobzio/query@0.1.3
  - @zoobzio/table@0.1.3
  - @zoobzio/browser@0.1.3
  - @zoobzio/form@0.1.3
  - @zoobzio/vue@0.1.3
  - @zoobzio/code@0.1.3
  - @zoobzio/editor@0.1.3
  - @zoobzio/icons@0.1.3
  - @zoobzio/theme@0.1.3

## 0.1.2

### Patch Changes

- [`cc42cba`](https://github.com/zoobzio/foundation/commit/cc42cba367086ee88c132c2cb7a12cd97593210e) Thanks [@zoobzio](https://github.com/zoobzio)! - The query's text stage is generalized into literals: a value typed between its own `open` and `close` characters, with a label for its option and no stage to suggest from. The config's `literals` are keyed as its fields are, and default to the text literal alone, `text`: free text between quotes under `Search`, the one `text` reads, so a word that is also a field's label is never taken for one. The field panel leads with the literal options while nothing is typed; selecting one writes its `open` before the term typed so far. The literal stage is terminal: it suggests nothing and adds no trail, so the panels are empty while the literal is typed and a panel view closes, where the text stage held its option open in the trail. Typing the `close` commits the literal at once, as Enter does an unclosed one; a bare term submits nothing, as it names a field still. A literal entry is `{ kind: "literal", key, value }`, one held per key, in place of the `text` entry kind; `textFor` of one is its value between the characters, the string `labelFor` gives and `unwrap` hands back minus the last character. `literals: {}` replaces `text: false`: there is no literal option and a quote is a character. `Literal` is an interface a layer may widen, its other properties carried onto its option as a field's are; `QUERY_TEXT_LITERAL`, `QUERY_LITERALS`, and `QUERY_TEXT_KEY` replace the quote and label constants. The table's config takes `literals` in place of `textLabel` and hands them to its query. The vue autocomplete renders nothing, not even its empty state, in a literal stage. The nuxt layer widens `Literal` with `icon`, draws `search` before a literal option that names none, and no arrow after one, as it is terminal.

- Updated dependencies [[`cc42cba`](https://github.com/zoobzio/foundation/commit/cc42cba367086ee88c132c2cb7a12cd97593210e)]:
  - @zoobzio/query@0.1.2
  - @zoobzio/table@0.1.2
  - @zoobzio/vue@0.1.2
  - @zoobzio/browser@0.1.2
  - @zoobzio/form@0.1.2
  - @zoobzio/editor@0.1.2
  - @zoobzio/code@0.1.2
  - @zoobzio/icons@0.1.2
  - @zoobzio/theme@0.1.2

## 0.1.1

### Patch Changes

- [`adbb87f`](https://github.com/zoobzio/foundation/commit/adbb87fb4086243d843b7c981a5e7b84cd58a62b) Thanks [@zoobzio](https://github.com/zoobzio)! - Free text is quoted in the query's draft: `"text"` is the text stage beside `Label: op term`, so a word that is also a field's label is never taken for a search. The field panel leads with the text option, labelled `Search` or the config's `textLabel`, while nothing is typed; selecting it opens the quote before the term typed so far, and while the draft is quoted it is the active trail option, so selecting it again steps back out. The closing quote commits the text at once, as Enter does an unclosed one. A bare term submits nothing: it names a field still. `textFor` of a text entry is its quoted text, the same string `labelFor` gives and `unwrap` hands back minus the closing quote. With `text: false` there is no text option and a quote is a character. The table's config takes `textLabel` and hands it to its query. The nuxt layer's autocomplete draws the `search` icon before the text option, and `next` after it as after any option that enters a stage.

- Updated dependencies [[`adbb87f`](https://github.com/zoobzio/foundation/commit/adbb87fb4086243d843b7c981a5e7b84cd58a62b)]:
  - @zoobzio/query@0.1.1
  - @zoobzio/table@0.1.1
  - @zoobzio/vue@0.1.1
  - @zoobzio/browser@0.1.1
  - @zoobzio/form@0.1.1
  - @zoobzio/editor@0.1.1
  - @zoobzio/code@0.1.1
  - @zoobzio/icons@0.1.1
  - @zoobzio/theme@0.1.1

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
