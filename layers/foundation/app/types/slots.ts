/**
 * Extracts a component's default-slot payload from its imported type.
 *
 * Some reka primitives deliver render-scope data through their default slot
 * (CalendarRoot's `grid`/`weekDays`, CalendarHeading's `headingValue`) that a
 * wrapper must forward through its own ctx-scoped slot. The payload type has
 * to come from the imported component — never a hand-written mirror of reka's
 * shape — but reka does not export its slot interfaces, so this derives them
 * from the component's `$slots` declaration. Applied only where a wrapped
 * primitive scopes its default slot; components without a payload never
 * touch it.
 */
export type SlotProps<C> = C extends abstract new (...args: never[]) => {
  $slots: { default?: (props: infer P) => unknown };
}
  ? P
  : never;
