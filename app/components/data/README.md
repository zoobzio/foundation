# Data components

Stateful features one tier above [core](../core/README.md). Each data feature
is split into a **headless machine** — store, service — and the
**presentational components** that render it. The widget composable yields
the canonical **widget** (`types/widget.ts`): the service (a plain, Vue-free class over
ref-backed state), the component that renders it under the uniform `service`
prop, and the consumer's reactive settings for its passthrough tree.
Components build their reactivity through the feature composable
(`useServiceRefs` under the hood) and own no feature state of their own.
Everything presentational conforms to the same passthrough / context / slots
system as core.

[`form`](./form/) and [`autocomplete`](./autocomplete/) are the reference
implementations: form shows async actions and config-keyed children,
autocomplete shows a sync machine and data-driven (iterated) children.

## File anatomy

A feature `<name>` spans a fixed set of files:

| Concern             | File                                                    |
| ------------------- | ------------------------------------------------------- |
| Domain contract     | `types/data/<name>.ts`                                  |
| Component types     | `types/data/<name>/widget.ts` (+ one per sub-component) |
| State               | `stores/<name>.ts`                                      |
| Logic               | `services/<name>.ts`                                    |
| Definition          | `definitions/<name>.ts`                                 |
| Instancing          | `factories/<name>.ts`                                   |
| Feature composables | `composables/<name>.ts`                                 |
| Components          | `components/data/<name>/widget.vue` (+ sub-components)  |
| Constants           | `constants/<name>.ts`                                   |
| Event registration  | `app.d.ts`                                              |

## Domain contract (`types/data/<name>.ts`)

Type aliases, **unprefixed** — the module path is the namespace. A fixed
progression, generic over the consumer's data (`Form<T>` over the payload,
`Autocomplete<M>` over item metadata):

| Type      | Meaning                                                                             |
| --------- | ----------------------------------------------------------------------------------- |
| `Config`  | consumer-declared description: static config + **synchronous** resolvers            |
| `State`   | raw reactive state — `Ref`-wrapped values only, exactly what the store owns         |
| `Service` | the machine contract: **unwrapped** state + deriveds + full method surface — the widget's `service` prop; actions receive it too |
| `Actions` | optional consumer side effects, each `(payload, service: Service<T>) => …`          |
| `Events`  | hook map: `"<name>:<past-tense>"` → `(event: { id: string; … }) => void`            |

Supporting types (`Field`, `Item`, `Query`, …) live in the same file;
component type files import them rather than redefining them.

- **Every event payload carries `id`** (`ScopedEvent`), so `useHooks` can
  filter by instance.
- **The `readonly` discipline is load-bearing.** `useServiceRefs` mirrors a
  service's state surface by its modifiers: `readonly` members become
  `ComputedRef`s, non-readonly members must be **get/set accessor pairs**
  whose setter routes through the matching mutator (autocomplete's `input`,
  form's `payload`, deck's filter fields) and become `WritableComputedRef`s.
  Methods are excluded — call them on the machine.

## Store (`stores/<name>.ts`)

```ts
export const accessAutocomplete = <M>(id: string): State<M> => {
  const input = useState<string>(`autocomplete-${id}-input`, () => "");
  // … one useState per State key, keyed `<name>-${id}-<key>`
  return { input, steps, focused, highlight };
};
```

Defaults only — no logic, no deriveds. Two callers with the same `id` share
state; that is the instancing model.

## Service (`services/<name>.ts`)

A plain class, `implements Service<T>`, constructed with the Nuxt app:

```ts
export class AutocompleteService<M> implements Service<M> {
  private readonly log: Logger;
  private readonly emit: NuxtApp["callHook"];

  constructor(
    nuxt: NuxtApp,
    public readonly id: string,
    public readonly config: Config<M>,
    private readonly state: State<M>,
    private readonly actions: Actions<M>,
  ) {
    this.log = nuxt.$logger(this.id);
    this.emit = nuxt.callHook;
  }
  // getters unwrap state / derive from config resolvers …
  // methods mutate state, log.debug, emit events …
}
```

