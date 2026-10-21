import type { Passthrough, PT } from "../types/passthrough";

import { rekey } from "objectively";
import { merge } from "./merge";

/**
 * Merges the consumer's `pt` layer over the local recipes.
 */
export const passthrough = <P, E = {}>(
  userPT: PT<Passthrough<P, E>> | undefined,
  localPT: Passthrough<P, E>,
): Passthrough<P, E> => {
  return rekey<Record<string, unknown>, Passthrough<P, E>>(
    merge(userPT ?? {}, localPT),
    (key, value) => [key, value],
  );
};
