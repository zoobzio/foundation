import type { AriaProps } from "../aria";
import type { Bindings } from "../bindings";
import type { ModifierProps } from "../modifiers";
import type { TokenProps } from "../tokens";
import type { VNode } from "vue";

export type TrProps = {
  modifiers?: ModifierProps<"tr">;
  tokens?: TokenProps<"tr">;
  aria?: AriaProps<"tr">;
};

export type TrEmits = {};

export type TrBindings = Bindings<"tr">;

export type TrContext = TrProps & {
  bindings: TrBindings;
  el: HTMLTableRowElement | null;
};

export type TrSlots = {
  default(props: TrContext): VNode[];
};
