import type { Bound } from "../types/actions";

import { map, rekey } from "objectively";

/**
 * Splits bound actions into the halves the headless services take: the
 * descriptor record for the config and the handler record for the wiring,
 * both under the keys given. No record yields two empty ones.
 */
export const split = <D extends object, F>(
  bound: Record<string, Bound<D, F>> = {},
): { descriptors: Record<string, D>; handlers: Record<string, F> } => ({
  descriptors: rekey<Record<string, Bound<D, F>>, Record<string, D>>(
    bound,
    (key, value) => {
      const { action: _, ...descriptor } = value;
      return [key, descriptor];
    },
  ),
  handlers: map(bound, ({ action }) => action),
});
