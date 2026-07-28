import type { AriaProps } from "#foundation/types/aria";
import type { Bindings } from "#foundation/types/bindings";
import type { ComponentEvents } from "#foundation/types/events";
import type { ModifierProps } from "#foundation/types/modifiers";
import type { TokenProps } from "#foundation/types/tokens";
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
