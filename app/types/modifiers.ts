import type { Component } from "#foundation/types/component";
import type { ComponentModifiers } from "#build/types/modifiers";

export type Modifiers<T extends Component> = ComponentModifiers[T];

export type ModifierAxes<T extends Component> = keyof Modifiers<T>;

export type ModifierAxesOptions<
  T extends Component,
  K extends ModifierAxes<T>,
> = Modifiers<T>[K] extends readonly (infer V)[] ? V : never;

export type ModifierProps<T extends Component> = {
  [K in ModifierAxes<T>]?: ModifierAxesOptions<T, K>;
};

export type ModifierBindings<T extends Component> = {
  [K in ModifierAxes<T> as `data-${K & string}`]?: ModifierAxesOptions<T, K>;
};
