import type { AriaProps } from "../../aria";
import type { Bindings } from "../../bindings";
import type { EventEmits } from "../../events";
import type { ModifierProps } from "../../modifiers";
import type { TokenProps } from "../../tokens";
import type { Reshape } from "../../reshape";
import type { ComponentPublicInstance, VNode } from "vue";
import type { AccordionTriggerProps as RekaAccordionTriggerProps } from "reka-ui";

export type AccordionTriggerForward = Reshape<RekaAccordionTriggerProps>;

export type AccordionTriggerProps = RekaAccordionTriggerProps & {
  modifiers?: ModifierProps<"accordion-trigger">;
  tokens?: TokenProps<"accordion-trigger">;
  aria?: AriaProps<"accordion-trigger">;
};

export type AccordionTriggerEmits = EventEmits<"click">;

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
