import type { ComputedRef, WritableComputedRef } from "vue";

/**
 * Exact type identity. Tells apart modifiers (readonly) that assignability
 * ignores.
 */
type Equal<A, B> =
  (<G>() => G extends A ? 1 : 2) extends <G>() => G extends B ? 1 : 2
    ? true
    : false;

/**
 * True when K is declared readonly on O.
 */
type ReadonlyKey<O, K extends keyof O> = Equal<
  Pick<O, K>,
  Readonly<Pick<O, K>>
>;

/**
 * The non-method keys of a service: the state surface `useServiceRefs`
 * mirrors. Readonly members are always state. The function test only
 * filters the non-readonly remainder: methods, against writable accessor
 * pairs.
 */
type StateKey<S> = {
  [K in keyof S]: ReadonlyKey<S, K> extends true
    ? K
    : [S[K]] extends [(...args: never[]) => unknown]
      ? never
      : K;
}[keyof S];

export type Accessor = {
  get: () => unknown;
  set?: (value: unknown) => void;
};

/**
 * The ref-shaped view over a service's state surface. Read-only members
 * become `ComputedRef`. Members the service declares a setter for become
 * `WritableComputedRef` and route writes through that setter. Methods are
 * excluded. Call them on the service itself.
 */
export type ServiceRefs<S extends object> = {
  [K in StateKey<S> & string]: ReadonlyKey<S, K> extends true
    ? ComputedRef<S[K]>
    : WritableComputedRef<S[K]>;
};
