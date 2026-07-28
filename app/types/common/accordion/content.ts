import type { AriaProps } from "#foundation/types/aria";
import type { Bindings } from "#foundation/types/bindings";
import type { ComponentEvents } from "#foundation/types/events";
import type { ModifierProps } from "#foundation/types/modifiers";
import type { TokenProps } from "#foundation/types/tokens";
import type { Reshape } from "#foundation/types/reshape";
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
