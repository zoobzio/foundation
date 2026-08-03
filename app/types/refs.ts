import type { ComputedRef, WritableComputedRef } from "vue";

/**
 * Exact type identity — distinguishes modifiers (readonly) that assignability
 * ignores.
 */
type Equal<A, B> =
  (<G>() => G extends A ? 1 : 2) extends <G>() => G extends B ? 1 : 2
    ? true
    : false;

/**
 * True when K is declared readonly on O.
 */
type ReadonlyKey<O, K extends keyof O> = Equal<Pick<O, K>, Readonly<Pick<O, K>>>;

/**
 * The non-method keys of a service: the state surface useServiceRefs mirrors.
 * Readonly members are always state — the modifier check resolves even for
 * members typed over an unbound generic (`T | null`), where a structural
 * function test would defer. The function test only filters the non-readonly
 * remainder: methods, vs. writable accessor pairs (which type concretely).
 */
type StateKey<S> = {
  [K in keyof S]: ReadonlyKey<S, K> extends true
    ? K
    : [S[K]] extends [(...args: never[]) => unknown]
      ? never
      : K;
}[keyof S];

/**
 * The ref-shaped view over a service's state surface. Read-only members
 * become ComputedRef; members the service declares a setter for become
 * WritableComputedRef routing writes through that setter. Methods are
 * excluded — call them on the service itself.
 */
export type ServiceRefs<S extends object> = {
  [K in StateKey<S> & string]: ReadonlyKey<S, K> extends true
    ? ComputedRef<S[K]>
    : WritableComputedRef<S[K]>;
};
