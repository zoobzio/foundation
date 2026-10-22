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
`modules/imports/` with the components and `define*` constructors of
`@zoobzio/vue`, so a consumer imports from them explicitly and never
depends on `@zoobzio/vue` itself. The package's composables are not
registered; they build the components and are not a consumer surface.

```ts
import { Autocomplete, Select } from "#components";
import { defineAutocomplete, defineSelect } from "#imports";
```

The layer's own modules ship through subpath exports, the same way
`@zoobzio/vue` ships `src/`:

```ts
import { createTable } from "@zoobzio/nuxt/factories/table";
```

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

Every relayed payload carries the service's `id`, so a listener filters by
instance:

```ts
useNuxtApp().hook("table:updated", ({ id, total }) => {
  if (id === "users") console.log(total);
});
```

The hook names and payloads are declared on `RuntimeNuxtHooks` in
`app/app.d.ts`; the option, initial-state, and hook types live in
`types/<name>`.

## Layout

```
app/
  app.d.ts        — RuntimeNuxtHooks augmentation for the relayed events
  factories/      — create<Name>(id, options) → use<Name>(): Service
  stores/         — access<Name>(id, …) → the id's shared state container
  types/          — per-feature options, initial state, and hook maps
  utils/          — split (actions → descriptors + handlers), seed (state)
modules/          — local Nuxt modules: imports/ fills the #imports / #components registries
tests/            — vitest + happy-dom, mirroring app/ path-for-path
nuxt.config.ts    — layer config (no implicit imports, no component scanning or tag resolution)
```
