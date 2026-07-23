import type { AriaProps } from "#foundation/types/aria";
import type { Bindings } from "#foundation/types/bindings";
import type { ModifierProps } from "#foundation/types/modifiers";
import type { TokenProps } from "#foundation/types/tokens";
import type { VNode } from "vue";

export type TrProps = {
  modifiers?: ModifierProps<"tr">;
  tokens?: TokenProps<"tr">;
  aria?: AriaProps<"tr">;
};

export type TrBindings = Bindings<"tr">;

export type TrContext = TrProps & {
  bindings: TrBindings;
  el: HTMLTableRowElement | null;
};

export type TrSlots = {
  default(props: { ctx: TrContext }): VNode[];
};
