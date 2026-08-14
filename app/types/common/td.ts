import type { AriaProps } from "../aria";
import type { Bindings } from "../bindings";
import type { ModifierProps } from "../modifiers";
import type { TokenProps } from "../tokens";
import type { VNode } from "vue";

export type TdProps = {
  label?: string;
  modifiers?: ModifierProps<"td">;
  tokens?: TokenProps<"td">;
  aria?: AriaProps<"td">;
};

export type TdEmits = {};

export type TdBindings = Bindings<"td">;

export type TdContext = TdProps & {
  bindings: TdBindings;
  el: HTMLTableCellElement | null;
};

export type TdSlots = {
  default(props: TdContext): VNode[];
};
