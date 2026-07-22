import type { AppTheme } from "#imports";
import type { ComponentTokens } from "#build/types/dtcg";
import type { Binding } from "untheme";

export type Token = keyof AppTheme["tokens"];

/** A component that may declare component tokens. */
export type TokenComponent = keyof ComponentTokens;

/**
 * Per-token style overrides for a component of type `T`: any theme token (the
 * {@link ThemeOverrides} half) plus the component's own declared tokens (from
 * the `dtcg` schema), each of which must be set to a theme token. Components
 * that declare none get only the theme-override half.
 */
export type TokenProps<T extends TokenComponent> = {
  [K in Token]?: Binding;
} & {
  [K in ComponentTokens[T]]?: Token;
};

export type TokenBindings = {
  style?: string;
};
