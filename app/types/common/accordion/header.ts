import type { AriaProps } from "#foundation/types/aria";
import type { Bindings } from "#foundation/types/bindings";
import type { ComponentEvents } from "#foundation/types/events";
import type { ModifierProps } from "#foundation/types/modifiers";
import type { TokenProps } from "#foundation/types/tokens";
import type { Reshape } from "#foundation/types/reshape";
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
