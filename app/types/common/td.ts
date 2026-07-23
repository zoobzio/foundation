import type { AriaProps } from "#foundation/types/aria";
import type { Bindings } from "#foundation/types/bindings";
import type { ModifierProps } from "#foundation/types/modifiers";
import type { TokenProps } from "#foundation/types/tokens";
import type { VNode } from "vue";

export type TdProps = {
  label?: string;
  modifiers?: ModifierProps<"td">;
  tokens?: TokenProps<"td">;
  aria?: AriaProps<"td">;
};

export type TdBindings = Bindings<"td">;

export type TdContext = TdProps & {
  bindings: TdBindings;
  el: HTMLTableCellElement | null;
};

export type TdSlots = {
  default(props: { ctx: TdContext }): VNode[];
};
