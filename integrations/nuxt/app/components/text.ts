// The text glue of the wrappers: a text, or the texts of a value, resolved
// through the app's prosary service as `icon.ts` draws through the app's
// sprite. Each runs at render time — in a slot default, a `pt` function or
// a `props` map — where the Nuxt app is reachable from the rendering
// instance, and where what it reads of the service's locale and messages
// is tracked. Never call one at module scope.
import type { Contract } from "#build/prosary/index.mjs";
import type { PrimitiveProps } from "@zoobzio/vue/types/components/primitive";
import type { Text } from "@zoobzio/kit";
import type { Format } from "prosary";
import type { VNode } from "vue";

import { useNuxtApp } from "#app";
import { createTextVNode, h } from "vue";
import { resolveText, resolveTexts } from "../utils/text";

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
 * A value with every text in it resolved: the options, groups, items or
 * nodes a wrapper hands on to the component it wraps.
 */
export const texts = <T>(value: T): T =>
  resolveTexts(useNuxtApp().$prosary, value);

/**
 * One text as a slot's content: what a slot default returns where the
 * component's own default is its English.
 */
export const textSlot = (value: Text): VNode[] => [
  createTextVNode(text(value)),
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
