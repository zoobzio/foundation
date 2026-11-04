// The text glue of the wrappers: one text resolved through the app's
// prosary service as `icon.ts` draws through the app's sprite. A wrapper
// resolves a label where the component renders it, in the default of the
// component's text slot, and a scalar text prop the component hands to an
// attribute — a placeholder, an accessible name — in its `props` map. Each
// runs at render time, where the Nuxt app is reachable from the rendering
// instance, and where what it reads of the service's locale and messages
// is tracked. Never call one at module scope.
import type { Contract } from "#build/prosary/index.mjs";
import type { PrimitiveProps } from "@zoobzio/vue/types/components/primitive";
import type { Text } from "@zoobzio/kit";
import type { Format } from "prosary";
import type { VNode } from "vue";

import { useNuxtApp } from "#app";
import { createTextVNode, h } from "vue";
import { resolveText } from "../utils/text";

/**
 * One text as the visitor reads it, called as `$t` is: a key and its
 * values — `text("pagination.info", { page, count, total })` — or a
 * message held as data, formatted in the active locale. A plain string
 * the contract does not declare stands as it is.
 */
export const text: Format<Contract> & ((value: Text) => string) = (
  value: unknown,
  ...args: unknown[]
): string =>
  resolveText(useNuxtApp().$prosary, args.length ? [value, ...args] : value);

/**
 * One text as a slot's content: what a slot default returns where the
 * component's own default is its English.
 */
export const textSlot = (value: Text): VNode[] => [
  createTextVNode(text(value)),
];

/**
 * One text inside an element: the span or caption a component's own slot
 * default renders around a label, with the text in the visitor's locale.
 */
export const textIn = (tag: string, cls: string, value: Text): VNode[] => [
  h(tag, { class: cls }, text(value)),
];

/**
 * A text that may be absent: resolved when given, absent otherwise, so the
 * component's own default applies.
 */
export const textIf = (value: Text | undefined): string | undefined =>
  value === undefined ? undefined : text(value);

/**
 * A text that may be absent: resolved when given, the fallback message
 * otherwise. For a prop the component defaults in English, so the layer's
 * default reads in the visitor's locale instead.
 */
export const textOr = (value: Text | undefined, fallback: Text): string =>
  text(value ?? fallback);

/**
 * A rendered part with some of its props replaced: the default of a slot
 * that replaces a part whose text the wrapper resolves. The part's resolved
 * `settings` carry `as` and the props, as the vue template hands them to
 * its `Primitive`.
 */
export const textPart = (
  settings: PrimitiveProps & Record<string, unknown>,
  over: Record<string, unknown>,
): VNode[] => {
  const { as, ...props } = settings;
  return [h(as, { ...props, ...over })];
};
