import type { ComponentModifiers } from "#build/types/modifiers";

export type Modifier = keyof ComponentModifiers;

export type Modifiers<T extends Modifier> = ComponentModifiers[T];

export type ModifierAxes<T extends Modifier> = keyof Modifiers<T>;

export type ModifierAxesOptions<
  T extends Modifier,
  K extends ModifierAxes<T>,
> = Modifiers<T>[K] extends readonly (infer V)[] ? V : never;

export type ModifierProps<T extends Modifier> = {
  [K in ModifierAxes<T>]?: ModifierAxesOptions<T, K>;
};

export type ModifierBindings<T extends Modifier> = {
  [K in ModifierAxes<T> as `data-${K & string}`]?: ModifierAxesOptions<T, K>;
};
