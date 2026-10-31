# @zoobzio/nuxt

Nuxt layer for the foundation design system. It carries the Nuxt-only
wiring over [`@zoobzio/vue`](../vue/) and the headless services in
`packages/`: `useState`-backed stores, hook-bus factories, and the app shell.

## Usage

Extend the layer from your app's `nuxt.config`:

```ts
export default defineNuxtConfig({
  extends: ["@zoobzio/nuxt"],
});
```

Nothing is injected implicitly: no directory is scanned for components
or composables, and bare component tags do not resolve. The registries
behind Nuxt's two virtual modules stay live, filled only by
`modules/imports/`, so a consumer imports from them explicitly:

- `#components` carries the components of `@zoobzio/vue`. The ones that
  hold links come as the layer's own wrappers, which render every link
  through `NuxtLink` (see [Components](#components)). It also carries
  `Icon`, from `@icon-sheets/nuxt` (see [Icons](#icons)).
- `#imports` also carries `useUntheme`, `useUnthemeRenderer`, and
  `useUnthemeCatalog`, from `@untheme/nuxt` (see [Theme](#theme)).
- `#imports` carries the `define*` constructors of `@zoobzio/vue` and the
  layer's own surface: the composables, factories, stores, and constants
  as values, and everything under `types/` as types. It also carries the
  types of `@zoobzio/vue` a consumer writes against: the component
  contracts (`SelectProps`, `TableSlots`, …), the shared item types
  (`Option`, `Link`, …), and the `define*` and `pt` vocabulary
  (`Definition`, `PT`, …). Where the layer widens a vue item type, as
  `MenuItem` with its `icon`, `#imports` serves the layer's under the
  vue name.

A consumer never depends on `@zoobzio/vue` itself. The package's
composables are not registered, nor are the types behind them (`forward`,
`refs`, `service`, `events`, `slots`, `context`); they build the
components and are not a consumer surface. Nor are the layer's `utils/`,
which are the factories' plumbing.

```ts
import { Autocomplete, Select, Table } from "#components";
import { defineAutocomplete, defineSelect } from "#imports";
import { createTable, useHooks, useLogger } from "#imports";
import type { TableOptions } from "#imports";
import type { Option, SelectProps } from "#imports";
```

The same files also ship through subpath exports, the same way
`@zoobzio/vue` ships `src/`, for code outside the Nuxt build:

```ts
import { createTable } from "@zoobzio/nuxt/factories/table";
```

## Components

The components of `@zoobzio/vue` render links through a `link` passthrough
part whose recipe is a plain anchor, and leave their icons to slots. The
layer wraps each component that holds a `link` part, draws an icon, or
renders another wrapped component through a part (thirty of them, listed
in `WRAPPED` of `modules/imports/constant.ts`) in `app/components/`. A
wrapper lays `NuxtLink` under the `link` part, so navigation goes through
the router with no setup, and fills the icon slots from the contract (see
[Icons](#icons)). `#components` serves the wrapper under the vue
component's name; the vue component itself is not registered.

A wrapper is one call to `wrap` of `@zoobzio/vue`: the vue component, a
`pt` layer, and the slot defaults of [Icons](#icons). It is typed as the
vue component itself, so it is the same contract (props, emits, slots,
and `ctx`) the `@zoobzio/vue` types on `#imports` describe. A consumer's
`pt.link` composes with the layer's, so an override keeps `NuxtLink`
unless it sets `as` itself. A disabled item has no `href`, and `NuxtLink`
renders it as an inert anchor.

```vue
<script setup lang="ts">
import { Breadcrumb } from "#components";
import type { BreadcrumbItem } from "#imports";

const items: BreadcrumbItem[] = [
  { key: "home", label: "Home", link: { to: "/" } },
  { key: "docs", label: "Docs" },
];
</script>

<template>
  <!-- "Home" renders as <NuxtLink href="/">; `pt.link` adds a class -->
  <Breadcrumb :items="items" :pt="{ link: () => ({ class: 'crumb' }) }" />
</template>
```

`Table` and `Browser` lay the part under their nested manifests (`pt.body`
and `pt.files`), so a consumer's part at the same path composes the same
way. Where a vue component renders another of its own as a part, the
wrapper names the layer's wrapped component through the part's `as`, so
nested components navigate through `NuxtLink` and draw their icons
without the consumer reaching in: the table's row actions and the
browser's file and folder actions render through the layer's `Menu`, the
browser's trail through its `Breadcrumb`, the table's pagination, column
manager command, and checkboxes through its `Pagination`, `Command`, and
`Checkbox`, a form's fields through its `FormField` and that field's
controls through its `Select`, `MultiSelect`, `Checkbox`, `DatePicker`,
`TagsInput`, `FileInput`, and `RichText`, and the facets', keywords', and
date filters' popover contents through its `Command`, `TagsInput`,
`SegmentedControl`, `Calendar`, and `RangeCalendar`.

## Icons

The components of `@zoobzio/vue` draw no icons. Where one belongs beside
content, the component has a `prepend` and an `append` slot around it
(`itemPrepend`, `triggerAppend`, `prevPrepend`, …), so an icon can lead,
trail, or both; where a button is one item (a `Fab`), the component has
one slot that replaces it (`refresh`, `actions`, `first`, …). The layer
loads
[`@icon-sheets/nuxt`](https://github.com/zoobzio/icon-sheets) with the
foundation contract from [`@zoobzio/icons`](../../packages/icons/) as its
default `iconSheets` option, so an app that extends the layer gets the
sprite inlined on every page and `<Icon name="…" />` on `#components`
with no setup. `IconAlias` on `#imports` is the alias union the app
compiles against.

An app with its own icons package passes it the usual way, and Nuxt
merges it over the layer's: the app's aliases join the foundation's, and
an alias the app declares again is rebound. See the icons package for the
contract and the merge.

```ts
export default defineNuxtConfig({
  extends: ["@zoobzio/nuxt"],
  iconSheets: { ...config, sets, prefix },
});
```

A wrapper fills those slots from the contract by default through the
`slots` option of `wrap`: the consumer's slot wins whenever it renders
one, and the wrapper's default fills in while it does not. A fixed role
draws its alias: `expand` after a select's, multi select's, or
accordion's trigger and as a tree branch's toggle; `prev` and `next` on
the calendars and pickers and `calendar` on a picker's trigger; `search`
before a command's filter and before an autocomplete literal option that
names no icon of its own (the text literal, the one that opens the quote
free text is typed in); `remove` on a tag's and a file's remove
button and after an autocomplete chip's label; `close` on a toast's; `top` on a scroller's back-to-top; `check`
in a checkbox; the editor's and rich text's tools by key (`bold`,
`heading`, `bullet-list`, `undo`, …, see `EDITOR_TOOL_ICONS`); and on
the table and browser, `refresh`, `columns`, `actions`, `drag`,
`sort-asc` or `sort-desc` after a sorted header, `folder` before a
folder, `magic` before the table's search, `next` after an autocomplete
option that enters a stage (a field or an operator; a literal option is
terminal and draws none) and
`expand` after the active trail option whose stage is open, and the pagination's `first`,
`prev`, `next`, and `last`. The table's search renders through the
layer's `TableSearch`: its Autocomplete with the `magic` icon in
`inputPrepend` at the front of the field, before its chips, the search
key (`TABLE_SEARCH_KEY`, `/`) as a `kbd` in `inputAppend`, and that key
focusing the input from anywhere on the page the user is not already
typing, through `useFocusKey`. A slot
that replaces a Fab renders the part with the icon as its content, so the
label stays the button's `aria-label` and the visible text goes. The
facets', keywords', and date filters' triggers draw `filter`, `keywords`,
and `calendar` that way.

An item draws its own `icon`. The vue item types (`Option`, which the
tabs, segmented control, accordion, select, and command options extend,
plus `MenuItem`, `BreadcrumbItem`, `DirectoryItem`, and `FacetItem`), the
action descriptors of `@zoobzio/table` and `@zoobzio/browser`, and the
`Field`, `Literal`, and `Option` of `@zoobzio/query` are
interfaces, and `app/app.d.ts` widens each with an optional
`icon: IconAlias` by declaration merging, so the one type the package,
the layer, and the app share carries the field, and the wrapper draws it
in the item's `prepend` slot. A row, file, folder, or bulk action given to
`createTable` or `createBrowser` with an `icon` draws it the same way,
since the layer's `Menu` renders those actions. A query field with an
`icon` draws it before its option in the autocomplete's panel and trail,
and a literal with one before its option in the panel, since the query
service carries it onto the option.

```vue
<script setup lang="ts">
import { Menu } from "#components";
import type { MenuGroup } from "#imports";

const groups: MenuGroup[] = [
  {
    key: "account",
    items: [
      { label: "Profile", link: { to: "/profile" }, icon: "next" },
      { label: "Sign out", icon: "close" },
    ],
  },
];
</script>

<template>
  <!-- each item renders <Icon :name="item.icon" /> before its label -->
  <Menu label="Account" :groups="groups" />
</template>
```

## Theme

The components of `@zoobzio/vue` read no tokens: they are unstyled, and a
consumer's stylesheet binds them. The layer loads
[`@untheme/nuxt`](https://github.com/zoobzio/untheme) with the foundation
theme from [`@zoobzio/theme`](../../packages/theme/) as its default
`untheme` option, so an app that extends the layer boots the foundation
palette, gets the aurora cascade (`--surface`, `--primary`, `--space-*`,
`--type-*`, …) under `@layer untheme` on every page, and may swap a scheme
or apply one of aurora's themes through `useUntheme()` with no setup. The
module mirrors the selection onto `<html>` as `data-<modifier>` attributes
(`data-color="dark"`), so an app's stylesheet selects on them too.

```vue
<script setup lang="ts">
import { useUntheme } from "#imports";

const untheme = useUntheme();
</script>

<template>
  <button @click="untheme.swap('color', 'dark')">Dark</button>
</template>
```

The theme is also where foundation keeps the tokens it reads itself. The
shell's loading indicator draws `var(--loading-indicator)`, a role of
`@zoobzio/theme` bound to `{primary}`, so it follows the scheme and the
applied theme and a downstream theme rebinds it without touching the shell.
A new token of the shell is one more entry in the theme's `src/roles.json`.

An app with a theme of its own builds it over `@zoobzio/theme` in place of
aurora (`source: "npm:/@zoobzio/theme"` in its kit config), so the shell's
roles come along and its palette takes the base, and passes its package as
the preset. The untheme module takes the closest layer's `untheme` option
as a whole, so the app's preset replaces the foundation's:

```ts
export default defineNuxtConfig({
  extends: ["@zoobzio/nuxt"],
  untheme: { preset: "@acme/theme" },
});
```

The module resolves a preset from the app's root, so an app that keeps the
layer's default lists `@zoobzio/theme` and `untheme` in its own
dependencies. See the theme package for the palette, the roles, and the
extension.

## Stores and factories

The data components of `@zoobzio/vue` (`Table`, `Form`, `Browser`,
`Editor`, `Code`) render a headless service through their `service` prop and own no
state of their own. The layer carries that state for Nuxt, split in two tiers:

- **Stores** (`stores/`, `access<Name>`) back one service's state container
  with a `useState` record keyed by id (`table-<id>`). The record's value is
  a reactive proxy, so the service's writes are tracked; every instance
  under the same id shares it, and it survives SSR hydration.
  The editor's record holds its revision and flags, never the document:
  `load` the document on both sides, in setup, so the server's static copy
  and the client's editor hold the same document. The editor component
  renders that copy as HTML on the server and mounts the editor over it
  only when the user interacts, so no `ClientOnly` is needed.
  The code editor's record is the same shape with a cursor in place of the
  active marks; its component renders the text in a `pre` on the server and
  mounts the CodeMirror view in its place when the user interacts.
- **Factories** (`factories/`, `create<Name>`) take an id and the options
  and return an id-scoped composable. Call the factory at module scope and
  the composable in setup: each call builds a service over the id's store
  and relays the service's domain events onto the Nuxt hook bus.

```ts
// composables/users.ts
import { createTable } from "@zoobzio/nuxt/factories/table";

export const useUsers = createTable<User>("users", {
  columns: [
    { key: "id", label: "ID", type: "number" },
    { key: "name", label: "Name", type: "text", sortable: true },
  ],
  rowKey: "id",
  fetch: (params) => $fetch("/api/users", { query: params }),
  actions: {
    edit: { label: "Edit", action: (user) => navigateTo(`/users/${user.id}`) },
  },
  initial: { pageSize: 50, sortField: "name" },
});
```

```vue
<script setup lang="ts">
import { Table } from "#components";
import { useUsers } from "~/composables/users";

const users = useUsers();
await users.init();
</script>

<template>
  <Table :service="users" />
</template>
```

The options are the headless config with the behavior joined on. An action
is its descriptor and its handler under one key (`{ label, action }`); the
factory splits them back into the config and the wiring the service takes.
`initial` is the slice of the state container the consumer chooses (for a
table: paging, sort, selection, column order, committed query), never what
a fetch fills in. It seeds the `useState` record on first access, so it
must be something Nuxt's payload can carry: plain data, with `Set` and
`Date` allowed (devalue serializes them). A second id with the same
options is a second, independent state.

| Factory         | Store           | Hooks relayed                                                                                       |
| --------------- | --------------- | --------------------------------------------------------------------------------------------------- |
| `createTable`   | `accessTable`   | `table:updated`, `table:filtered`                                                                   |
| `createForm`    | `accessForm`    | `form:initialized`, `form:submitted`, `form:rejected`, `form:restored`, `form:reset`, `form:failed` |
| `createBrowser` | `accessBrowser` | `browser:updated`, `browser:navigated`                                                              |
| `createEditor`  | `accessEditor`  | `editor:loaded`, `editor:updated`, `editor:mounted`, `editor:unmounted`                             |
| `createCode`    | `accessCode`    | `code:loaded`, `code:updated`, `code:mounted`, `code:unmounted`                                     |

Every relayed payload carries the service's `id`. `useHooks` subscribes
for one instance: each listener fires for events with that id only, and
the subscriptions leave with the calling scope, so call it in setup.

```ts
import { useHooks } from "@zoobzio/nuxt/composables/hook";

useHooks("users", {
  "table:updated": ({ total }) => console.log(total),
  "table:filtered": ({ query }) => console.log(query),
});
```

Each relay is also logged at `debug` under the service's id (see
[Logging](#logging)).

The hook names and payloads are declared on `RuntimeNuxtHooks` in
`app/app.d.ts`; the option, initial-state, and hook types live in
`types/<name>`.

## Logging

The layer keeps a log in state: the current level under `log:level`
(default `info`) and the kept lines under `log:backlog`, behind
`accessLogs`. `useLogger(name?)` is a named logger over them with one emit
per level (`trace`, `debug`, `info`, `warn`, `error`); a line is kept when
its level is at or above the current level and dropped otherwise. The level
and the backlog are the shared refs, so any logger may read or change them.

```ts
import { useLogger } from "@zoobzio/nuxt/composables/log";

const log = useLogger("checkout");
log.level.value = "debug";
log.info("Order placed", { id: order.id });
```

`plugins/log` provides the root logger as `nuxt.$log` and the constructor
as `nuxt.$logger`, so code holding the app instance logs without setup
scope. The factories use it: every relayed event is logged at `debug` under
the service's id.

## Requests and errors

`useAppError(code, message, options?)` builds an app error: a Nuxt error with
the code's status text, stamped with when it was built, and carrying the
notification the shell toasts for it. `options` takes the `notification`,
the `cause`, and `fatal`; a fatal error renders the error page instead.

```ts
import { useAppError } from "@zoobzio/nuxt/composables/error";

throw useAppError(404, "No such order", {
  notification: { variant: "warning", title: "Order not found" },
});
```

`useRequest` and `useLazyRequest` wrap `useAsyncData` and
`useLazyAsyncData`: the same arguments, with the request logged under its
key and a failure thrown as an app error rather than left on `error`. The
blocking one runs during SSR and fails fatal by default; the lazy one runs
on the client and fails non-fatal, so the shell toasts it. The `error`
option sets the status, message, and notification of the error thrown.

```ts
import { useLazyRequest } from "@zoobzio/nuxt/composables/request";

const { data } = useLazyRequest("orders", () => $fetch("/api/orders"), {
  error: { status: 502, message: "Orders are unavailable" },
});
```

## App shell

`app.vue` is the layer's root: reka's `ConfigProvider` (ids from Nuxt's
`useId`, so they match across hydration) and `TooltipProvider` around the
loading indicator, the page inside its layout, and the `Toaster`. An
`error.vue` renders the status code and a message, with a control that
clears the error home. An app that extends the layer gets both unless it
provides its own.

Notifications are the one piece of app state the layer owns: a `useState`
list behind `accessNotifications`, and `useNotifications` over it with
`push` (the id is assigned) and `remove`. The shell renders the list as
toasts and dismisses each on close.

```ts
import { useNotifications } from "@zoobzio/nuxt/composables/notification";

const { push } = useNotifications();
push({ variant: "success", title: "Saved" });
```

The layer loads one stylesheet of its own, `app/assets/css/reset.css`: a
Preflight-style reset inside `@layer reset`, so any unlayered stylesheet
(the system's own semantic classes, the app's CSS) wins every
equal-specificity conflict. It uses no tokens, so it applies before and
independently of the theme's cascade, which `@untheme/nuxt` links in under
`@layer untheme` (see [Theme](#theme)).

The shell also wraps the page in a `NuxtErrorBoundary`. An error thrown
under it is toasted rather than replacing the page: when the error's `data`
carries a `notification` (`AppError` in `types/error`), that notification
is pushed as is; otherwise the error's message is pushed under the `error`
variant.

## Layout

```
app/
  app.vue         — the root: reka providers, loading indicator (colored by the theme's `loading-indicator` role), error boundary, toaster
  components/     — the wrapped vue components: wrap(<Core>, { pt, slots }), NuxtLink under link parts, icons in the slots, the layer's components under nested parts; icon.ts is the icon glue they share
  error.vue       — the error page
  app.d.ts        — RuntimeNuxtHooks augmentation for the relayed events; the vue item types and the headless action descriptors widened with `icon`
  constants/      — error page status codes, log levels, the editor tools' icons, the table's search key
  assets/css/     — reset.css, loaded by the layer config
  composables/    — useAppError, useFocusKey, useHooks, useLogger, useNotifications, useRequest, useLazyRequest
  factories/      — create<Name>(id, options) → use<Name>(): Service
  plugins/        — log: provides $log and $logger
  stores/         — access<Name>(id, …) → the id's shared state container; accessLogs, accessNotifications
  types/          — per-feature options, initial state, and hook maps; hook, log, notification, error, request; icon (IconAlias)
  utils/          — split (actions → descriptors + handlers), seed (state), editor (a tool's icon by key)
modules/          — local Nuxt modules: imports/ fills #components and #imports (the @zoobzio/vue components, definitions, and types, and the layer's own surface) and references app.d.ts for consumers
tests/            — vitest + happy-dom, mirroring app/ path-for-path
nuxt.config.ts    — layer config (no implicit imports, no component scanning or tag resolution; loads the reset, @icon-sheets/nuxt with the foundation contract, and @untheme/nuxt with the foundation theme)
```
