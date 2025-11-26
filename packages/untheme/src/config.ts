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

type UnionToIntersection<U> = (U extends any ? (k: U) => void : never) extends (
  k: infer I,
) => void
  ? I
  : never;

export type ElementTokens<T extends readonly Role[]> =
  UnionToIntersection<Roles["base"] | Roles[T[number]]> extends infer U
    ? U extends Record<string, any>
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

export interface UnthemeOptions {
  elements?: Record<
    string,
    {
      defaults: Record<string, Record<string, string | null>>;
      tokens: Record<string, string | null>;
    }
  >;
  theme?: UserTheme;
}

export const defineTheme =
  (theme: UserTheme) =>
  (override: UserTheme = {}) =>
    defu(override, theme, { reference, modes }) as Theme;

/**
 * Define an element by composing roles.
 * Returns an object with:
 * - `defaults()`: Get merged tokens from base + roles
 * - `configure(settings)`: Type-safe configuration with autocomplete
 *
 * @example
 * ```typescript
 * // Define element
 * export const button = defineElement(['interactive', 'animated'])
 *
 * // Use in nuxt.config
 * export default {
 *   untheme: {
 *     elements: {
 *       button: button.configure({ background: 'sys-primary' })
 *     }
 *   }
 * }
 *
 * // Use in component
 * import { button } from '@layers/blocks/elements'
 * const custom = button.configure({ background: 'sys-secondary' })
 * const all = defu(custom, button.defaults())
 * ```
 */
export const defineElement =
  <T extends readonly Role[]>(...features: T) =>
  (tokens: Partial<ElementTokens<T>>) => {
    const defaults = { base: roles.base } as Record<
      "base" | T[number],
      Record<string, string | null>
    >;
    for (const role of features) {
      defaults[role as T[number]] = roles[role];
    }
    return {
      defaults,
      tokens,
    };
  };

export const defineUntheme = (options: UnthemeOptions) => options;
