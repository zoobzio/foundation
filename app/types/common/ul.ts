import type { AriaProps } from "../aria";
import type { Bindings } from "../bindings";
import type { ComponentEvents } from "../events";
import type { ModifierProps } from "../modifiers";
import type { TokenProps } from "../tokens";
import type { VNode } from "vue";

export type UlProps = {
  modifiers?: ModifierProps<"ul">;
  tokens?: TokenProps<"ul">;
  aria?: AriaProps<"ul">;
};

export type UlEmits = ComponentEvents["ul"];

export type UlBindings = Bindings<"ul">;

export type UlContext = UlProps & {
  bindings: UlBindings;
  el: HTMLUListElement | null;
};

export type UlSlots = {
  default(props: UlContext): VNode[];
};
