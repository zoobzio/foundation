import type { AriaAttributes } from "vue";
import type { GlobalAria, ProhibitedAria, RoleAria } from "#build/types/a11y";

export type { RoleAria };

/**
 * Every ARIA state/property, `aria-` prefix stripped, values typed from the
 * spec (Vue's `AriaAttributes`). The raw pool the role maps draw from.
 */
type AllAria = {
  [K in keyof AriaAttributes as K extends `aria-${infer Name}`
    ? Name
    : never]?: AriaAttributes[K];
};

/**
 * An ARIA role. `RoleAria` and its `GlobalAria` companion are generated from
 * `aria-query` by the `a11y` module: every concrete role mapped to the
 * role-specific states/properties it adds on top of the globals (`never` when
 * it adds none). See `modules/a11y`.
 */
export type Role = keyof RoleAria;

/**
 * The aria attributes a component of role `T` accepts: the global set plus the
 * role's own, minus any the role prohibits (e.g. `generic` cannot be named),
 * values typed straight from the spec. Pinned concretely on a component's
 * `aria` prop, e.g. `aria?: AriaProps<"button">`.
 */
export type AriaProps<T extends Role> = Pick<
  AllAria,
  Exclude<GlobalAria | RoleAria[T], ProhibitedAria[T]> & keyof AllAria
>;

/**
 * The rendered bindings for role `T`: keys re-prefixed with `aria-`, ready to
 * `v-bind`.
 */
export type AriaBindings<T extends Role> = {
  [K in keyof AriaProps<T> as `aria-${K & string}`]?: AriaProps<T>[K];
};