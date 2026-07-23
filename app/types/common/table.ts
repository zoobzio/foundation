import type { AriaProps } from "#foundation/types/aria";
import type { Bindings } from "#foundation/types/bindings";
import type { ModifierProps } from "#foundation/types/modifiers";
import type { TokenProps } from "#foundation/types/tokens";
import type { VNode } from "vue";

export type TableProps = {
  modifiers?: ModifierProps<"table">;
  tokens?: TokenProps<"table">;
  aria?: AriaProps<"table">;
};

export type TableBindings = Bindings<"table">;

export type TableContext = TableProps & {
  bindings: TableBindings;
  el: HTMLTableElement | null;
};

export type TableSlots = {
  default(props: { ctx: TableContext }): VNode[];
};
