import type { AriaProps } from "#foundation/types/aria";
import type { Bindings } from "#foundation/types/bindings";
import type { ModifierProps } from "#foundation/types/modifiers";
import type { TokenProps } from "#foundation/types/tokens";
import type { VNode } from "vue";

export type TbodyProps = {
  modifiers?: ModifierProps<"tbody">;
  tokens?: TokenProps<"tbody">;
  aria?: AriaProps<"tbody">;
};

export type TbodyBindings = Bindings<"tbody">;

export type TbodyContext = TbodyProps & {
  bindings: TbodyBindings;
  el: HTMLTableSectionElement | null;
};

export type TbodySlots = {
  default(props: { ctx: TbodyContext }): VNode[];
};