- **All feature logic lives here** — validation, derivation, highlight
  bookkeeping, everything. The service is the unit under test.
- Getters return plain values (`this.state.x.value`); deriveds call the
  config resolvers. Keep derived getters cheap — the refs view's computeds
  cache only the outermost call.
- Mutating methods `log.debug` and emit the matching event **after** the
  state change; dispatcher methods invoke the consumer action first, then
  emit (`this.actions.select?.(item, this); this.emit("…:selected", …)`).
- **DOM-free**: no `window`, `document`, timers, or event objects beyond
  what actions forward. Presentational timing (blur delays, scrolling) is
  widget/composable territory.

## Definition + widget composable (`definitions/<name>.ts` · `factories/<name>.ts`)

Authoring is split into two verbs, and there is no framework correlation
between them — the user maps a definition to its composable explicitly,
and TypeScript checks the pairing on that line. `define<Name>` is a typed
constructor over the feature's static description — config, actions,
settings — pure data plus consumer callbacks, definable at module scope
(storable in `constants/`), reusable across instances:

```ts
export type AutocompleteDefinition<M> = {
  config: Config<M>;
  actions?: Actions<M>;
  settings?: WidgetSettings<AutocompleteWidgetProps<M>>;
};

export const defineAutocomplete = <M>(
  definition: AutocompleteDefinition<M>,
): AutocompleteDefinition<M> => definition;
```

`use<Name>` is a composable — call it in setup — that instances a
definition: `id` is the only thing it adds (shared state, hook scoping,
wiring identity all key on it). Pure instancing, no logic:

```ts
import component from "../components/data/autocomplete/widget.vue";

export const useAutocomplete = <M>(
  id: string,
  definition: AutocompleteDefinition<M>,
): Widget<AutocompleteWidgetProps<M>> => {
  const nuxt = useNuxtApp();
  const state = accessAutocomplete<M>(id);
  const service = new AutocompleteService(nuxt, id, definition.config, state, definition.actions ?? {});
  return { service, component, settings: definition.settings };
};
```

`Widget<Props>` is generic over the component's props type, which carries
both the machine (`Props["service"]`) and the settings tree
(`NonNullable<Props["pt"]>`). The return annotation is the enforcement
point: a component whose `service` prop doesn't accept the constructed
service fails to compile here. `settings` is a `MaybeRefOrGetter` passed
through raw — structural components resolve it with `toValue` at the bind
site.

## Widget (`components/data/<name>/widget.vue`)

Script skeleton, in order:

```ts
const { service, pt } = defineProps<AutocompleteWidgetProps<M>>();   // generic="M"
const emit = defineEmits<AutocompleteWidgetEmits<M>>();

useHooks<Events<M>>(service.id, {                         // hook → emit, 1:1
  "autocomplete:updated": (event) => emit("updated", event),
  /* … every event … */
});

const el = useTemplateRef<ComponentPublicInstance>("el");

// One feature composable per feature — refs + deriveds + recipes in one call
const { input, hint, panels, dropdown, recipes } = useAutocompleteView(service, el);

const settings = usePassthrough<AutocompleteWidgetPassthrough<M>>(() => ({
  pt,
  recipes: { root: {}, /* … blank parts … */, ...recipes.value },
}));

const ctx = useContext<AutocompleteWidgetContext<M>>("data-autocomplete", () => ({
  autocomplete: service, el: el.value, settings: settings.value,
}));

defineExpose({ ctx });
const slots = defineSlots<AutocompleteWidgetSlots<M>>();
const forwarded = useForwardSlots(slots, AUTOCOMPLETE_ITEM_SLOTS);
```

Two hard rules the collapse introduced:

- **Never destructure a machine.** `const { loading } = service` snapshots a
  plain value dead. State comes from the feature composable's refs; methods
  are called on the machine (`service.fetch()`), whose property reads stay
  live in any tracked context.
