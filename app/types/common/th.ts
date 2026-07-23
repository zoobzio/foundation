import type { AriaProps } from "#foundation/types/aria";
import type { Bindings } from "#foundation/types/bindings";
import type { ModifierProps } from "#foundation/types/modifiers";
import type { TokenProps } from "#foundation/types/tokens";
import type { VNode } from "vue";

export type ThProps = {
  scope?: "col" | "row" | "colgroup" | "rowgroup";
  modifiers?: ModifierProps<"th">;
  tokens?: TokenProps<"th">;
  aria?: AriaProps<"th">;
};

export type ThBindings = Bindings<"th">;

export type ThContext = ThProps & {
  bindings: ThBindings;
  el: HTMLTableCellElement | null;
};

export type ThSlots = {
  default(props: { ctx: ThContext }): VNode[];
};
