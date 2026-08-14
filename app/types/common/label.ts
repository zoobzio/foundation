import type { AriaProps } from "../aria";
import type { Bindings } from "../bindings";
import type { ModifierProps } from "../modifiers";
import type { TokenProps } from "../tokens";
import type { VNode } from "vue";

export type LabelProps = {
  for?: string;
  modifiers?: ModifierProps<"label">;
  tokens?: TokenProps<"label">;
  aria?: AriaProps<"label">;
};

export type LabelEmits = {};

export type LabelBindings = Bindings<"label">;

export type LabelContext = LabelProps & {
  bindings: LabelBindings;
  el: HTMLLabelElement | null;
};

export type LabelSlots = {
  default(props: LabelContext): VNode[];
};
