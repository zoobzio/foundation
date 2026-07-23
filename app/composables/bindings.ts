import type { AriaProps } from "#foundation/types/aria";
import type { Component } from "#foundation/types/component";
import type { ModifierProps } from "#foundation/types/modifiers";
import type { TokenProps } from "#foundation/types/tokens";

import { useAria } from "#foundation/composables/aria";
import { useModifiers } from "#foundation/composables/modifiers";
import { useTokens } from "#foundation/composables/tokens";

/**
 * Composes the modifier, token, and ARIA sources into one flat binding object.
 *
 * A component spreads the result with a single `v-bind`, letting `modifiers`
 * (→ `data-*`), `tokens` (→ `style`), and `aria` (→ `aria-*`) merge without
 * key collisions. Any source may be omitted. `C` is the component — the single
 * generic driving all three axes: the modifier axes, the token slots, and (via
 * the `roles` map) the ARIA role the `aria` surface is pinned to.
 *
 * @param modifiers - Modifier axis selections for the component.
 * @param tokens - Per-token style overrides.
 * @param aria - ARIA state and properties for the component's mapped role.
 * @returns The merged `data-*`, `style`, and `aria-*` bindings.
 */
export const useBindings = <C extends Component>(
  modifiers?: NoInfer<ModifierProps<C>>,
  tokens?: NoInfer<TokenProps<C>>,
  aria?: NoInfer<AriaProps<C>>,
) => {
  return {
    ...useModifiers<C>(modifiers),
    ...useTokens<C>(tokens),
    ...useAria<C>(aria),
  };
};
