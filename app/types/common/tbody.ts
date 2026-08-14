import type { AriaProps } from "../aria";
import type { Bindings } from "../bindings";
import type { ModifierProps } from "../modifiers";
import type { TokenProps } from "../tokens";
import type { VNode } from "vue";

export type TbodyProps = {
  modifiers?: ModifierProps<"tbody">;
  tokens?: TokenProps<"tbody">;
  aria?: AriaProps<"tbody">;
};

export type TbodyEmits = {};

export type TbodyBindings = Bindings<"tbody">;

export type TbodyContext = TbodyProps & {
  bindings: TbodyBindings;
  el: HTMLTableSectionElement | null;
};

export type TbodySlots = {
  default(props: TbodyContext): VNode[];
};
