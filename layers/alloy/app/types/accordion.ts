import type { AccordionRootProps, AccordionItemProps, AccordionHeaderProps, AccordionTriggerProps, AccordionContentProps } from "reka-ui";

export type AccordionPassthrough = {
  root?: Passthrough<AccordionRootProps>;
  item?: Passthrough<AccordionItemProps>;
  header?: Passthrough<AccordionHeaderProps>;
  trigger?: Passthrough<AccordionTriggerProps>;
  content?: Passthrough<AccordionContentProps>;
};

export type AccordionProps = {
  items: Option[];
  type?: "single" | "multiple";
  collapsible?: boolean;
  defaultValue?: string | string[];
  pt?: AccordionPassthrough;
};

export type AccordionEmits = {};

export const defineAccordion = useComponentRecipe<AccordionProps, AccordionEmits>();

export type AccordionRecipe = ComponentRecipe<AccordionProps, AccordionEmits>;
