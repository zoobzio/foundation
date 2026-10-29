// The icon glue of the wrappers: a sprite icon by alias, an optional one
// from an item, and a Fab part rendered with an icon as its content. It
// sits with the wrappers because only they may name `Icon`, which
// @icon-sheets/nuxt registers on `#components`.
import type { IconAlias } from "../types/icon";
import type { PrimitiveProps } from "@zoobzio/vue/types/components/primitive";
import type { VNode } from "vue";

import { Icon } from "#components";
import { h } from "vue";

/**
 * One icon of the app's sprite, by alias.
 */
export const icon = (name: IconAlias): VNode => h(Icon, { name });

/**
 * An icon as a slot's content, or nothing where the item names none.
 */
export const iconOf = (name: IconAlias | undefined): VNode[] =>
  name ? [icon(name)] : [];

/**
 * A rendered part with an icon as its content: the default of a slot that
 * replaces a Fab (`refresh`, `actions`, `first`, …). The part's resolved
 * `settings` carry `as` and the props, as the vue template hands them to
 * its `Primitive`; the icon fills the Fab's default slot in place of its
 * label text, and the label stays its `aria-label`.
 */
export const iconPart = (
  settings: PrimitiveProps & Record<string, unknown>,
  name: IconAlias,
): VNode[] => {
  const { as, ...props } = settings;
  return [h(as, props, () => [icon(name)])];
};
