import type { Component } from "#foundation/types/component";
import type { AriaProps, Role } from "#foundation/types/aria";
import type { ModifierProps } from "#foundation/types/modifiers";
import type { TokenProps } from "#foundation/types/tokens";

import { useModifiers } from "#foundation/composables/modifiers";
import { useTokens } from "#foundation/composables/tokens";
import { useAria } from "#foundation/composables/aria";

/**
 * Composes the modifier, token, and ARIA sources into one flat binding object.
 *
 * A component spreads the result with a single `v-bind`, letting `modifiers`
 * (→ `data-*`), `tokens` (→ `style`), and `aria` (→ `aria-*`) merge without
 * key collisions. Any source may be omitted. `C` is the component — it drives
 * both the modifier axes and the token slots; `R` is its ARIA role, usually
 * distinct (e.g. component `nav` plays role `navigation`), so it is separate.
 *
 * @param modifiers - Modifier axis selections for the component.
 * @param tokens - Per-token style overrides.
 * @param aria - ARIA state and properties for the component's role.
 * @returns The merged `data-*`, `style`, and `aria-*` bindings.
 */
export const useBindings = <C extends Component, R extends Role>(
  modifiers?: ModifierProps<C>,
  tokens?: NoInfer<TokenProps<C>>,
  aria?: AriaProps<R>,
) => {
  return {
    ...useModifiers<C>(modifiers),
    ...useTokens<C>(tokens),
    ...useAria<R>(aria),
  };
};
