import type { Component } from "#foundation/types/component";
import type { AriaBindings, AriaProps } from "#foundation/types/aria";
import type {
  ModifierBindings,
  ModifierProps,
} from "#foundation/types/modifiers";
import type { TokenBindings, TokenProps } from "#foundation/types/tokens";

export type BindingProps<T extends Component> = ModifierProps<T> &
  TokenProps<T> &
  AriaProps<T>;

export type Bindings<T extends Component> = ModifierBindings<T> &
  TokenBindings &
  AriaBindings<T>;
