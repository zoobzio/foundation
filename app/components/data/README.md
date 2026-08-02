# Data components

Stateful features one tier above [core](../core/README.md). Each data feature
is split into a **headless machine** — store, service, factory — and the
**presentational components** that render it. The machine is created by the
consumer through a factory and handed to the widget as a single prop; the
widget reads its refs, calls its methods, and owns no feature state of its
own. Everything presentational conforms to the same passthrough / context /
slots system as core.

[`form`](./form/) and [`autocomplete`](./autocomplete/) are the reference
implementations: form shows async actions and config-keyed children,
autocomplete shows a sync machine and data-driven (iterated) children.

## File anatomy

A feature `<name>` spans a fixed set of files:

| Concern           | File                                              |
| ----------------- | ------------------------------------------------- |
| Domain contract   | `types/data/<name>.ts`                            |
| Component types   | `types/data/<name>/widget.ts` (+ one per sub-component) |
| State             | `stores/<name>.ts`                                |
| Logic             | `services/<name>.ts`                              |
| Wiring            | `factories/<name>.ts`                             |
| Feature composables | `composables/<name>.ts`                         |
| Components        | `components/data/<name>/widget.vue` (+ sub-components) |
| Constants         | `constants/<name>.ts`                             |
| Event registration | `app.d.ts`                                       |

## Domain contract (`types/data/<name>.ts`)

Type aliases, **unprefixed** — the module path is the namespace. A fixed
progression, generic over the consumer's data (`Form<T>` over the payload,
`Autocomplete<M>` over item metadata):

| Type      | Meaning                                                                     |
| --------- | --------------------------------------------------------------------------- |
| `Config`  | consumer-declared description: static config + **synchronous** resolvers    |
| `State`   | raw reactive state — `Ref`-wrapped values only, exactly what the store owns |
| `Service` | imperative contract: readonly **unwrapped** state + deriveds + full method surface |
| `Actions` | optional consumer side effects, each `(payload, service: Service<T>) => …`  |
| `Events`  | hook map: `"<name>:<past-tense>"` → `(event: { id: string; … }) => void`    |
| `<Name>`  | the reactive facade returned by the factory; the widget's prop              |

Supporting types (`Field`, `Item`, `Query`, …) live in the same file;
component type files import them rather than redefining them.

- **Actions receive the plain `Service`**, never the facade — consumer logic
  drives the machine imperatively, without refs.
- **Every event payload carries `id`** (`ScopedEvent`), so `useHooks` can
  filter by instance.
- The facade mirrors the service reactively: state as `Ref`s, deriveds as
  `ComputedRef`s, methods bound through.

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
  config resolvers. Keep derived getters cheap — the factory's computeds
  cache only the outermost call.
- Mutating methods `log.debug` and emit the matching event **after** the
  state change; dispatcher methods invoke the consumer action first, then
  emit (`this.actions.select?.(item, this); this.emit("…:selected", …)`).
- **DOM-free**: no `window`, `document`, timers, or event objects beyond
  what actions forward. Presentational timing (blur delays, scrolling) is
  widget/composable territory.

## Factory (`factories/<name>.ts`)

Pure wiring — resolve the app, access the store, construct the service,
return the facade. No logic:

```ts
export const createAutocomplete = <M>(id, config, actions = {}) => {
  return (): Autocomplete<M> => {
    const nuxt = useNuxtApp();
    const state = accessAutocomplete<M>(id);
    const service = new AutocompleteService(nuxt, id, config, state, actions);
    return {
      id,
      config,
      input: computed({ get: () => service.input, set: (v) => service.set(v) }),
      focused: computed(() => service.focused),
      suggestions: computed(() => service.suggestions),
      // … every State key, every derived, every method bound through
      set: (value) => service.set(value),
    };
  };
};
```

State the consumer or widget writes gets a **writable computed** routing
through the service's mutator (form's `payload`, autocomplete's `input` /
`steps`); everything else is a read-only computed.

## Widget (`components/data/<name>/widget.vue`)

Script skeleton, in order:

```ts
const { autocomplete, pt } = defineProps<AutocompleteWidgetProps<M>>();   // generic="M"
const emit = defineEmits<AutocompleteWidgetEmits<M>>();

useHooks<Events<M>>(autocomplete.id, {                    // hook → emit, 1:1
  "autocomplete:updated": (event) => emit("updated", event),
  /* … every event … */
});

const { input, hint, panels, dropdown } = autocomplete;   // what the template reads

const el = useTemplateRef<ComponentPublicInstance>("el");
const { recipes } = useAutocomplete(autocomplete, el);    // feature composable

const settings = usePassthrough<AutocompleteWidgetPassthrough<M>>(() => ({
  pt,
  recipes: { root: {}, /* … blank parts … */, ...recipes.value },
}));

const ctx = useContext<AutocompleteWidgetContext<M>>("data-autocomplete", () => ({
  autocomplete, el: el.value, settings: settings.value,
}));

defineExpose({ ctx });
const slots = defineSlots<AutocompleteWidgetSlots<M>>();
const forwarded = useForwardSlots(slots, AUTOCOMPLETE_ITEM_SLOTS);
```

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

