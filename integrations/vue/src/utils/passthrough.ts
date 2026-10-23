import type { Passthrough, PT } from "../types/passthrough";

import { record, rekey } from "objectively";
import { merge } from "./merge";

/**
 * Merges the consumer's `pt` layer over the local recipes. The guard
 * narrows the deep partial, whose conditional type stays unresolved while
 * the props are generic, and stands in for the empty layer.
 */
export const passthrough = <P, E = {}>(
  userPT: PT<Passthrough<P, E>> | undefined,
  localPT: Passthrough<P, E>,
): Passthrough<P, E> => {
  return rekey<Record<string, unknown>, Passthrough<P, E>>(
    merge(record(userPT) ? userPT : {}, localPT),
    (key, value) => [key, value],
  );
};
