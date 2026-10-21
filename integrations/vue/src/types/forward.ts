import type { FunctionalComponent, VNode } from "vue";

/**
 * A component that accepts the props `P`. Both encodings: a plain SFC
 * exports a constructable type, a generic SFC exports a call signature.
 */
export type ForwardComponent<P> =
  | FunctionalComponent<P>
  | (new (...args: unknown[]) => { $props: P });

/**
 * A child to render with the parent's slots: a component that accepts the
 * props `P`, a getter for its props (read on each render, so reactive
 * sources stay live), and the slot record to hand it whole. The child reads
 * the slots it declares and keeps its defaults for the rest.
 */
export type Forward<P> = {
  component: NoInfer<ForwardComponent<P>>;
  props: () => P;
  slots: Record<string, unknown>;
};

/**
 * A record of forwards. `P` maps each key to that child's props, inferred
 * from the entry's `props`.
 */
export type Forwards<P extends Record<string, object>> = {
  [K in keyof P]: Forward<P[K]>;
};

/**
 * The rendered forwards: one zero-prop functional component per key, for
 * `<component :is>`.
 */
export type Forwarded<P extends Record<string, object>> = {
  [K in keyof P]: () => VNode;
};
