import type { AriaProps } from "../aria";
import type { Bindings } from "../bindings";
import type { ComponentEvents } from "../events";
import type { ModifierProps } from "../modifiers";
import type { TokenProps } from "../tokens";
import type { VNode } from "vue";

export type ButtonProps = {
  label?: string;
  type?: "button" | "submit" | "reset";
  disabled?: boolean;
  modifiers?: ModifierProps<"button">;
  tokens?: TokenProps<"button">;
  aria?: AriaProps<"button">;
};

export type ButtonEmits = ComponentEvents["button"];

export type ButtonBindings = Bindings<"button">;

export type ButtonContext = ButtonProps & {
  bindings: ButtonBindings;
  el: HTMLButtonElement | null;
};

export type ButtonSlots = {
  default(props: ButtonContext): VNode[];
};
