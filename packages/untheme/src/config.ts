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

// ============================================================================
// Element Definition API
// ============================================================================

/**
 * Convert camelCase to kebab-case.
 * e.g., "triggerContent" -> "trigger-content"
 */
const toKebabCase = (str: string): string =>
  str.replace(/([a-z])([A-Z])/g, "$1-$2").toLowerCase();

/**
 * Type-level camelCase to kebab-case conversion.
 */
type CamelToKebab<S extends string> = S extends `${infer T}${infer U}`
  ? `${T extends Capitalize<T> ? "-" : ""}${Lowercase<T>}${CamelToKebab<U>}`
  : S;

/**
 * Build an ElementDefinition from a list of roles.
 * Internal helper used by defineElement and defineElements.
 */
const buildElementDefinition = (features: readonly Role[]): ElementDefinition => {
  const merged: Record<string, string | null> = { ...roles.base };
  for (const role of features) {
    Object.assign(merged, roles[role]);
  }
  return {
    roles: features as unknown as string[],
    keys: Object.keys(merged),
  };
};

/**
 * Type for deriving element keys from namespace + property name.
 * Property names are converted from camelCase to kebab-case.
 */
type ElementKey<N extends string, P extends string> = `${N}-${CamelToKebab<P>}`;

/**
 * Result type for defineElements().
 * Contains both the key constants and the element definitions.
 */
type ElementsResult<N extends string, E extends Record<string, readonly Role[]>> = {
  readonly [P in keyof E]: ElementKey<N, P & string>;
} & {
  readonly $defs: {
    readonly [P in keyof E as ElementKey<N, P & string>]: ElementDefinition;
  };
};

/**
 * Result type for defineElement().
 * Contains the key constant and the element definition.
 */
type ElementResult<N extends string> = {
  readonly key: N;
  readonly $def: ElementDefinition;
};

/**
 * Define a compound element with multiple parts.
 * Each part becomes a namespaced key (e.g., "accordion-root").
 *
 * @example
 * ```typescript
 * // In elements.config.ts
 * export const accordion = defineElements("accordion", {
 *   root: ["flexbox"],
 *   item: [],
 *   trigger: ["flexbox", "interactive", "selected"],
 * });
 *
 * // accordion.root === "accordion-root"
 * // accordion.item === "accordion-item"
 * // accordion.trigger === "accordion-trigger"
 * // accordion.$defs === { "accordion-root": {...}, "accordion-item": {...}, ... }
 *
 * // In component:
 * tokenize(accordion.root)  // type-safe
 *
 * // In nuxt.config.ts:
 * untheme: { elements: { ...accordion.$defs } }
 * ```
 */
export const defineElements = <
  N extends string,
  E extends Record<string, readonly Role[]>,
>(
  namespace: N,
  elements: E,
): ElementsResult<N, E> => {
  const result: Record<string, string> = {};
  const defs: Record<string, ElementDefinition> = {};

  for (const [prop, propRoles] of Object.entries(elements)) {
    const key = `${namespace}-${toKebabCase(prop)}`;
    result[prop] = key;
    defs[key] = buildElementDefinition(propRoles as readonly Role[]);
  }

  return { ...result, $defs: defs } as ElementsResult<N, E>;
};

/**
 * Define a standalone element with a single key.
 *
 * @example
 * ```typescript
 * // In elements.config.ts
 * export const button = defineElement("button", "interactive", "disabled");
 *
 * // button.key === "button"
 * // button.$def === { roles: [...], keys: [...] }
 *
 * // In component:
 * tokenize(button.key)  // type-safe
 *
 * // In nuxt.config.ts:
 * untheme: { elements: { [button.key]: button.$def } }
 * ```
 */
export const defineElement = <N extends string, T extends readonly Role[]>(
  name: N,
  ...features: T
): ElementResult<N> => {
  return {
    key: name,
    $def: buildElementDefinition(features),
  };
};

export const defineUntheme = (options: UnthemeOptions) => options;
