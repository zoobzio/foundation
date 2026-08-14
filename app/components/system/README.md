# System components

Page-level **structures** one tier above [data](../data/README.md). A
structure is an arrangement strategy over widgets — the workspace arranges a
grid of slots, the panel arranges three fixed regions (header / content /
footer) — and a page implements exactly one. Structures are *not*
widgets: a widget is an entity a factory creates; a structure is a component
a page uses, on [core](../core/README.md)'s component contract
(props / pt / ctx / slots), with **no machine** — no store, no service, no
factory, no events of its own.

## The taxonomy

| Prefix     | Home              | Nature                                                        |
| ---------- | ----------------- | ------------------------------------------------------------- |
| `create*`  | `factories/`      | runtime widget construction — returns a setup-time composable |
| `define*`  | `specs/`          | pure module-scope identity fn — a type checkpoint, no runtime |
| structures | `components/system/` | components consuming a spec — where specs become pages     |

`define*` follows the `defineNuxtConfig` idiom: it runs anywhere, does
nothing, and exists so the spec's types are enforced **at the definition
site** — a bad layout key or wire event errors on the line it is written,
not at mount.

## Specs

A spec is the complete description of a page's furniture: what exists
(`widgets`), where it goes (`layout`), how it talks to itself (`wire`).
Consumers keep them in their own `specs/` files — plain data, no Vue:

```ts
// specs/crm.ts
export const crmWorkspace = defineWorkspace({
  widgets: {
    "contact-table": useContactTable,
    "contact-form": useContactForm,
  },
  layout: {
    columns: 3,
    rows: 2,
    slots: [
      { id: "main", widget: "contact-table", position: [0, 0], span: [2, 2] },
      { id: "side", widget: "contact-form", position: [2, 0], span: [1, 2] },
    ],
  },
  wire: {
    "contact-table": {
      "table:updated": (event, services) => {
        services["contact-form"].validate();
      },
    },
  },
});
```

The page mounts the structure with the spec and optionally overrides
regions:

```vue
<Workspace :spec="crmWorkspace" :pt="{ … }">
  <template #widget:contact-form="{ service }">…</template>
</Workspace>
```

- `R` (the registry type) infers from `widgets`; `layout` slot keys and
  `wire` keys/events check against it.
- `#slot:<id>` overrides a grid cell wholesale; `#widget:<key>` overrides
  how a registry widget renders and receives its **typed** service.

The panel's spec swaps the arrangement vocabulary: `regions: { header?,
content?, footer? }` maps fixed region names to registry keys — no
arrangement math at all; layout is userland styling. Regions with neither a
widget nor slotted content are omitted from the DOM, and region overrides
use plain named slots (`#header`) rather than `slot:<id>`.

## Widget consumption (`composables/widgets.ts`)

The repeated pattern every structure shares, built once:

- `useWidgets(registry)` — invokes each widget composable once, in setup,
  where factories may run. Returns the erased `Record<string, AnyWidget>`
  the template binds: `<component :is="w.component" :service="w.service"
  :pt="toValue(w.settings)" />`. The render path is unchecked by design —
  correlation was proven at each factory's return annotation.
- `useWiring(spec.wire, widgets)` — registers each wire handler through the
  hooks backbone via [`useHooks`](../../composables/hook.ts), scoped to the
  resolved machine's id, torn down with the component scope. Handlers
  receive `(event, services)` where `services` is every resolved machine
  keyed like the registry.

A new structure is its arrangement types + a component calling these two —
nothing else.

Content without a widget of its own rides the
[adapter](../data/README.md#the-adapter): `createAdapter` lifts any plain
component (a logo, a core composite) into the widget contract, so a registry
entry, a spec slot, and wire coordination all work identically.

## Wiring semantics

Typing flows through the widget entity, not the global hook registry: the
registry erases feature generics (`FormEvents<unknown>` in `app.d.ts`), so
`Widget<Props, E>` carries an `events?: E` **phantom** that each factory
annotates at its concrete generics. `Wiring<R>`
([`types/spec.ts`](../../types/spec.ts)) recovers per-key payloads from it
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
- Specs are data. A spec field must be definable at module scope with no
  Vue context; handlers close over nothing.
- One structure per page.

## Adding a structure

1. **Types** — `types/system/<name>.ts`: the arrangement vocabulary
   (workspace's `Slot` / `Layout`), the `<Name>Spec<R>` (arrangement +
   `widgets: R` + `wire?: Wiring<R>`), and the component contract
   (props / passthrough / ctx / slots, with the `widget:<key>` mapped slot
   type for typed overrides).
2. **Spec module** — `specs/<name>.ts`: `define<Name>`, the identity
   checkpoint.
3. **Component** — `components/system/<name>.vue`: `generic="R extends
   Widgets"`, `useWidgets` + `useWiring`, arrangement math inline, the
   consumption cell (`slot:` fallback → `widget:` fallback →
   `<component :is>`).
4. **Verify** — typecheck, eslint, and a mount test over a fixture spec.

## Source map

| Concern             | File                                                                                                    |
| ------------------- | ------------------------------------------------------------------------------------------------------- |
| Widget contract     | [`types/widget.ts`](../../types/widget.ts) (`Widget` · `AnyWidget` · `Widgets`)                          |
| Spec/wiring types   | [`types/spec.ts`](../../types/spec.ts) (`Wiring` · `ServicesOf` · `EventsOf` · `WireHandler`)            |
| Consumption         | [`composables/widgets.ts`](../../composables/widgets.ts) (`useWidgets` · `useWiring`)                    |
| Hook backbone       | [`composables/hook.ts`](../../composables/hook.ts) · [`types/hook.ts`](../../types/hook.ts)              |
| Reference structure | [`workspace.vue`](./workspace.vue) · [`types/system/workspace.ts`](../../types/system/workspace.ts) · [`specs/workspace.ts`](../../specs/workspace.ts) |
| Region structure    | [`panel.vue`](./panel.vue) · [`types/system/panel.ts`](../../types/system/panel.ts) · [`specs/panel.ts`](../../specs/panel.ts) |
