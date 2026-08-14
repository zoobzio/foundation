import type { AriaProps } from "../../aria";
import type { Bindings } from "../../bindings";
import type { ComponentEvents } from "../../events";
import type { ModifierProps } from "../../modifiers";
import type { TokenProps } from "../../tokens";
import type { Reshape } from "../../reshape";
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
