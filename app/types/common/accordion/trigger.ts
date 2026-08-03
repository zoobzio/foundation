import type { AriaProps } from "#foundation/types/aria";
import type { Bindings } from "#foundation/types/bindings";
import type { ComponentEvents } from "#foundation/types/events";
import type { ModifierProps } from "#foundation/types/modifiers";
import type { TokenProps } from "#foundation/types/tokens";
import type { Reshape } from "#foundation/types/reshape";
import type { ComponentPublicInstance, VNode } from "vue";
import type { AccordionTriggerProps as RekaAccordionTriggerProps } from "reka-ui";

export type AccordionTriggerForward = Reshape<RekaAccordionTriggerProps>;

export type AccordionTriggerProps = RekaAccordionTriggerProps & {
  modifiers?: ModifierProps<"accordion-trigger">;
  tokens?: TokenProps<"accordion-trigger">;
  aria?: AriaProps<"accordion-trigger">;
};

export type AccordionTriggerEmits = ComponentEvents["accordion-trigger"];

export type AccordionTriggerBindings = Bindings<
  "accordion-trigger",
  AccordionTriggerForward
>;

export type AccordionTriggerContext = Reshape<AccordionTriggerProps> & {
  bindings: AccordionTriggerBindings;
  el: ComponentPublicInstance | null;
};

export type AccordionTriggerSlots = {
  default(props: AccordionTriggerContext): VNode[];
};
