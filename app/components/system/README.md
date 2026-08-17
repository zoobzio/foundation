# System components

Page-level **structures** one tier above [data](../data/README.md). A
structure is an arrangement strategy over widgets — the workspace arranges a
grid of slots, the panel arranges three fixed regions (header / content /
footer) — and a page implements exactly one. Structures are *not*
widgets: a widget is what a widget composable yields; a structure is a
component a page uses, on [core](../core/README.md)'s component contract
(props / pt / ctx / slots), with **no machine** — no store, no service, no
events of its own.

## The model

Static configuration and reactive wiring are isolated features, implemented
independently and connected by the user:

| Verb       | Home                 | Nature                                                        |
| ---------- | -------------------- | ------------------------------------------------------------- |
| `define*`  | `definitions/`       | pure module-scope identity fn — inert typed config, no runtime |
| `use*`     | `factories/` (widgets) · `composables/` (structures) | setup-scope instantiation — definition in, live entity out |
| structures | `components/system/` | components rendering a live handle                            |

`define*` follows the `defineNuxtConfig` idiom: it runs anywhere, does
nothing, and exists so types are enforced **at the definition site** — a
bad key or wire event errors on the line it is written, not at mount.
Nothing in a definition can execute; the whole tree is storable in
`constants/`, definitions composing definitions.

There is **no framework correlation** between a definition and the
composable that instances it: the user maps each widget definition to its
feature composable explicitly, and TypeScript checks the pairing on that
line. The extra step is the point — what exists (constants), how it is
alive (composables), and where it sits (template) stay separate:

```ts
// constants/dashboard.ts — the whole page as inert typed data
export const CONTACTS_TABLE = defineTable({ config: …, actions: … });
export const CONTACT_FORM = defineForm({ config: …, actions: … });

export const DASHBOARD = defineWorkspace({
  columns: 3,
  rows: 2,
  slots: {
    main: { position: [0, 0], span: [2, 2], widget: CONTACTS_TABLE },
    side: { position: [2, 0], span: [1, 2], widget: CONTACT_FORM },
  },
});
```

```ts
// composables/dashboard.ts — instantiation + wiring, the only place anything runs
export const useDashboard = () => {
  const main = useTable("dash-contacts", DASHBOARD.slots.main.widget);
  const side = useForm("dash-form", DASHBOARD.slots.side.widget);

  return useWorkspace(DASHBOARD, { main, side }, {
    main: {
      "table:updated": (event, services) => services.side.validate(),
    },
  });
};
```

```vue
<script setup lang="ts">
const workspace = useDashboard();
</script>

<template>
  <Workspace :workspace="workspace">
    <template #widget:side="{ service }">…</template>
  </Workspace>
</template>
```

Because wiring lives in setup rather than at module scope, handlers may
close over setup context — other structures' services, stores, the router.
The handle is fully typed: `services.<key>` is the page's imperative access
to the machines, `widgets.<key>` the keyed registry at the composables'
concrete generics. Widget lifetime follows the `use*` caller's scope, not
the structure's mount — a `v-if`'d structure does not rebuild its machines.

## The structures

**Workspace** — a grid. The definition holds geometry and slots keyed by
id, each carrying its placement and, optionally, the widget definition that
fills it; the slot id is the registry key, so wiring, `#slot:<id>` /
`#widget:<id>` overrides, and `services` all address a cell the same way.
`useWorkspace(definition, widgets, wire?)` guards the id vocabulary — a
widget key outside `slots` errors where it is written — and carries the
definition onto the handle as the layout the component renders. Widgetless
slots render through their Vue slot only.

**Panel** — three fixed regions, no arrangement math; layout is userland
styling. `definePanel({ header?, content?, footer? })` holds widget
definitions keyed by region; `usePanel(widgets, wire?)` takes the instanced
widgets under the same keys, with the region vocabulary guarded the same
way. Regions with neither a widget nor slotted content are omitted from the
DOM; region overrides use plain named slots (`#header`) rather than
`slot:<id>`, widget overrides `#widget:<region>`.

## Widget consumption

- Instantiation is the user's explicit `use*` calls — there is no registry
  resolver. Structure composables receive live widgets.
- `useWiring(wire, widgets)` ([`composables/widgets.ts`](../../composables/widgets.ts))
  registers each wire handler through the hooks backbone via
  [`useHooks`](../../composables/hook.ts), scoped to the machine's id, torn
  down with the calling scope. Handlers receive `(event, services)` where
  `services` is every machine keyed like the registry. Both structure
  composables ride it.
