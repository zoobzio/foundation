import type { AriaProps } from "../aria";
import type { Bindings } from "../bindings";
import type { ModifierProps } from "../modifiers";
import type { TokenProps } from "../tokens";
import type { VNode } from "vue";

export type PreProps = {
  label?: string;
  modifiers?: ModifierProps<"pre">;
  tokens?: TokenProps<"pre">;
  aria?: AriaProps<"pre">;
};

export type PreEmits = {};

export type PreBindings = Bindings<"pre">;

export type PreContext = PreProps & {
  bindings: PreBindings;
  el: HTMLPreElement | null;
};

export type PreSlots = {
  default(props: PreContext): VNode[];
};
