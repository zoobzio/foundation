import type { Changes, Step } from "./types";

/**
 * Builds the change object of a field.
 */
export const change = <S, K extends keyof S>(
  field: K,
  before: S[K],
  after: S[K],
): Changes<S>[K] => ({ field, before, after });

/**
 * Chains steps into one: the value runs through each in order, each given
 * the same context. A consumer composes its own parser with a service's
 * codec here: `compose(pipeline.build, hast.read)` reads Markdown through
 * the consumer's pipeline and the tree through the codec.
 */
export function compose<A, B, C, X>(
  a: Step<A, B, X>,
  b: Step<B, C, X>,
): Step<A, C, X>;
export function compose<A, B, C, D, X>(
  a: Step<A, B, X>,
  b: Step<B, C, X>,
  c: Step<C, D, X>,
): Step<A, D, X>;
export function compose<A, B, C, D, E, X>(
  a: Step<A, B, X>,
  b: Step<B, C, X>,
  c: Step<C, D, X>,
  d: Step<D, E, X>,
): Step<A, E, X>;
export function compose(
  ...steps: Step<unknown, unknown, unknown>[]
): Step<unknown, unknown, unknown> {
  return (value: unknown, context: unknown): unknown =>
    steps.reduce((current, step) => step(current, context), value);
}