- **Never pass a machine method bare.** Class methods bind `this` at the
  call: `useLazyRequest(key, service.init)` detaches and throws. Always
  close over the machine — `() => service.init()`.

Component type files are **prefixed** (`AutocompleteWidgetProps`,
`AutocompleteItemContext`, …) and follow core's progression —
`XPassthrough` / `XProps` / `XEmits` / `XContext` / `XSlots` — with two
data-tier differences:

- `XProps` is `{ <name>: <Name><T>; pt?: PT<XPassthrough<T>> }` — the machine
  plus passthrough, nothing else. Feature options belong in `Config`, not
  props.
- `XEmits` is **derived from the domain events**, never authored:
  `updated: Parameters<Events<M>["autocomplete:updated"]>`.

Template contract is core's (one `v-bind` per part, one ctx-scoped slot per
overridable region, no `.value`), except classes: **data widgets own their
part classes** — `f-data-<name>` on the root, `f-data-<name>-<part>` per
part, `--<state>` modifiers driven by machine state.

## Repeated children

The repeated unit is its **own sub-component** with its own type file,
composable, ctx, and forwarded slots — never inlined in the widget. Two
mechanisms, chosen by what keys the children:

| Children keyed by                             | Mechanism                        | Shape                                                                                                                    |
| --------------------------------------------- | -------------------------------- | ------------------------------------------------------------------------------------------------------------------------ |
| static config (form fields, table columns)    | keyed `pt` record                | `pt?: PT<…> & { fields?: Partial<Record<keyof T, PT<FormFieldPassthrough>>> }`, bound as `:pt="pt?.fields?.[field.key]"` |
| runtime data (autocomplete items, table rows) | `PassthroughIter` manifest entry | `item: PassthroughIter<Anchor<M>, XItemProps<M>>`, bound as `v-bind="settings.item(anchor)"`                             |

For iterated children, define an **anchor type** — the child's render
position (`{ item, index, panel }`) — and reuse it as the iter's datum, the
child's props base, and the child composable's reactive source. Remember
core's iter semantics: a consumer callback **replaces the recipe wholesale**,
structural wiring included.

The widget relays the child's slot names from a constant
(`constants/<name>.ts`, typed `(keyof XItemSlots<unknown>)[]`) via
`useForwardSlots` + a dynamic `<template #[name]>` loop.

## Feature composables (`composables/<name>.ts`)

**One composable per feature** — `use<Name>(machine, el?)` — called by the
widget and every sub-component, each destructuring its slice. It is the
feature's whole view surface:

- **The refs view**: opens with
  [`useServiceRefs`](../../composables/refs.ts)`(machine)` and spreads it
  into the return — the generic facade (storeToRefs style) that mirrors the
  service's state surface as computeds, writable where the class declares a
  setter.
- **Shared deriveds** (`hasSelection`, `isSelectable`, …) — never inline
  these in components; two components deriving the same thing is the smell.
- **Native-surface handlers and DOM** (keyboard, input, focus/blur delays,
  scroll-into-view, timers), gated on the optional `el` when widget-only.
  DOM, timers, and browser APIs stop at this layer — they never reach the
  service.
- **Anchored scopes** for repeated/positioned children, returned as
  closures: `useItem(source)`, `useField(field)`, `useControl(source)`,
  `useCanvas(canvasEl)`. Each takes a `MaybeRefOrGetter` anchor (child props
  are reactive per-render, so pass a getter, not values) and returns the
  child's deriveds plus its feature recipes. Annotate the recipes computed
  (`computed<Pick<XItemPassthrough, "root" | "arrow">>`) so literal props
  don't widen.

Derived names must not shadow service keys — the spread is silent
(`facetOptions`, not a second `facetGroups`).

## Events

One backbone: Nuxt runtime hooks.

1. Declare the map in the domain contract — names are
   `"<name>:<past-tense>"`, payloads carry `id`.
2. Register it in [`app.d.ts`](../../app.d.ts):
   `interface RuntimeNuxtHooks extends FormEvents<unknown>, AutocompleteEvents<unknown> {}`.
