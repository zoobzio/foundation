import type { Passthrough } from "#foundation/types/core/passthrough";
import type { Recipe } from "#foundation/types/core/recipe";
export function passthrough<P, E = {}>(
  userPT: Passthrough<P, E> | undefined,
  localPT: Recipe<P, E>,
): Recipe<P, E> {
  return {
    props: { ...localPT.props, ...userPT?.props },
    handlers: { ...localPT.handlers, ...userPT?.handlers },
  };
}
