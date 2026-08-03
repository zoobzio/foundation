import type { AriaProps } from "#foundation/types/aria";
import type { Bindings } from "#foundation/types/bindings";
import type { ComponentEvents } from "#foundation/types/events";
import type { ModifierProps } from "#foundation/types/modifiers";
import type { TokenProps } from "#foundation/types/tokens";
import type { Reshape } from "#foundation/types/reshape";
import type { ComponentPublicInstance, VNode } from "vue";
import type { AccordionItemProps as RekaAccordionItemProps } from "reka-ui";

export type AccordionItemForward = Reshape<RekaAccordionItemProps>;

export type AccordionItemProps = RekaAccordionItemProps & {
  modifiers?: ModifierProps<"accordion-item">;
  tokens?: TokenProps<"accordion-item">;
  aria?: AriaProps<"accordion-item">;
};

export type AccordionItemEmits = ComponentEvents["accordion-item"];

export type AccordionItemBindings = Bindings<
  "accordion-item",
  AccordionItemForward
>;

export type AccordionItemContext = Reshape<AccordionItemProps> & {
  bindings: AccordionItemBindings;
  el: ComponentPublicInstance | null;
};

export type AccordionItemSlots = {
  default(props: AccordionItemContext & { open: boolean }): VNode[];
};
