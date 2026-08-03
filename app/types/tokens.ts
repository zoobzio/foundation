import type { AppTheme } from "#imports";
import type { Binding } from "untheme";
import type { Element } from "#foundation/types/component";
import type components from "#config/components";

export type Token = keyof AppTheme["tokens"];

/**
 * Per-token style overrides for a component of type `T`: any theme token (the
 * {@link ThemeOverrides} half) plus the component's own declared tokens (the
 * `tokens` slots in `config/components.ts`), each of which must be set to a
 * theme token. Components that declare none get only the theme-override half.
 * The slot names resolve straight from the config — like `AriaRole`, no
 * generated registry in between.
 */
export type TokenProps<T extends Element> = {
  [K in Token]?: Binding;
} & {
  [K in keyof (typeof components.elements)[T]["tokens"]]?: Token;
};

export type TokenBindings = {
  style?: string;
};
