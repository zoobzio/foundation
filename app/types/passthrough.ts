export type Passthrough<Props, Emits = {}> = Props & {
  [K in keyof Emits as `on${Capitalize<K & string>}`]?: Emits[K] extends unknown[]
    ? (...args: Emits[K]) => void
    : never;
};

export type PassthroughIter<T, Props, Emits = {}> = (
  obj: T,
) => Passthrough<Props, Emits>;

export type PT<T> = T extends (...args: never[]) => unknown
  ? T
  : T extends readonly unknown[]
    ? T
    : T extends object
      ? { [K in keyof T]?: PT<T[K]> }
      : T;

export type PassthroughSource<P, E = {}> = {
  pt?: PT<Passthrough<P, E>>;
  recipes: Passthrough<P, E>;
};
