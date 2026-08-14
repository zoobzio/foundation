import type { AriaProps } from "../aria";
import type { Bindings } from "../bindings";
import type { ModifierProps } from "../modifiers";
import type { TokenProps } from "../tokens";
import type { VNode } from "vue";

export type TableProps = {
  modifiers?: ModifierProps<"table">;
  tokens?: TokenProps<"table">;
  aria?: AriaProps<"table">;
};

export type TableEmits = {};

export type TableBindings = Bindings<"table">;

export type TableContext = TableProps & {
  bindings: TableBindings;
  el: HTMLTableElement | null;
};

export type TableSlots = {
  default(props: TableContext): VNode[];
};
