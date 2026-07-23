import type { AriaProps } from "#foundation/types/aria";
import type { Bindings } from "#foundation/types/bindings";
import type { ModifierProps } from "#foundation/types/modifiers";
import type { TokenProps } from "#foundation/types/tokens";
import type { VNode } from "vue";

export type ButtonProps = {
  label?: string;
  type?: "button" | "submit" | "reset";
  disabled?: boolean;
  modifiers?: ModifierProps<"button">;
  tokens?: TokenProps<"button">;
  aria?: AriaProps<"button">;
};

export type ButtonBindings = Bindings<"button">;

export type ButtonContext = ButtonProps & {
  bindings: ButtonBindings;
  el: HTMLButtonElement | null;
};

export type ButtonSlots = {
  default(props: { ctx: ButtonContext }): VNode[];
};
