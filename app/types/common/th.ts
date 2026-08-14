import type { AriaProps } from "../aria";
import type { Bindings } from "../bindings";
import type { ModifierProps } from "../modifiers";
import type { TokenProps } from "../tokens";
import type { VNode } from "vue";

export type ThProps = {
  scope?: "col" | "row" | "colgroup" | "rowgroup";
  modifiers?: ModifierProps<"th">;
  tokens?: TokenProps<"th">;
  aria?: AriaProps<"th">;
};

export type ThEmits = {};

export type ThBindings = Bindings<"th">;

export type ThContext = ThProps & {
  bindings: ThBindings;
  el: HTMLTableCellElement | null;
};

export type ThSlots = {
  default(props: ThContext): VNode[];
};
