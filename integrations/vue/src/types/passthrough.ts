import type { PrimitiveProps } from "./components/primitive";

/**
 * Props plus emit listeners in `on*` form.
 */
export type Passthrough<Props, Emits = {}> = Props & {
  [
    K in keyof Emits as `on${Capitalize<K & string>}`
  ]?: Emits[K] extends unknown[] ? (...args: Emits[K]) => void : never;
};

/**
 * The passthrough of a part that renders a component through the
 * package's `Primitive`: the component's props and listeners, plus `as`,
 * the component rendered. The recipe names the component the part renders
 * by default; a consumer's or a layer's `pt` renders another in its place
 * with the same props, such as a framework layer's wrapper of the
 * component.
 */
export type Rendered<Props, Emits = {}> = Passthrough<
  Props & PrimitiveProps,
  Emits
>;

/**
 * Builds the passthrough of one part for one item.
 */
export type PassthroughIter<T, Props, Emits = {}> = (
  obj: T,
) => Passthrough<Props, Emits>;

/**
 * Builds the passthrough of one rendered-component part for one item.
 */
export type RenderedIter<T, Props, Emits = {}> = PassthroughIter<
  T,
  Props & PrimitiveProps,
  Emits
>;

/**
 * A deep partial of a part manifest. A function part keeps its arguments
 * and returns a deep partial of its result; arrays and constructors stay
 * whole, so a component passed through `as` keeps its signature.
 */
export type PT<T> = T extends (...args: never[]) => unknown
  ? (...args: Parameters<T>) => PT<ReturnType<T>>
  : T extends abstract new (...args: never[]) => unknown
    ? T
    : T extends readonly unknown[]
      ? T
      : T extends object
        ? { [K in keyof T]?: PT<T[K]> }
        : T;

/**
 * The consumer's `pt` layer and the component's own recipes.
 */
export type PassthroughSource<P, E = {}> = {
  pt?: PT<Passthrough<P, E>>;
  recipes: Passthrough<P, E>;
};

/**
 * The consumer's `pt` layer and a wrapper's own partial layer beneath it.
 * The result is still partial: the wrapper hands it on as the wrapped
 * component's `pt`.
 */
export type PassthroughLayer<P, E = {}> = {
  pt?: PT<Passthrough<P, E>>;
  layer: PT<Passthrough<P, E>>;
};
