/**
 * Props plus emit listeners in `on*` form.
 */
export type Passthrough<Props, Emits = {}> = Props & {
  [
    K in keyof Emits as `on${Capitalize<K & string>}`
  ]?: Emits[K] extends unknown[] ? (...args: Emits[K]) => void : never;
};

/**
 * Builds the passthrough of one part for one item.
 */
export type PassthroughIter<T, Props, Emits = {}> = (
  obj: T,
) => Passthrough<Props, Emits>;

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
