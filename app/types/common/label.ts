import type { AriaProps } from "#foundation/types/aria";
import type { Bindings } from "#foundation/types/bindings";
import type { ModifierProps } from "#foundation/types/modifiers";
import type { TokenProps } from "#foundation/types/tokens";
import type { VNode } from "vue";

export type LabelProps = {
  for?: string;
  modifiers?: ModifierProps<"label">;
  tokens?: TokenProps<"label">;
  aria?: AriaProps<"label">;
};

export type LabelBindings = Bindings<"label">;

export type LabelContext = LabelProps & {
  bindings: LabelBindings;
  el: HTMLLabelElement | null;
};

export type LabelSlots = {
  default(props: { ctx: LabelContext }): VNode[];
};
