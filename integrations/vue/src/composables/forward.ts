import type { Forwarded, Forwards } from "../types/forward";

import { rekey } from "objectively";
import { forward } from "../utils/forward";

/**
 * Renders children with the parent's slots passed whole. A template cannot
 * hand a slot record to a child, so each entry becomes a functional
 * component that does it through `h`. The child reads the slots it
 * declares and keeps its defaults for the rest.
 *
 * @param forwards - The children by key: component, props getter, slots.
 * @returns One render function per key, for `<component :is>`.
 */
export const useForward = <P extends Record<string, object>>(
  forwards: Forwards<P>,
): Forwarded<P> =>
  rekey<Forwards<P>, Forwarded<P>>(forwards, (key, entry) => [
    key,
    () => forward(entry),
  ]);
