import type { AccordionRootProps, AccordionRootEmits, AccordionItemProps, AccordionHeaderProps, AccordionTriggerProps, AccordionContentProps, CollapsibleContentEmits } from "reka-ui";

export type AccordionPassthrough = {
  root?: Passthrough<AccordionRootProps, AccordionRootEmits>;
  item?: Passthrough<AccordionItemProps>;
  header?: Passthrough<AccordionHeaderProps>;
  trigger?: Passthrough<AccordionTriggerProps>;
  triggerContent?: Passthrough<GroupProps>;
  triggerIcon?: Passthrough<IconProps>;
  chevron?: Passthrough<IconProps>;
  content?: Passthrough<AccordionContentProps, CollapsibleContentEmits>;
};

export type AccordionProps = {
  items: Option[];
  type?: "single" | "multiple";
  collapsible?: boolean;
  defaultValue?: string | string[];
  pt?: AccordionPassthrough;
};

export type AccordionEmits = {};

export type AccordionRecipe = Recipe<AccordionProps, AccordionEmits>;
