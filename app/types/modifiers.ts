import type { Element } from "./component";
import type { ComponentModifiers } from "#build/types/contracts";

export type Modifiers<T extends Element> = ComponentModifiers[T];

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
