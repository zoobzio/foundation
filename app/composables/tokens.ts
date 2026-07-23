import type { Component } from "#foundation/types/component";
import type { TokenBindings, TokenProps } from "#foundation/types/tokens";

import { useUntheme, useUnthemeRenderer } from "#imports";
import { property } from "untheme/css";

/**
 * Renders a component's token overrides into an inline `style` binding.
 *
 * Two kinds of entry are handled. A key the theme contract knows is a **theme
 * override** — the untheme renderer serializes it (a value or `{token}`
 * reference) into its custom property. A key the contract does not know is a
 * **component token** (declared in the `dtcg` schema): its value is a theme
 * token name, converted to a `var(--token)` reference and emitted as the custom
 * property `--<name>`. Returns `{}` when no overrides are given.
 *
 * @param props - Token overrides: theme tokens and/or the component's own.
 * @returns `{ style }` with the rendered declarations, or `{}` when absent.
 */
export const useTokens = <T extends Component>(
  props?: TokenProps<T>,
): TokenBindings => {
  if (!props) {
    return {};
  }
  const tokens = useUntheme().config.theme.tokens;
  const renderer = useUnthemeRenderer();

  // Theme overrides — the renderer serializes contract tokens and skips any
  // component-token key it does not recognize.
  const declarations = Object.entries(renderer.variables(props)).map(
    ([name, text]) => `${name}: ${text}`,
  );

  // Component tokens — keys the contract does not know. Each value is a theme
  // token name; convert it to a `var(--token)` reference, scoped to the
  // component.
  for (const [key, value] of Object.entries(props)) {
    if (value === undefined || key in tokens || typeof value !== "string") {
      continue;
    }
    declarations.push(`--${key}: var(${property(value)})`);
  }

  return { style: declarations.join("; ") };
};
