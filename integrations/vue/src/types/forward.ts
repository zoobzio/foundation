import type { Component, FunctionalComponent, VNode } from "vue";

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
 * A per-datum props getter: the datum is what the parent's template binds
 * on the rendered component, the return is the child's props.
 */
export type ForwardGetter = (datum: never) => object;

/**
 * A per-datum forward, generic over its getter `G` so one inference yields
 * both the datum (the rendered component's props) and the child's props.
 * The parent binds the datum in its template (`<Child :field="field" />`)
 * and the getter maps it to the child's props on each render.
 */
export type ForwardIter<G extends ForwardGetter> = {
  component: NoInfer<ForwardComponent<ReturnType<G>>>;
  props: G;
  slots: Record<string, unknown>;
};

/**
 * Any forward as the renderer sees it: the component erased, the getter
 * taking an optional datum that a static getter ignores. The component is
 * checked against its props where the entry is authored, through
 * `Forward` and `ForwardIter`.
 */
export type AnyForward = {
  component: Component;
  props(datum?: object): object;
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
 * A record of per-datum forwards. `G` maps each key to its getter,
 * inferred from the entry's `props`.
 */
export type ForwardsIter<G extends Record<string, ForwardGetter>> = {
  [K in keyof G]: ForwardIter<G[K]>;
};

/**
 * The rendered forwards: one zero-prop functional component per key, for
 * `<component :is>`.
 */
export type Forwarded<P extends Record<string, object>> = {
  [K in keyof P]: () => VNode;
};

/**
 * The rendered per-datum forwards: one functional component per key, whose
 * props are the getter's datum.
 */
export type ForwardedIter<G extends Record<string, ForwardGetter>> = {
  [K in keyof G]: (props: Parameters<G[K]>[0]) => VNode;
};
