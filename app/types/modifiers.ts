import type { Element } from "./element";
import type modifiers from "../../config/modifiers";

/**
 * The variant-axis registry, derived directly from the `config/modifiers`
 * schema: components with a schema entry expose their axes as
 * `axis: readonly [...values]` tuples; components without one resolve to
 * `never`, so their `ModifierProps` surface is empty.
 */
export type ComponentModifiers = typeof modifiers;

export type Modifiers<T extends Element> = T extends keyof ComponentModifiers
  ? ComponentModifiers[T]
  : never;

export type ModifierAxes<T extends Element> = keyof Modifiers<T>;

export type ModifierAxesOptions<
  T extends Element,
  K extends ModifierAxes<T>,
> = Modifiers<T>[K] extends readonly (infer V)[] ? V : never;

export type ModifierProps<T extends Element> = {
  [K in ModifierAxes<T>]?: ModifierAxesOptions<T, K>;
};

export type ModifierBindings<T extends Element> = {
  [K in ModifierAxes<T> as `data-${K & string}`]?: ModifierAxesOptions<T, K>;
};
