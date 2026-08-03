import type { AriaBindings, AriaProps } from "#foundation/types/aria";
import type { Bindings, BindingsSource } from "#foundation/types/bindings";
import type {
  ModifierBindings,
  ModifierProps,
} from "#foundation/types/modifiers";
import type { TokenBindings, TokenProps } from "#foundation/types/tokens";
import type { Element } from "#foundation/types/component";
import type { ComputedRef, MaybeRefOrGetter } from "vue";

import { computed, toValue, useUntheme, useUnthemeRenderer } from "#imports";
import { property } from "untheme/css";
import { rekey } from "objectively";

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
export const useAria = <T extends Element>(
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
export const useModifiers = <T extends Element>(
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
 * **component token** (a `tokens` slot in `config/components.ts`): its value is a theme
 * token name, converted to a `var(--token)` reference and emitted as the custom
 * property `--<name>`. Returns `{}` when no overrides are given.
 *
 * @param props - Token overrides: theme tokens and/or the component's own.
 * @returns `{ style }` with the rendered declarations, or `{}` when absent.
 */
export const useTokens = <T extends Element>(
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
 * Composes the modifier, token, and ARIA sources — plus a component's
 * forwarded props — into one reactive binding object.
 *
 * A real composable: takes a single reactive source and returns the computed
 * a component binds with one `v-bind`. `modifiers` (→ `data-*`), `tokens`
 * (→ `style`), and `aria` (→ `aria-*`) merge without key collisions; `forward`
 * rides along verbatim. `C` is the component — the single generic driving all
 * three channel axes. `Props` is the forwarded surface; `forward` is required
 * so the returned `Bindings<C, Props>` is always satisfied — elements that
 * forward nothing state it (`forward: {}`).
 *
 * Wrappers must filter their rest props through reka's `useForwardProps` (at
 * setup scope) before feeding them here, so absent boolean props are not
 * forwarded as cast `false` values over reka's own defaults.
 *
 * @param source - Reactive source of the channels + forwarded props.
 * @returns The computed `data-*` / `style` / `aria-*` bindings plus `forward`.
 */
export const useBindings = <C extends Element, Props extends object = {}>(
  source: NoInfer<MaybeRefOrGetter<BindingsSource<C, Props>>>,
): ComputedRef<Bindings<C, Props>> => {
  return computed(() => {
    const { modifiers, tokens, aria, forward } = toValue(source);
    return {
      ...useModifiers<C>(modifiers),
      ...useTokens<C>(tokens),
      ...useAria<C>(aria),
      ...forward,
    };
  });
};
