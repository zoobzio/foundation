import type { AppTheme } from "#imports";
import type { ComponentTokens } from "#build/types/tokens";
import type { Binding } from "untheme";
import type { Component } from "#foundation/types/component";

export type Token = keyof AppTheme["tokens"];

/**
 * Per-token style overrides for a component of type `T`: any theme token (the
 * {@link ThemeOverrides} half) plus the component's own declared tokens (from
 * the `dtcg` schema), each of which must be set to a theme token. Components
 * that declare none get only the theme-override half.
 */
export type TokenProps<T extends Component> = {
  [K in Token]?: Binding;
} & {
  [K in ComponentTokens[T]]?: Token;
};

export type TokenBindings = {
  style?: string;
};