| Children keyed by       | Mechanism | Shape |
| ----------------------- | --------- | ----- |
| static config (form fields, table columns) | keyed `pt` record | `pt?: PT<…> & { fields?: Partial<Record<keyof T, PT<FormFieldPassthrough>>> }`, bound as `:pt="pt?.fields?.[field.key]"` |
| runtime data (autocomplete items, table rows) | `PassthroughIter` manifest entry | `item: PassthroughIter<Anchor<M>, XItemProps<M>>`, bound as `v-bind="settings.item(anchor)"` |

For iterated children, define an **anchor type** — the child's render
position (`{ item, index, panel }`) — and reuse it as the iter's datum, the
child's props base, and the child composable's reactive source. Remember
core's iter semantics: a consumer callback **replaces the recipe wholesale**,
structural wiring included.

The widget relays the child's slot names from a constant
(`constants/<name>.ts`, typed `(keyof XItemSlots<unknown>)[]`) via
`useForwardSlots` + a dynamic `<template #[name]>` loop.

## Feature composables (`composables/<name>.ts`)

The feature half of each component, extracted for testability:

- `use<Name>(machine, el)` — widget level. Owns native-surface handlers
  (keyboard, input, focus/blur with its delay), DOM watchers
  (scroll-into-view), and returns the `recipes` computed the widget spreads
  into its manifest.
- `use<Name><Part>(machine, source)` — child level. Takes the machine plus a
  `MaybeRefOrGetter` anchor source (`() => ({ item, index, panel })` — child
  props are reactive per-render, so pass a getter, not values) and returns
  deriveds for the ctx plus the child's feature recipes. Annotate the recipes
  computed (`computed<Pick<XItemPassthrough, "root" | "arrow">>`) so literal
  props don't widen.

DOM, timers, and browser APIs stop at this layer — they never reach the
service.

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

- **Explicit imports only** — `#foundation/*`, `#imports`, `#components`
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

## Migration checklist

For a legacy component in this tier (PascalCase files are pending;
kebab-case are migrated — renaming is the final step):

1. **Domain contract** — write `types/data/<name>.ts` from scratch:
   `Config` / `State` / `Service` / `Actions` / `Events` / facade. Decide the
   generic, the action surface, and the event set here, not in the component.
2. **Store** — `accessX(id)` over `useState`, defaults only.
3. **Service** — port *all* logic from the old component/factory into the
   class; add log + emit discipline. Typecheck before moving on: the service
   compiles clean while the old component is still broken.
4. **Factory** — collapse to wiring.
5. **Register events** in `app.d.ts`.
6. **Component types** — `types/data/<name>/widget.ts` (+ per sub-component),
   prefixed, emits derived from `Events`.
7. **Sub-components** for repeated units; anchor type; keyed-`pt` or iter
   entry.
8. **Feature composables** — everything in the widget script that isn't
   wiring moves here.
9. **Widgets** — the skeleton above; `f-data-*` classes; slots forwarded.
10. **Verify** — `npx nuxt typecheck` (new files clean; legacy noise is
    tracked separately) and `npx eslint` on every touched path.

## Source map

| Concern             | File                                                                                    |
| ------------------- | --------------------------------------------------------------------------------------- |
| Passthrough system  | [core README](../core/README.md#the-passthrough-system) — identical merge semantics      |
| Hook subscription   | [`composables/hook.ts`](../../composables/hook.ts) · [`types/hook.ts`](../../types/hook.ts) |
| Slot forwarding     | [`composables/slots.ts`](../../composables/slots.ts) (`useForwardSlots`)                 |
| Lazy init           | [`composables/request.ts`](../../composables/request.ts) (`useLazyRequest`)              |
| Schema helpers      | [`utils/schema.ts`](../../utils/schema.ts) (`flatten` · `check`)                         |
| Reference: machine  | [`services/form.ts`](../../services/form.ts) · [`services/autocomplete.ts`](../../services/autocomplete.ts) |
| Reference: widget   | [`form/widget.vue`](./form/widget.vue) · [`autocomplete/widget.vue`](./autocomplete/widget.vue) |
| Reference: children | [`form/field.vue`](./form/field.vue) (keyed) · [`autocomplete/item.vue`](./autocomplete/item.vue) (iterated) |

## Status

Migrated: `form`, `autocomplete`. Pending (PascalCase files, previous
architecture): `chart`, `deck`, `filter`, `preview`, `table`.
