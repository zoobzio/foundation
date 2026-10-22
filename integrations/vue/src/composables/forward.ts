import type {
  AnyForward,
  Forward,
  Forwarded,
  ForwardedIter,
  ForwardGetter,
  ForwardIter,
  Forwards,
  ForwardsIter,
} from "../types/forward";
import type { VNode } from "vue";

import { rekey } from "objectively";
import { forward } from "../utils/forward";

/**
 * Whether a value is one forward entry rather than a record of them.
 */
const isForward = (
  value: AnyForward | Record<string, AnyForward>,
): value is AnyForward =>
  "component" in value && typeof value.props === "function";

/**
 * Renders children with the parent's slots passed whole. A template cannot
 * hand a slot record to a child, so each entry becomes a functional
 * component that does it through `h`. The child reads the slots it
 * declares and keeps its defaults for the rest.
 *
 * One entry renders as one component; a record of entries renders as a
 * record of components by key. Either way an entry is one of two kinds.
 * With a zero-argument props getter it renders as `<Child />`. With a
 * getter that takes a datum, the datum is the rendered component's props:
 * `<Child :field="field" />` reaches the getter as `{ field }`.
 *
 * @param forwards - One child or the children by key: component, props
 * getter, slots.
 * @returns One functional component, or one per key, for `<component :is>`.
 */
export function useForward<P extends object>(forward: Forward<P>): () => VNode;
export function useForward<G extends ForwardGetter>(
  forward: ForwardIter<G>,
): (props: Parameters<G>[0]) => VNode;
export function useForward<P extends Record<string, object>>(
  forwards: Forwards<P>,
): Forwarded<P>;
export function useForward<G extends Record<string, ForwardGetter>>(
  forwards: ForwardsIter<G>,
): ForwardedIter<G>;
export function useForward(
  forwards: AnyForward | Record<string, AnyForward>,
): ((props: object) => VNode) | Record<string, (props: object) => VNode> {
  if (isForward(forwards)) {
    return (props: object) => forward(forwards, props);
  }
  return rekey<
    Record<string, AnyForward>,
    Record<string, (props: object) => VNode>
  >(forwards, (key, entry) => [key, (props: object) => forward(entry, props)]);
}
