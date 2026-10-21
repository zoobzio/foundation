/**
 * The native events a component can emit, in Vue object-emits form.
 * A literal interface, not a mapped type: `@vue/compiler-sfc` must fold the
 * emit keys statically for `defineEmits`.
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
 * Picks native events from {@link NativeEventMap} for a component's emits.
 * Declaring an emit removes its listener from `$attrs`, so the component must
 * also re-emit the event from its root. Instantiate with literal event names:
 * the `compiler-sfc` macro resolver cannot substitute a type parameter.
 */
export type EventEmits<K extends keyof NativeEventMap> = Pick<
  NativeEventMap,
  K
>;
