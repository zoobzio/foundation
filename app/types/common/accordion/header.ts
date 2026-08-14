import type { AriaProps } from "../../aria";
import type { Bindings } from "../../bindings";
import type { ComponentEvents } from "../../events";
import type { ModifierProps } from "../../modifiers";
import type { TokenProps } from "../../tokens";
import type { Reshape } from "../../reshape";
import type { ComponentPublicInstance, VNode } from "vue";
import type { AccordionHeaderProps as RekaAccordionHeaderProps } from "reka-ui";

export type AccordionHeaderForward = Reshape<RekaAccordionHeaderProps>;

export type AccordionHeaderProps = RekaAccordionHeaderProps & {
  modifiers?: ModifierProps<"accordion-header">;
  tokens?: TokenProps<"accordion-header">;
  aria?: AriaProps<"accordion-header">;
};

export type AccordionHeaderEmits = ComponentEvents["accordion-header"];

export type AccordionHeaderBindings = Bindings<
  "accordion-header",
  AccordionHeaderForward
>;

export type AccordionHeaderContext = Reshape<AccordionHeaderProps> & {
  bindings: AccordionHeaderBindings;
  el: ComponentPublicInstance | null;
};

export type AccordionHeaderSlots = {
  default(props: AccordionHeaderContext): VNode[];
};
