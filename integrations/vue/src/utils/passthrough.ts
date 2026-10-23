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

/**
 * Merges the consumer's `pt` layer over a wrapper's partial layer. The
 * consumer wins per key and a function part composes, so `pt.link = () =>
 * ({ class })` keeps the layer's `as`. Only top-level parts compose: a
 * nested manifest is layered on its own. Both guards narrow the deep
 * partials and stand in for an empty layer.
 */
export const layer = <P, E = {}>(
  userPT: PT<Passthrough<P, E>> | undefined,
  localPT: PT<Passthrough<P, E>>,
): PT<Passthrough<P, E>> => {
  return rekey<Record<string, unknown>, PT<Passthrough<P, E>>>(
    merge(record(userPT) ? userPT : {}, record(localPT) ? localPT : {}),
    (key, value) => [key, value],
  );
};
