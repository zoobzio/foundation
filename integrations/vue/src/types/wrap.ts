import type { Component } from "vue";

/**
 * The surface of a component type: its props and its slots, read from
 * either encoding. A generic SFC exports a call signature whose render
 * result carries the setup context, with the type parameter at its
 * constraint; a plain SFC exports a constructor whose instance carries
 * `$props` and `$slots`.
 */
export type Surface<C> = C extends (...args: never[]) => { __ctx?: infer X }
  ? {
      props: NonNullable<X> extends { props: infer P } ? P : never;
      slots: NonNullable<X> extends { slots: infer S } ? S : never;
    }
  : C extends abstract new (...args: never[]) => {
        $props: infer P;
        $slots: infer S;
      }
    ? { props: P; slots: S }
    : never;

/**
 * A component's `pt` prop: the deep partial of its part manifest.
 */
export type PTOf<C> = Surface<C>["props"] extends { pt?: infer P }
  ? NonNullable<P>
  : never;

/**
 * A component's slot record.
 */
export type SlotsOf<C> = NonNullable<Surface<C>["slots"]>;

/**
 * What a wrapper lays under a component: a `pt` layer and slot defaults.
 *
 * `pt` is laid under the consumer's `pt`: the consumer wins per key and a
 * function part composes, as `usePassthrough` lays a wrapper's layer. A
 * nested manifest is layered on its own, so for one the option is a
 * function of the consumer's `pt` that returns the whole prop, laying
 * each nested manifest where it sits.
 *
 * `slots` fill in where the consumer renders no slot of that name. Each
 * default takes the slot's own scope.
 */
export type WrapOptions<C extends Component> = {
  pt?: PTOf<C> | ((pt: PTOf<C> | undefined) => PTOf<C>);
  slots?: Partial<SlotsOf<C>>;
};
