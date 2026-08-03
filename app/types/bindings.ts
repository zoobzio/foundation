import type { Element } from "#foundation/types/component";
import type { AriaBindings, AriaProps } from "#foundation/types/aria";
import type {
  ModifierBindings,
  ModifierProps,
} from "#foundation/types/modifiers";
import type { TokenBindings, TokenProps } from "#foundation/types/tokens";

export type BindingProps<C extends Element> = ModifierProps<C> &
  TokenProps<C> &
  AriaProps<C>;

export type Bindings<
  C extends Element,
  Props extends object = {},
> = ModifierBindings<C> & TokenBindings & AriaBindings<C> & Props;

export type BindingsSource<
  C extends Element,
  Props extends object = {},
> = {
  modifiers?: ModifierProps<C>;
  tokens?: TokenProps<C>;
  aria?: AriaProps<C>;
  forward: Props;
};
