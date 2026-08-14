import type { AriaProps } from "../aria";
import type { Bindings } from "../bindings";
import type { ComponentEvents } from "../events";
import type { ModifierProps } from "../modifiers";
import type { TokenProps } from "../tokens";
import type { VNode } from "vue";

export type CodeProps = {
  label?: string;
  modifiers?: ModifierProps<"code">;
  tokens?: TokenProps<"code">;
  aria?: AriaProps<"code">;
};

export type CodeEmits = ComponentEvents["code"];

export type CodeBindings = Bindings<"code">;

export type CodeContext = CodeProps & {
  bindings: CodeBindings;
  el: HTMLElement | null;
};

export type CodeSlots = {
  default(props: CodeContext): VNode[];
};
