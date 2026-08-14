import type { AriaProps } from "../../aria";
import type { Bindings } from "../../bindings";
import type { ComponentEvents } from "../../events";
import type { ModifierProps } from "../../modifiers";
import type { TokenProps } from "../../tokens";
import type { Reshape } from "../../reshape";
import type { ComponentPublicInstance, VNode } from "vue";
import type { AccordionContentProps as RekaAccordionContentProps } from "reka-ui";

export type AccordionContentForward = Reshape<RekaAccordionContentProps>;

export type AccordionContentProps = RekaAccordionContentProps & {
  modifiers?: ModifierProps<"accordion-content">;
  tokens?: TokenProps<"accordion-content">;
  aria?: AriaProps<"accordion-content">;
};

export type AccordionContentEmits = ComponentEvents["accordion-content"];

export type AccordionContentBindings = Bindings<
  "accordion-content",
  AccordionContentForward
>;

export type AccordionContentContext = Reshape<AccordionContentProps> & {
  bindings: AccordionContentBindings;
  el: ComponentPublicInstance | null;
};

export type AccordionContentSlots = {
  default(props: AccordionContentContext): VNode[];
};
