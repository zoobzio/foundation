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
  through `NuxtLink` (see [Components](#components)).
- `#imports` carries the `define*` constructors of `@zoobzio/vue` and the
  layer's own surface: the composables, factories, stores, and constants
  as values, and everything under `types/` as types. It also carries the
  types of `@zoobzio/vue` a consumer writes against: the component
  contracts (`SelectProps`, `TableSlots`, `MenuItem`, …), the shared item
  types (`Option`, `Link`, …), and the `define*` and `pt` vocabulary
  (`Definition`, `PT`, …).

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
part whose recipe is a plain anchor. The layer wraps each component that
holds one (`Breadcrumb`, `Browser`, `Directory`, `Hero`, `Menu`,
`SegmentedControl`, `Table`, `Tabs`, `Tree`) in `app/components/`, and the
wrapper lays `NuxtLink` under that part, so navigation goes through the
router with no setup. `#components` serves the wrapper under the vue
component's name; the vue component itself is not registered.

A wrapper is the vue component's contract: the same props, emits, slots,
and `ctx`, typed from the same `@zoobzio/vue` types that `#imports`
carries. A consumer's `pt.link` composes with the layer's, so an override
keeps `NuxtLink` unless it sets `as` itself. A disabled item has no
`href`, and `NuxtLink` renders it as an inert anchor.

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

`Table` and `Browser` lay the part under their nested manifests (`pt.body`,
`pt.files`, and the browser's `pt.breadcrumb.pt`), so a consumer's part at
the same path composes the same way.

## Stores and factories

The data components of `@zoobzio/vue` (`Table`, `Form`, `Browser`) render a
headless service through their `service` prop and own no state of their
own. The layer carries that state for Nuxt, split in two tiers:

- **Stores** (`stores/`, `access<Name>`) back one service's state container
  with a `useState` record keyed by id (`table-<id>`). The record's value is
  a reactive proxy, so the service's writes are tracked; every instance
  under the same id shares it, and it survives SSR hydration.
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

The layer loads one stylesheet, `app/assets/css/reset.css`: a
Preflight-style reset inside `@layer reset`, so any unlayered stylesheet
(the system's own semantic classes, the app's CSS) wins every
equal-specificity conflict. It uses no tokens, so it applies before and
independently of any theme.

The shell also wraps the page in a `NuxtErrorBoundary`. An error thrown
under it is toasted rather than replacing the page: when the error's `data`
carries a `notification` (`AppError` in `types/error`), that notification
is pushed as is; otherwise the error's message is pushed under the `error`
variant.

## Layout

```
app/
  app.vue         — the root: reka providers, loading indicator, error boundary, toaster
  error.vue       — the error page
  app.d.ts        — RuntimeNuxtHooks augmentation for the relayed events
  assets/css/     — reset.css, loaded by the layer config
  composables/    — useAppError, useHooks, useLogger, useNotifications, useRequest, useLazyRequest
  constants/      — error page status codes, log levels
  factories/      — create<Name>(id, options) → use<Name>(): Service
  plugins/        — log: provides $log and $logger
  stores/         — access<Name>(id, …) → the id's shared state container; accessLogs, accessNotifications
  types/          — per-feature options, initial state, and hook maps; hook, log, notification, error, request
  utils/          — split (actions → descriptors + handlers), seed (state)
modules/          — local Nuxt modules: imports/ fills #components and #imports (the @zoobzio/vue components, definitions, and types, and the layer's own surface) and references app.d.ts for consumers
tests/            — vitest + happy-dom, mirroring app/ path-for-path
nuxt.config.ts    — layer config (no implicit imports, no component scanning or tag resolution; loads the reset)
```