- Erasure is an internal render mechanism only — userland types are exact.
  Each structure widens its registry to `Record<string, AnyWidget>` at its
  own boundary (one widening assignment, no cast) before the template binds
  `<component :is="w.component" :service="w.service"
  :pt="toValue(w.settings)" />`. That render path is unchecked by design —
  correlation was proven where each widget was instanced.

Content without a widget of its own rides the
[adapter](../data/README.md#the-adapter): `defineAdapter` + `useAdapter`
lift any plain component (a logo, a core composite) into the widget
contract, so a registry entry, a structure slot, and wire coordination all
work identically.

## Wiring semantics

Typing flows through the widget entity, not the global hook registry: the
registry erases feature generics (`FormEvents<unknown>` in `app.d.ts`), so
`Widget<Props, E>` carries an `events?: E` **phantom** that each widget
composable annotates at its concrete generics. `Wiring<R>`
([`types/definition.ts`](../../types/definition.ts)) recovers per-key payloads from it
and types the services record as `ServicesOf<R>`.

Two deliberate semantics:

- Wiring rides the **global hook bus, id-filtered** — a handler also fires
  when its machine is driven from elsewhere on the page. Page-scoped
  coordination in the broad sense; chosen, not accidental.
- The typed-handler → erased-runner seam uses hook.ts's method-bivariance
  precedent (`WireHandler`), plus `infer E extends ScopedEvent` so the
  conditional resolves inside generic component code. No casts; the
  unsoundness is the same one the hooks backbone already carries, and it is
  sound by construction — handlers are id-filtered to the machine whose
  generics they were typed against.

## Conventions

- **No machines in this tier.** If a structure seems to need a store or a
  service, the state belongs to a widget (data tier) or to the page.
  Arrangement math (grid styles, cell pairing) lives in the structure's own
  script — it *is* the component.
- Structures follow core's component contract: parts manifest via
  `usePassthrough`, `useContext` (`system-<name>`), typed `defineSlots`,
  `f-system-<name>-*` classes.
- **Definitions are inert.** A definition must be definable at module scope
  with no Vue context, and must never grow a function-valued field beyond
  the consumer callbacks its feature definitions already carry. Wiring
  never rides a definition — it attaches at the structure's `use*`, where
  handlers may close over setup scope.
- One structure per page.

## Adding a structure

1. **Types** — `types/system/<name>.ts`: the arrangement vocabulary
   (workspace's `Slot`), the `<Name>Definition` (inert config), the live
   `<Name><R>` handle (`widgets: R` + `services: ServicesOf<R>` + whatever
   static config the component renders), and the component contract
   (props / passthrough / ctx / slots, with the `widget:<key>` mapped slot
   type for typed overrides).
2. **Definition module** — `definitions/<name>.ts`: `define<Name>`, the
   identity checkpoint.
3. **Composable** — `composables/<name>.ts`: `use<Name>(…, widgets, wire?)`
   — key-vocabulary guard, `useWiring`, services assembly, the handle.
4. **Component** — `components/system/<name>.vue`: `generic="R extends
   Widgets"`, one handle prop, arrangement math inline, the consumption
   cell (`slot:` fallback → `widget:` fallback → `<component :is>`).
5. **Verify** — typecheck, eslint, and a mount test over a fixture
   definition driven through the full define → use → mount flow.

## Source map

| Concern             | File                                                                                                    |
| ------------------- | ------------------------------------------------------------------------------------------------------- |
| Widget contract     | [`types/widget.ts`](../../types/widget.ts) (`Widget` · `AnyWidget` · `Widgets`)                          |
| Definition/wiring types | [`types/definition.ts`](../../types/definition.ts) (`Wiring` · `ServicesOf` · `EventsOf` · `WireHandler`) |
| Wiring runner       | [`composables/widgets.ts`](../../composables/widgets.ts) (`useWiring`)                                   |
| Hook backbone       | [`composables/hook.ts`](../../composables/hook.ts) · [`types/hook.ts`](../../types/hook.ts)              |
| Grid structure      | [`workspace.vue`](./workspace.vue) · [`types/system/workspace.ts`](../../types/system/workspace.ts) · [`definitions/workspace.ts`](../../definitions/workspace.ts) · [`composables/workspace.ts`](../../composables/workspace.ts) |
| Region structure    | [`panel.vue`](./panel.vue) · [`types/system/panel.ts`](../../types/system/panel.ts) · [`definitions/panel.ts`](../../definitions/panel.ts) · [`composables/panel.ts`](../../composables/panel.ts) |
