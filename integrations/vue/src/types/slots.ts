/**
 * The default-slot payload of a component type.
 * reka does not export its slot interfaces, so this reads them from `$slots`.
 */
export type SlotProps<C> = C extends abstract new (...args: never[]) => {
  $slots: { default?: (props: infer P) => unknown };
}
  ? P
  : never;
