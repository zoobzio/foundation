import type { AriaProps } from "../aria";
import type { Bindings } from "../bindings";
import type { ComponentEvents } from "../events";
import type { ModifierProps } from "../modifiers";
import type { TokenProps } from "../tokens";
import type { VNode } from "vue";

export type TheadProps = {
  modifiers?: ModifierProps<"thead">;
  tokens?: TokenProps<"thead">;
  aria?: AriaProps<"thead">;
};

export type TheadEmits = ComponentEvents["thead"];

export type TheadBindings = Bindings<"thead">;

export type TheadContext = TheadProps & {
  bindings: TheadBindings;
  el: HTMLTableSectionElement | null;
};

export type TheadSlots = {
  default(props: TheadContext): VNode[];
};
