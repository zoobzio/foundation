import type { SchemaFor } from "./schema";

import roles from "./tokens/roles";
import reference from "./tokens/reference";
import modes from "./tokens/modes";

import defu from "defu";

export type RefToken = keyof typeof reference;
export type ModeToken = keyof typeof modes.light;

export type UserTheme = {
  reference?: {
    [R in keyof typeof reference]?: string;
  };
  modes?: {
    light?: {
      [M in ModeToken]?: RefToken;
    };
    dark?: {
      [M in ModeToken]?: RefToken;
    };
  };
};

export type Theme = {
  reference: {
    [R in keyof typeof reference]: string;
  };
  modes: {
    light: {
      [M in ModeToken]: RefToken;
    };
    dark: {
      [M in ModeToken]: RefToken;
    };
  };
};

export type Roles = typeof roles;

export type Role = Exclude<keyof Roles, "base">;

type UnionToIntersection<U> = (U extends unknown ? (k: U) => void : never) extends (
  k: infer I,
) => void
  ? I
  : never;

export type ElementTokens<T extends readonly Role[]> =
  UnionToIntersection<Roles["base"] | Roles[T[number]]> extends infer U
    ? U extends Record<string, unknown>
      ? SchemaFor<U>
      : never
    : never;

/**
 * Extract token types from an element definition.
 *
 * @example
 * ```typescript
 * export const button = defineElement(['interactive', 'animated'])
 * type ButtonTokens = TokensFrom<typeof button>
 * // ButtonTokens = Partial<ElementTokens<['interactive', 'animated']>>
 * ```
 */
export type TokensFrom<E> = E extends {
  configure: (settings: infer S) => unknown;
}
  ? S
  : never;

export interface ElementDefinition {
  roles: string[];
  keys: string[];
}

export interface UnthemeOptions {
  elements?: Record<string, ElementDefinition>;
  theme?: UserTheme;
}

export const defineTheme =
  (theme: UserTheme) =>
  (override: UserTheme = {}) =>
    defu(override, theme, { reference, modes }) as Theme;

/**
 * Define an element by composing roles.
 * Returns a serializable object with role names and merged token keys.
 *
 * @example
 * ```typescript
 * // In elements.config.ts
 * export default {
 *   button: defineElement("interactive", "animated")
 * }
 *
 * // In nuxt.config.ts
 * import elements from "./elements.config"
 * export default {
 *   untheme: { elements }
 * }
 * ```
 */
export const defineElement = <T extends readonly Role[]>(...features: T) => {
  // Merge base + role tokens to get complete key set
  const merged: Record<string, string | null> = { ...roles.base };
  for (const role of features) {
    Object.assign(merged, roles[role]);
  }
  return {
    roles: features as unknown as string[],
    keys: Object.keys(merged),
  };
};

export const defineUntheme = (options: UnthemeOptions) => options;