3. The **service** emits via `nuxt.callHook` at each state transition /
   dispatched action.
4. The **widget** subscribes with
   [`useHooks`](../../composables/hook.ts)`(machine.id, { … })` — filtered by
   `id` — and re-emits each event under its unprefixed name.

Consumers therefore get every user action three ways: imperatively
(`Actions`), globally (hooks), locally (widget emits). All three carry the
same payloads.

## Conventions

- **Explicit imports only** — relative paths within the layer, `#imports`, `#components`
  (e.g. `ClientOnly`); type imports first, rendered components second,
  composables third.
- **No casts, no non-null assertions** — narrow structurally:
  `event.target instanceof HTMLInputElement` for DOM payloads, `v-if`
  scope for data-driven required props (an `Icon` whose `alias` comes from
  item data binds `:alias="item.icon"` inside `v-if="item.icon"`, and the
  manifest omits that prop).
- **Widening a common contract**: when the widget drives native behavior a
  common component doesn't declare (form's `value`/`min`/`max`, this tier's
  input `keydown`), widen the manifest entry —
  `Passthrough<InputProps & { value?: string }, InputEmits & { keydown: [KeyboardEvent] }>`
  — and note it; the bindings fall through the component to its root
  element. Do not grow the common component's event list for one feature.
- **Config resolvers are synchronous.** Async belongs in `Actions`
  (form's `init`/`submit`), guarded by service state (`initialized`,
  `submitting`) and kicked off by the widget via `useLazyRequest` when the
  feature has an init lifecycle.
- Constants live in `constants/<name>.ts`, `SCREAMING_SNAKE` with the
  feature prefix (`AUTOCOMPLETE_BLUR_DELAY_MS`).
- Store keys are `` `<name>-${id}-<key>` ``; ctx names are
  `data-<name>` / `data-<name>-<part>`.

## The adapter

The escape hatch at the widget boundary: `useAdapter` lifts a plain
component — a logo, a core composite like directory — into the widget
contract, so a registry entry, a structure slot, and wire coordination all
work identically to a real feature. It follows this tier's anatomy (store,
service, widget composable, widget, registered event) with deliberate
deviations.

```ts
// the composite definition — the same v-bindable object a template uses
const nav = defineDirectory({ groups: NAV_GROUPS, onSelect: (item) => {} });

// the lift — component, exhaustive emit acknowledgment, definition as settings
const adapter = defineAdapter({
  component: Directory,
  emits: { select: true },
  settings: nav,
});

// in setup — the definition instanced under its id
const navWidget = useAdapter("sidebar-nav", adapter);
```

One named const per entity — definitions are declared, then composed by
reference; `define*` calls never nest inside `use*` calls.

- **The contract is a definition.** `Contract<Props, Emits>` is the same
  transform as `Definition<Props, Emits>` — a component's props plus emit
  listeners in `v-bind` form — so a composite's `<Name>Definition` is a valid
  contract and valid `settings` with zero glue. `defineAdapter<Contract>` is
  where it's enforced: everything verifies against it: the component must implement it (checked at
  `component:`), `settings`/`patch` check against exactly its props, its
  `on*` listener props define the emit vocabulary, and wire payloads carry
  its exact argument tuples. Omitting the generic infers the contract from
  the component's `$props` — legal, but noisier types. Contract requiredness
  mirrors the component's: a prop the component defaults cannot be required
  by the contract.
- **`emits` is exhaustive.** `{ [K in EmitName<P>]: true }` — every contract
  listener prop must be acknowledged, so the typed wire surface and the
  runtime bridge cannot drift; a contract with no listeners states
  `emits: {}`. Contract emit ⇔ bridged emit: local-only means leaving the
  listener off the contract.
- **`pt` is the wrapped component's own props, not a part manifest.**
  `settings` is the reactive base — the definition requires it when the
  contract has required props — and the service's `patch`/`reset` override layer merges over it
  **flat, per key**. `patch` is the entry point wiring uses to drive an
  adapted component imperatively (`services.nav.patch({ … })`); it emits no
  domain event — prop control is coordination plumbing, and an event there
  invites wire feedback loops.
