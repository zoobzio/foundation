import type { AriaBindings, AriaProps, Role } from "#foundation/types/aria";
import type {
  Modifier,
  ModifierBindings,
  ModifierProps,
} from "#foundation/types/modifiers";
import type {
  TokenBindings,
  TokenComponent,
  TokenProps,
} from "#foundation/types/tokens";

import { rekey } from "objectively";
import { property } from "untheme/css";
import { useUntheme, useUnthemeRenderer } from "#imports";

/**
 * Maps a component's modifier axes to `data-*` attribute bindings.
 *
 * Each axis becomes a `data-{axis}` attribute carrying its selected option, so
 * a recipe can target `[data-variant="solid"]` in CSS. The valid axes and
 * options come from the generated `ComponentModifiers` contract for component
 * `T`.
 *
 * @param props - The selected option per axis (e.g. `{ variant: "solid" }`).
 *   Omitted or `undefined` binds nothing.
 * @returns The `data-*` bindings, ready to spread with `v-bind`.
 */
export const useModifiers = <T extends Modifier>(
  props?: ModifierProps<T>,
): ModifierBindings<T> => {
  if (!props) {
    return {};
  }
  return rekey<ModifierProps<T>, ModifierBindings<T>>(props, (key, value) => [
    `data-${key}`,
    value,
  ]);
};

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
export const useTokens = <T extends TokenComponent>(
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

/**
 * Maps ARIA state and properties to `aria-*` attribute bindings.
 *
 * The accessibility mirror of {@link useModifiers}: each key is a bare ARIA
 * attribute name (`pressed`, `expanded`, `label`) with a value typed from the
 * WAI-ARIA spec, emitted as the prefixed `aria-{name}`. The surface is scoped
 * to the component's ARIA role `T` — the role's supported states/properties
 * plus the global set (see `RoleAria`).
 *
 * @param props - ARIA attributes without the `aria-` prefix.
 * @returns The `aria-*` bindings, ready to spread with `v-bind`.
 */
export const useAria = <T extends Role>(
  props?: AriaProps<T>,
): AriaBindings<T> => {
  if (!props) {
    return {};
  }
  return rekey<AriaProps<T>, AriaBindings<T>>(props, (key, value) => [
    `aria-${key}`,
    value,
  ]);
};

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
export const useBindings = <
  C extends Modifier & TokenComponent,
  R extends Role,
>(
  modifiers?: ModifierProps<C>,
  tokens?: NoInfer<TokenProps<C>>,
  aria?: AriaProps<R>,
) => {
  return {
    ...useModifiers(modifiers),
    ...useTokens<C>(tokens),
    ...useAria(aria),
  };
};
