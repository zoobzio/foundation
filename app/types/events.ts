/**
 * The native events a component may surface as emits, each mapped to a payload
 * tuple whose type is the DOM's own (`GlobalEventHandlersEventMap`), in Vue
 * object-emits form. A literal interface — not a mapped type over the DOM
 * event map — because `@vue/compiler-sfc` must statically fold the emit keys
 * for `defineEmits` and its resolver cannot expand mapped types or lib.dom
 * interfaces; new events earn entries here as components need them.
 */
interface NativeEventMap {
  blur: [event: GlobalEventHandlersEventMap["blur"]];
  change: [event: GlobalEventHandlersEventMap["change"]];
  click: [event: GlobalEventHandlersEventMap["click"]];
  focus: [event: GlobalEventHandlersEventMap["focus"]];
  input: [event: GlobalEventHandlersEventMap["input"]];
  reset: [event: GlobalEventHandlersEventMap["reset"]];
  submit: [event: GlobalEventHandlersEventMap["submit"]];
}

/**
 * The native-event emits contract for a component, declared in the component's
 * own type file: `type FooEmits = EventEmits<"input" | "change">` picks those
 * events' entries from {@link NativeEventMap}; custom emits intersect on top
 * (`EventEmits<"click"> & { select: [value: string] }`).
 *
 * The component is the decision site: an event is part of the contract when
 * the component declares it via `defineEmits` and re-emits it from its root
 * (`@click="emit('click', $event)"`). Declaring an emit removes the listener
 * from `$attrs`, so naming an event here without wiring the re-emit leaves it
 * silently dead. Always instantiated with literal event names — the
 * `compiler-sfc` macro resolver cannot substitute a type parameter, so emits
 * stay per-component on `defineEmits` and never pass through a generic.
 */
export type EventEmits<K extends keyof NativeEventMap> = Pick<
  NativeEventMap,
  K
>;