- **One registered event.** Every contract emit dispatches `adapter:emitted`
  (`{ id, emit, args }`, id-scoped). Wire handlers narrow on `event.emit`
  with typing recovered from the widget events phantom, not the registry.
- **No slots cross the widget boundary.** Override at the structure
  (`widget:<key>`), or wrap the component in a local SFC that fills its own
  slots and adapt that.
- **Anything stateful deserves a real feature.** The adapter's machine is
  identity plus props; when page behavior starts accumulating in `patch`
  calls and wire handlers, that is a feature asking to be built.
- Ids use the standard instancing model (`adapter-${id}-props`): the same id
  anywhere in the app shares the override layer. Name adapter ids as
  deliberately as feature ids — the definition is the reusable half, the id
  is the instancing decision.

## Adding a feature

Build order for a new feature in this tier:

1. **Domain contract** — write `types/data/<name>.ts` first:
   `Config` / `State` / `Service` / `Actions` / `Events`. Decide the generic,
   the action surface, the event set, and which members are writable accessor
   pairs here, not in the component.
2. **Store** — `accessX(id)` over `useState`, defaults only.
3. **Service** — _all_ feature logic lives in the class; log + emit
   discipline. Typecheck before moving on: the service compiles clean before
   any component exists.
4. **Definition** — `definitions/<name>.ts`: the `<Name>Definition` bundle
   and its `define<Name>` constructor.
5. **Widget composable** — `factories/<name>.ts`: pure instancing over the
   definition, `use<Name>(id, definition) => Widget`.
6. **Register events** in `app.d.ts`.
7. **Component types** — `types/data/<name>/widget.ts` (+ per sub-component),
   prefixed, emits derived from `Events`.
8. **Sub-components** for repeated units; anchor type; keyed-`pt` or iter
   entry.
9. **Feature composables** — everything in the widget script that isn't
   wiring goes here.
10. **Widgets** — the skeleton above; `f-data-*` classes; slots forwarded.
11. **Verify** — `npx nuxt typecheck` and `npx eslint` on every touched
    path.

## Source map

| Concern             | File                                                                                                         |
| ------------------- | ------------------------------------------------------------------------------------------------------------ |
| Passthrough system  | [core README](../core/README.md#the-passthrough-system) — identical merge semantics                          |
| Widget contract     | [`types/widget.ts`](../../types/widget.ts) (`Widget` · `WidgetSettings` · `AnyWidget` · `Widgets`)           |
| Refs view           | [`composables/refs.ts`](../../composables/refs.ts) (`useServiceRefs`) · [`types/refs.ts`](../../types/refs.ts) |
| Hook subscription   | [`composables/hook.ts`](../../composables/hook.ts) · [`types/hook.ts`](../../types/hook.ts)                  |
| Slot forwarding     | [`composables/slots.ts`](../../composables/slots.ts) (`useForwardSlots`)                                     |
| Lazy init           | [`composables/request.ts`](../../composables/request.ts) (`useLazyRequest`)                                  |
| Schema helpers      | [`utils/schema.ts`](../../utils/schema.ts) (`flatten` · `check`)                                             |
| Reference: machine  | [`services/form.ts`](../../services/form.ts) · [`services/autocomplete.ts`](../../services/autocomplete.ts)  |
| Reference: widget   | [`form/widget.vue`](./form/widget.vue) · [`autocomplete/widget.vue`](./autocomplete/widget.vue)              |
| Reference: children | [`form/field.vue`](./form/field.vue) (keyed) · [`autocomplete/item.vue`](./autocomplete/item.vue) (iterated) |
| Adapter             | [`definitions/adapter.ts`](../../definitions/adapter.ts) · [`factories/adapter.ts`](../../factories/adapter.ts) · [`types/data/adapter.ts`](../../types/data/adapter.ts) · [`adapter/widget.vue`](./adapter/widget.vue) |
