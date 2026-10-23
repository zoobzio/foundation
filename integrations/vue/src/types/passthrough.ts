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
 * and returns a deep partial of its result; arrays stay whole.
 */
export type PT<T> = T extends (...args: never[]) => unknown
  ? (...args: Parameters<T>) => PT<ReturnType<T>>
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
